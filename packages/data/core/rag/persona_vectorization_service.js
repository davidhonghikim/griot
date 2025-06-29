export class PersonaVectorizationService {
    constructor(config) {
        this.config = {
            chunkSize: 1000,
            overlapSize: 200,
            similarityThreshold: 0.7,
            ...config,
        };
        this.vectorizedPersonas = new Map();
    }
    async initialize() {
        console.log('🔄 Initializing Persona Vectorization Service...');
        await this.loadExistingVectors();
        console.log('✅ Persona Vectorization Service initialized');
    }
    async vectorizePersona(personaId) {
        const startTime = Date.now();
        try {
            console.log(`📊 Vectorizing persona: ${personaId}`);
            const persona = await this.config.personaLoader.loadPersona(personaId);
            if (!persona) {
                throw new Error(`Persona not found: ${personaId}`);
            }
            const content = this.extractPersonaContent(persona);
            const embedding = await this.config.embeddingService.embedText(content);
            const vectorId = await this.config.vectorStore.storeDocument({
                id: `persona_${personaId}`,
                content,
                embedding,
                metadata: {
                    type: 'persona',
                    personaId,
                    uuid: persona.uuid,
                    name: persona.name,
                    base: persona.base,
                    variant: persona.variant,
                    author: persona.author,
                    description: persona.description,
                    tags: persona.tags,
                    contentLength: content.length,
                    vectorizedAt: new Date().toISOString(),
                }
            });
            this.vectorizedPersonas.set(personaId, vectorId);
            const processingTime = Date.now() - startTime;
            console.log(`✅ Persona vectorized: ${personaId} (${processingTime}ms)`);
            return {
                personaId,
                vectorId,
                contentLength: content.length,
                embeddingDimensions: embedding.length,
                processingTime,
                success: true,
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            console.error(`❌ Failed to vectorize persona ${personaId}:`, error);
            return {
                personaId,
                vectorId: '',
                contentLength: 0,
                embeddingDimensions: 0,
                processingTime,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async vectorizeAllPersonas() {
        console.log('🔄 Starting batch persona vectorization...');
        const personas = await this.config.personaLoader.listPersonas();
        const results = [];
        for (const persona of personas) {
            const result = await this.vectorizePersona(persona.id);
            results.push(result);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const successCount = results.filter(r => r.success).length;
        const totalTime = results.reduce((sum, r) => sum + r.processingTime, 0);
        console.log(`✅ Batch vectorization complete: ${successCount}/${personas.length} personas (${totalTime}ms total)`);
        return results;
    }
    async updatePersonaVectors(personaId) {
        console.log(`🔄 Updating vectors for persona: ${personaId}`);
        const existingVectorId = this.vectorizedPersonas.get(personaId);
        if (existingVectorId) {
            await this.config.vectorStore.deleteDocument(existingVectorId);
            this.vectorizedPersonas.delete(personaId);
        }
        return await this.vectorizePersona(personaId);
    }
    async getPersonaVector(personaId) {
        const vectorId = this.vectorizedPersonas.get(personaId);
        if (!vectorId) {
            return null;
        }
        const document = await this.config.vectorStore.getDocument(vectorId);
        return document?.embedding || null;
    }
    async searchPersonas(query, options = {}) {
        const queryEmbedding = await this.config.embeddingService.embedText(query);
        const searchResults = await this.config.vectorStore.search(queryEmbedding, {
            limit: options.limit || 10,
            filter: {
                type: 'persona',
                ...options.filter,
            },
        });
        return searchResults.map((result) => ({
            personaId: result.metadata.personaId,
            score: result.score,
            metadata: result.metadata,
            content: options.includeContent ? result.content : undefined,
        }));
    }
    async getVectorizationStats() {
        const personas = await this.config.personaLoader.listPersonas();
        const vectorizedCount = this.vectorizedPersonas.size;
        const processingTimes = [];
        const contentLengths = [];
        for (const [personaId, vectorId] of Array.from(this.vectorizedPersonas.entries())) {
            try {
                const document = await this.config.vectorStore.getDocument(vectorId);
                if (document?.metadata) {
                    if (document.metadata.processingTime) {
                        processingTimes.push(document.metadata.processingTime);
                    }
                    if (document.metadata.contentLength) {
                        contentLengths.push(document.metadata.contentLength);
                    }
                }
            }
            catch (error) {
                console.warn(`Failed to get stats for persona ${personaId}:`, error);
            }
        }
        return {
            totalPersonas: personas.length,
            vectorizedPersonas: vectorizedCount,
            averageProcessingTime: processingTimes.length > 0
                ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
                : 0,
            totalContentLength: contentLengths.reduce((sum, length) => sum + length, 0),
            averageContentLength: contentLengths.length > 0
                ? contentLengths.reduce((sum, length) => sum + length, 0) / contentLengths.length
                : 0,
        };
    }
    extractPersonaContent(persona) {
        const contentParts = [];
        contentParts.push(`Persona: ${persona.name}`);
        contentParts.push(`Base: ${persona.base}`);
        contentParts.push(`Variant: ${persona.variant}`);
        contentParts.push(`Author: ${persona.author}`);
        contentParts.push(`Description: ${persona.description}`);
        if (persona.tags && persona.tags.length > 0) {
            contentParts.push(`Specializations: ${persona.tags.join(', ')}`);
        }
        if (persona.skills && persona.skills.length > 0) {
            contentParts.push(`Skills: ${persona.skills.map((s) => s.name).join(', ')}`);
        }
        if (persona.recipes && persona.recipes.length > 0) {
            contentParts.push(`Recipes: ${persona.recipes.map((r) => r.name).join(', ')}`);
        }
        if (persona.knowledge && persona.knowledge.length > 0) {
            contentParts.push(`Knowledge: ${persona.knowledge.map((k) => k.title).join(', ')}`);
        }
        if (persona.personality) {
            contentParts.push(`Personality: ${JSON.stringify(persona.personality)}`);
        }
        if (persona.communication) {
            contentParts.push(`Communication: ${JSON.stringify(persona.communication)}`);
        }
        return contentParts.join('\n\n');
    }
    async loadExistingVectors() {
        try {
            const existingVectors = await this.config.vectorStore.search([], {
                filter: { type: 'persona' },
                limit: 1000,
            });
            for (const vector of existingVectors) {
                if (vector.metadata?.personaId) {
                    this.vectorizedPersonas.set(vector.metadata.personaId, vector.id);
                }
            }
            console.log(`📊 Loaded ${this.vectorizedPersonas.size} existing persona vectors`);
        }
        catch (error) {
            console.warn('Failed to load existing vectors:', error);
        }
    }
    async cleanup() {
        this.vectorizedPersonas.clear();
        console.log('🧹 Persona Vectorization Service cleaned up');
    }
}
//# sourceMappingURL=persona_vectorization_service.js.map