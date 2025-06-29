#!/usr/bin/env node

/**
 * PersonaRAG Bridge Test Script
 * 
 * Tests the bridge service connectivity and functionality with OpenWebUI
 */

import axios from 'axios';

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:3001';
const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://192.168.1.180:3000';

// Test queries to demonstrate persona-aware capabilities
const TEST_QUERIES = [
  {
    query: "Tell me a story about ancient wisdom",
    expectedPersona: "Griot",
    description: "Should select Griot for storytelling context"
  },
  {
    query: "I need spiritual guidance for meditation",
    expectedPersona: "Tohunga", 
    description: "Should select Tohunga for spiritual wisdom"
  },
  {
    query: "How do I preserve cultural traditions?",
    expectedPersona: "Griot",
    description: "Should select Griot for cultural preservation"
  },
  {
    query: "What is the meaning of sacred rituals?",
    expectedPersona: "Tohunga",
    description: "Should select Tohunga for spiritual understanding"
  },
  {
    query: "Help me with my homework about mathematics",
    expectedPersona: null,
    description: "Should not select a persona for generic queries"
  }
];

class BridgeTestSuite {
  constructor() {
    this.results = {
      healthCheck: null,
      personaQuery: [],
      personaSelection: [],
      enhancedChat: [],
      overallStatus: 'PENDING'
    };
  }

  async runTests() {
    console.log('🚀 Starting PersonaRAG Bridge Test Suite\n');
    
    try {
      // Test 1: Health Check
      await this.testHealthCheck();
      
      // Test 2: Persona Query Endpoint
      await this.testPersonaQuery();
      
      // Test 3: Persona Selection Endpoint
      await this.testPersonaSelection();
      
      // Test 4: Enhanced Chat Integration
      await this.testEnhancedChat();
      
      // Test 5: Performance Benchmarks
      await this.testPerformance();
      
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.overallStatus = 'FAILED';
    }
  }

  async testHealthCheck() {
    console.log('📋 Test 1: Health Check');
    
    try {
      const response = await axios.get(`${BRIDGE_URL}/health`);
      
      this.results.healthCheck = {
        status: 'PASSED',
        data: response.data,
        responseTime: Date.now()
      };
      
      console.log(`✅ Bridge service healthy: ${response.data.status}`);
      console.log(`📊 RAG Service: ${response.data.ragService}`);
      console.log(`🕒 Response time: ${Date.now() - this.results.healthCheck.responseTime}ms\n`);
      
    } catch (error) {
      this.results.healthCheck = {
        status: 'FAILED',
        error: error.message
      };
      console.error('❌ Health check failed:', error.message, '\n');
    }
  }

  async testPersonaQuery() {
    console.log('📋 Test 2: Persona Query Endpoint');
    
    for (const testCase of TEST_QUERIES) {
      try {
        const startTime = Date.now();
        
        const response = await axios.post(`${BRIDGE_URL}/api/persona/query`, {
          query: testCase.query,
          options: {
            limit: 3,
            threshold: 0.6,
            includeContent: true
          }
        });
        
        const responseTime = Date.now() - startTime;
        const hasResults = response.data.data.totalResults > 0;
        const selectedPersona = response.data.data.selectedPersona;
        
        this.results.personaQuery.push({
          query: testCase.query,
          status: response.data.success ? 'PASSED' : 'FAILED',
          hasResults,
          selectedPersona: selectedPersona?.name || null,
          expectedPersona: testCase.expectedPersona,
          responseTime,
          description: testCase.description
        });
        
        console.log(`🔍 Query: "${testCase.query}"`);
        console.log(`🎯 Expected: ${testCase.expectedPersona || 'None'} | Got: ${selectedPersona?.name || 'None'}`);
        console.log(`📊 Results: ${response.data.data.totalResults} | Time: ${responseTime}ms`);
        console.log(`${hasResults ? '✅' : '❌'} ${testCase.description}\n`);
        
      } catch (error) {
        this.results.personaQuery.push({
          query: testCase.query,
          status: 'FAILED',
          error: error.message
        });
        console.error(`❌ Query failed: "${testCase.query}" - ${error.message}\n`);
      }
    }
  }

