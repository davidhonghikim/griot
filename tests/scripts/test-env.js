#!/usr/bin/env node

/**
 * Environment Configuration Test Script
 * 
 * This script tests that environment variables are being loaded correctly
 * from the various .env files in the correct priority order.
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
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

function logSubsection(title) {
  console.log('\n' + '-'.repeat(40));
  log(title, 'cyan');
  console.log('-'.repeat(40));
}

// Test environment loading
logSection('Environment Configuration Test');

const projectDir = path.resolve(__dirname, '..');
const envFiles = [
  { name: 'env.example', path: path.join(projectDir, 'env.example') },
  { name: '.env', path: path.join(projectDir, '.env') },
  { name: '.env.local', path: path.join(projectDir, '.env.local') },
  { name: '.env.production', path: path.join(projectDir, '.env.production') }
];

// Check which files exist
logSubsection('Environment Files Status');
envFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  const status = exists ? '✓ EXISTS' : '✗ MISSING';
  const color = exists ? 'green' : 'red';
  log(`${status} ${file.name}`, color);
});

// Load environment variables in priority order
logSubsection('Loading Environment Variables');
log('Loading in priority order (highest to lowest):');

// Clear any existing environment variables for testing
const originalEnv = { ...process.env };

// Load in reverse order (lowest priority first)
envFiles.reverse().forEach(file => {
  if (fs.existsSync(file.path)) {
    log(`Loading ${file.name}...`, 'yellow');
    const result = dotenv.config({ path: file.path });
    if (result.error) {
      log(`Error loading ${file.name}: ${result.error.message}`, 'red');
    } else {
      log(`✓ Loaded ${file.name}`, 'green');
    }
  }
});

// Test key environment variables
logSubsection('Key Environment Variables');

const keyVars = [
  'NODE_ENV',
  'DEPLOYMENT_TYPE',
  'BASE_IP',
  'PORT',
  'HOST',
  'MONGODB_URI',
  'POSTGRES_HOST',
  'WEAVIATE_URL',
  'NEO4J_URI',
  'SERVICE_TEST_INTERVAL',
  'CONNECTION_TIMEOUT'
];

keyVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Hide sensitive values
    const displayValue = varName.includes('URI') || varName.includes('PASSWORD') || varName.includes('KEY')
      ? value.replace(/\/\/.*@/, '//***:***@').replace(/:[^\/]*@/, ':***@')
      : value;
    log(`${varName}=${displayValue}`, 'green');
  } else {
    log(`${varName}=undefined`, 'red');
  }
});

// Test deployment-specific configuration
logSubsection('Deployment Configuration Test');

const deploymentType = process.env.DEPLOYMENT_TYPE || 'direct';
const baseIP = process.env.BASE_IP;

log(`Deployment Type: ${deploymentType}`, 'blue');
log(`Base IP: ${baseIP || 'not set'}`, baseIP ? 'green' : 'red');

// Test service host resolution
const services = ['mongodb', 'postgresql', 'weaviate', 'neo4j'];
const localHost = deploymentType === 'direct' ? (baseIP || 'localhost') : '127.0.0.1';

logSubsection('Service Host Resolution');
services.forEach(service => {
  const envVar = `${service.toUpperCase()}_HOST`;
  const envValue = process.env[envVar];
  const resolvedHost = envValue || localHost;
  
  log(`${service}:`, 'blue');
  log(`  Environment Variable (${envVar}): ${envValue || 'not set'}`, envValue ? 'green' : 'yellow');
  log(`  Resolved Host: ${resolvedHost}`, 'green');
});

// Test database connection strings
logSubsection('Database Connection Strings');

const dbConfigs = [
  {
    name: 'MongoDB',
    uri: process.env.MONGODB_URI || `mongodb://${localHost}:27017`,
    envVar: 'MONGODB_URI'
  },
  {
    name: 'PostgreSQL',
    uri: `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'password'}@${localHost}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'starseed'}`,
    envVar: 'POSTGRES_HOST'
  },
  {
    name: 'Weaviate',
    uri: process.env.WEAVIATE_URL || `http://${localHost}:8080`,
    envVar: 'WEAVIATE_URL'
  },
  {
    name: 'Neo4j',
    uri: process.env.NEO4J_URI || `bolt://${localHost}:7687`,
    envVar: 'NEO4J_URI'
  }
];

dbConfigs.forEach(db => {
  log(`${db.name}:`, 'blue');
  const displayUri = db.uri.replace(/\/\/.*@/, '//***:***@').replace(/:[^\/]*@/, ':***@');
  log(`  Connection String: ${displayUri}`, 'green');
  log(`  Environment Variable: ${db.envVar}`, process.env[db.envVar] ? 'green' : 'yellow');
});

// Test server configuration
logSubsection('Server Configuration');

const serverConfig = {
  port: parseInt(process.env.PORT || '30437'),
  host: process.env.HOST || '0.0.0.0',
  sslEnabled: process.env.SSL_ENABLED === 'true',
  deploymentType: process.env.DEPLOYMENT_TYPE || 'direct'
};

log(`Port: ${serverConfig.port}`, 'green');
log(`Host: ${serverConfig.host}`, 'green');
log(`SSL Enabled: ${serverConfig.sslEnabled}`, serverConfig.sslEnabled ? 'green' : 'yellow');
log(`Deployment Type: ${serverConfig.deploymentType}`, 'green');

// Test service intervals
logSubsection('Service Configuration');

const serviceConfig = {
  testInterval: parseInt(process.env.SERVICE_TEST_INTERVAL || '30000'),
  connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT || '5000')
};

log(`Service Test Interval: ${serviceConfig.testInterval}ms`, 'green');
log(`Connection Timeout: ${serviceConfig.connectionTimeout}ms`, 'green');

// Summary
logSection('Test Summary');

const missingRequired = keyVars.filter(varName => !process.env[varName]);
if (missingRequired.length === 0) {
  log('✓ All key environment variables are configured', 'green');
} else {
  log('⚠ Some environment variables are missing:', 'yellow');
  missingRequired.forEach(varName => {
    log(`  - ${varName}`, 'red');
  });
}

const deploymentTypeValid = ['direct', 'nginx', 'apache', 'cloudflare', 'docker'].includes(serverConfig.deploymentType);
if (deploymentTypeValid) {
  log(`✓ Deployment type '${serverConfig.deploymentType}' is valid`, 'green');
} else {
  log(`✗ Deployment type '${serverConfig.deploymentType}' is invalid`, 'red');
}

log('\nEnvironment test completed!', 'bright');

// Restore original environment
Object.keys(process.env).forEach(key => {
  if (!(key in originalEnv)) {
    delete process.env[key];
  }
});
Object.assign(process.env, originalEnv); 