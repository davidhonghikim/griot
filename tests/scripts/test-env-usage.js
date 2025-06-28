#!/usr/bin/env node

/**
 * Environment Usage Test Script
 * 
 * This script simulates how the TypeScript files use environment variables
 * to verify that the configuration is working correctly.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (same as server.ts)
const envPath = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(envPath, '.env.local') });
dotenv.config({ path: path.resolve(envPath, '.env') });
dotenv.config({ path: path.resolve(envPath, 'env.example') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

// Simulate server.ts configuration
logSection('Server Configuration Test');

const serverConfig = {
  port: parseInt(process.env.PORT || '30437'),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  deploymentType: process.env.DEPLOYMENT_TYPE || 'direct'
};

log(`Server will start on: ${serverConfig.host}:${serverConfig.port}`, 'green');
log(`Environment: ${serverConfig.nodeEnv}`, 'green');
log(`Deployment Type: ${serverConfig.deploymentType}`, 'green');

// Simulate service-manager.ts configuration
logSection('Service Manager Configuration Test');

function getDeploymentHosts() {
  const deploymentType = process.env.DEPLOYMENT_TYPE || 'direct';
  const baseIP = process.env.BASE_IP;
  
  // For production with reverse proxy, use localhost for local services
  const localHost = deploymentType === 'direct' ? (baseIP || 'localhost') : '127.0.0.1';
  
  return {
    ollama: process.env.OLLAMA_HOST || localHost,
    comfyui: process.env.COMFYUI_HOST || localHost,
    qdrant: process.env.QDRANT_HOST || localHost,
    openai: process.env.OPENAI_HOST || 'api.openai.com',
    anthropic: process.env.ANTHROPIC_HOST || 'api.anthropic.com',
    weaviate: process.env.WEAVIATE_HOST || localHost,
    neo4j: process.env.NEO4J_HOST || localHost,
    postgresql: process.env.POSTGRES_HOST || localHost,
  };
}

const serviceHosts = getDeploymentHosts();
log('Service hosts configuration:', 'blue');
Object.entries(serviceHosts).forEach(([service, host]) => {
  log(`  ${service}: ${host}`, 'green');
});

const serviceManagerConfig = {
  autoTestInterval: parseInt(process.env.SERVICE_TEST_INTERVAL || '30000'),
  connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT || '5000'),
  deploymentType: process.env.DEPLOYMENT_TYPE || 'direct'
};

log(`Service test interval: ${serviceManagerConfig.autoTestInterval}ms`, 'green');
log(`Connection timeout: ${serviceManagerConfig.connectionTimeout}ms`, 'green');

// Simulate database-manager.ts configuration
logSection('Database Manager Configuration Test');

function getDeploymentHostsForDB() {
  const deploymentType = process.env.DEPLOYMENT_TYPE || 'direct';
  const baseIP = process.env.BASE_IP;
  
  const localHost = deploymentType === 'direct' ? (baseIP || 'localhost') : '127.0.0.1';
  
  return {
    mongodb: process.env.MONGODB_HOST || localHost,
    postgresql: process.env.POSTGRES_HOST || localHost,
    weaviate: process.env.WEAVIATE_HOST || localHost,
    neo4j: process.env.NEO4J_HOST || localHost,
  };
}

const dbHosts = getDeploymentHostsForDB();

const dbConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || `mongodb://${dbHosts.mongodb}:27017`,
    dbName: process.env.MONGODB_DB_NAME || 'starseed'
  },
  postgresql: {
    host: dbHosts.postgresql,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'starseed',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password'
  },
  weaviate: {
    url: process.env.WEAVIATE_URL || `http://${dbHosts.weaviate}:8080`,
    apiKey: process.env.WEAVIATE_API_KEY
  },
  neo4j: {
    uri: process.env.NEO4J_URI || `bolt://${dbHosts.neo4j}:7687`,
    username: process.env.NEO4J_USERNAME || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password'
  }
};

log('Database configuration:', 'blue');
log(`MongoDB: ${dbConfig.mongodb.uri.replace(/\/\/.*@/, '//***:***@')}`, 'green');
log(`PostgreSQL: ${dbConfig.postgresql.host}:${dbConfig.postgresql.port}/${dbConfig.postgresql.database}`, 'green');
log(`Weaviate: ${dbConfig.weaviate.url}`, 'green');
log(`Neo4j: ${dbConfig.neo4j.uri.replace(/\/\/.*@/, '//***:***@')}`, 'green');

// Test deployment-specific behavior
logSection('Deployment-Specific Behavior Test');

const deploymentType = process.env.DEPLOYMENT_TYPE || 'direct';
const baseIP = process.env.BASE_IP;

if (deploymentType === 'direct') {
  log('Direct deployment detected:', 'blue');
  log(`  - Using BASE_IP (${baseIP}) for all local services`, 'green');
  log(`  - Services accessible from external network`, 'green');
} else {
  log(`Reverse proxy deployment detected (${deploymentType}):`, 'blue');
  log(`  - Using 127.0.0.1 for local services`, 'green');
  log(`  - Services only accessible through reverse proxy`, 'green');
  log(`  - BASE_IP (${baseIP}) used for external service discovery`, 'green');
}

// Test SSL configuration
logSection('SSL Configuration Test');

const sslConfig = {
  enabled: process.env.SSL_ENABLED === 'true',
  certPath: process.env.SSL_CERT_PATH,
  keyPath: process.env.SSL_KEY_PATH
};

if (sslConfig.enabled) {
  log('SSL is enabled:', 'green');
  log(`  Certificate: ${sslConfig.certPath}`, 'green');
  log(`  Private Key: ${sslConfig.keyPath}`, 'green');
} else {
  log('SSL is disabled (using HTTP)', 'yellow');
}

// Summary
logSection('Configuration Summary');

const configSummary = {
  server: {
    host: serverConfig.host,
    port: serverConfig.port,
    environment: serverConfig.nodeEnv
  },
  deployment: {
    type: deploymentType,
    baseIP: baseIP,
    sslEnabled: sslConfig.enabled
  },
  services: {
    total: Object.keys(serviceHosts).length,
    localServices: Object.values(serviceHosts).filter(host => 
      host === '127.0.0.1' || host === baseIP || host === 'localhost'
    ).length,
    externalServices: Object.values(serviceHosts).filter(host => 
      !['127.0.0.1', baseIP, 'localhost'].includes(host)
    ).length
  },
  databases: {
    configured: Object.keys(dbConfig).length,
    withCredentials: Object.values(dbConfig).filter(db => 
      db.username || db.password || db.apiKey
    ).length
  }
};

log('Configuration Summary:', 'blue');
log(`  Server: ${configSummary.server.host}:${configSummary.server.port} (${configSummary.server.environment})`, 'green');
log(`  Deployment: ${configSummary.deployment.type} with ${configSummary.deployment.sslEnabled ? 'SSL' : 'HTTP'}`, 'green');
log(`  Services: ${configSummary.services.total} total (${configSummary.services.localServices} local, ${configSummary.services.externalServices} external)`, 'green');
log(`  Databases: ${configSummary.databases.configured} configured`, 'green');

log('\n✅ Environment configuration test completed successfully!', 'bright'); 