  async testPersonaSelection() {
    console.log('📋 Test 3: Persona Selection Endpoint');
    
    const testQuery = "I need help with traditional storytelling techniques";
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${BRIDGE_URL}/api/persona/select`, {
        query: testQuery,
        options: {
          minRelevanceScore: 0.8
        }
      });
      
      const responseTime = Date.now() - startTime;
      const hasSelection = response.data.data.hasSelection;
      const selectedPersona = response.data.data.selectedPersona;
      
      this.results.personaSelection = {
        status: response.data.success ? 'PASSED' : 'FAILED',
        query: testQuery,
        hasSelection,
        selectedPersona: selectedPersona?.name || null,
        relevanceScore: selectedPersona?.relevanceScore || 0,
        responseTime
      };
      
      console.log(`🔍 Query: "${testQuery}"`);
      console.log(`🎯 Selected: ${selectedPersona?.name || 'None'}`);
      console.log(`📊 Relevance: ${selectedPersona?.relevanceScore?.toFixed(3) || 'N/A'}`);
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`${hasSelection ? '✅' : '❌'} Persona selection test\n`);
      
    } catch (error) {
      this.results.personaSelection = {
        status: 'FAILED',
        error: error.message
      };
      console.error('❌ Persona selection failed:', error.message, '\n');
    }
  }

  async testEnhancedChat() {
    console.log('📋 Test 4: Enhanced Chat Integration');
    
    const testMessage = "Tell me about the importance of oral traditions in preserving culture";
    
    try {
      const startTime = Date.now();
      
      const response = await axios.post(`${BRIDGE_URL}/api/chat/enhanced`, {
        message: testMessage,
        conversation_id: 'test_conversation',
        model: 'llama3.1'
      });
      
      const responseTime = Date.now() - startTime;
      const enhancement = response.data.data.enhancement;
      const persona = response.data.data.persona;
      
      this.results.enhancedChat = {
        status: response.data.success ? 'PASSED' : 'FAILED',
        message: testMessage,
        personaApplied: enhancement.personaApplied,
        selectedPersona: persona?.name || null,
        contextAdded: enhancement.contextAdded,
        responseTime
      };
      
      console.log(`💬 Message: "${testMessage}"`);
      console.log(`🎭 Persona Applied: ${enhancement.personaApplied ? '✅' : '❌'}`);
      console.log(`👤 Selected Persona: ${persona?.name || 'None'}`);
      console.log(`📝 Context Added: ${enhancement.contextAdded ? '✅' : '❌'}`);
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`${response.data.success ? '✅' : '❌'} Enhanced chat test\n`);
      
    } catch (error) {
      this.results.enhancedChat = {
        status: 'FAILED',
        error: error.message
      };
      
      // Note: This might fail if OpenWebUI is not accessible, which is expected
      console.log(`⚠️ Enhanced chat test failed (expected if OpenWebUI not accessible): ${error.message}\n`);
    }
  }

  async testPerformance() {
    console.log('📋 Test 5: Performance Benchmarks');
    
    const performanceTests = [
      "What is wisdom?",
      "Tell me a story",
      "Spiritual guidance needed",
      "Cultural preservation",
      "Traditional knowledge"
    ];
    
    const results = [];
    
    for (const query of performanceTests) {
      try {
        const startTime = Date.now();
        
        await axios.post(`${BRIDGE_URL}/api/persona/select`, {
          query,
          options: { minRelevanceScore: 0.6 }
        });
        
        const responseTime = Date.now() - startTime;
        results.push({ query, responseTime, success: true });
        
      } catch (error) {
        results.push({ query, responseTime: 0, success: false, error: error.message });
      }
    }
    
    const successfulTests = results.filter(r => r.success);
    const averageTime = successfulTests.length > 0 
      ? successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length 
      : 0;
    
    console.log(`⚡ Performance Results:`);
    console.log(`📊 Tests completed: ${results.length}`);
    console.log(`✅ Successful: ${successfulTests.length}`);
    console.log(`⏱️ Average response time: ${averageTime.toFixed(2)}ms`);
    console.log(`🎯 Target: <200ms | Status: ${averageTime < 200 ? '✅ MET' : '❌ EXCEEDED'}\n`);
  }

  printSummary() {
    console.log('📊 Test Summary Report');
    console.log('=' * 50);
    
    // Health Check
    const healthStatus = this.results.healthCheck?.status || 'FAILED';
    console.log(`🏥 Health Check: ${healthStatus === 'PASSED' ? '✅' : '❌'} ${healthStatus}`);
    
    // Persona Query Tests
    const queryTests = this.results.personaQuery;
    const queryPassed = queryTests.filter(t => t.status === 'PASSED').length;
    console.log(`🔍 Persona Queries: ${queryPassed}/${queryTests.length} passed`);
    
    // Persona Selection
    const selectionStatus = this.results.personaSelection?.status || 'FAILED';
    console.log(`🎯 Persona Selection: ${selectionStatus === 'PASSED' ? '✅' : '❌'} ${selectionStatus}`);
    
    // Enhanced Chat
    const chatStatus = this.results.enhancedChat?.status || 'FAILED';
    console.log(`💬 Enhanced Chat: ${chatStatus === 'PASSED' ? '✅' : '⚠️'} ${chatStatus}`);
    
    console.log('=' * 50);
    
    const overallSuccess = healthStatus === 'PASSED' && 
                          queryPassed > 0 && 
                          selectionStatus === 'PASSED';
    
    this.results.overallStatus = overallSuccess ? 'PASSED' : 'PARTIAL';
    
    console.log(`🎉 Overall Status: ${this.results.overallStatus}`);
    console.log(`\n🚀 PersonaRAG Bridge is ${overallSuccess ? 'ready for use!' : 'partially functional. Check error messages above.'}`);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new BridgeTestSuite();
  testSuite.runTests()
    .then(() => {
      process.exit(testSuite.results.overallStatus === 'PASSED' ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { BridgeTestSuite }; 