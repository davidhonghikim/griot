import { getEnvironmentConfig } from '@griot/core';

const env = getEnvironmentConfig();

export const config = {
  host: env.HOST,
  port: env.PORT || 8080,
  mongoUri: env.MONGODB_URI || 'mongodb://localhost:27017',
  mongoDbName: env.MONGODB_DB_NAME || 'griot_seed',
  logLevel: process.env.LOG_LEVEL || 'info', // If LOG_LEVEL is not in central config, keep this fallback
};

// Validate that essential variables are present
if (!config.mongoUri || !config.mongoDbName) {
  throw new Error("Missing critical configuration: MONGODB_URI and MONGODB_DB_NAME must be defined in your .env file.");
}

export default config; 