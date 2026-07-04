import { EventEmitter } from 'events';
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
export declare class NetbuildIntegration extends EventEmitter {
    private config;
    private process?;
    private status;
    private restartTimer?;
    constructor(config: NetbuildConfig);
    private ensureLogDirectory;
    initialize(): Promise<void>;
    private startProcess;
    private setupProcessHandlers;
    private shouldRestart;
    private scheduleRestart;
    stop(): Promise<void>;
    restart(): Promise<void>;
    sendInput(data: string): void;
    getStatus(): ProcessStatus;
    updateConfig(newConfig: Partial<NetbuildConfig>): void;
    private logOutput;
    private log;
}
