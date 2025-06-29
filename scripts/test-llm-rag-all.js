#!/usr/bin/env node

/**
 * Comprehensive LLM-RAG Integration Test Script
 * 
 * Tests all LLM-RAG integrations: Ollama, Llama.cpp, vLLM, and Hugging Face.
 * Requires Docker containers to be running for all services.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  // Service endpoints
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
  llamaCppHost: process.env.LLAMA_CPP_HOST || 'http://localhost:8080',
  vllmHost: process.env.VLLM_HOST || 'http://localhost:8000',
  huggingfaceHost: process.env.HUGGINGFACE_HOST || 'https://api-inference.huggingface.co',
  
  // API Keys
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // Test queries
  testQueries: [
    "What is the role of the Griot in West African culture?",
    "How does the Tohunga node preserve knowledge?",
    "What are the seven sacred intentions of HIEROS?",
    "Explain the Kind Link Framework protocol",
    "What is the difference between a Ronin and a Musa node?"
  ],
  
  // Test models
  ollamaModels: ['llama3.2', 'llama3.1', 'llama3.1.1'],
  llamaCppModels: ['llama-2-7b-chat.gguf', 'llama-2-13b-chat.gguf'],
  vllmModels: ['microsoft/DialoGPT-medium', 'gpt2'],
  huggingfaceModels: ['microsoft/DialoGPT-medium', 'gpt2'],
  
  // Performance thresholds
  maxRetrievalTime: 1000, // 1 second
  maxGenerationTime: 10000, // 10 seconds
  minSimilarityThreshold: 0.5,
};

// Test results storage
const testResults = {
  ollama: { passed: 0, failed: 0, errors: [] },
  llamaCpp: { passed: 0, failed: 0, errors: [] },
  vllm: { passed: 0, failed: 0, errors: [] },
  huggingface: { passed: 0, failed: 0, errors: [] },
  overall: { passed: 0, failed: 0, total: 0 }
};

/**
 * Utility functions
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪'
  }[type] || 'ℹ️';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logTestResult(service, testName, passed, error = null) {
  if (passed) {
    testResults[service].passed++;
    testResults.overall.passed++;
    log(`${service.toUpperCase()} - ${testName}: PASSED`, 'success');
  } else {
    testResults[service].failed++;
    testResults.overall.failed++;
    testResults[service].errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`${service.toUpperCase()} - ${testName}: FAILED - ${error?.message || 'Unknown error'}`, 'error');
  }
  testResults.overall.total++;
}

/**
 * Health check functions
 */
async function checkServiceHealth(url, serviceName) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      log(`${serviceName} health check: PASSED`, 'success');
      return true;
    } else {
      log(`${serviceName} health check: FAILED - Status ${response.status}`, 'error');
      return false;
    }
  } catch (error) {
    log(`${serviceName} health check: FAILED - ${error.message}`, 'error');
    return false;
  }
}

async function checkOllamaHealth() {
  return await checkServiceHealth(`${TEST_CONFIG.ollamaHost}/api/tags`, 'Ollama');
}

async function checkLlamaCppHealth() {
  return await checkServiceHealth(`${TEST_CONFIG.llamaCppHost}/health`, 'Llama.cpp');
}

async function checkVLLMHealth() {
  return await checkServiceHealth(`${TEST_CONFIG.vllmHost}/v1/models`, 'vLLM');
}

async function checkHuggingFaceHealth() {
  if (!TEST_CONFIG.huggingfaceApiKey) {
    log('Hugging Face API key not provided, skipping health check', 'warning');
    return false;
  }
  return await checkServiceHealth(`${TEST_CONFIG.huggingfaceHost}/models`, 'Hugging Face');
}

/**
 * Model availability checks
 */
