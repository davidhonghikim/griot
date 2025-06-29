export class PersonaRAGService {
    constructor(vectorStore, embeddingService, personaVectorization) {
        this.initialized = false;
        this.vectorStore = vectorStore;
        this.embeddingService = embeddingService;
        this.personaVectorization = personaVectorization;
    }
    async initialize() {
        console.log('🔄 Initializing Persona RAG Service...');
        await this.personaVectorization.initialize();
        await this.verifyVectorStore();
        this.initialized = true;
        console.log('✅ Persona RAG Service initialized');
    }
    async query(request) {
        const startTime = Date.now();
        try {
            if (!this.initialized) {
                throw new Error('PersonaRAGService not initialized. Call initialize() first.');
            }
            console.log(`🔍 Performing persona RAG query: "${request.query}"`);
            const queryEmbedding = await this.embeddingService.embedText(request.query);
            const searchFilter = this.buildPersonaFilter(request.personaFilter);
            const searchResults = await this.vectorStore.search(queryEmbedding, {
                limit: request.limit || 10,
                filter: {
                    type: 'persona',
                    ...searchFilter
                }
            });
            const results = await this.convertToPersonaResults(searchResults, request.query, request.includeContent || false, request.similarityThreshold || 0.5);
            const selectedPersona = request.personaId
                ? results.find(r => r.personaId === request.personaId)
                : results[0];
            const processingTime = Date.now() - startTime;
            const averageRelevance = results.length > 0
                ? results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length
                : 0;
            console.log(`✅ Persona RAG query completed (${processingTime}ms, ${results.length} results)`);
            return {
                query: request.query,
                results,
                totalResults: results.length,
                processingTime,
                selectedPersona,
                averageRelevance,
                success: true
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            console.error('❌ Persona RAG query failed:', error);
            return {
                query: request.query,
                results: [],
                totalResults: 0,
                processingTime,
                averageRelevance: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async getPersonaContext(personaId, query, options = {}) {
        const request = {
            query,
            personaId,
            limit: 1,
            includeContent: true
        };
        const response = await this.query(request);
        if (!response.success || response.results.length === 0) {
            throw new Error(`No context found for persona ${personaId}`);
        }
        const persona = response.results[0];
        if (!persona) {
            throw new Error(`No persona found for ID: ${personaId}`);
        }
        let context = persona.contextSnippet;
        if (options.includeSkills || options.includeKnowledge) {
            const enhancedContext = await this.enhancePersonaContext(personaId, context, options);
            context = enhancedContext;
        }
        if (options.maxLength && context.length > options.maxLength) {
            context = context.substring(0, options.maxLength) + '...';
        }
        return {
            context,
            relevanceScore: persona.relevanceScore,
            metadata: persona.metadata
        };
    }
    async selectBestPersona(query, options = {}) {
        const request = {
            query,
            limit: 20,
            similarityThreshold: options.minRelevanceScore || 0.6,
            personaFilter: {
                base: options.preferredBase,
                tags: options.requiredTags
            }
        };
        const response = await this.query(request);
        if (!response.success || response.results.length === 0) {
            return null;
        }
        let candidates = response.results;
        if (options.excludePersonas && options.excludePersonas.length > 0) {
            candidates = candidates.filter(p => !options.excludePersonas.includes(p.personaId));
        }
        return candidates.length > 0 ? candidates[0] : null;
    }
    async getPersonaEnsemble(query, ensembleSize = 3, options = {}) {
        const request = {
            query,
            limit: ensembleSize * 3,
            personaFilter: {
                tags: options.requiredTags
            }
        };
        const response = await this.query(request);
        if (!response.success || response.results.length === 0) {
            return [];
        }
        const ensemble = this.selectDiversePersonas(response.results, ensembleSize, options.diversityThreshold || 0.3, options.maxSimilarity || 0.8);
        return ensemble;
    }
    async getPersonaRecommendations(query, userId, options = {}) {
        const maxRecs = options.maxRecommendations || 5;
        let enhancedQuery = query;
        if (options.contextHistory && options.contextHistory.length > 0) {
            enhancedQuery = `${query}\n\nContext: ${options.contextHistory.join(' ')}`;
        }
        const response = await this.query({
            query: enhancedQuery,
            limit: maxRecs + 1,
            includeContent: true
        });
        if (!response.success || response.results.length === 0) {
            throw new Error('No personas found for recommendations');
        }
        const primary = response.results[0];
        if (!primary) {
            throw new Error("No primary persona found for recommendations");
        }
        const alternatives = response.results.slice(1, maxRecs);
        const reasonings = options.includeReasonings
            ? await this.generatePersonaReasonings(query, [primary, ...alternatives])
            : [];
        return {
            primary,
            alternatives,
            reasonings
        };
    }
    async updatePersonaVectors(personaId) {
        console.log(`🔄 Updating vectors for persona: ${personaId}`);
        await this.personaVectorization.updatePersonaVectors(personaId);
        console.log(`✅ Vectors updated for persona: ${personaId}`);
    }
    async getRAGStats() {
        const vectorizationStats = await this.personaVectorization.getVectorizationStats();
        return {
            totalPersonas: vectorizationStats.totalPersonas,
            vectorizedPersonas: vectorizationStats.vectorizedPersonas,
            averageQueryTime: 0,
            totalQueries: 0,
            successRate: 0
        };
    }
    async verifyVectorStore() {
        try {
            await this.vectorStore.search([], { limit: 1, filter: { type: 'persona' } });
        }
        catch (error) {
            throw new Error(`Vector store verification failed: ${error}`);
        }
    }
    buildPersonaFilter(filter) {
        if (!filter)
            return {};
        const searchFilter = {};
        if (filter.base)
            searchFilter.base = filter.base;
        if (filter.variant)
            searchFilter.variant = filter.variant;
        if (filter.author)
            searchFilter.author = filter.author;
        if (filter.tags && filter.tags.length > 0) {
            searchFilter.tags = { $in: filter.tags };
        }
        return searchFilter;
    }
    async convertToPersonaResults(searchResults, query, includeContent, similarityThreshold) {
        const results = [];
        for (const result of searchResults) {
            if (result.score < similarityThreshold)
                continue;
            const contextSnippet = this.extractContextSnippet(result.content || '', query, 200);
            results.push({
                personaId: result.metadata.personaId,
                name: result.metadata.name || result.metadata.display_name,
                relevanceScore: result.score,
                content: includeContent ? result.content : '',
                contextSnippet,
                metadata: {
                    base: result.metadata.base,
                    variant: result.metadata.variant,
                    author: result.metadata.author,
                    tags: result.metadata.tags || [],
                    description: result.metadata.description || ''
                },
                processingTime: 0
            });
        }
        return results;
    }
    extractContextSnippet(content, query, maxLength) {
        if (!content)
            return '';
        const queryWords = query.toLowerCase().split(/\s+/);
        const sentences = content.split(/[.!?]+/);
        const relevantSentences = sentences.filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return queryWords.some(word => lowerSentence.includes(word));
        });
        let snippet = relevantSentences.length > 0
            ? relevantSentences.slice(0, 2).join('. ')
            : sentences.slice(0, 2).join('. ');
        if (snippet.length > maxLength) {
            snippet = snippet.substring(0, maxLength) + '...';
        }
        return snippet.trim();
    }
    async enhancePersonaContext(personaId, baseContext, options) {
        return baseContext;
    }
    selectDiversePersonas(candidates, ensembleSize, diversityThreshold, maxSimilarity) {
        if (candidates.length <= ensembleSize)
            return candidates;
        const selected = [candidates[0]];
        for (let i = 1; i < candidates.length && selected.length < ensembleSize; i++) {
            const candidate = candidates[i];
            const isDiverse = selected.every(selected => {
                const similarity = this.calculatePersonaSimilarity(candidate, selected);
                return similarity < maxSimilarity;
            });
            if (isDiverse) {
                selected.push(candidate);
            }
        }
        return selected;
    }
    calculatePersonaSimilarity(persona1, persona2) {
        const tags1 = new Set(persona1.metadata.tags);
        const tags2 = new Set(persona2.metadata.tags);
        const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)));
        const tagUnion = new Set([...tags1, ...tags2]);
        const tagSimilarity = tagUnion.size > 0 ? tagIntersection.size / tagUnion.size : 0;
        const baseSimilarity = persona1.metadata.base === persona2.metadata.base ? 1 : 0;
        return (tagSimilarity + baseSimilarity) / 2;
    }
    async generatePersonaReasonings(query, personas) {
        return personas.map(persona => ({
            personaId: persona.personaId,
            reasoning: `Selected for ${persona.name} based on ${persona.relevanceScore.toFixed(2)} relevance score and matching ${persona.metadata.tags.length} relevant tags.`,
            confidence: persona.relevanceScore
        }));
    }
    async cleanup() {
        await this.personaVectorization.cleanup();
        this.initialized = false;
        console.log('🧹 Persona RAG Service cleaned up');
    }
}
//# sourceMappingURL=persona_rag_service.js.map