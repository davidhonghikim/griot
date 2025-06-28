#!/usr/bin/env node

/**
 * Simple test script for the Starseed Node SDK
 */

import { StarseedClient } from './dist/StarseedClient.js';

async function testClient() {
  console.log('🧪 Testing Starseed Node SDK...\n');

  // Create client instance
  const client = new StarseedClient({
    baseUrl: 'http://localhost:30437',
    timeout: 5000
  });

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await client.getHealth();
    console.log('✅ Health check passed:', health.status);
    console.log('   Version:', health.version);
    console.log('   Database connected:', health.database.connected);
    console.log('   Services:', `${health.services.connected}/${health.services.total} connected\n`);

    // Test services endpoint
    console.log('2. Testing services endpoint...');
    const { services, stats } = await client.services.list();
    console.log('✅ Services list retrieved');
    console.log('   Total services:', stats.total);
    console.log('   Connected:', stats.connected);
    console.log('   Disconnected:', stats.disconnected);
    console.log('   Error:', stats.error);
    
    if (services.length > 0) {
      console.log('   Sample service:', services[0].service.name);
    }
    console.log();

    // Test database status
    console.log('3. Testing database status...');
    const dbStatus = await client.getDatabaseStatus();
    console.log('✅ Database status retrieved');
    console.log('   MongoDB:', dbStatus.mongodb.connected ? '✅' : '❌');
    console.log('   PostgreSQL:', dbStatus.postgresql.connected ? '✅' : '❌');
    console.log('   Weaviate:', dbStatus.weaviate.connected ? '✅' : '❌');
    console.log('   Neo4j:', dbStatus.neo4j.connected ? '✅' : '❌');
    console.log();

    // Test nodes endpoint
    console.log('4. Testing nodes endpoint...');
    const { nodes } = await client.getNodes();
    console.log('✅ Nodes list retrieved');
    console.log('   Available nodes:', nodes.length);
    nodes.forEach(node => {
      console.log(`   - ${node.name} (${node.type}) v${node.version}`);
    });
    console.log();

    console.log('🎉 All tests passed! SDK is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure the Starseed Node is running on http://localhost:30437');
      console.log('   Run: cd apps/starseed-node && npm start');
    }
    
    process.exit(1);
  }
}

// Run the test
testClient(); 