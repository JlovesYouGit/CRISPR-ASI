import { PersistentService, PersistentServiceConfig } from './persistent-service.js';
export declare function createDefaultConfig(): PersistentServiceConfig;
export declare function bootstrapService(config?: Partial<PersistentServiceConfig>): Promise<PersistentService>;
export declare function runBootstrap(): Promise<void>;
