import { PersistentService, PersistentServiceConfig } from './persistent-service.js';
import { resolve } from 'path';

export function createDefaultConfig(): PersistentServiceConfig {
  const projectRoot = process.cwd(); // Use current working directory
  const logPath = resolve(projectRoot, 'logs');
  
  return {
    service: {
      serviceName: 'MagiZoneService',
      displayName: 'Magi Zone Dimensional Service',
      description: 'Dimensional wave detection, enforce protocol, and reality-tear invocation system',
      executablePath: resolve(projectRoot, 'dist', 'index.js'),
      arguments: ['--service', '--auto-init'],
      startType: 'auto',
      logPath: logPath,
      watchdogInterval: 30000, // 30 seconds
      activationThreshold: 10 // 10 activations per minute threshold
    },
    watchdog: {
      name: 'MagiZone',
      checkInterval: 15000, // 15 seconds
      responseTimeout: 5000, // 5 seconds
      maxFailures: 3,
      activationThreshold: 10,
      logPath: logPath,
      metricsEnabled: true
    },
    netbuild: {
      executablePath: resolve(projectRoot, 'dist', 'index.js'),
      arguments: ['--netbuild', '--daemon'],
      workingDirectory: projectRoot,
      autoRestart: true,
      restartDelay: 5000, // 5 seconds
      maxRestarts: 10,
      logPath: logPath,
      environment: {
        NODE_ENV: 'production',
        MAGI_ZONE_MODE: 'persistent'
      }
    },
    netRuntime: {
      dotnetPath: 'dotnet',
      assemblyPath: resolve(projectRoot, 'bin', 'Debug', 'net9.0', 'MagiZone.Runtime.dll'),
      arguments: ['--auto-load', '--service-mode'],
      workingDirectory: projectRoot,
      autoStart: true,
      autoRestart: true,
      restartDelay: 3000, // 3 seconds
      maxRestarts: 5,
      timeout: 30000, // 30 seconds
      logPath: logPath,
      environment: {
        DOTNET_ENVIRONMENT: 'Production',
        MAGI_ZONE_RUNTIME: 'enabled'
      }
    },
    autoInstall: true,
    autoStart: true,
    enableLogging: true
  };
}

export async function bootstrapService(config?: Partial<PersistentServiceConfig>): Promise<PersistentService> {
  const defaultConfig = createDefaultConfig();
  const finalConfig = { ...defaultConfig, ...config };
  
  console.log('Bootstrapping Magi Zone persistent service with .NET runtime...');
  
  // For service mode, we run directly without netbuild integration to avoid circular spawning
  const isServiceMode = process.argv.includes('--service');
  if (isServiceMode) {
    finalConfig.netbuild = {
      ...finalConfig.netbuild,
      autoRestart: false // Disable netbuild in service mode to avoid circular spawning
    };
  }
  
  const service = new PersistentService(finalConfig);
  
  // Set up error handling
  service.on('error', (error) => {
    console.error('Service error:', error);
  });
  
  service.on('initializationFailed', (error) => {
    console.error('Service initialization failed:', error);
    process.exit(1);
  });
  
  service.on('shutdownFailed', (error) => {
    console.error('Service shutdown failed:', error);
  });

  // .NET Runtime specific events
  service.on('netRuntimeReady', () => {
    console.log('✅ .NET runtime is ready');
  });

  service.on('assemblyLoaded', (assemblyPath) => {
    console.log(`✅ Assembly auto-loaded: ${assemblyPath}`);
  });
  
  // Handle process signals
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    try {
      await service.shutdown();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    try {
      await service.shutdown();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Initialize the service
  try {
    await service.initialize();
    console.log('Magi Zone persistent service with .NET runtime bootstrap complete');
    return service;
  } catch (error) {
    console.error('Failed to bootstrap service:', error);
    throw error;
  }
}

// CLI entry point
export async function runBootstrap(): Promise<void> {
  const args = process.argv.slice(2);
  const config: Partial<PersistentServiceConfig> = {};
  
  // Parse command line arguments
  if (args.includes('--no-auto-install')) {
    config.autoInstall = false;
  }
  
  if (args.includes('--no-auto-start')) {
    config.autoStart = false;
  }
  
  if (args.includes('--debug')) {
    config.enableLogging = true;
    if (config.watchdog) {
      config.watchdog.metricsEnabled = true;
    }
  }
  
  try {
    const service = await bootstrapService(config);
    
    // Keep the process alive
    console.log('Service is running. Press Ctrl+C to stop.');
    
    // Set up periodic status reporting
    setInterval(() => {
      const status = service.getStatus();
      console.log('Service Status:', JSON.stringify(status, null, 2));
    }, 60000); // Every minute
    
  } catch (error) {
    console.error('Bootstrap failed:', error);
    process.exit(1);
  }
}

// Run bootstrap if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBootstrap();
}
