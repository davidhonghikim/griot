#!/usr/bin/env ts-node

/**
 * Database Migration Script for Personas
 * 
 * Migrates persona files from YAML to MongoDB database.
 * This script loads all persona files from packages/data/personas/base/
 * and stores them in MongoDB with proper structure.
 */

import { PersonaLoader } from '../packages/data/core/persona_loader';
import { Persona } from '../packages/schemas/src/persona.schema';
import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';
import * as path from 'path';
import mongoose from 'mongoose';

export interface MigrationResult {
  success: boolean;
  totalPersonas: number;
  migratedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
  processingTime: number;
}

export class PersonaMigrationService {
  private personaLoader: PersonaLoader;
  private isConnected: boolean = false;

  constructor() {
    this.personaLoader = new PersonaLoader();
  }

  async connectToDatabase(): Promise<void> {
    try {
      console.log('🔌 Connecting to MongoDB...');
      
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/griot-node';
      await mongoose.connect(mongoUri);
      
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnectFromDatabase(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  async migratePersonasToDatabase(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      totalPersonas: 0,
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      processingTime: 0,
    };

    try {
      console.log('🔄 Starting persona migration to database...');
      
      // Connect to database
      await this.connectToDatabase();
      
      // Load all personas from files
      const personas = await this.personaLoader.listPersonas();
      result.totalPersonas = personas.length;
      
      console.log(`📊 Found ${personas.length} personas to migrate`);
      
      for (const persona of personas) {
        try {
          // Check if persona already exists
          const existing = await Persona.findOne({ id: persona.id });
          if (existing) {
            console.log(`⚠️ Persona ${persona.id} already exists, skipping`);
            result.skippedCount++;
            continue;
          }

          // Load YAML content
          const yamlPath = path.join(process.cwd(), 'packages/data/personas/base', `${persona.id}.yml`);
          const yamlContent = await fs.readFile(yamlPath, 'utf-8');
          
          // Create persona document
          const personaDoc = new Persona({
            id: persona.id,
            uuid: persona.uuid,
            name: persona.name,
            base: persona.base,
            variant: persona.variant,
            author: persona.author,
            description: persona.description,
            tags: persona.tags,
            content: {
              yaml: yamlContent,
              parsed: yaml.load(yamlContent)
            },
            skills: persona.skills,
            recipes: persona.recipes,
            knowledge: persona.knowledge,
            personality: persona.personality,
            communication: persona.communication,
            identity: persona.identity,
            asset_preferences: persona.asset_preferences,
            imports: persona.imports,
            version: persona.version,
          });
          
          await personaDoc.save();
          console.log(`✅ Migrated persona: ${persona.id} (${persona.name})`);
          result.migratedCount++;
          
        } catch (error) {
          const errorMsg = `Failed to migrate persona ${persona.id}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
          result.errorCount++;
        }
      }
      
      result.success = result.errorCount === 0;
      result.processingTime = Date.now() - startTime;
      
      console.log(`✅ Migration complete: ${result.migratedCount}/${result.totalPersonas} personas migrated`);
      console.log(`📊 Results: ${result.migratedCount} migrated, ${result.skippedCount} skipped, ${result.errorCount} errors`);
      console.log(`⏱️ Processing time: ${result.processingTime}ms`);
      
      if (result.errors.length > 0) {
        console.log('❌ Errors encountered:');
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
      
    } catch (error) {
      const errorMsg = `Migration failed: ${error}`;
      console.error(`❌ ${errorMsg}`);
      result.errors.push(errorMsg);
      result.success = false;
    } finally {
      await this.disconnectFromDatabase();
    }

    return result;
  }

  async validateMigration(): Promise<{
    success: boolean;
    fileCount: number;
    dbCount: number;
    validationErrors: string[];
  }> {
    try {
      console.log('🔍 Validating migration...');
      
      // Count files
      const personas = await this.personaLoader.listPersonas();
      const fileCount = personas.length;
      
      // Count database records
      await this.connectToDatabase();
      const dbCount = await Persona.countDocuments();
      
      const validationErrors: string[] = [];
      
      // Check if all personas are in database
      for (const persona of personas) {
        const dbPersona = await Persona.findOne({ id: persona.id });
        if (!dbPersona) {
          validationErrors.push(`Persona ${persona.id} not found in database`);
        }
      }
      
      const success = validationErrors.length === 0 && fileCount === dbCount;
      
      console.log(`📊 Validation results: ${fileCount} files, ${dbCount} database records`);
      console.log(`✅ Validation ${success ? 'passed' : 'failed'}`);
      
      if (validationErrors.length > 0) {
        console.log('❌ Validation errors:');
        validationErrors.forEach(error => console.log(`  - ${error}`));
      }
      
      await this.disconnectFromDatabase();
      
      return {
        success,
        fileCount,
        dbCount,
        validationErrors,
      };
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      await this.disconnectFromDatabase();
      return {
        success: false,
        fileCount: 0,
        dbCount: 0,
        validationErrors: [`Validation failed: ${error}`],
      };
    }
  }

  async rollbackMigration(): Promise<{
    success: boolean;
    deletedCount: number;
    errors: string[];
  }> {
    try {
      console.log('🔄 Rolling back migration...');
      
      await this.connectToDatabase();
      
      const result = await Persona.deleteMany({});
      
      console.log(`✅ Rollback complete: ${result.deletedCount} personas deleted`);
      
      await this.disconnectFromDatabase();
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        errors: [],
      };
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      await this.disconnectFromDatabase();
      return {
        success: false,
        deletedCount: 0,
        errors: [`Rollback failed: ${error}`],
      };
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const migrationService = new PersonaMigrationService();
  
  try {
    switch (command) {
      case 'migrate':
        const result = await migrationService.migratePersonasToDatabase();
        process.exit(result.success ? 0 : 1);
        break;
        
      case 'validate':
        const validation = await migrationService.validateMigration();
        process.exit(validation.success ? 0 : 1);
        break;
        
      case 'rollback':
        const rollback = await migrationService.rollbackMigration();
        process.exit(rollback.success ? 0 : 1);
        break;
        
      default:
        console.log('Usage: npm run migrate-personas [migrate|validate|rollback]');
        console.log('');
        console.log('Commands:');
        console.log('  migrate   - Migrate personas from YAML files to MongoDB');
        console.log('  validate  - Validate that all personas are in database');
        console.log('  rollback  - Remove all personas from database');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === process.argv[1]) {
  main();
} 