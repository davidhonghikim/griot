import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';
import { PersonaLoader } from '../persona_loader';

export interface PersonaDocument {
  id: string;
  uuid: string;
  name: string;
  base: string;
  variant: string;
  author: string;
  description: string;
  tags: string[];
  content: {
    yaml: string;
    parsed: any;
  };
  vectorId?: string; // Reference to Weaviate vector
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonaVectorizationConfig {
  vectorStore: VectorStore;
  embeddingService: EmbeddingService;
  personaLoader: PersonaLoader;
  chunkSize?: number;
  overlapSize?: number;
  similarityThreshold?: number;
}

export interface PersonaVectorizationResult {
  personaId: string;
  vectorId: string;
  contentLength: number;
  embeddingDimensions: number;
  processingTime: number;
  success: boolean;
  error?: string;
}

export class PersonaVectorizationService {
  private config: PersonaVectorizationConfig;
  private vectorizedPersonas: Map<string, string>; // personaId -> vectorId

  constructor(config: PersonaVectorizationConfig) {
    this.config = {
      chunkSize: 1000,
      overlapSize: 200,
      similarityThreshold: 0.7,
      ...config,
    };
    this.vectorizedPersonas = new Map();
  }

  /**
   * Initialize the persona vectorization service
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Persona Vectorization Service...');
    
    // Load existing vectorized personas from vector store
    await this.loadExistingVectors();
    
    console.log('✅ Persona Vectorization Service initialized');
  }

  /**
   * Vectorize a single persona
   */
  async vectorizePersona(personaId: string): Promise<PersonaVectorizationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`📊 Vectorizing persona: ${personaId}`);
      
      // Load persona content
      const persona = await this.config.personaLoader.loadPersona(personaId);
      if (!persona) {
        throw new Error(`Persona not found: ${personaId}`);
      }

      // Extract persona content for vectorization
      const content = this.extractPersonaContent(persona);
      
      // Generate embedding
      const embedding = await this.config.embeddingService.embedText(content);
      
      // Store in vector database
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

      // Update tracking
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
      
    } catch (error) {
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

  /**
   * Vectorize all personas in batch
   */
  async vectorizeAllPersonas(): Promise<PersonaVectorizationResult[]> {
    console.log('🔄 Starting batch persona vectorization...');
    
    const personas = await this.config.personaLoader.listPersonas();
    const results: PersonaVectorizationResult[] = [];
    
    for (const persona of personas) {
      const result = await this.vectorizePersona(persona.id);
      results.push(result);
      
      // Small delay to prevent overwhelming the embedding service
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalTime = results.reduce((sum, r) => sum + r.processingTime, 0);
    
    console.log(`✅ Batch vectorization complete: ${successCount}/${personas.length} personas (${totalTime}ms total)`);
    
    return results;
  }

  /**
   * Update vectors when persona changes
   */
  async updatePersonaVectors(personaId: string): Promise<PersonaVectorizationResult> {
    console.log(`🔄 Updating vectors for persona: ${personaId}`);
    
    // Delete existing vector
    const existingVectorId = this.vectorizedPersonas.get(personaId);
    if (existingVectorId) {
      await this.config.vectorStore.deleteDocument(existingVectorId);
      this.vectorizedPersonas.delete(personaId);
    }
    
    // Re-vectorize
    return await this.vectorizePersona(personaId);
  }

  /**
   * Get persona vector for search operations
   */
  async getPersonaVector(personaId: string): Promise<number[] | null> {
    const vectorId = this.vectorizedPersonas.get(personaId);
    if (!vectorId) {
      return null;
    }
    
    const document = await this.config.vectorStore.getDocument(vectorId);
    return document?.embedding || null;
  }

  /**
   * Search for personas using semantic queries
   */
  async searchPersonas(
    query: string,
    options: {
      limit?: number;
      filter?: Record<string, any>;
      includeContent?: boolean;
    } = {}
  ): Promise<Array<{
    personaId: string;
    score: number;
    metadata: Record<string, any>;
    content?: string;
  }>> {
    // Generate embedding for query
    const queryEmbedding = await this.config.embeddingService.embedText(query);
    
    // Search vector database
    const searchResults = await this.config.vectorStore.search(queryEmbedding, {
      limit: options.limit || 10,
      filter: {
        type: 'persona',
        ...options.filter,
      },
    });

    // Map results to persona format
    return searchResults.map((result: any) => ({
      personaId: result.metadata.personaId,
      score: result.score,
      metadata: result.metadata,
      content: options.includeContent ? result.content : undefined,
    }));
  }

  /**
   * Get vectorization statistics
   */
  async getVectorizationStats(): Promise<{
    totalPersonas: number;
    vectorizedPersonas: number;
    averageProcessingTime: number;
    totalContentLength: number;
    averageContentLength: number;
  }> {
    const personas = await this.config.personaLoader.listPersonas();
    const vectorizedCount = this.vectorizedPersonas.size;
    
    // Get processing times from vector store metadata
    const processingTimes: number[] = [];
    const contentLengths: number[] = [];
    
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
      } catch (error) {
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

  /**
   * Extract persona content for vectorization
   */
  private extractPersonaContent(persona: any): string {
    const contentParts: string[] = [];
    
    // Basic persona information
    contentParts.push(`Persona: ${persona.name}`);
    contentParts.push(`Base: ${persona.base}`);
    contentParts.push(`Variant: ${persona.variant}`);
    contentParts.push(`Author: ${persona.author}`);
    contentParts.push(`Description: ${persona.description}`);
    
    // Tags and specializations
    if (persona.tags && persona.tags.length > 0) {
      contentParts.push(`Specializations: ${persona.tags.join(', ')}`);
    }
    
    // Skills and capabilities
    if (persona.skills && persona.skills.length > 0) {
      contentParts.push(`Skills: ${persona.skills.map((s: any) => s.name).join(', ')}`);
    }
    
    // Recipes and workflows
    if (persona.recipes && persona.recipes.length > 0) {
      contentParts.push(`Recipes: ${persona.recipes.map((r: any) => r.name).join(', ')}`);
    }
    
    // Knowledge base
    if (persona.knowledge && persona.knowledge.length > 0) {
      contentParts.push(`Knowledge: ${persona.knowledge.map((k: any) => k.title).join(', ')}`);
    }
    
    // Personality traits and characteristics
    if (persona.personality) {
      contentParts.push(`Personality: ${JSON.stringify(persona.personality)}`);
    }
    
    // Communication style
    if (persona.communication) {
      contentParts.push(`Communication: ${JSON.stringify(persona.communication)}`);
    }
    
    return contentParts.join('\n\n');
  }

  /**
   * Load existing vectorized personas from vector store
   */
  private async loadExistingVectors(): Promise<void> {
    try {
      // Search for existing persona vectors
      const existingVectors = await this.config.vectorStore.search([], {
        filter: { type: 'persona' },
        limit: 1000, // Assuming we won't have more than 1000 personas
      });
      
      // Update tracking map
      for (const vector of existingVectors) {
        if (vector.metadata?.personaId) {
          this.vectorizedPersonas.set(vector.metadata.personaId, vector.id);
        }
      }
      
      console.log(`📊 Loaded ${this.vectorizedPersonas.size} existing persona vectors`);
      
    } catch (error) {
      console.warn('Failed to load existing vectors:', error);
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    this.vectorizedPersonas.clear();
    console.log('🧹 Persona Vectorization Service cleaned up');
  }
} 