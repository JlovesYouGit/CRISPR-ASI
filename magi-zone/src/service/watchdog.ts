import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface WatchdogConfig {
  name: string;
  checkInterval: number;
  responseTimeout: number;
  maxFailures: number;
  activationThreshold: number;
  logPath: string;
  metricsEnabled: boolean;
}

export interface HealthMetrics {
  uptime: number;
  lastCheck: number;
  failureCount: number;
  responseTime: number;
  activationCount: number;
  thresholdReached: boolean;
}

export class Watchdog extends EventEmitter {
  private config: WatchdogConfig;
  private isRunning = false;
  private checkTimer?: NodeJS.Timeout;
  private startTime = Date.now();
  private metrics: HealthMetrics;
  private lastResponseTime = 0;
  private consecutiveFailures = 0;
  private activationEvents: number[] = [];

  constructor(config: WatchdogConfig) {
    super();
    this.config = config;
    this.ensureLogDirectory();
    this.metrics = {
      uptime: 0,
      lastCheck: Date.now(),
      failureCount: 0,
      responseTime: 0,
      activationCount: 0,
      thresholdReached: false
    };
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.config.logPath)) {
      mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  start(): void {
    if (this.isRunning) {
      this.log('Watchdog already running');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();
    this.log('Watchdog started');
    
    this.checkTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);

    this.emit('watchdogStarted');
  }

  stop(): void {
    if (!this.isRunning) {
      this.log('Watchdog not running');
      return;
    }

    this.isRunning = false;
    
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }

    this.log('Watchdog stopped');
    this.emit('watchdogStopped');
  }

  private async performHealthCheck(): Promise<void> {
    const checkStart = performance.now();
    
    try {
      this.emit('healthCheckStarted');
      
      // Simulate health check - in real implementation, this would check the actual service
      const isHealthy = await this.checkServiceHealth();
      
      const responseTime = performance.now() - checkStart;
      this.lastResponseTime = responseTime;
      this.metrics.responseTime = responseTime;
      this.metrics.lastCheck = Date.now();
      this.metrics.uptime = Date.now() - this.startTime;

      if (isHealthy) {
        this.consecutiveFailures = 0;
        this.emit('healthCheckPassed', { responseTime, uptime: this.metrics.uptime });
      } else {
        this.consecutiveFailures++;
        this.metrics.failureCount++;
        this.emit('healthCheckFailed', { 
          consecutiveFailures: this.consecutiveFailures,
          totalFailures: this.metrics.failureCount 
        });

        if (this.consecutiveFailures >= this.config.maxFailures) {
          this.handleServiceFailure();
        }
      }

    } catch (error) {
      this.consecutiveFailures++;
      this.metrics.failureCount++;
      this.log(`Health check error: ${error}`);
      this.emit('healthCheckError', error);
    }
  }

  private async checkServiceHealth(): Promise<boolean> {
    // This is where you'd implement actual service health checking
    // For now, we'll simulate with a simple check
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const isHealthy = Math.random() > 0.05;
        resolve(isHealthy);
      }, Math.random() * 100); // Random response time 0-100ms
    });
  }

  private handleServiceFailure(): void {
    this.log(`Service failure detected after ${this.consecutiveFailures} consecutive failures`);
    this.emit('serviceFailure', { consecutiveFailures: this.consecutiveFailures });
    
    // Reset consecutive failures after handling
    this.consecutiveFailures = 0;
  }

  recordActivation(): void {
    const now = Date.now();
    this.activationEvents.push(now);
    
    // Keep only events from the last minute
    const oneMinuteAgo = now - 60000;
    this.activationEvents = this.activationEvents.filter(event => event > oneMinuteAgo);
    
    this.metrics.activationCount = this.activationEvents.length;
    
    if (this.activationEvents.length >= this.config.activationThreshold) {
      if (!this.metrics.thresholdReached) {
        this.metrics.thresholdReached = true;
        this.log(`Activation threshold reached: ${this.activationEvents.length} events in last minute`);
        this.emit('activationThresholdReached', {
          count: this.activationEvents.length,
          threshold: this.config.activationThreshold
        });
      }
    } else {
      this.metrics.thresholdReached = false;
    }
  }

  getMetrics(): HealthMetrics {
    return { ...this.metrics };
  }

  updateConfig(newConfig: Partial<WatchdogConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('Watchdog configuration updated');
    
    if (this.isRunning && newConfig.checkInterval) {
      // Restart with new interval
      this.stop();
      this.start();
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [WATCHDOG] ${message}\n`;
    const logFile = join(this.config.logPath, `${this.config.name}-watchdog.log`);
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write watchdog log:', error);
    }
    
    if (this.config.metricsEnabled) {
      console.log(logEntry.trim());
    }
  }
}
