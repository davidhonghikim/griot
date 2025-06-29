import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface Persona {
  id: string;
  uuid: string;
  name: string;
  base: string;
  variant: string;
  author: string;
  description: string;
  tags: string[];
  skills?: any[];
  recipes?: any[];
  knowledge?: any[];
  personality?: any;
  communication?: any;
  identity?: any;
  asset_preferences?: any;
  imports?: string[];
  version?: string;
}

export class PersonaLoader {
  private personasPath: string;
  private indexPath: string;

  constructor() {
    this.personasPath = path.join(process.cwd(), 'packages/data/personas/base');
    this.indexPath = path.join(this.personasPath, 'index.json');
  }

  async loadPersona(personaId: string): Promise<Persona | null> {
    try {
      console.log(`📖 Loading persona: ${personaId}`);
      
      // Load index to find persona file
      const indexData = await fs.readFile(this.indexPath, 'utf-8');
      const personas = JSON.parse(indexData);
      
      const persona = personas.find((p: any) => p.id === personaId);
      if (!persona) {
        console.warn(`⚠️ Persona not found in index: ${personaId}`);
        return null;
      }

      // Load YAML file
      const yamlPath = path.join(this.personasPath, `${personaId}.yml`);
      const yamlContent = await fs.readFile(yamlPath, 'utf-8');
      const parsedContent = yaml.load(yamlContent) as any;

      const loadedPersona: Persona = {
        id: persona.id,
        uuid: persona.uuid,
        name: persona.name,
        base: persona.base,
        variant: persona.variant,
        author: persona.author,
        description: persona.description,
        tags: persona.tags,
        skills: parsedContent.skills || [],
        recipes: parsedContent.recipes || [],
        knowledge: parsedContent.knowledge || [],
        personality: parsedContent.personality,
        communication: parsedContent.communication,
        identity: parsedContent.identity,
        asset_preferences: parsedContent.asset_preferences,
        imports: parsedContent.imports,
        version: parsedContent.version,
      };

      console.log(`✅ Loaded persona: ${personaId} (${persona.name})`);
      return loadedPersona;
      
    } catch (error) {
      console.error(`❌ Failed to load persona ${personaId}:`, error);
      return null;
    }
  }

  async listPersonas(): Promise<Persona[]> {
    try {
      console.log('📋 Listing all personas...');
      
      const indexData = await fs.readFile(this.indexPath, 'utf-8');
      const personas = JSON.parse(indexData);
      
      const loadedPersonas: Persona[] = [];
      for (const persona of personas) {
        const loaded = await this.loadPersona(persona.id);
        if (loaded) {
          loadedPersonas.push(loaded);
        }
      }
      
      console.log(`✅ Listed ${loadedPersonas.length} personas`);
      return loadedPersonas;
      
    } catch (error) {
      console.error('❌ Failed to list personas:', error);
      return [];
    }
  }

  async savePersona(persona: Persona): Promise<void> {
    try {
      console.log(`💾 Saving persona: ${persona.id}`);
      
      // Convert persona to YAML format
      const yamlContent = yaml.dump(persona, { 
        indent: 2,
        lineWidth: 120,
        noRefs: true 
      });
      
      // Save to file
      const yamlPath = path.join(this.personasPath, `${persona.id}.yml`);
      await fs.writeFile(yamlPath, yamlContent, 'utf-8');
      
      console.log(`✅ Saved persona: ${persona.id}`);
      
    } catch (error) {
      console.error(`❌ Failed to save persona ${persona.id}:`, error);
      throw error;
    }
  }

  async getPersonaCount(): Promise<number> {
    try {
      const indexData = await fs.readFile(this.indexPath, 'utf-8');
      const personas = JSON.parse(indexData);
      return personas.length;
    } catch (error) {
      console.error('❌ Failed to get persona count:', error);
      return 0;
    }
  }

  async validatePersona(personaId: string): Promise<boolean> {
    try {
      const persona = await this.loadPersona(personaId);
      if (!persona) return false;
      
      // Basic validation
      const requiredFields = ['id', 'uuid', 'name', 'base', 'variant', 'author', 'description'];
      for (const field of requiredFields) {
        if (!persona[field as keyof Persona]) {
          console.warn(`⚠️ Missing required field '${field}' in persona ${personaId}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to validate persona ${personaId}:`, error);
      return false;
    }
  }
} 