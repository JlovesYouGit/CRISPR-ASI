import { EventEmitter } from 'events';
export declare class SimplePersistentService extends EventEmitter {
    private isRunning;
    private logPath;
    private heartbeatInterval?;
    constructor(logPath?: string);
    private ensureLogDirectory;
    start(): Promise<void>;
    private heartbeat;
    private keepAlive;
    shutdown(): Promise<void>;
    private log;
}
export declare function runSimplePersistentService(): Promise<void>;
