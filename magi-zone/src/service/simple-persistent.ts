import { EventEmitter } from 'events';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class SimplePersistentService extends EventEmitter {
  private isRunning = false;
  private logPath: string;
  private heartbeatInterval?: NodeJS.Timeout;

  constructor(logPath: string = 'logs') {
    super();
    this.logPath = logPath;
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!existsSync(this.logPath)) {
      mkdirSync(this.logPath, { recursive: true });
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.log('Service already running');
      return;
    }

    this.isRunning = true;
    this.log('Simple persistent service started');
    
    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.heartbeat();
    }, 30000); // Every 30 seconds

    // Set up signal handlers
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    this.emit('started');
    this.log('Service is now running persistently');
    
    // Keep the process alive
    this.keepAlive();
  }

  private heartbeat(): void {
    this.log('Heartbeat - service is running');
    this.emit('heartbeat');
  }

  private keepAlive(): void {
    // Simple keep-alive mechanism
    const checkInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(checkInterval);
        return;
      }
      
      // Emit periodic status
      this.emit('status', {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      });
    }, 60000); // Every minute
  }

  async shutdown(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.log('Shutting down service...');
    this.isRunning = false;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.emit('shutdown');
    this.log('Service shutdown complete');
    
    // Give a moment for cleanup
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [SIMPLE-PERSISTENT] ${message}\n`;
    const logFile = join(this.logPath, 'simple-service.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write log:', error);
    }
    
    console.log(logEntry.trim());
  }
}

export async function runSimplePersistentService(): Promise<void> {
  const service = new SimplePersistentService();
  
  service.on('started', () => {
    console.log('✅ Magi Zone simple persistent service started');
    console.log('📝 Logs are being written to logs/simple-service.log');
    console.log('🔄 Service will run continuously');
    console.log('⏹️  Press Ctrl+C to stop');
  });

  service.on('heartbeat', () => {
    // Heartbeat logged to file only
  });

  service.on('status', (status) => {
    console.log(`📊 Status: Uptime ${Math.floor(status.uptime)}s, Memory ${Math.floor(status.memory.heapUsed / 1024 / 1024)}MB`);
  });

  service.on('shutdown', () => {
    console.log('🛑 Service stopped');
  });

  try {
    await service.start();
  } catch (error) {
    console.error('❌ Failed to start service:', error);
    process.exit(1);
  }
}
