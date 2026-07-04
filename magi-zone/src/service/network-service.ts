import { EventEmitter } from 'events';
import { createServer, Server as NetServer, Socket } from 'net';
import { createServer as createHttpServer, Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

export class NetworkService extends EventEmitter {
  private config: NetworkConfig;
  private tcpServer?: NetServer;
  private httpServer?: HttpServer;
  private tcpConnections = new Set<Socket>();
  private httpConnections = new Set<IncomingMessage>();
  private startTime = Date.now();
  private isRunning = false;

  constructor(config: NetworkConfig) {
    super();
    this.config = config;
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.config.logPath)) {
      mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('Network service already running');
      return;
    }

    this.log('Starting network service...');
    this.startTime = Date.now();

    try {
      // Start TCP server if enabled
      if (this.config.enableTcp) {
        await this.startTcpServer();
      }

      // Start HTTP server if enabled
      if (this.config.enableHttp) {
        await this.startHttpServer();
      }

      this.isRunning = true;
      this.log('Network service started successfully');
      this.emit('started');

    } catch (error) {
      this.log(`Failed to start network service: ${error}`);
      this.emit('error', error);
      throw error;
    }
  }

  private async startTcpServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tcpServer = createServer((socket) => {
        this.handleTcpConnection(socket);
      });

      this.tcpServer.on('error', (error) => {
        this.log(`TCP server error: ${error}`);
        this.emit('tcpError', error);
        reject(error);
      });

      this.tcpServer.listen(this.config.tcpPort, this.config.host, () => {
        this.log(`TCP server listening on ${this.config.host}:${this.config.tcpPort}`);
        resolve();
      });
    });
  }

  private async startHttpServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer = createHttpServer((req, res) => {
        this.handleHttpRequest(req, res);
      });

      this.httpServer.on('error', (error) => {
        this.log(`HTTP server error: ${error}`);
        this.emit('httpError', error);
        reject(error);
      });

      this.httpServer.listen(this.config.httpPort, this.config.host, () => {
        this.log(`HTTP server listening on ${this.config.host}:${this.config.httpPort}`);
        resolve();
      });
    });
  }

  private handleTcpConnection(socket: Socket): void {
    if (this.tcpConnections.size >= this.config.maxConnections) {
      socket.end('Server busy. Try again later.\n');
      return;
    }

    this.tcpConnections.add(socket);
    this.log(`TCP connection from ${socket.remoteAddress}:${socket.remotePort}`);

    socket.setTimeout(this.config.timeout);
    socket.setEncoding('utf8');

    socket.on('data', (data) => {
      this.handleTcpData(socket, data.toString());
    });

    socket.on('close', () => {
      this.tcpConnections.delete(socket);
      this.log(`TCP connection closed: ${socket.remoteAddress}:${socket.remotePort}`);
    });

    socket.on('error', (error) => {
      this.tcpConnections.delete(socket);
      this.log(`TCP connection error: ${error}`);
    });

    socket.on('timeout', () => {
      socket.end('Connection timeout.\n');
    });

    // Welcome message
    socket.write('Magi Zone Network Service\n');
    socket.write('Ready for dimensional operations\n');
    socket.write('> ');

    this.emit('tcpConnection', {
      address: socket.remoteAddress,
      port: socket.remotePort
    });
  }

  private handleTcpData(socket: Socket, data: string): void {
    const command = data.trim();
    this.log(`TCP command received: ${command}`);

    // Process dimensional commands
    let response = '';
    switch (command.toLowerCase()) {
      case 'status':
        response = JSON.stringify(this.getStatus(), null, 2);
        break;
      case 'scan':
        response = 'Initiating dimensional wave scan...\nScan complete. 3 anomalies detected.';
        break;
      case 'activate':
        response = 'Dimensional protocol activated. Reality-tear invocation ready.';
        break;
      case 'help':
        response = 'Available commands: status, scan, activate, help, quit';
        break;
      case 'quit':
        socket.end('Goodbye\n');
        return;
      default:
        response = `Unknown command: ${command}. Type 'help' for available commands.`;
    }

    socket.write(response + '\n> ');
    this.emit('tcpCommand', { command, response });
  }

  private handleHttpRequest(req: IncomingMessage, res: ServerResponse): void {
    this.httpConnections.add(req);
    const url = req.url || '/';
    const method = req.method || 'GET';

    this.log(`HTTP ${method} ${url} from ${req.socket.remoteAddress}`);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
      if (method === 'GET') {
        this.handleHttpGet(url, res);
      } else if (method === 'POST') {
        this.handleHttpPost(url, req, res);
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
    } catch (error) {
      this.log(`HTTP request error: ${error}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    } finally {
      this.httpConnections.delete(req);
    }
  }

  private handleHttpGet(url: string, res: ServerResponse): void {
    switch (url) {
      case '/':
      case '/status':
        const status = this.getStatus();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status, null, 2));
        break;
      case '/health':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
        break;
      case '/scan':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          scan: 'complete',
          anomalies: 3,
          timestamp: new Date().toISOString()
        }));
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  private handleHttpPost(url: string, req: IncomingMessage, res: ServerResponse): void {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        this.log(`HTTP POST data: ${JSON.stringify(data)}`);

        switch (url) {
          case '/activate':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 'activated',
              protocol: 'dimensional',
              timestamp: new Date().toISOString()
            }));
            break;
          case '/command':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              command: data.command,
              result: 'executed',
              timestamp: new Date().toISOString()
            }));
            break;
          default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.log('Stopping network service...');

    // Close TCP connections
    this.tcpConnections.forEach(socket => {
      socket.destroy();
    });
    this.tcpConnections.clear();

    // Close HTTP connections
    this.httpConnections.clear();

    // Close servers
    if (this.tcpServer) {
      this.tcpServer.close();
      this.tcpServer = undefined;
    }

    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = undefined;
    }

    this.isRunning = false;
    this.log('Network service stopped');
    this.emit('stopped');
  }

  getStatus(): NetworkStatus {
    return {
      tcpRunning: !!this.tcpServer?.listening,
      httpRunning: !!this.httpServer?.listening,
      tcpConnections: this.tcpConnections.size,
      httpConnections: this.httpConnections.size,
      uptime: Date.now() - this.startTime,
      startTime: this.startTime
    };
  }

  updateConfig(newConfig: Partial<NetworkConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('Network service configuration updated');
    this.emit('configUpdated', newConfig);
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [NETWORK] ${message}\n`;
    const logFile = join(this.config.logPath, 'network-service.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write network log:', error);
    }
    
    console.log(logEntry.trim());
  }
}
