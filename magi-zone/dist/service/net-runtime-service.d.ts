import { EventEmitter } from 'events';
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
export declare class NetRuntimeService extends EventEmitter {
    private config;
    private process?;
    private status;
    private restartTimer?;
    private readyCheckTimer?;
    constructor(config: NetRuntimeConfig);
    private ensureLogDirectory;
    initialize(): Promise<void>;
    private checkDotNetRuntime;
    private checkAssembly;
    start(): Promise<void>;
    private setupProcessHandlers;
    private startReadyCheck;
    private shouldRestart;
    private scheduleRestart;
    stop(): Promise<void>;
    sendCommand(command: string): void;
    executeCommand(command: string, timeout?: number): Promise<string>;
    autoLoadAssembly(assemblyPath?: string): Promise<void>;
    getStatus(): NetRuntimeStatus;
    updateConfig(newConfig: Partial<NetRuntimeConfig>): void;
    private logOutput;
    private log;
}
