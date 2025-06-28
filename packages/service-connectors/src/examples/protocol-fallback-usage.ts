import { 
  createServiceUrl, 
  testServiceConnectivity, 
  ServiceConnectionManager,
  ollamaDefinition,
  comfyuiDefinition,
  openaiDefinition
} from '../index';

/**
 * Example: Using protocol fallback with local services
 */
export async function exampleLocalServiceConnection() {
  console.log('=== Local Service Protocol Fallback Example ===');
  
  // Example 1: Ollama (local service - tries HTTPS first, falls back to HTTP)
  try {
    const ollamaUrl = await createServiceUrl(ollamaDefinition, 'localhost');
    console.log(`Ollama URL: ${ollamaUrl}`);
    
    const ollamaTest = await testServiceConnectivity(ollamaDefinition, 'localhost');
    console.log(`Ollama connectivity: ${ollamaTest.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Protocol used: ${ollamaTest.protocol}`);
    if (ollamaTest.responseTime) {
      console.log(`Response time: ${ollamaTest.responseTime}ms`);
    }
  } catch (error) {
    console.error('Ollama connection failed:', error);
  }

  // Example 2: ComfyUI (local service - tries HTTPS first, falls back to HTTP)
  try {
    const comfyuiUrl = await createServiceUrl(comfyuiDefinition, '127.0.0.1');
    console.log(`ComfyUI URL: ${comfyuiUrl}`);
    
    const comfyuiTest = await testServiceConnectivity(comfyuiDefinition, '127.0.0.1');
    console.log(`ComfyUI connectivity: ${comfyuiTest.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Protocol used: ${comfyuiTest.protocol}`);
  } catch (error) {
    console.error('ComfyUI connection failed:', error);
  }
}

/**
 * Example: Using protocol fallback with cloud services
 */
export async function exampleCloudServiceConnection() {
  console.log('\n=== Cloud Service Protocol Fallback Example ===');
  
  // Example: OpenAI (cloud service - should use HTTPS)
  try {
    const openaiUrl = await createServiceUrl(openaiDefinition, 'api.openai.com');
    console.log(`OpenAI URL: ${openaiUrl}`);
    
    const openaiTest = await testServiceConnectivity(openaiDefinition, 'api.openai.com');
    console.log(`OpenAI connectivity: ${openaiTest.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Protocol used: ${openaiTest.protocol}`);
  } catch (error) {
    console.error('OpenAI connection failed:', error);
  }
}

/**
 * Example: Managing connection cache
 */
export async function exampleCacheManagement() {
  console.log('\n=== Cache Management Example ===');
  
  const connectionManager = ServiceConnectionManager.getInstance();
  
  // Get cache statistics
  const stats = connectionManager.getCacheStats();
  console.log(`Cache size: ${stats.size}`);
  console.log('Cached entries:', stats.entries);
  
  // Clear cache (useful for testing or when services change)
  connectionManager.clearCache();
  console.log('Cache cleared');
  
  const newStats = connectionManager.getCacheStats();
  console.log(`New cache size: ${newStats.size}`);
}

/**
 * Example: Batch testing multiple services
 */
export async function exampleBatchTesting() {
  console.log('\n=== Batch Testing Example ===');
  
  const services = [
    { definition: ollamaDefinition, host: 'localhost', name: 'Ollama' },
    { definition: comfyuiDefinition, host: '127.0.0.1', name: 'ComfyUI' },
    { definition: openaiDefinition, host: 'api.openai.com', name: 'OpenAI' }
  ];
  
  const results = await Promise.allSettled(
    services.map(async (service) => {
      const test = await testServiceConnectivity(service.definition, service.host);
      return {
        name: service.name,
        success: test.success,
        protocol: test.protocol,
        responseTime: test.responseTime,
        error: test.error
      };
    })
  );
  
  console.log('Batch test results:');
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const service = result.value;
      console.log(`${service.name}: ${service.success ? 'SUCCESS' : 'FAILED'} (${service.protocol})`);
      if (service.responseTime) {
        console.log(`  Response time: ${service.responseTime}ms`);
      }
      if (service.error) {
        console.log(`  Error: ${service.error}`);
      }
    } else {
      console.log(`${services[index].name}: ERROR - ${result.reason}`);
    }
  });
}

/**
 * Main example function
 */
export async function runProtocolFallbackExamples() {
  console.log('Service Connector Protocol Fallback Examples\n');
  
  await exampleLocalServiceConnection();
  await exampleCloudServiceConnection();
  await exampleCacheManagement();
  await exampleBatchTesting();
  
  console.log('\n=== Examples Complete ===');
}

// Export for use in other modules
export default {
  exampleLocalServiceConnection,
  exampleCloudServiceConnection,
  exampleCacheManagement,
  exampleBatchTesting,
  runProtocolFallbackExamples
}; 