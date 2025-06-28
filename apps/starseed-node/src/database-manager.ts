import mongoose from 'mongoose';
import { createLogger, getEnvironmentConfig } from '@griot/core';
import { Skill, Persona } from '@griot/schemas';

const logger = createLogger('database-manager');
const env = getEnvironmentConfig();

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
    this.config = {
      mongodb: {
        uri: env.MONGODB_URI || `mongodb://${env.MONGODB_HOST}:27017`,
        dbName: env.MONGODB_DB_NAME || 'starseed'
      },
      postgresql: {
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        database: env.POSTGRES_DB,
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD
      },
      weaviate: {
        url: env.WEAVIATE_URL || `http://${env.WEAVIATE_HOST}:${env.WEAVIATE_PORT}`,
        apiKey: env.WEAVIATE_API_KEY
      },
      neo4j: {
        uri: env.NEO4J_URI || `bolt://${env.NEO4J_HOST}:7687`,
        username: env.NEO4J_USERNAME,
        password: env.NEO4J_PASSWORD
      },
      ...config
    };

    logger.info('Database configuration:', {
      deploymentType: env.DEPLOYMENT_TYPE || 'direct',
      mongodb: {
        uri: this.config.mongodb.uri.replace(/\/\/.*@/, '//***:***@'),
        dbName: this.config.mongodb.dbName
      },
      postgresql: {
        host: this.config.postgresql.host,
        port: this.config.postgresql.port,
        database: this.config.postgresql.database,
        username: this.config.postgresql.username
      },
      weaviate: {
        url: this.config.weaviate.url,
        hasApiKey: !!this.config.weaviate.apiKey
      },
      neo4j: {
        uri: this.config.neo4j.uri.replace(/\/\/.*@/, '//***:***@'),
        username: this.config.neo4j.username
      }
    });
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