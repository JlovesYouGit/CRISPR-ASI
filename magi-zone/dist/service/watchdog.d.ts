import { EventEmitter } from 'events';
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
export declare class Watchdog extends EventEmitter {
    private config;
    private isRunning;
    private checkTimer?;
    private startTime;
    private metrics;
    private lastResponseTime;
    private consecutiveFailures;
    private activationEvents;
    constructor(config: WatchdogConfig);
    private ensureLogDirectory;
    start(): void;
    stop(): void;
    private performHealthCheck;
    private checkServiceHealth;
    private handleServiceFailure;
    recordActivation(): void;
    getMetrics(): HealthMetrics;
    updateConfig(newConfig: Partial<WatchdogConfig>): void;
    private log;
}
