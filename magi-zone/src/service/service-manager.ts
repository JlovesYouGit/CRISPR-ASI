import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

export interface ServiceConfig {
  serviceName: string;
  displayName: string;
  description: string;
  executablePath: string;
  arguments?: string[];
  startType: 'auto' | 'demand' | 'disabled';
  logPath: string;
  watchdogInterval: number;
  activationThreshold: number;
}

export class ServiceManager extends EventEmitter {
  private config: ServiceConfig;
  private isRunning = false;
  private watchdogTimer?: NodeJS.Timeout;
  private activationCount = 0;
  private lastActivationTime = Date.now();

  constructor(config: ServiceConfig) {
    super();
    this.config = config;
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    const logDir = this.config.logPath;
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  async installService(): Promise<void> {
    try {
      const serviceCommand = this.buildServiceCommand();
      const psCommand = `
        New-Service -Name "${this.config.serviceName}" `
        + `-DisplayName "${this.config.displayName}" `
        + `-Description "${this.config.description}" `
        + `-BinaryPathName "${serviceCommand}" `
        + `-StartupType ${this.config.startType}
      `;

      await execAsync(`powershell.exe -Command "${psCommand}"`, { cwd: process.cwd() });
      this.log('Service installed successfully');
      this.emit('serviceInstalled');
    } catch (error) {
      this.log(`Failed to install service: ${error}`);
      throw error;
    }
  }

  async uninstallService(): Promise<void> {
    try {
      await execAsync(`sc delete "${this.config.serviceName}"`, { cwd: process.cwd() });
      this.log('Service uninstalled successfully');
      this.emit('serviceUninstalled');
    } catch (error) {
      this.log(`Failed to uninstall service: ${error}`);
      throw error;
    }
  }

  async startService(): Promise<void> {
    try {
      await execAsync(`sc start "${this.config.serviceName}"`, { cwd: process.cwd() });
      this.isRunning = true;
      this.startWatchdog();
      this.log('Service started successfully');
      this.emit('serviceStarted');
    } catch (error) {
      this.log(`Failed to start service: ${error}`);
      throw error;
    }
  }

  async stopService(): Promise<void> {
    try {
      await execAsync(`sc stop "${this.config.serviceName}"`, { cwd: process.cwd() });
      this.isRunning = false;
      this.stopWatchdog();
      this.log('Service stopped successfully');
      this.emit('serviceStopped');
    } catch (error) {
      this.log(`Failed to stop service: ${error}`);
      throw error;
    }
  }

  private buildServiceCommand(): string {
    const args = this.config.arguments ? this.config.arguments.join(' ') : '';
    return `"${this.config.executablePath}" ${args}`;
  }

  private startWatchdog(): void {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
    }

    this.watchdogTimer = setInterval(() => {
      this.checkServiceHealth();
    }, this.config.watchdogInterval);
  }

  private stopWatchdog(): void {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = undefined;
    }
  }

  private async checkServiceHealth(): Promise<void> {
    try {
      const { stdout } = await execAsync(`sc query "${this.config.serviceName}"`, { cwd: process.cwd() });
      const isServiceRunning = stdout.includes('RUNNING');

      if (!isServiceRunning && this.isRunning) {
        this.log('Service detected as down, attempting restart');
        this.emit('serviceDown');
        await this.restartService();
      }

      this.checkActivationThreshold();
    } catch (error) {
      this.log(`Health check failed: ${error}`);
      this.emit('healthCheckFailed', error);
    }
  }

  private checkActivationThreshold(): void {
    const now = Date.now();
    const timeSinceLastActivation = now - this.lastActivationTime;

    if (timeSinceLastActivation < 60000) { // Within last minute
      this.activationCount++;
    } else {
      this.activationCount = 1;
    }

    this.lastActivationTime = now;

    if (this.activationCount >= this.config.activationThreshold) {
      this.log(`Activation threshold reached: ${this.activationCount}`);
      this.emit('thresholdExceeded', this.activationCount);
      this.activationCount = 0; // Reset after threshold reached
    }
  }

  private async restartService(): Promise<void> {
    try {
      await this.stopService();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      await this.startService();
      this.log('Service restarted successfully');
      this.emit('serviceRestarted');
    } catch (error) {
      this.log(`Failed to restart service: ${error}`);
      this.emit('restartFailed', error);
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    const logFile = join(this.config.logPath, `${this.config.serviceName}.log`);
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
    
    console.log(logEntry.trim());
  }

  getServiceStatus(): { isRunning: boolean; activationCount: number; lastActivation: number } {
    return {
      isRunning: this.isRunning,
      activationCount: this.activationCount,
      lastActivation: this.lastActivationTime
    };
  }
}
