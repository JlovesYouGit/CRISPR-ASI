import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
const execAsync = promisify(exec);
export class ServiceManager extends EventEmitter {
    config;
    isRunning = false;
    watchdogTimer;
    activationCount = 0;
    lastActivationTime = Date.now();
    constructor(config) {
        super();
        this.config = config;
        this.ensureLogDirectory();
    }
    ensureLogDirectory() {
        const logDir = this.config.logPath;
        if (!existsSync(logDir)) {
            mkdirSync(logDir, { recursive: true });
        }
    }
    async installService() {
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
        }
        catch (error) {
            this.log(`Failed to install service: ${error}`);
            throw error;
        }
    }
    async uninstallService() {
        try {
            await execAsync(`sc delete "${this.config.serviceName}"`, { cwd: process.cwd() });
            this.log('Service uninstalled successfully');
            this.emit('serviceUninstalled');
        }
        catch (error) {
            this.log(`Failed to uninstall service: ${error}`);
            throw error;
        }
    }
    async startService() {
        try {
            await execAsync(`sc start "${this.config.serviceName}"`, { cwd: process.cwd() });
            this.isRunning = true;
            this.startWatchdog();
            this.log('Service started successfully');
            this.emit('serviceStarted');
        }
        catch (error) {
            this.log(`Failed to start service: ${error}`);
            throw error;
        }
    }
    async stopService() {
        try {
            await execAsync(`sc stop "${this.config.serviceName}"`, { cwd: process.cwd() });
            this.isRunning = false;
            this.stopWatchdog();
            this.log('Service stopped successfully');
            this.emit('serviceStopped');
        }
        catch (error) {
            this.log(`Failed to stop service: ${error}`);
            throw error;
        }
    }
    buildServiceCommand() {
        const args = this.config.arguments ? this.config.arguments.join(' ') : '';
        return `"${this.config.executablePath}" ${args}`;
    }
    startWatchdog() {
        if (this.watchdogTimer) {
            clearInterval(this.watchdogTimer);
        }
        this.watchdogTimer = setInterval(() => {
            this.checkServiceHealth();
        }, this.config.watchdogInterval);
    }
    stopWatchdog() {
        if (this.watchdogTimer) {
            clearInterval(this.watchdogTimer);
            this.watchdogTimer = undefined;
        }
    }
    async checkServiceHealth() {
        try {
            const { stdout } = await execAsync(`sc query "${this.config.serviceName}"`, { cwd: process.cwd() });
            const isServiceRunning = stdout.includes('RUNNING');
            if (!isServiceRunning && this.isRunning) {
                this.log('Service detected as down, attempting restart');
                this.emit('serviceDown');
                await this.restartService();
            }
            this.checkActivationThreshold();
        }
        catch (error) {
            this.log(`Health check failed: ${error}`);
            this.emit('healthCheckFailed', error);
        }
    }
    checkActivationThreshold() {
        const now = Date.now();
        const timeSinceLastActivation = now - this.lastActivationTime;
        if (timeSinceLastActivation < 60000) { // Within last minute
            this.activationCount++;
        }
        else {
            this.activationCount = 1;
        }
        this.lastActivationTime = now;
        if (this.activationCount >= this.config.activationThreshold) {
            this.log(`Activation threshold reached: ${this.activationCount}`);
            this.emit('thresholdExceeded', this.activationCount);
            this.activationCount = 0; // Reset after threshold reached
        }
    }
    async restartService() {
        try {
            await this.stopService();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            await this.startService();
            this.log('Service restarted successfully');
            this.emit('serviceRestarted');
        }
        catch (error) {
            this.log(`Failed to restart service: ${error}`);
            this.emit('restartFailed', error);
        }
    }
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        const logFile = join(this.config.logPath, `${this.config.serviceName}.log`);
        try {
            writeFileSync(logFile, logEntry, { flag: 'a' });
        }
        catch (error) {
            console.error('Failed to write to log file:', error);
        }
        console.log(logEntry.trim());
    }
    getServiceStatus() {
        return {
            isRunning: this.isRunning,
            activationCount: this.activationCount,
            lastActivation: this.lastActivationTime
        };
    }
}
