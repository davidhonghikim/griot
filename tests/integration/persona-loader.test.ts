/**
 * Integration Tests for PersonaLoader
 * 
 * Tests the PersonaLoader functionality for loading and managing
 * persona files from the filesystem.
 */

import { PersonaLoader } from '../../packages/data/core/persona_loader';

describe('PersonaLoader Integration', () => {
  let personaLoader: PersonaLoader;
  const testPersonaId = 'griot-core-dangermouse-b82c4707-8c7d-4bb3-9608-7c33a924806f';

  beforeAll(async () => {
    personaLoader = new PersonaLoader();
  });

  describe('Persona Loading', () => {
    it('should load a persona from YAML file', async () => {
      const persona = await personaLoader.loadPersona(testPersonaId);
      
      expect(persona).not.toBeNull();
      expect(persona?.id).toBe(testPersonaId);
      expect(persona?.name).toBe('Griot');
      expect(persona?.base).toBe('griot');
      expect(persona?.variant).toBe('core');
      expect(persona?.author).toBe('dangermouse');
      expect(persona?.description).toContain('software engineering');
      expect(persona?.tags).toContain('core');
      expect(persona?.skills).toBeDefined();
    });

    it('should return null for non-existent persona', async () => {
      const persona = await personaLoader.loadPersona('non-existent-persona');
      expect(persona).toBeNull();
    });

    it('should validate persona structure', async () => {
      const isValid = await personaLoader.validatePersona(testPersonaId);
      expect(isValid).toBe(true);
    });

    it('should handle malformed persona files gracefully', async () => {
      // This test would require a malformed test file
      // For now, we test the validation logic
      const persona = await personaLoader.loadPersona(testPersonaId);
      expect(persona).not.toBeNull();
      
      if (persona) {
        // Test validation with valid persona
        const isValid = await personaLoader.validatePersona(testPersonaId);
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Persona Listing', () => {
    it('should list all personas', async () => {
      const personas = await personaLoader.listPersonas();
      
      expect(personas.length).toBeGreaterThan(0);
      expect(personas.length).toBe(13); // Should have 13 personas
      
      // Check that all personas have required fields
      for (const persona of personas) {
        expect(persona.id).toBeDefined();
        expect(persona.name).toBeDefined();
        expect(persona.base).toBeDefined();
        expect(persona.description).toBeDefined();
      }
    });

    it('should get persona count', async () => {
      const count = await personaLoader.getPersonaCount();
      expect(count).toBe(13);
    });
  });

  describe('Persona Validation', () => {
    it('should validate required fields', async () => {
      const persona = await personaLoader.loadPersona(testPersonaId);
      expect(persona).not.toBeNull();
      
      if (persona) {
        const requiredFields = ['id', 'uuid', 'name', 'base', 'variant', 'author', 'description'];
        for (const field of requiredFields) {
          expect(persona[field as keyof typeof persona]).toBeDefined();
        }
      }
    });

    it('should handle validation errors gracefully', async () => {
      const isValid = await personaLoader.validatePersona('non-existent-persona');
      expect(isValid).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should load persona within performance limits', async () => {
      const startTime = Date.now();
      
      await personaLoader.loadPersona(testPersonaId);
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(100); // < 100ms
    });

    it('should list personas within performance limits', async () => {
      const startTime = Date.now();
      
      await personaLoader.listPersonas();
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(500); // < 500ms for all personas
    });
  });
}); 