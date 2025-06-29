#!/usr/bin/env node

/**
 * RAG System Production Validation
 * 
 * Comprehensive validation of RAG system for production deployment
 */

import { PersonaLoader } from '../packages/data/core/persona_loader.ts';
import { VectorStore } from '../packages/data/core/rag/vector_store.ts';
import { EmbeddingService } from '../packages/data/core/rag/embedding_service.ts';

async function validateRAGProduction() {
  console.log('🔍 RAG System Production Validation\n');
  console.log('=' .repeat(60));
  
  const results = {
    personaLoader: { status: 'PENDING', details: [] },
    vectorStore: { status: 'PENDING', details: [] },
    embeddingService: { status: 'PENDING', details: [] },
    database: { status: 'PENDING', details: [] },
    performance: { status: 'PENDING', details: [] },
    security: { status: 'PENDING', details: [] }
  };

  try {
    // 1. PersonaLoader Validation
    console.log('\n1. PersonaLoader Validation...');
    const personaLoader = new PersonaLoader();
    
    const startTime = Date.now();
    const personas = await personaLoader.listPersonas();
    const loadTime = Date.now() - startTime;
    
    results.personaLoader.status = 'PASS';
    results.personaLoader.details.push(`Loaded ${personas.length} personas in ${loadTime}ms`);
    results.personaLoader.details.push(`Performance: ${loadTime < 1000 ? '✅' : '⚠️'} ${loadTime}ms`);
    
    if (personas.length > 0) {
      const testPersona = await personaLoader.loadPersona(personas[0].id);
      if (testPersona) {
        results.personaLoader.details.push(`✅ Individual persona loading: ${testPersona.name}`);
      } else {
        results.personaLoader.status = 'FAIL';
        results.personaLoader.details.push('❌ Individual persona loading failed');
      }
    }
    
    console.log(`   ✅ ${personas.length} personas loaded in ${loadTime}ms`);

    // 2. VectorStore Validation
    console.log('\n2. VectorStore Validation...');
    const vectorStore = new VectorStore();
    
    const vectorHealth = await vectorStore.healthCheck();
    if (vectorHealth) {
      results.vectorStore.status = 'PASS';
      results.vectorStore.details.push('✅ Weaviate connection healthy');
      
      const docCount = await vectorStore.getDocumentCount();
      results.vectorStore.details.push(`📊 Document count: ${docCount}`);
      
      console.log(`   ✅ Weaviate connected, ${docCount} documents`);
    } else {
      results.vectorStore.status = 'FAIL';
      results.vectorStore.details.push('❌ Weaviate connection failed');
      console.log('   ❌ Weaviate connection failed');
    }

    // 3. EmbeddingService Validation
    console.log('\n3. EmbeddingService Validation...');
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-test-mock-key-for-testing-only') {
      const embeddingService = new EmbeddingService();
      const modelInfo = embeddingService.getModelInfo();
      
      results.embeddingService.status = 'PASS';
      results.embeddingService.details.push(`✅ Model: ${modelInfo.model} (${modelInfo.dimensions} dimensions)`);
      
      try {
        const startTime = Date.now();
        const embedding = await embeddingService.embedText('Test text for validation');
        const embedTime = Date.now() - startTime;
        
        results.embeddingService.details.push(`✅ Embedding generation: ${embedding.length} dimensions in ${embedTime}ms`);
        results.embeddingService.details.push(`Performance: ${embedTime < 2000 ? '✅' : '⚠️'} ${embedTime}ms`);
        
        console.log(`   ✅ Embedding service working (${embedTime}ms)`);
      } catch (error) {
        results.embeddingService.status = 'FAIL';
        results.embeddingService.details.push(`❌ Embedding generation failed: ${error.message}`);
        console.log(`   ❌ Embedding generation failed: ${error.message}`);
      }
    } else {
      results.embeddingService.status = 'WARNING';
      results.embeddingService.details.push('⚠️ No valid OpenAI API key configured');
      console.log('   ⚠️ No valid OpenAI API key configured');
    }

    // 4. Database Validation
    console.log('\n4. Database Validation...');
    try {
      const { execSync } = await import('child_process');
      const mongoCount = execSync('docker exec griot-mongo mongosh --eval "db.personas.countDocuments()" --quiet', { encoding: 'utf8' }).trim();
      
      if (mongoCount === '0') {
        results.database.status = 'WARNING';
        results.database.details.push('⚠️ MongoDB: No personas migrated yet');
        console.log('   ⚠️ MongoDB: No personas migrated yet');
      } else {
        results.database.status = 'PASS';
        results.database.details.push(`✅ MongoDB: ${mongoCount} personas`);
        console.log(`   ✅ MongoDB: ${mongoCount} personas`);
      }
    } catch (error) {
      results.database.status = 'FAIL';
      results.database.details.push(`❌ MongoDB connection failed: ${error.message}`);
      console.log(`   ❌ MongoDB connection failed: ${error.message}`);
    }

    // 5. Performance Validation
    console.log('\n5. Performance Validation...');
    const performanceChecks = [];
    
    // PersonaLoader performance
    if (loadTime < 1000) {
      performanceChecks.push('✅ PersonaLoader: < 1s');
    } else {
      performanceChecks.push('⚠️ PersonaLoader: > 1s');
    }
    
    // VectorStore performance
    const vectorStartTime = Date.now();
    await vectorStore.getDocumentCount();
    const vectorTime = Date.now() - vectorStartTime;
    
    if (vectorTime < 100) {
      performanceChecks.push('✅ VectorStore: < 100ms');
    } else {
      performanceChecks.push('⚠️ VectorStore: > 100ms');
    }
    
    results.performance.status = performanceChecks.every(check => check.includes('✅')) ? 'PASS' : 'WARNING';
    results.performance.details = performanceChecks;
    
    console.log(`   ${performanceChecks.join(', ')}`);

    // 6. Security Validation
    console.log('\n6. Security Validation...');
    const securityChecks = [];
    
    // Environment variables
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-test-mock-key-for-testing-only') {
      securityChecks.push('✅ OpenAI API key configured');
    } else {
      securityChecks.push('⚠️ OpenAI API key not configured');
    }
    
    // Database connection
    if (process.env.MONGODB_URI) {
      securityChecks.push('✅ MongoDB URI configured');
    } else {
      securityChecks.push('⚠️ MongoDB URI not configured');
    }
    
    // Weaviate connection
    if (process.env.WEAVIATE_HOST) {
      securityChecks.push('✅ Weaviate host configured');
    } else {
      securityChecks.push('⚠️ Using default Weaviate host');
    }
    
    results.security.status = securityChecks.every(check => check.includes('✅')) ? 'PASS' : 'WARNING';
    results.security.details = securityChecks;
    
    console.log(`   ${securityChecks.join(', ')}`);

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return;
  }

  // Generate Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 PRODUCTION VALIDATION REPORT');
  console.log('='.repeat(60));
  
  const statusCounts = { PASS: 0, WARNING: 0, FAIL: 0 };
  
  Object.entries(results).forEach(([component, result]) => {
    const status = result.status;
    statusCounts[status]++;
    
    console.log(`\n${component.toUpperCase()}: ${getStatusIcon(status)} ${status}`);
    result.details.forEach(detail => {
      console.log(`  ${detail}`);
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ PASS: ${statusCounts.PASS}`);
  console.log(`⚠️ WARNING: ${statusCounts.WARNING}`);
  console.log(`❌ FAIL: ${statusCounts.FAIL}`);
  
  const overallStatus = statusCounts.FAIL > 0 ? 'FAIL' : statusCounts.WARNING > 0 ? 'WARNING' : 'PASS';
  console.log(`\nOVERALL STATUS: ${getStatusIcon(overallStatus)} ${overallStatus}`);
  
  if (overallStatus === 'PASS') {
    console.log('\n🎉 RAG System is ready for production deployment!');
  } else if (overallStatus === 'WARNING') {
    console.log('\n⚠️ RAG System has warnings but can be deployed with caution.');
    console.log('Recommendations:');
    console.log('- Configure OpenAI API key for full functionality');
    console.log('- Run database migration: npm run migrate-personas migrate');
    console.log('- Monitor performance metrics in production');
  } else {
    console.log('\n❌ RAG System has critical issues that must be resolved before deployment.');
  }
  
  console.log('\nNEXT STEPS:');
  console.log('1. Set OPENAI_API_KEY for embedding functionality');
  console.log('2. Run database migration: npm run migrate-personas migrate');
  console.log('3. Test complete workflow with real data');
  console.log('4. Monitor performance and error rates in production');
}

function getStatusIcon(status) {
  switch (status) {
    case 'PASS': return '✅';
    case 'WARNING': return '⚠️';
    case 'FAIL': return '❌';
    default: return '⏳';
  }
}

// Run validation
validateRAGProduction(); 