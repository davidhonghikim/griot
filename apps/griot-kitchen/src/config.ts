import dotenv from 'dotenv';

// It is recommended to create a `.env` file in the root of the `griot-kitchen` package.
// Load environment variables from that file.
dotenv.config();

interface AppConfig {
  host: string;
  port: number;
  mongoUri: string;
  mongoDbName: string;
  logLevel: string;
}

// Perform basic validation and export the configuration.
const config: AppConfig = {
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '8080', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  mongoDbName: process.env.MONGODB_DB_NAME || 'griot_seed',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate that essential variables are present
if (!config.mongoUri || !config.mongoDbName) {
  throw new Error("Missing critical configuration: MONGODB_URI and MONGODB_DB_NAME must be defined in your .env file.");
}

export default config; 