/**
 * Integration Tests for Database Integration
 * 
 * Tests the database integration functionality including
 * MongoDB schema validation and migration operations.
 */

import { Persona } from '../../packages/schemas/src/persona.schema';
import { PersonaLoader } from '../../packages/data/core/persona_loader';
import mongoose from 'mongoose';

describe('Database Integration', () => {
  let personaLoader: PersonaLoader;
  const testPersonaId = 'griot-core-dangermouse-b82c4707-8c7d-4bb3-9608-7c33a924806f';

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/griot-node-test';
    await mongoose.connect(mongoUri);
    
    personaLoader = new PersonaLoader();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear test data before each test
    await Persona.deleteMany({});
  });

  describe('MongoDB Schema Validation', () => {
    it('should store persona in MongoDB with proper schema', async () => {
      const persona = await personaLoader.loadPersona(testPersonaId);
      expect(persona).not.toBeNull();
      
      if (persona) {
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
            yaml: 'test yaml content',
            parsed: { test: 'data' }
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
        
        // Verify document was saved
        const saved = await Persona.findOne({ id: persona.id });
        expect(saved).not.toBeNull();
        expect(saved?.name).toBe(persona.name);
        expect(saved?.base).toBe(persona.base);
        expect(saved?.tags).toContain('core');
      }
    });

    it('should validate required fields', async () => {
      const invalidPersona = new Persona({
        // Missing required fields
        name: 'Test Persona'
      });
      
      try {
        await invalidPersona.save();
        fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain('validation failed');
      }
    });

    it('should handle optional fields correctly', async () => {
      const persona = await personaLoader.loadPersona(testPersonaId);
      expect(persona).not.toBeNull();
      
      if (persona) {
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
            yaml: 'test content',
            parsed: {}
          },
          // Optional fields
          vectorId: 'test-vector-id',
          skills: [],
          recipes: [],
          knowledge: [],
          imports: [],
          version: '1.0.0'
        });
        
        await personaDoc.save();
        
        const saved = await Persona.findOne({ id: persona.id });
        expect(saved).not.toBeNull();
        expect(saved?.vectorId).toBe('test-vector-id');
        expect(saved?.skills).toEqual([]);
      }
    });
  });

  describe('Database Queries', () => {
    beforeEach(async () => {
      // Add test personas
      const personas = await personaLoader.listPersonas();
      for (const persona of personas.slice(0, 3)) { // Add first 3 personas
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
            yaml: 'test content',
            parsed: {}
          }
        });
        await personaDoc.save();
      }
    });

    it('should find personas by base', async () => {
      const griotPersonas = await Persona.find({ base: 'griot' });
      expect(griotPersonas.length).toBeGreaterThan(0);
      
      for (const persona of griotPersonas) {
        expect(persona.base).toBe('griot');
      }
    });

    it('should find personas by author', async () => {
      const authorPersonas = await Persona.find({ author: 'dangermouse' });
      expect(authorPersonas.length).toBeGreaterThan(0);
      
      for (const persona of authorPersonas) {
        expect(persona.author).toBe('dangermouse');
      }
    });

    it('should find personas by tags', async () => {
      const corePersonas = await Persona.find({ tags: { $in: ['core'] } });
      expect(corePersonas.length).toBeGreaterThan(0);
      
      for (const persona of corePersonas) {
        expect(persona.tags).toContain('core');
      }
    });

    it('should search personas by text', async () => {
      const results = await Persona.find(
        { $text: { $search: 'software engineering' } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      
      expect(results.length).toBeGreaterThan(0);
    });

    it('should get persona statistics', async () => {
      const total = await Persona.countDocuments();
      expect(total).toBeGreaterThan(0);
      
      const withVectors = await Persona.countDocuments({ 
        vectorId: { $exists: true, $ne: null } 
      });
      expect(withVectors).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Migration Operations', () => {
    it('should handle bulk persona insertion', async () => {
      const personas = await personaLoader.listPersonas();
      const personaDocs = personas.slice(0, 5).map(persona => ({
        id: persona.id,
        uuid: persona.uuid,
        name: persona.name,
        base: persona.base,
        variant: persona.variant,
        author: persona.author,
        description: persona.description,
        tags: persona.tags,
        content: {
          yaml: 'migrated content',
          parsed: {}
        }
      }));
      
      const result = await Persona.insertMany(personaDocs);
      expect(result.length).toBe(5);
      
      const count = await Persona.countDocuments();
      expect(count).toBe(5);
    });

    it('should handle duplicate persona prevention', async () => {
      const persona = await personaLoader.loadPersona(testPersonaId);
      expect(persona).not.toBeNull();
      
      if (persona) {
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
            yaml: 'test content',
            parsed: {}
          }
        });
        
        await personaDoc.save();
        
        // Try to save the same persona again
        const duplicateDoc = new Persona({
          id: persona.id,
          uuid: persona.uuid,
          name: persona.name,
          base: persona.base,
          variant: persona.variant,
          author: persona.author,
          description: persona.description,
          tags: persona.tags,
          content: {
            yaml: 'duplicate content',
            parsed: {}
          }
        });
        
        try {
          await duplicateDoc.save();
          fail('Should have thrown duplicate key error');
        } catch (error: any) {
          expect(error).toBeDefined();
          expect(error.code).toBe(11000); // MongoDB duplicate key error
        }
      }
    });
  });

  describe('Performance', () => {
    it('should handle database operations within performance limits', async () => {
      const startTime = Date.now();
      
      const count = await Persona.countDocuments();
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(100); // < 100ms
    });

    it('should handle text search efficiently', async () => {
      const startTime = Date.now();
      
      await Persona.find(
        { $text: { $search: 'engineering' } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(200); // < 200ms
    });
  });
}); 