async function checkOllamaModels() {
  try {
    const response = await fetch(`${TEST_CONFIG.ollamaHost}/api/tags`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const availableModels = data.models?.map(m => m.name) || [];
    
    log(`Available Ollama models: ${availableModels.join(', ')}`, 'info');
    
    for (const model of TEST_CONFIG.ollamaModels) {
      if (availableModels.includes(model)) {
        logTestResult('ollama', `Model ${model} available`, true);
      } else {
        logTestResult('ollama', `Model ${model} available`, false, new Error(`Model ${model} not found`));
      }
    }
    
    return availableModels.length > 0;
  } catch (error) {
    logTestResult('ollama', 'Model availability check', false, error);
    return false;
  }
}

async function checkLlamaCppModels() {
  try {
    const response = await fetch(`${TEST_CONFIG.llamaCppHost}/v1/models`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const availableModels = data.data?.map(m => m.id) || [];
    
    log(`Available Llama.cpp models: ${availableModels.join(', ')}`, 'info');
    
    for (const model of TEST_CONFIG.llamaCppModels) {
      if (availableModels.includes(model)) {
        logTestResult('llamaCpp', `Model ${model} available`, true);
      } else {
        logTestResult('llamaCpp', `Model ${model} available`, false, new Error(`Model ${model} not found`));
      }
    }
    
    return availableModels.length > 0;
  } catch (error) {
    logTestResult('llamaCpp', 'Model availability check', false, error);
    return false;
  }
}

async function checkVLLMModels() {
  try {
    const response = await fetch(`${TEST_CONFIG.vllmHost}/v1/models`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const availableModels = data.data?.map(m => m.id) || [];
    
    log(`Available vLLM models: ${availableModels.join(', ')}`, 'info');
    
    for (const model of TEST_CONFIG.vllmModels) {
      if (availableModels.includes(model)) {
        logTestResult('vllm', `Model ${model} available`, true);
      } else {
        logTestResult('vllm', `Model ${model} available`, false, new Error(`Model ${model} not found`));
      }
    }
    
    return availableModels.length > 0;
  } catch (error) {
    logTestResult('vllm', 'Model availability check', false, error);
    return false;
  }
}

async function checkHuggingFaceModels() {
  if (!TEST_CONFIG.huggingfaceApiKey) {
    log('Hugging Face API key not provided, skipping model check', 'warning');
    return false;
  }
  
  try {
    const response = await fetch(`${TEST_CONFIG.huggingfaceHost}/api/models`, {
      headers: { 'Authorization': `Bearer ${TEST_CONFIG.huggingfaceApiKey}` }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const availableModels = data.map(m => m.id) || [];
    
    log(`Available Hugging Face models: ${availableModels.slice(0, 10).join(', ')}...`, 'info');
    
    for (const model of TEST_CONFIG.huggingfaceModels) {
      if (availableModels.includes(model)) {
        logTestResult('huggingface', `Model ${model} available`, true);
      } else {
        logTestResult('huggingface', `Model ${model} available`, false, new Error(`Model ${model} not found`));
      }
    }
    
    return availableModels.length > 0;
  } catch (error) {
    logTestResult('huggingface', 'Model availability check', false, error);
    return false;
  }
}

/**
 * RAG integration tests
 */
async function testOllamaRAG() {
  log('Testing Ollama-RAG integration...', 'test');
  
  try {
    // Test basic query
    const query = TEST_CONFIG.testQueries[0];
    const response = await fetch(`${TEST_CONFIG.ollamaHost}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `Answer this question: ${query}`,
        stream: false
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data.response && data.response.length > 0) {
      logTestResult('ollama', 'Basic query generation', true);
    } else {
      logTestResult('ollama', 'Basic query generation', false, new Error('Empty response'));
    }
    
  } catch (error) {
    logTestResult('ollama', 'Basic query generation', false, error);
  }
}

async function testLlamaCppRAG() {
  log('Testing Llama.cpp-RAG integration...', 'test');
  
  try {
    // Test basic query
    const query = TEST_CONFIG.testQueries[1];
    const response = await fetch(`${TEST_CONFIG.llamaCppHost}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-2-7b-chat.gguf',
        messages: [
          { role: 'user', content: query }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data.choices && data.choices[0]?.message?.content) {
      logTestResult('llamaCpp', 'Basic query generation', true);
    } else {
      logTestResult('llamaCpp', 'Basic query generation', false, new Error('Empty response'));
    }
    
  } catch (error) {
    logTestResult('llamaCpp', 'Basic query generation', false, error);
  }
}

async function testVLLMRAG() {
  log('Testing vLLM-RAG integration...', 'test');
  
  try {
    // Test basic query
    const query = TEST_CONFIG.testQueries[2];
    const response = await fetch(`${TEST_CONFIG.vllmHost}/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token-abc123'
      },
      body: JSON.stringify({
        model: 'microsoft/DialoGPT-medium',
        messages: [
          { role: 'user', content: query }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data.choices && data.choices[0]?.message?.content) {
      logTestResult('vllm', 'Basic query generation', true);
    } else {
      logTestResult('vllm', 'Basic query generation', false, new Error('Empty response'));
    }
    
  } catch (error) {
    logTestResult('vllm', 'Basic query generation', false, error);
  }
}

async function testHuggingFaceRAG() {
  if (!TEST_CONFIG.huggingfaceApiKey) {
    log('Hugging Face API key not provided, skipping RAG test', 'warning');
    return;
  }
  
  log('Testing Hugging Face-RAG integration...', 'test');
  
  try {
    // Test basic query
    const query = TEST_CONFIG.testQueries[3];
    const response = await fetch(`${TEST_CONFIG.huggingfaceHost}/models/microsoft/DialoGPT-medium`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_CONFIG.huggingfaceApiKey}`
      },
      body: JSON.stringify({
        inputs: query,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7
        }
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (data && (data.generated_text || (Array.isArray(data) && data[0]?.generated_text))) {
      logTestResult('huggingface', 'Basic query generation', true);
    } else {
      logTestResult('huggingface', 'Basic query generation', false, new Error('Empty response'));
    }
    
  } catch (error) {
    logTestResult('huggingface', 'Basic query generation', false, error);
  }
}

/**
 * Performance tests
 */
async function testPerformance(service, testFunction) {
  const startTime = Date.now();
  try {
    await testFunction();
    const duration = Date.now() - startTime;
    
    if (duration < TEST_CONFIG.maxGenerationTime) {
      logTestResult(service, `Performance test (<${TEST_CONFIG.maxGenerationTime}ms)`, true);
    } else {
      logTestResult(service, `Performance test (<${TEST_CONFIG.maxGenerationTime}ms)`, false, 
        new Error(`Response time ${duration}ms exceeds threshold`));
    }
  } catch (error) {
    logTestResult(service, 'Performance test', false, error);
  }
}

/**
 * Main test execution
 */
async function runAllTests() {
  log('🚀 Starting Comprehensive LLM-RAG Integration Tests', 'info');
  log(`Test Configuration:`, 'info');
  log(`  Ollama Host: ${TEST_CONFIG.ollamaHost}`, 'info');
  log(`  Llama.cpp Host: ${TEST_CONFIG.llamaCppHost}`, 'info');
  log(`  vLLM Host: ${TEST_CONFIG.vllmHost}`, 'info');
  log(`  Hugging Face Host: ${TEST_CONFIG.huggingfaceHost}`, 'info');
  log(`  Test Queries: ${TEST_CONFIG.testQueries.length}`, 'info');
  
  // Health checks
  log('\n🏥 Running Health Checks...', 'test');
  await checkOllamaHealth();
  await checkLlamaCppHealth();
  await checkVLLMHealth();
  await checkHuggingFaceHealth();
  
  // Model availability checks
  log('\n📚 Checking Model Availability...', 'test');
  await checkOllamaModels();
  await checkLlamaCppModels();
  await checkVLLMModels();
  await checkHuggingFaceModels();
  
  // RAG integration tests
  log('\n🧠 Testing RAG Integrations...', 'test');
  await testOllamaRAG();
  await testLlamaCppRAG();
  await testVLLMRAG();
  await testHuggingFaceRAG();
  
  // Performance tests
  log('\n⚡ Running Performance Tests...', 'test');
  await testPerformance('ollama', testOllamaRAG);
  await testPerformance('llamaCpp', testLlamaCppRAG);
  await testPerformance('vllm', testVLLMRAG);
  await testPerformance('huggingface', testHuggingFaceRAG);
  
  // Generate summary
  generateSummary();
}

/**
 * Generate test summary
 */
function generateSummary() {
  log('\n📊 TEST SUMMARY', 'info');
  log('=' * 50, 'info');
  
  const services = ['ollama', 'llamaCpp', 'vllm', 'huggingface'];
  
  for (const service of services) {
    const results = testResults[service];
    const total = results.passed + results.failed;
    const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
    
    log(`${service.toUpperCase()}: ${results.passed}/${total} passed (${percentage}%)`, 
      results.failed === 0 ? 'success' : 'error');
    
    if (results.errors.length > 0) {
      log(`  Errors:`, 'error');
      results.errors.forEach(error => {
        log(`    - ${error.test}: ${error.error}`, 'error');
      });
    }
  }
  
  log('\nOVERALL RESULTS:', 'info');
  const overall = testResults.overall;
  const overallPercentage = overall.total > 0 ? ((overall.passed / overall.total) * 100).toFixed(1) : 0;
  log(`Total: ${overall.passed}/${overall.total} passed (${overallPercentage}%)`, 
    overall.failed === 0 ? 'success' : 'error');
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'info');
  if (testResults.overall.failed > 0) {
    log('Some tests failed. Check the error messages above and ensure all services are running.', 'warning');
  } else {
    log('All tests passed! Your LLM-RAG integrations are working correctly.', 'success');
  }
  
  if (!TEST_CONFIG.huggingfaceApiKey) {
    log('Consider setting HUGGINGFACE_API_KEY for full Hugging Face integration testing.', 'warning');
  }
  
  if (!TEST_CONFIG.openaiApiKey) {
    log('Consider setting OPENAI_API_KEY for embedding service testing.', 'warning');
  }
}

/**
 * Error handling
 */
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  process.exit(1);
});

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults,
  TEST_CONFIG
}; 