import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface NetbuildConfig {
  executablePath: string;
  arguments: string[];
  workingDirectory: string;
  autoRestart: boolean;
  restartDelay: number;
  maxRestarts: number;
  logPath: string;
  environment?: Record<string, string>;
}

export interface ProcessStatus {
  pid?: number;
  running: boolean;
  startTime?: number;
  restartCount: number;
  lastRestart?: number;
  exitCode?: number;
  signal?: string;
}

export class NetbuildIntegration extends EventEmitter {
  private config: NetbuildConfig;
  private process?: ChildProcess;
  private status: ProcessStatus;
  private restartTimer?: NodeJS.Timeout;

  constructor(config: NetbuildConfig) {
    super();
    this.config = config;
    this.ensureLogDirectory();
    this.status = {
      running: false,
      restartCount: 0
    };
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.config.logPath)) {
      mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  async initialize(): Promise<void> {
    this.log('Initializing netbuild integration');
    
    try {
      await this.startProcess();
      this.emit('initialized');
    } catch (error) {
      this.log(`Initialization failed: ${error}`);
      this.emit('initializationFailed', error);
      throw error;
    }
  }

  private async startProcess(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.process && !this.process.killed) {
        this.log('Process already running');
        resolve();
        return;
      }

      this.log(`Starting process: ${this.config.executablePath}`);
      
      const env = { ...process.env, ...this.config.environment };
      
      this.process = spawn(this.config.executablePath, this.config.arguments, {
        cwd: this.config.workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: env
      });

      this.status.running = true;
      this.status.startTime = Date.now();
      this.status.pid = this.process.pid;

      this.setupProcessHandlers();
      
      this.process.on('spawn', () => {
        this.log(`Process spawned with PID: ${this.process?.pid}`);
        this.emit('processStarted', { pid: this.process?.pid });
        resolve();
      });

      this.process.on('error', (error) => {
        this.log(`Process error: ${error}`);
        this.status.running = false;
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
      this.status.signal = signal || undefined;
      
      this.log(`Process exited with code: ${code}, signal: ${signal}`);
      this.emit('processExited', { code, signal });

      if (this.config.autoRestart && this.shouldRestart()) {
        this.scheduleRestart();
      }
    });

    // Handle process close
    this.process.on('close', (code, signal) => {
      this.log(`Process closed with code: ${code}, signal: ${signal}`);
      this.emit('processClosed', { code, signal });
    });
  }

  private shouldRestart(): boolean {
    if (this.status.restartCount >= this.config.maxRestarts) {
      this.log(`Max restarts reached (${this.config.maxRestarts}), not restarting`);
      return false;
    }

    // Don't restart if process was killed intentionally
    if (this.status.signal === 'SIGTERM' || this.status.signal === 'SIGINT') {
      this.log('Process was terminated intentionally, not restarting');
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
        await this.startProcess();
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
    this.log('Stopping netbuild integration');
    
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = undefined;
    }

    if (this.process && !this.process.killed) {
      return new Promise((resolve) => {
        this.process!.once('exit', () => {
          this.log('Process stopped successfully');
          this.emit('stopped');
          resolve();
        });

        this.process!.kill('SIGTERM');
        
        // Force kill if graceful shutdown doesn't work
        setTimeout(() => {
          if (this.process && !this.process.killed) {
            this.process.kill('SIGKILL');
          }
        }, 5000);
      });
    }
  }

  async restart(): Promise<void> {
    this.log('Restarting netbuild integration');
    
    await this.stop();
    this.status.restartCount = 0; // Reset restart count on manual restart
    
    try {
      await this.startProcess();
      this.emit('restarted');
    } catch (error) {
      this.log(`Manual restart failed: ${error}`);
      this.emit('restartFailed', error);
      throw error;
    }
  }

  sendInput(data: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(data);
      this.log(`Sent input: ${data}`);
      this.emit('inputSent', data);
    } else {
      this.log('Cannot send input: process not running or stdin not available');
      this.emit('inputFailed', 'Process not running');
    }
  }

  getStatus(): ProcessStatus {
    return { ...this.status };
  }

  updateConfig(newConfig: Partial<NetbuildConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('Netbuild configuration updated');
    this.emit('configUpdated', newConfig);
  }

  private logOutput(type: 'STDOUT' | 'STDERR', output: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type}] ${output}`;
    const logFile = join(this.config.logPath, 'netbuild-output.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write output log:', error);
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [NETBUILD] ${message}\n`;
    const logFile = join(this.config.logPath, 'netbuild-integration.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write netbuild log:', error);
    }
    
    console.log(logEntry.trim());
  }
}
