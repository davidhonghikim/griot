import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
export class PersonaLoader {
    constructor() {
        this.personasPath = path.join(process.cwd(), 'packages/data/personas/base');
        this.indexPath = path.join(this.personasPath, 'index.json');
    }
    async loadPersona(personaId) {
        try {
            console.log(`📖 Loading persona: ${personaId}`);
            const indexData = await fs.readFile(this.indexPath, 'utf-8');
            const personas = JSON.parse(indexData);
            const persona = personas.find((p) => p.id === personaId);
            if (!persona) {
                console.warn(`⚠️ Persona not found in index: ${personaId}`);
                return null;
            }
            const yamlPath = path.join(this.personasPath, `${personaId}.yml`);
            const yamlContent = await fs.readFile(yamlPath, 'utf-8');
            const parsedContent = yaml.load(yamlContent);
            const loadedPersona = {
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
        }
        catch (error) {
            console.error(`❌ Failed to load persona ${personaId}:`, error);
            return null;
        }
    }
    async listPersonas() {
        try {
            console.log('📋 Listing all personas...');
            const indexData = await fs.readFile(this.indexPath, 'utf-8');
            const personas = JSON.parse(indexData);
            const loadedPersonas = [];
            for (const persona of personas) {
                const loaded = await this.loadPersona(persona.id);
                if (loaded) {
                    loadedPersonas.push(loaded);
                }
            }
            console.log(`✅ Listed ${loadedPersonas.length} personas`);
            return loadedPersonas;
        }
        catch (error) {
            console.error('❌ Failed to list personas:', error);
            return [];
        }
    }
    async savePersona(persona) {
        try {
            console.log(`💾 Saving persona: ${persona.id}`);
            const yamlContent = yaml.dump(persona, {
                indent: 2,
                lineWidth: 120,
                noRefs: true
            });
            const yamlPath = path.join(this.personasPath, `${persona.id}.yml`);
            await fs.writeFile(yamlPath, yamlContent, 'utf-8');
            console.log(`✅ Saved persona: ${persona.id}`);
        }
        catch (error) {
            console.error(`❌ Failed to save persona ${persona.id}:`, error);
            throw error;
        }
    }
    async getPersonaCount() {
        try {
            const indexData = await fs.readFile(this.indexPath, 'utf-8');
            const personas = JSON.parse(indexData);
            return personas.length;
        }
        catch (error) {
            console.error('❌ Failed to get persona count:', error);
            return 0;
        }
    }
    async validatePersona(personaId) {
        try {
            const persona = await this.loadPersona(personaId);
            if (!persona)
                return false;
            const requiredFields = ['id', 'uuid', 'name', 'base', 'variant', 'author', 'description'];
            for (const field of requiredFields) {
                if (!persona[field]) {
                    console.warn(`⚠️ Missing required field '${field}' in persona ${personaId}`);
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to validate persona ${personaId}:`, error);
            return false;
        }
    }
}
//# sourceMappingURL=persona_loader.js.map