import mongoose from 'mongoose';
import { createLogger } from '@griot/core';
import { Skill, Persona } from '@griot/schemas';

const logger = createLogger('database-manager');

export interface DatabaseConfig {
  mongodb: {
    uri: string;
    dbName: string;
  };
  postgresql: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  weaviate: {
    url: string;
    apiKey?: string;
  };
  neo4j: {
    uri: string;
    username: string;
    password: string;
  };
}

export class DatabaseManager {
  private config: DatabaseConfig;
  private isConnected = false;

  constructor(config?: Partial<DatabaseConfig>) {
    // Use environment variables with fallbacks
    this.config = {
      mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        dbName: process.env.MONGODB_DB_NAME || 'starseed'
      },
      postgresql: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB || 'starseed',
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password'
      },
      weaviate: {
        url: process.env.WEAVIATE_URL || 'http://localhost:8080',
        apiKey: process.env.WEAVIATE_API_KEY
      },
      neo4j: {
        uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
        username: process.env.NEO4J_USERNAME || 'neo4j',
        password: process.env.NEO4J_PASSWORD || 'password'
      },
      ...config
    };
  }

  /**
   * Initialize all database connections
   */
  async initialize(): Promise<void> {
    logger.info('Initializing database connections...');

    try {
      // Connect to MongoDB
      await this.connectMongoDB();
      
      // TODO: Add PostgreSQL, Weaviate, and Neo4j connections
      // These will be implemented as we add the specific drivers
      
      this.isConnected = true;
      logger.info('Database connections initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database connections:', error);
      throw error;
    }
  }

  /**
   * Connect to MongoDB
   */
  private async connectMongoDB(): Promise<void> {
    try {
      await mongoose.connect(this.config.mongodb.uri, {
        dbName: this.config.mongodb.dbName,
      });
      
      logger.info(`Connected to MongoDB: ${this.config.mongodb.dbName}`);
      
      // Test the connection by checking if we can access our models
      const skillCount = await Skill.countDocuments();
      const personaCount = await Persona.countDocuments();
      
      logger.info(`MongoDB models accessible - Skills: ${skillCount}, Personas: ${personaCount}`);
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get MongoDB connection status
   */
  getMongoDBStatus(): { connected: boolean; readyState: number } {
    return {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    };
  }

  /**
   * Get overall database status
   */
  getStatus(): {
    connected: boolean;
    mongodb: { connected: boolean; readyState: number };
    postgresql: { connected: boolean };
    weaviate: { connected: boolean };
    neo4j: { connected: boolean };
  } {
    return {
      connected: this.isConnected,
      mongodb: this.getMongoDBStatus(),
      postgresql: { connected: false }, // TODO: Implement
      weaviate: { connected: false }, // TODO: Implement
      neo4j: { connected: false }, // TODO: Implement
    };
  }

  /**
   * Close all database connections
   */
  async close(): Promise<void> {
    logger.info('Closing database connections...');
    
    try {
      await mongoose.disconnect();
      logger.info('MongoDB connection closed');
      
      // TODO: Close other database connections
      
      this.isConnected = false;
      logger.info('All database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
      throw error;
    }
  }

  /**
   * Get database models
   */
  getModels() {
    return {
      Skill,
      Persona,
    };
  }
} 