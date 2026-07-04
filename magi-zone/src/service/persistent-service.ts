import { EventEmitter } from 'events';
import { ServiceManager, ServiceConfig } from './service-manager.js';
import { Watchdog, WatchdogConfig } from './watchdog.js';
import { NetbuildIntegration, NetbuildConfig } from './netbuild-integration.js';
import { NetRuntimeService, NetRuntimeConfig } from './net-runtime-service.js';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface PersistentServiceConfig {
  service: ServiceConfig;
  watchdog: WatchdogConfig;
  netbuild: NetbuildConfig;
  netRuntime: NetRuntimeConfig;
  autoInstall: boolean;
  autoStart: boolean;
  enableLogging: boolean;
}

export class PersistentService extends EventEmitter {
  private config: PersistentServiceConfig;
  private serviceManager: ServiceManager;
  private watchdog: Watchdog;
  private netbuildIntegration: NetbuildIntegration;
  private netRuntimeService: NetRuntimeService;
  private isInitialized = false;

  constructor(config: PersistentServiceConfig) {
    super();
    this.config = config;
    
    this.serviceManager = new ServiceManager(config.service);
    this.watchdog = new Watchdog(config.watchdog);
    this.netbuildIntegration = new NetbuildIntegration(config.netbuild);
    this.netRuntimeService = new NetRuntimeService(config.netRuntime);
    
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Service manager events
    this.serviceManager.on('serviceStarted', () => {
      this.log('Service started, starting watchdog and .NET runtime');
      this.watchdog.start();
      this.netRuntimeService.initialize().catch(error => {
        this.log(`Failed to initialize .NET runtime: ${error}`);
      });
      this.emit('serviceStarted');
    });

    this.serviceManager.on('serviceStopped', () => {
      this.log('Service stopped, stopping watchdog and .NET runtime');
      this.watchdog.stop();
      this.netRuntimeService.stop().catch(error => {
        this.log(`Failed to stop .NET runtime: ${error}`);
      });
      this.emit('serviceStopped');
    });

    this.serviceManager.on('serviceDown', () => {
      this.log('Service detected as down');
      this.emit('serviceDown');
    });

    this.serviceManager.on('thresholdExceeded', (count) => {
      this.log(`Activation threshold exceeded: ${count}`);
      this.emit('thresholdExceeded', count);
    });

    // Watchdog events
    this.watchdog.on('activationThresholdReached', (data) => {
      this.log(`Watchdog activation threshold reached: ${data.count}/${data.threshold}`);
      this.handleActivationThreshold(data);
    });

    this.watchdog.on('serviceFailure', () => {
      this.log('Watchdog detected service failure');
      this.handleServiceFailure();
    });

    this.watchdog.on('healthCheckFailed', (data) => {
      this.log(`Health check failed: ${data.consecutiveFailures} consecutive failures`);
      this.emit('healthCheckFailed', data);
    });

    // Netbuild integration events
    this.netbuildIntegration.on('processStarted', (data) => {
      this.log(`Netbuild process started with PID: ${data.pid}`);
      this.emit('netbuildStarted', data);
    });

    this.netbuildIntegration.on('processExited', (data) => {
      this.log(`Netbuild process exited: ${data.code}`);
      this.emit('netbuildExited', data);
    });

    this.netbuildIntegration.on('processRestarted', (data) => {
      this.log(`Netbuild process restarted: attempt ${data.restartCount}`);
      this.emit('netbuildRestarted', data);
    });

    // .NET Runtime events
    this.netRuntimeService.on('ready', () => {
      this.log('.NET runtime is ready');
      this.emit('netRuntimeReady');
    });

    this.netRuntimeService.on('assemblyLoaded', (assemblyPath) => {
      this.log(`Assembly loaded: ${assemblyPath}`);
      this.emit('assemblyLoaded', assemblyPath);
    });

    this.netRuntimeService.on('processStarted', (data) => {
      this.log(`.NET runtime started with PID: ${data.pid}`);
      this.emit('netRuntimeStarted', data);
    });

    this.netRuntimeService.on('processExited', (data) => {
      this.log(`.NET runtime exited: ${data.code}`);
      this.emit('netRuntimeExited', data);
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.log('Service already initialized');
      return;
    }

    this.log('Initializing persistent service');

    try {
      // Auto-install service if configured
      if (this.config.autoInstall) {
        await this.installService();
      }

      // Only initialize netbuild integration if not in service mode
      const isServiceMode = process.argv.includes('--service');
      if (!isServiceMode) {
        await this.netbuildIntegration.initialize();
      } else {
        this.log('Skipping netbuild integration in service mode');
      }

      // Auto-start service if configured
      if (this.config.autoStart) {
        await this.startService();
      }

      this.isInitialized = true;
      this.log('Persistent service initialized successfully');
      this.emit('initialized');

    } catch (error) {
      this.log(`Initialization failed: ${error}`);
      this.emit('initializationFailed', error);
      throw error;
    }
  }

  async installService(): Promise<void> {
    this.log('Installing Windows service');
    await this.serviceManager.installService();
    this.emit('serviceInstalled');
  }

  async uninstallService(): Promise<void> {
    this.log('Uninstalling Windows service');
    await this.stopService();
    await this.serviceManager.uninstallService();
    this.emit('serviceUninstalled');
  }

  async startService(): Promise<void> {
    this.log('Starting persistent service');
    await this.serviceManager.startService();
  }

  async stopService(): Promise<void> {
    this.log('Stopping persistent service');
    await this.netbuildIntegration.stop();
    await this.netRuntimeService.stop();
    await this.serviceManager.stopService();
  }

  async restartService(): Promise<void> {
    this.log('Restarting persistent service');
    await this.stopService();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.startService();
  }

  private handleActivationThreshold(data: { count: number; threshold: number }): void {
    // Record activation in watchdog
    this.watchdog.recordActivation();
    
    // Emit event for external handling
    this.emit('activationThresholdReached', data);
  }

  private handleServiceFailure(): void {
    this.log('Handling service failure');
    
    // Attempt to restart the service
    this.restartService().catch(error => {
      this.log(`Failed to restart service: ${error}`);
      this.emit('restartFailed', error);
    });
  }

  getStatus(): {
    service: any;
    watchdog: any;
    netbuild: any;
    netRuntime: any;
    initialized: boolean;
  } {
    return {
      service: this.serviceManager.getServiceStatus(),
      watchdog: this.watchdog.getMetrics(),
      netbuild: this.netbuildIntegration.getStatus(),
      netRuntime: this.netRuntimeService.getStatus(),
      initialized: this.isInitialized
    };
  }

  updateConfig(newConfig: Partial<PersistentServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.service) {
      // Service config updates require service restart
      this.log('Service configuration updated');
    }
    
    if (newConfig.watchdog) {
      this.watchdog.updateConfig(newConfig.watchdog);
    }
    
    if (newConfig.netbuild) {
      this.netbuildIntegration.updateConfig(newConfig.netbuild);
    }
    
    if (newConfig.netRuntime) {
      this.netRuntimeService.updateConfig(newConfig.netRuntime);
    }
    
    this.log('Persistent service configuration updated');
    this.emit('configUpdated', newConfig);
  }

  async shutdown(): Promise<void> {
    this.log('Shutting down persistent service');
    
    try {
      await this.stopService();
      this.watchdog.stop();
      await this.netbuildIntegration.stop();
      await this.netRuntimeService.stop();
      
      this.isInitialized = false;
      this.log('Persistent service shut down successfully');
      this.emit('shutdown');
    } catch (error) {
      this.log(`Shutdown failed: ${error}`);
      this.emit('shutdownFailed', error);
      throw error;
    }
  }

  private log(message: string): void {
    if (!this.config.enableLogging) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [PERSISTENT] ${message}\n`;
    const logFile = join(this.config.service.logPath, 'persistent-service.log');
    
    try {
      writeFileSync(logFile, logEntry, { flag: 'a' });
    } catch (error) {
      console.error('Failed to write persistent service log:', error);
    }
    
    console.log(logEntry.trim());
  }
}
