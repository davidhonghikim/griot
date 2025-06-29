#!/usr/bin/env node

/**
 * Ollama-RAG Integration Test Script
 * 
 * Tests the integration between Ollama and the existing RAG system.
 * Requires Docker containers to be running for Ollama, MongoDB, and Weaviate.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
  openwebuiHost: process.env.OPENWEBUI_HOST || 'http://localhost:3000',
  comfyuiHost: process.env.COMFYUI_HOST || 'http://localhost:8188',
  a1111Host: process.env.A1111_HOST || 'http://localhost:7860',
  testQueries: [
    "What is the role of the Griot in West African culture?",
    "How does the Tohunga node preserve knowledge?",
    "What are the security capabilities of the Musa node?",
    "Explain the RAG system architecture",
  ]
};

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function logSubsection(title) {
  console.log('\n' + '-'.repeat(40));
  log(title, 'cyan');
  console.log('-'.repeat(40));
}

async function checkDockerContainers() {
  logSection('🐳 Checking Docker Containers');
  
  const containers = [
    { name: 'griot-ollama', port: 11434 },
    { name: 'griot-openwebui', port: 3000 },
    { name: 'griot-comfyui', port: 8188 },
    { name: 'griot-a1111', port: 7860 },
    { name: 'griot-mongo', port: 27017 },
    { name: 'griot-weaviate', port: 8080 },
  ];
  
  for (const container of containers) {
    try {
      const result = await new Promise((resolve, reject) => {
        const docker = spawn('docker', ['ps', '--filter', `name=${container.name}`, '--format', '{{.Names}}']);
        let output = '';
        
        docker.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        docker.on('close', (code) => {
          if (code === 0) {
            resolve(output.trim());
          } else {
            reject(new Error(`Docker command failed with code ${code}`));
          }
        });
      });
      
      if (result.includes(container.name)) {
        log(`✅ ${container.name} is running`, 'green');
      } else {
        log(`❌ ${container.name} is not running`, 'red');
      }
    } catch (error) {
      log(`❌ Failed to check ${container.name}: ${error.message}`, 'red');
    }
  }
}

async function testOllamaHealth() {
  logSubsection('🔍 Testing Ollama Health');
  
  try {
    const response = await fetch(`${TEST_CONFIG.ollamaHost}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      log(`✅ Ollama is healthy - ${data.models?.length || 0} models available`, 'green');
      
      if (data.models && data.models.length > 0) {
        log('📚 Available models:', 'blue');
        data.models.forEach(model => {
          log(`  - ${model.name} (${model.details?.parameter_size || 'unknown size'})`, 'blue');
        });
      } else {
        log('⚠️ No models found - you may need to pull some models', 'yellow');
        log('💡 Try: ollama pull llama3.2', 'yellow');
      }
    } else {
      log(`❌ Ollama health check failed: ${response.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Ollama health check failed: ${error.message}`, 'red');
  }
}

async function testOpenWebUI() {
  logSubsection('🌐 Testing OpenWebUI');
  
  try {
    const response = await fetch(`${TEST_CONFIG.openwebuiHost}/api/v1/models`);
    if (response.ok) {
      log('✅ OpenWebUI is accessible', 'green');
    } else {
      log(`⚠️ OpenWebUI returned status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ OpenWebUI test failed: ${error.message}`, 'red');
  }
}

async function testComfyUI() {
  logSubsection('🎨 Testing ComfyUI');
  
  try {
    const response = await fetch(`${TEST_CONFIG.comfyuiHost}/system_stats`);
    if (response.ok) {
      log('✅ ComfyUI is accessible', 'green');
    } else {
      log(`⚠️ ComfyUI returned status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ ComfyUI test failed: ${error.message}`, 'red');
  }
}

async function testA1111() {
  logSubsection('🎭 Testing A1111');
  
  try {
    const response = await fetch(`${TEST_CONFIG.a1111Host}/sdapi/v1/samplers`);
    if (response.ok) {
      log('✅ A1111 is accessible', 'green');
    } else {
      log(`⚠️ A1111 returned status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ A1111 test failed: ${error.message}`, 'red');
  }
}

async function testRAGSystem() {
  logSubsection('🔍 Testing RAG System Components');
  
  try {
    // Test MongoDB connection
    const mongoResponse = await fetch('http://localhost:27017');
    if (mongoResponse.status === 200) {
      log('✅ MongoDB is accessible', 'green');
    } else {
      log(`⚠️ MongoDB status: ${mongoResponse.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ MongoDB test failed: ${error.message}`, 'red');
  }
  
  try {
    // Test Weaviate connection
    const weaviateResponse = await fetch('http://localhost:8080/v1/.well-known/ready');
    if (weaviateResponse.ok) {
      log('✅ Weaviate is accessible', 'green');
    } else {
      log(`⚠️ Weaviate status: ${weaviateResponse.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Weaviate test failed: ${error.message}`, 'red');
  }
}

async function testOllamaRAGIntegration() {
  logSubsection('🤖 Testing Ollama-RAG Integration');
  
  try {
    // This would require the TypeScript service to be compiled and available
    // For now, we'll test the basic Ollama API integration
    
    const testPrompt = "What is the role of the Griot in West African culture?";
    const response = await fetch(`${TEST_CONFIG.ollamaHost}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: testPrompt,
        stream: false,
        options: {
          num_predict: 100,
          temperature: 0.7,
        }
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Ollama generation test successful', 'green');
      log(`📝 Response length: ${data.response?.length || 0} characters`, 'blue');
    } else {
      log(`❌ Ollama generation test failed: ${response.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Ollama-RAG integration test failed: ${error.message}`, 'red');
  }
}

async function showUsageInstructions() {
  logSection('📖 Usage Instructions');
  
  log('🚀 To start all services:', 'bright');
  log('   docker-compose up -d', 'blue');
  
  log('\n🔧 To pull a model to Ollama:', 'bright');
  log('   docker exec griot-ollama ollama pull llama3.2', 'blue');
  log('   docker exec griot-ollama ollama pull codellama', 'blue');
  
  log('\n🌐 Access the services:', 'bright');
  log('   OpenWebUI: http://localhost:3000', 'blue');
  log('   ComfyUI: http://localhost:8188', 'blue');
  log('   A1111: http://localhost:7860', 'blue');
  log('   n8n: http://localhost:5678', 'blue');
  
  log('\n📊 Monitor services:', 'bright');
  log('   docker-compose ps', 'blue');
  log('   docker-compose logs -f [service-name]', 'blue');
  
  log('\n🧪 Run this test again:', 'bright');
  log('   node scripts/test-ollama-rag.js', 'blue');
}

async function main() {
  logSection('🤖 Ollama-RAG Integration Test');
  log(`Testing integration at ${new Date().toISOString()}`, 'blue');
  
  try {
    await checkDockerContainers();
    await testOllamaHealth();
    await testOpenWebUI();
    await testComfyUI();
    await testA1111();
    await testRAGSystem();
    await testOllamaRAGIntegration();
    
    logSection('✅ Test Summary');
    log('Ollama-RAG integration test completed!', 'green');
    log('Check the results above for any issues that need to be addressed.', 'blue');
    
  } catch (error) {
    logSection('❌ Test Failed');
    log(`Test failed with error: ${error.message}`, 'red');
  }
  
  await showUsageInstructions();
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkDockerContainers,
  testOllamaHealth,
  testOpenWebUI,
  testComfyUI,
  testA1111,
  testRAGSystem,
  testOllamaRAGIntegration,
}; 