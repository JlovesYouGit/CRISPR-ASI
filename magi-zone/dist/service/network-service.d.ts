import { EventEmitter } from 'events';
export interface NetworkConfig {
    tcpPort: number;
    httpPort: number;
    host: string;
    enableTcp: boolean;
    enableHttp: boolean;
    maxConnections: number;
    timeout: number;
    logPath: string;
}
export interface NetworkStatus {
    tcpRunning: boolean;
    httpRunning: boolean;
    tcpConnections: number;
    httpConnections: number;
    uptime: number;
    startTime: number;
}
export declare class NetworkService extends EventEmitter {
    private config;
    private tcpServer?;
    private httpServer?;
    private tcpConnections;
    private httpConnections;
    private startTime;
    private isRunning;
    constructor(config: NetworkConfig);
    private ensureLogDirectory;
    start(): Promise<void>;
    private startTcpServer;
    private startHttpServer;
    private handleTcpConnection;
    private handleTcpData;
    private handleHttpRequest;
    private handleHttpGet;
    private handleHttpPost;
    stop(): Promise<void>;
    getStatus(): NetworkStatus;
    updateConfig(newConfig: Partial<NetworkConfig>): void;
    private log;
}
