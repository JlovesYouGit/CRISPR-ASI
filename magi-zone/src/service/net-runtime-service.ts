import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

export interface NetRuntimeConfig {
  dotnetPath: string;
  assemblyPath: string;
  arguments: string[];
  workingDirectory: string;
  autoStart: boolean;
  autoRestart: boolean;
  restartDelay: number;
  maxRestarts: number;
  timeout: number;
  logPath: string;
  environment?: Record<string, string>;
}

export interface NetRuntimeStatus {
  running: boolean;
  pid?: number;
  startTime?: number;
  uptime: number;
  restartCount: number;
  lastRestart?: number;
  exitCode?: number;
  assemblyLoaded: boolean;
  ready: boolean;
}

export class NetRuntimeService extends EventEmitter {
  private config: NetRuntimeConfig;
  private process?: ChildProcess;
  private status: NetRuntimeStatus;
  private restartTimer?: NodeJS.Timeout;
  private readyCheckTimer?: NodeJS.Timeout;

  constructor(config: NetRuntimeConfig) {
    super();
    this.config = config;
    this.ensureLogDirectory();
    this.status = {
      running: false,
      uptime: 0,
      restartCount: 0,
      assemblyLoaded: false,
      ready: false
    };
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.config.logPath)) {
      mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  async initialize(): Promise<void> {
    this.log('Initializing .NET runtime service');
    
    try {
      // Check if .NET runtime is available
      await this.checkDotNetRuntime();
      
      // Check if assembly exists
      await this.checkAssembly();
      
      if (this.config.autoStart) {
        await this.start();
      }
      
      this.log('.NET runtime service initialized successfully');
      this.emit('initialized');
      
    } catch (error) {
      this.log(`Initialization failed: ${error}`);
      this.emit('initializationFailed', error);
      throw error;
    }
  }

  private async checkDotNetRuntime(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkProcess = spawn(this.config.dotnetPath, ['--version'], {
        stdio: 'pipe',
        timeout: 5000
      });

      let output = '';
      checkProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      checkProcess.on('close', (code) => {
        if (code === 0) {
          this.log(`Found .NET runtime: ${output.trim()}`);
          resolve();
        } else {
          reject(new Error(`.NET runtime not found at: ${this.config.dotnetPath}`));
        }
      });

      checkProcess.on('error', (error) => {
        reject(new Error(`Failed to check .NET runtime: ${error}`));
      });
    });
  }

  private async checkAssembly(): Promise<void> {
    if (!existsSync(this.config.assemblyPath)) {
      throw new Error(`Assembly not found: ${this.config.assemblyPath}`);
    }
    this.log(`Assembly found: ${this.config.assemblyPath}`);
  }

  async start(): Promise<void> {
    if (this.process && !this.process.killed) {
      this.log('.NET runtime already running');
      return;
    }

    this.log('Starting .NET runtime...');

    return new Promise((resolve, reject) => {
      const env = { ...process.env, ...this.config.environment };
      
      this.process = spawn(this.config.dotnetPath, [
        this.config.assemblyPath,
        ...this.config.arguments
      ], {
        cwd: this.config.workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: env,
        timeout: this.config.timeout
      });

      this.status.running = true;
      this.status.startTime = Date.now();
      this.status.pid = this.process.pid;

      this.setupProcessHandlers();
      
      this.process.on('spawn', () => {
        this.log(`.NET runtime spawned with PID: ${this.process?.pid}`);
        this.startReadyCheck();
        this.emit('processStarted', { pid: this.process?.pid });
        resolve();
      });

      this.process.on('error', (error) => {
        this.status.running = false;
        this.log(`.NET runtime error: ${error}`);
        this.emit('processError', error);
        reject(error);
      });
    });
  }

  private setupProcessHandlers(): void {
    if (!this.process) return;

    // Handle stdout
    this.process.stdout?.on('data', (data) => {
      const output = data.toString();
      this.logOutput('STDOUT', output);
      this.emit('stdout', output);
      
      // Check for ready signal
      if (output.includes('READY') || output.includes('Assembly loaded')) {
        this.status.assemblyLoaded = true;
        this.status.ready = true;
        this.emit('ready');
      }
    });

    // Handle stderr
    this.process.stderr?.on('data', (data) => {
      const output = data.toString();
      this.logOutput('STDERR', output);
      this.emit('stderr', output);
    });

    // Handle process exit
    this.process.on('exit', (code, signal) => {
      this.status.running = false;
      this.status.exitCode = code || undefined;
      this.status.ready = false;
      
      this.log(`.NET runtime exited with code: ${code}, signal: ${signal}`);
      this.emit('processExited', { code, signal });

      if (this.config.autoRestart && this.shouldRestart()) {
        this.scheduleRestart();
      }
    });

    // Handle process close
    this.process.on('close', (code, signal) => {
      this.log(`.NET runtime closed with code: ${code}, signal: ${signal}`);
      this.emit('processClosed', { code, signal });
    });
  }

  private startReadyCheck(): void {
    if (this.readyCheckTimer) {
      clearInterval(this.readyCheckTimer);
    }

    this.readyCheckTimer = setInterval(() => {
      if (!this.status.ready && this.status.running) {
        // Send ready check command
        this.sendCommand('STATUS');
      }
    }, 5000); // Check every 5 seconds

    // Auto-mark as ready after 30 seconds
    setTimeout(() => {
      if (!this.status.ready && this.status.running) {
        this.status.ready = true;
        this.status.assemblyLoaded = true;
        this.log('Auto-marked as ready (timeout)');
        this.emit('ready');
      }
    }, 30000);
  }

  private shouldRestart(): boolean {
    if (this.status.restartCount >= this.config.maxRestarts) {
      this.log(`Max restarts reached (${this.config.maxRestarts}), not restarting`);
      return false;
    }

    // Don't restart if process was killed intentionally
    if (this.status.exitCode === 0) {
      this.log('Process exited normally, not restarting');
      return false;
    }

    return true;
  }

  private scheduleRestart(): void {
    this.status.restartCount++;
    this.status.lastRestart = Date.now();
    
    this.log(`Scheduling restart #${this.status.restartCount} in ${this.config.restartDelay}ms`);
    
    this.restartTimer = setTimeout(async () => {
      try {
        await this.start();
        this.emit('processRestarted', { 
          restartCount: this.status.restartCount,
          pid: this.process?.pid 
        });
      } catch (error) {
        this.log(`Restart failed: ${error}`);
        this.emit('restartFailed', error);
      }
    }, this.config.restartDelay);
  }

  async stop(): Promise<void> {
    this.log('Stopping .NET runtime...');
    
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = undefined;
    }

    if (this.readyCheckTimer) {
      clearInterval(this.readyCheckTimer);
      this.readyCheckTimer = undefined;
    }

    if (this.process && !this.process.killed) {
      return new Promise((resolve) => {
        this.process!.once('exit', () => {
          this.log('.NET runtime stopped successfully');
          this.emit('stopped');
          resolve();
        });

        // Try graceful shutdown first
        this.sendCommand('SHUTDOWN');
        
        // Force kill if graceful shutdown doesn't work
        setTimeout(() => {
          if (this.process && !this.process.killed) {
            this.process.kill('SIGKILL');
          }
        }, 5000);
      });
    }
  }

  sendCommand(command: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(command + '\n');
      this.log(`Sent command: ${command}`);
      this.emit('commandSent', command);
    } else {
      this.log('Cannot send command: .NET runtime not running');
      this.emit('commandFailed', 'Runtime not running');
    }
  }

  async executeCommand(command: string, timeout: number = 10000): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.status.ready) {
        reject(new Error('.NET runtime not ready'));
        return;
      }

      let output = '';
      const originalStdout = this.process.stdout;
      
      const dataHandler = (data: Buffer) => {
        output += data.toString();
      };

      originalStdout?.on('data', dataHandler);
      
      this.sendCommand(command);

      setTimeout(() => {
        originalStdout?.off('data', dataHandler);
        if (output) {
          resolve(output.trim());
        } else {
          reject(new Error('Command timeout'));
        }
      }, timeout);
    });
  }

  async autoLoadAssembly(assemblyPath?: string): Promise<void> {
    const targetAssembly = assemblyPath || this.config.assemblyPath;
    this.log(`Auto-loading assembly: ${targetAssembly}`);
    
    try {
      await this.executeCommand(`LOAD "${targetAssembly}"`);
      this.status.assemblyLoaded = true;
      this.log('Assembly auto-loaded successfully');
      this.emit('assemblyLoaded', targetAssembly);
    } catch (error) {
      this.log(`Failed to auto-load assembly: ${error}`);
      this.emit('assemblyLoadFailed', error);
      throw error;
    }
  }

  getStatus(): NetRuntimeStatus {
    return { 
      ...this.status,
      uptime: this.status.startTime ? Date.now() - this.status.startTime : 0
    };
  }

  updateConfig(newConfig: Partial<NetRuntimeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('.NET runtime configuration updated');
    this.emit('configUpdated', newConfig);
  }

  private logOutput(type: 'STDOUT' | 'STDERR', output: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type}] ${output}`;
    const logFile = join(this.config.logPath, 'netruntime-output.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write output log:', error);
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [NETRUNTIME] ${message}\n`;
    const logFile = join(this.config.logPath, 'netruntime-service.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write netruntime log:', error);
    }
    
    console.log(logEntry.trim());
  }
}
