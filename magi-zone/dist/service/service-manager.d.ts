import { EventEmitter } from 'events';
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
export declare class ServiceManager extends EventEmitter {
    private config;
    private isRunning;
    private watchdogTimer?;
    private activationCount;
    private lastActivationTime;
    constructor(config: ServiceConfig);
    private ensureLogDirectory;
    installService(): Promise<void>;
    uninstallService(): Promise<void>;
    startService(): Promise<void>;
    stopService(): Promise<void>;
    private buildServiceCommand;
    private startWatchdog;
    private stopWatchdog;
    private checkServiceHealth;
    private checkActivationThreshold;
    private restartService;
    private log;
    getServiceStatus(): {
        isRunning: boolean;
        activationCount: number;
        lastActivation: number;
    };
}
