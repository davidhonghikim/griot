import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { PersonaVectorizationService } from './persona_vectorization_service';

export interface PersonaRAGRequest {
  query: string;
  personaId?: string;
  personaFilter?: {
    base?: string;
    variant?: string;
    author?: string;
    tags?: string[];
  };
  limit?: number;
  similarityThreshold?: number;
  includeContent?: boolean;
  contextWindow?: number;
}

export interface PersonaRAGResult {
  personaId: string;
  name: string;
  relevanceScore: number;
  content: string;
  contextSnippet: string;
  metadata: {
    base: string;
    variant: string;
    author: string;
    tags: string[];
    description: string;
  };
  processingTime: number;
}

export interface PersonaRAGResponse {
  query: string;
  results: PersonaRAGResult[];
  totalResults: number;
  processingTime: number;
  selectedPersona?: PersonaRAGResult;
  averageRelevance: number;
  success: boolean;
  error?: string;
}

export class PersonaRAGService {
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private personaVectorization: PersonaVectorizationService;
  private initialized: boolean = false;

  constructor(
    vectorStore: VectorStore,
    embeddingService: EmbeddingService,
    personaVectorization: PersonaVectorizationService
  ) {
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.personaVectorization = personaVectorization;
  }

  /**
   * Initialize the Persona RAG service
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Persona RAG Service...');
    
    // Initialize persona vectorization service
    await this.personaVectorization.initialize();
    
    // Verify vector store is ready
    await this.verifyVectorStore();
    
    this.initialized = true;
    console.log('✅ Persona RAG Service initialized');
  }

  /**
   * Perform persona-aware RAG query
   */
  async query(request: PersonaRAGRequest): Promise<PersonaRAGResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.initialized) {
        throw new Error('PersonaRAGService not initialized. Call initialize() first.');
      }

      console.log(`🔍 Performing persona RAG query: "${request.query}"`);
      
      // Generate query embedding
      const queryEmbedding = await this.embeddingService.embedText(request.query);
      
      // Build search filter for personas
      const searchFilter = this.buildPersonaFilter(request.personaFilter);
      
      // Search persona vectors
      const searchResults = await this.vectorStore.search(queryEmbedding, {
        limit: request.limit || 10,
        filter: {
          type: 'persona',
          ...searchFilter
        }
      });

      // Convert to persona RAG results
      const results = await this.convertToPersonaResults(
        searchResults, 
        request.query,
        request.includeContent || false,
        request.similarityThreshold || 0.5
      );

      // Select best persona if none specified
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

    } catch (error) {
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

  /**
   * Get context for a specific persona
   */
  async getPersonaContext(
    personaId: string, 
    query: string,
    options: { maxLength?: number; includeSkills?: boolean; includeKnowledge?: boolean } = {}
  ): Promise<{
    context: string;
    relevanceScore: number;
    metadata: Record<string, any>;
  }> {
    const request: PersonaRAGRequest = {
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
    if (!persona) { throw new Error(`No persona found for ID: ${personaId}`); }
    let context = persona.contextSnippet;

    // Enhance context with additional information if requested
    if (options.includeSkills || options.includeKnowledge) {
      const enhancedContext = await this.enhancePersonaContext(
        personaId, 
        context, 
        options
      );
      context = enhancedContext;
    }

    // Trim to max length if specified
    if (options.maxLength && context.length > options.maxLength) {
      context = context.substring(0, options.maxLength) + '...';
    }

    return {
      context,
      relevanceScore: persona.relevanceScore,
      metadata: persona.metadata
    };
  }

  /**
   * Select best persona for a given query
   */
  async selectBestPersona(
    query: string,
    options: {
      excludePersonas?: string[];
      requiredTags?: string[];
      preferredBase?: string;
      minRelevanceScore?: number;
    } = {}
  ): Promise<PersonaRAGResult | null> {
    const request: PersonaRAGRequest = {
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

    // Filter out excluded personas
    let candidates = response.results;
    if (options.excludePersonas && options.excludePersonas.length > 0) {
      candidates = candidates.filter(p => !options.excludePersonas!.includes(p.personaId));
    }

    // Return best candidate
    return candidates.length > 0 ? candidates[0]! : null;
  }

  /**
   * Get multiple personas for ensemble responses
   */
  async getPersonaEnsemble(
    query: string,
    ensembleSize: number = 3,
    options: {
      diversityThreshold?: number;
      maxSimilarity?: number;
      requiredTags?: string[];
    } = {}
  ): Promise<PersonaRAGResult[]> {
    const request: PersonaRAGRequest = {
      query,
      limit: ensembleSize * 3, // Get more candidates for diversity selection
      personaFilter: {
        tags: options.requiredTags
      }
    };

    const response = await this.query(request);
    
    if (!response.success || response.results.length === 0) {
      return [];
    }

    // Select diverse personas using similarity-based diversity
    const ensemble = this.selectDiversePersonas(
      response.results,
      ensembleSize,
      options.diversityThreshold || 0.3,
      options.maxSimilarity || 0.8
    );

    return ensemble;
  }

  /**
   * Get persona recommendations based on query analysis
   */
  async getPersonaRecommendations(
    query: string,
    userId?: string,
    options: {
      includeReasonings?: boolean;
      maxRecommendations?: number;
      contextHistory?: string[];
    } = {}
  ): Promise<{
    primary: PersonaRAGResult;
    alternatives: PersonaRAGResult[];
    reasonings: Array<{
      personaId: string;
      reasoning: string;
      confidence: number;
    }>;
  }> {
    const maxRecs = options.maxRecommendations || 5;
    
    // Enhance query with context history if provided
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
    if (!primary) { throw new Error("No primary persona found for recommendations"); }
    const alternatives = response.results.slice(1, maxRecs);

    // Generate reasonings if requested
    const reasonings = options.includeReasonings 
      ? await this.generatePersonaReasonings(query, [primary, ...alternatives])
      : [];

    return {
      primary,
      alternatives,
      reasonings
    };
  }

  /**
   * Update persona vectors when content changes
   */
  async updatePersonaVectors(personaId: string): Promise<void> {
    console.log(`🔄 Updating vectors for persona: ${personaId}`);
    await this.personaVectorization.updatePersonaVectors(personaId);
    console.log(`✅ Vectors updated for persona: ${personaId}`);
  }

  /**
   * Get RAG service statistics
   */
  async getRAGStats(): Promise<{
    totalPersonas: number;
    vectorizedPersonas: number;
    averageQueryTime: number;
    totalQueries: number;
    successRate: number;
  }> {
    const vectorizationStats = await this.personaVectorization.getVectorizationStats();
    
    // Additional RAG-specific stats would be tracked here
    return {
      totalPersonas: vectorizationStats.totalPersonas,
      vectorizedPersonas: vectorizationStats.vectorizedPersonas,
      averageQueryTime: 0, // Would track this in production
      totalQueries: 0,     // Would track this in production
      successRate: 0       // Would track this in production
    };
  }

  /**
   * Private helper methods
   */

  private async verifyVectorStore(): Promise<void> {
    try {
      // Test vector store connectivity
      await this.vectorStore.search([], { limit: 1, filter: { type: 'persona' } });
    } catch (error) {
      throw new Error(`Vector store verification failed: ${error}`);
    }
  }

  private buildPersonaFilter(filter?: PersonaRAGRequest['personaFilter']): Record<string, any> {
    if (!filter) return {};

    const searchFilter: Record<string, any> = {};

    if (filter.base) searchFilter.base = filter.base;
    if (filter.variant) searchFilter.variant = filter.variant;
    if (filter.author) searchFilter.author = filter.author;
    if (filter.tags && filter.tags.length > 0) {
      searchFilter.tags = { $in: filter.tags };
    }

    return searchFilter;
  }

  private async convertToPersonaResults(
    searchResults: any[],
    query: string,
    includeContent: boolean,
    similarityThreshold: number
  ): Promise<PersonaRAGResult[]> {
    const results: PersonaRAGResult[] = [];

    for (const result of searchResults) {
      // Skip results below similarity threshold
      if (result.score < similarityThreshold) continue;

      // Extract context snippet from content
      const contextSnippet = this.extractContextSnippet(
        result.content || '',
        query,
        200 // max snippet length
      );

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
        processingTime: 0 // Would track individual processing times
      });
    }

    return results;
  }

  private extractContextSnippet(content: string, query: string, maxLength: number): string {
    if (!content) return '';

    // Simple context extraction - find relevant parts of content
    const queryWords = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/);
    
    // Find sentences that contain query words
    const relevantSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return queryWords.some(word => lowerSentence.includes(word));
    });

    let snippet = relevantSentences.length > 0 
      ? relevantSentences.slice(0, 2).join('. ')
      : sentences.slice(0, 2).join('. ');

    // Trim to max length
    if (snippet.length > maxLength) {
      snippet = snippet.substring(0, maxLength) + '...';
    }

    return snippet.trim();
  }

  private async enhancePersonaContext(
    personaId: string,
    baseContext: string,
    options: { includeSkills?: boolean; includeKnowledge?: boolean }
  ): Promise<string> {
    // This would query additional persona data from the persona loader
    // For now, return base context
    return baseContext;
  }

  private selectDiversePersonas(
    candidates: PersonaRAGResult[],
    ensembleSize: number,
    diversityThreshold: number,
    maxSimilarity: number
  ): PersonaRAGResult[] {
    if (candidates.length <= ensembleSize) return candidates;

    const selected: PersonaRAGResult[] = [candidates[0]!]; // Always include best match
    
    for (let i = 1; i < candidates.length && selected.length < ensembleSize; i++) {
      const candidate = candidates[i];
      
      // Check if candidate is diverse enough from already selected personas
      const isDiverse = selected.every(selected => {
        const similarity = this.calculatePersonaSimilarity(candidate!, selected);
        return similarity < maxSimilarity;
      });
      
      if (isDiverse) {
        selected.push(candidate!);
      }
    }

    return selected;
  }

  private calculatePersonaSimilarity(persona1: PersonaRAGResult, persona2: PersonaRAGResult): number {
    // Simple similarity calculation based on tags and base
    const tags1 = new Set(persona1.metadata.tags);
    const tags2 = new Set(persona2.metadata.tags);
    const tagIntersection = new Set([...tags1].filter(x => tags2.has(x)));
    const tagUnion = new Set([...tags1, ...tags2]);
    
    const tagSimilarity = tagUnion.size > 0 ? tagIntersection.size / tagUnion.size : 0;
    const baseSimilarity = persona1.metadata.base === persona2.metadata.base ? 1 : 0;
    
    return (tagSimilarity + baseSimilarity) / 2;
  }

  private async generatePersonaReasonings(
    query: string,
    personas: PersonaRAGResult[]
  ): Promise<Array<{ personaId: string; reasoning: string; confidence: number; }>> {
    // This would use an LLM to generate explanations for why each persona was selected
    // For now, return simple reasonings based on relevance scores
    return personas.map(persona => ({
      personaId: persona.personaId,
      reasoning: `Selected for ${persona.name} based on ${persona.relevanceScore.toFixed(2)} relevance score and matching ${persona.metadata.tags.length} relevant tags.`,
      confidence: persona.relevanceScore
    }));
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    await this.personaVectorization.cleanup();
    this.initialized = false;
    console.log('🧹 Persona RAG Service cleaned up');
  }
} 