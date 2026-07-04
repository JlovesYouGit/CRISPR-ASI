import { EventEmitter } from 'events';
import { ServiceConfig } from './service-manager.js';
import { WatchdogConfig } from './watchdog.js';
import { NetbuildConfig } from './netbuild-integration.js';
import { NetRuntimeConfig } from './net-runtime-service.js';
export interface PersistentServiceConfig {
    service: ServiceConfig;
    watchdog: WatchdogConfig;
    netbuild: NetbuildConfig;
    netRuntime: NetRuntimeConfig;
    autoInstall: boolean;
    autoStart: boolean;
    enableLogging: boolean;
}
export declare class PersistentService extends EventEmitter {
    private config;
    private serviceManager;
    private watchdog;
    private netbuildIntegration;
    private netRuntimeService;
    private isInitialized;
    constructor(config: PersistentServiceConfig);
    private setupEventHandlers;
    initialize(): Promise<void>;
    installService(): Promise<void>;
    uninstallService(): Promise<void>;
    startService(): Promise<void>;
    stopService(): Promise<void>;
    restartService(): Promise<void>;
    private handleActivationThreshold;
    private handleServiceFailure;
    getStatus(): {
        service: any;
        watchdog: any;
        netbuild: any;
        netRuntime: any;
        initialized: boolean;
    };
    updateConfig(newConfig: Partial<PersistentServiceConfig>): void;
    shutdown(): Promise<void>;
    private log;
}
