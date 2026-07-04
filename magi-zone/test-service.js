// Simple test to verify service functionality
import { bootstrapService } from './dist/index.js';

async function test() {
  try {
    console.log('Testing service without auto-install...');
    const service = await bootstrapService({
      autoInstall: false,
      autoStart: false
    });
    
    console.log('Service created successfully');
    console.log('Service status:', service.getStatus());
    
    // Test for a few seconds
    setTimeout(() => {
      console.log('Test completed successfully');
      process.exit(0);
    }, 3000);
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

test();
