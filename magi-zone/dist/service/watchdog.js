import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
export class Watchdog extends EventEmitter {
    config;
    isRunning = false;
    checkTimer;
    startTime = Date.now();
    metrics;
    lastResponseTime = 0;
    consecutiveFailures = 0;
    activationEvents = [];
    constructor(config) {
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
    ensureLogDirectory() {
        if (!existsSync(this.config.logPath)) {
            mkdirSync(this.config.logPath, { recursive: true });
        }
    }
    start() {
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
    stop() {
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
    async performHealthCheck() {
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
            }
            else {
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
        }
        catch (error) {
            this.consecutiveFailures++;
            this.metrics.failureCount++;
            this.log(`Health check error: ${error}`);
            this.emit('healthCheckError', error);
        }
    }
    async checkServiceHealth() {
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
    handleServiceFailure() {
        this.log(`Service failure detected after ${this.consecutiveFailures} consecutive failures`);
        this.emit('serviceFailure', { consecutiveFailures: this.consecutiveFailures });
        // Reset consecutive failures after handling
        this.consecutiveFailures = 0;
    }
    recordActivation() {
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
        }
        else {
            this.metrics.thresholdReached = false;
        }
    }
    getMetrics() {
        return { ...this.metrics };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Watchdog configuration updated');
        if (this.isRunning && newConfig.checkInterval) {
            // Restart with new interval
            this.stop();
            this.start();
        }
    }
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [WATCHDOG] ${message}\n`;
        const logFile = join(this.config.logPath, `${this.config.name}-watchdog.log`);
        try {
            writeFileSync(logFile, logEntry, { flag: 'a' });
        }
        catch (error) {
            console.error('Failed to write watchdog log:', error);
        }
        if (this.config.metricsEnabled) {
            console.log(logEntry.trim());
        }
    }
}
