/**
 * Centralized Environment Configuration
 * 
 * This module provides a unified way to handle environment variables
 * across all packages and applications in the kOS ecosystem.
 */

import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..', '..', '..');

export interface EnvironmentConfig {
  // Node Environment
  NODE_ENV: string;
  DEPLOYMENT_TYPE: 'direct' | 'nginx' | 'apache' | 'cloudflare' | 'custom';
  
  // Network Configuration
  BASE_IP?: string;
  PORT: number;
  HOST: string;
  SSL_ENABLED: boolean;
  
  // Database Configuration
  MONGODB_URI?: string;
  MONGODB_HOST: string;
  MONGODB_DB_NAME: string;
  
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  
  WEAVIATE_URL?: string;
  WEAVIATE_HOST: string;
  WEAVIATE_PORT: number;
  WEAVIATE_API_KEY?: string;
  
  NEO4J_URI?: string;
  NEO4J_HOST: string;
  NEO4J_PORT: number;
  NEO4J_USERNAME: string;
  NEO4J_PASSWORD: string;
  
  // Service Configuration
  OLLAMA_HOST: string;
  OLLAMA_PORT: number;
  
  COMFYUI_HOST: string;
  COMFYUI_PORT: number;
  
  QDRANT_HOST: string;
  QDRANT_PORT: number;
  
  OPENAI_HOST: string;
  OPENAI_PORT: number;
  
  ANTHROPIC_HOST: string;
  ANTHROPIC_PORT: number;
  
  // Service Management
  SERVICE_TEST_INTERVAL: number;
  CONNECTION_TIMEOUT: number;
  
  // API Keys (optional)
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;

  // Logging
  LOG_LEVEL?: string;
}

/**
 * Load environment variables from multiple sources in order of precedence:
 * 1. .env.local (personal overrides)
 * 2. .env (base configuration)
 * 3. env.example (template fallback)
 */
export function loadEnvironment(envPath?: string): void {
  const basePath = envPath || resolve(process.cwd());
  
  // Load in order of precedence (last loaded takes precedence)
  dotenv.config({ path: resolve(basePath, 'env.example') }); // Template fallback
  dotenv.config({ path: resolve(basePath, '.env') }); // Base configuration
  dotenv.config({ path: resolve(basePath, '.env.local') }); // Personal overrides
}

/**
 * Get the local host based on deployment type and BASE_IP
 */
export function getLocalHost(): string {
  const deploymentType = process.env.DEPLOYMENT_TYPE || 'direct';
  const baseIP = process.env.BASE_IP;
  
  if (deploymentType === 'direct' && baseIP) {
    return baseIP;
  }
  
  // For production or when BASE_IP is not set, use localhost
  return '127.0.0.1';
}

/**
 * Create a complete environment configuration object
 */
export function createEnvironmentConfig(envPath?: string): EnvironmentConfig {
  // Load environment variables
  loadEnvironment(envPath);
  
  const localHost = getLocalHost();
  
  return {
    // Node Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    DEPLOYMENT_TYPE: (process.env.DEPLOYMENT_TYPE as any) || 'direct',
    
    // Network Configuration
    BASE_IP: process.env.BASE_IP,
    PORT: parseInt(process.env.PORT || '30437'),
    HOST: process.env.HOST || '0.0.0.0',
    SSL_ENABLED: process.env.SSL_ENABLED === 'true',
    
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_HOST: process.env.MONGODB_HOST || localHost,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'starseed',
    
    POSTGRES_HOST: process.env.POSTGRES_HOST || localHost,
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432'),
    POSTGRES_DB: process.env.POSTGRES_DB || 'starseed',
    POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'password',
    
    WEAVIATE_URL: process.env.WEAVIATE_URL,
    WEAVIATE_HOST: process.env.WEAVIATE_HOST || localHost,
    WEAVIATE_PORT: parseInt(process.env.WEAVIATE_PORT || '8080'),
    WEAVIATE_API_KEY: process.env.WEAVIATE_API_KEY,
    
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_HOST: process.env.NEO4J_HOST || localHost,
    NEO4J_PORT: parseInt(process.env.NEO4J_PORT || '7474'),
    NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
    
    // Service Configuration
    OLLAMA_HOST: process.env.OLLAMA_HOST || localHost,
    OLLAMA_PORT: parseInt(process.env.OLLAMA_PORT || '11434'),
    
    COMFYUI_HOST: process.env.COMFYUI_HOST || localHost,
    COMFYUI_PORT: parseInt(process.env.COMFYUI_PORT || '8188'),
    
    QDRANT_HOST: process.env.QDRANT_HOST || localHost,
    QDRANT_PORT: parseInt(process.env.QDRANT_PORT || '6333'),
    
    OPENAI_HOST: process.env.OPENAI_HOST || 'api.openai.com',
    OPENAI_PORT: parseInt(process.env.OPENAI_PORT || '443'),
    
    ANTHROPIC_HOST: process.env.ANTHROPIC_HOST || 'api.anthropic.com',
    ANTHROPIC_PORT: parseInt(process.env.ANTHROPIC_PORT || '443'),
    
    // Service Management
    SERVICE_TEST_INTERVAL: parseInt(process.env.SERVICE_TEST_INTERVAL || '30000'),
    CONNECTION_TIMEOUT: parseInt(process.env.CONNECTION_TIMEOUT || '5000'),
    
    // API Keys
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  };
}

/**
 * Validate that required environment variables are set
 */
export function validateEnvironment(config: EnvironmentConfig): string[] {
  const errors: string[] = [];
  
  // Add validation logic here if needed
  // For now, all fields have defaults, so no validation errors
  
  return errors;
}

/**
 * Get environment configuration for a specific package/app
 */
export function getEnvironmentConfig(envPath?: string): EnvironmentConfig {
  const config = createEnvironmentConfig(envPath);
  const errors = validateEnvironment(config);
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
  
  return config;
}

// Export default configuration
export const env = getEnvironmentConfig(); 