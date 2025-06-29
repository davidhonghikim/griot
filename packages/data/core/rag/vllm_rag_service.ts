/**
 * vLLM-RAG Integration Service
 * 
 * Integrates vLLM high-performance inference API with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';

export interface VLLMRAGConfig {
  vllmHost?: string;
  apiKey?: string;
  defaultModel?: string;
  enableStreaming?: boolean;
  maxTokens?: number;
  topP?: number;
  temperature?: number;
  similarityThreshold?: number;
}

export interface VLLMRAGRequest {
  query: string;
  model?: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  similarityThreshold?: number;
  maxResults?: number;
  includeMetadata?: boolean;
  stream?: boolean;
}

export interface VLLMRAGResponse {
  query: string;
  model: string;
  response: string;
  retrievedDocuments: Array<{
    id: string;
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>;
  context: string;
  metadata: {
    retrievalTime: number;
    generationTime: number;
    totalTokens: number;
    documentCount: number;
    modelUsed: string;
    apiEndpoint: string;
  };
}

export interface VLLMModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  permission: any[];
  root: string;
  parent: string;
}

function validateHost(host: string): { isValid: boolean; error?: string } {
  try {
    const url = new URL(host);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { isValid: false, error: 'Protocol must be http or https' };
    }
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

export class VLLMRAGService {
  private config: VLLMRAGConfig;
  private vllmHost: string;
  private apiKey: string;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;

  constructor(
    config: VLLMRAGConfig,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    this.config = {
      vllmHost: 'http://localhost:8000',
      defaultModel: 'llama2-7b',
      enableStreaming: false,
      maxTokens: 1000,
      topP: 0.9,
      temperature: 0.7,
      similarityThreshold: 0.7,
      ...config,
    };
    
    const hostValidation = validateHost(this.config.vllmHost || 'http://localhost:8000');
    if (!hostValidation.isValid) {
      throw new Error(`Invalid vLLM host: ${hostValidation.error}`);
    }
    
    this.vllmHost = this.config.vllmHost!;
    this.apiKey = this.config.apiKey || '';
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
  }

  async initialize(): Promise<void> {
    // Test connection to vLLM
    await this.checkVLLMHealth();
  }

  async query(request: VLLMRAGRequest): Promise<VLLMRAGResponse> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel!;
    
    try {
      // Retrieve relevant documents
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;

      // Build context from retrieved documents
      const context = this.buildContext(
        retrievedDocuments.map(doc => ({ content: doc.content, score: doc.score })),
        request.query
      );

      // Generate response using vLLM
      const generationStart = Date.now();
      const generationResult = await this.generateWithVLLM({
        model,
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          max_tokens: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          top_p: request.topP || this.config.topP,
        },
      });
      const generationTime = Date.now() - generationStart;

      return {
        query: request.query,
        model,
        response: generationResult.response,
        retrievedDocuments: request.includeMetadata ? retrievedDocuments : [],
        context,
        metadata: {
          retrievalTime,
          generationTime,
          totalTokens: generationResult.usage?.total_tokens || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model,
          apiEndpoint: this.vllmHost,
        },
      };
    } catch (error) {
      throw new Error(`vLLM RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async retrieveDocuments(request: VLLMRAGRequest): Promise<Array<{
    id: string;
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>> {
    const queryEmbedding = await this.embeddingService.embedText(request.query);
    
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      limit: request.maxResults || 5,
      
    });

    return searchResults.map(result => ({
      id: result.id,
      content: result.content,
      score: result.score,
      metadata: result.metadata,
    }));
  }

  private buildContext(documents: Array<{ content: string; score: number }>, query: string): string {
    if (documents.length === 0) {
      return 'No relevant documents found.';
    }

    const sortedDocuments = documents
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Use top 3 most relevant documents

    return sortedDocuments
      .map((doc, index) => `Document ${index + 1} (Relevance: ${doc.score.toFixed(3)}):\n${doc.content}`)
      .join('\n\n');
  }

  private buildPrompt(context: string, query: string): string {
    return `You are a helpful AI assistant with access to relevant information. Use the context below to answer the user's question accurately and comprehensively.

${context}

Based on the information above, please answer the following question:

Question: ${query}

Answer:`;
  }

  private async generateWithVLLM(params: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: {
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
    };
  }): Promise<{ response: string; usage?: { total_tokens: number } }> {
    const url = `${this.vllmHost}/v1/chat/completions`;
    
    const payload = {
      model: params.model,
      messages: [
        {
          role: 'user',
          content: params.prompt,
        },
      ],
      stream: params.stream || false,
      max_tokens: params.options?.max_tokens || this.config.maxTokens,
      temperature: params.options?.temperature || this.config.temperature,
      top_p: params.options?.top_p || this.config.topP,
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`vLLM API error: ${response.status} ${response.statusText}`);
    }
    
    if (params.stream) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader for streaming');
      }
      
      let responseText = '';
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                responseText += parsed.choices[0].delta.content;
              }
            } catch (error) {
              // Skip malformed JSON lines
            }
          }
        }
      }
      
      return {
        response: responseText,
        usage: { total_tokens: responseText.length }, // Approximate
      };
    } else {
      // Handle non-streaming response
      const data = await response.json() as any;
      
      return {
        response: data.choices?.[0]?.message?.content || '',
        usage: (data as any).usage || { total_tokens: 0 },
      };
    }
  }

  async checkVLLMHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.vllmHost}/v1/models`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('vLLM health check failed:', error);
      throw new Error(`vLLM service not available at ${this.vllmHost}`);
    }
  }

  async getAvailableModels(): Promise<VLLMModelInfo[]> {
    try {
      const response = await fetch(`${this.vllmHost}/v1/models`);
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json() as any;
      return (data as any).data || [];
    } catch (error) {
      console.error('Failed to get vLLM models:', error);
      return [];
    }
  }

  getConfig(): VLLMRAGConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<VLLMRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.vllmHost) {
      const hostValidation = validateHost(newConfig.vllmHost);
      if (!hostValidation.isValid) {
        throw new Error(`Invalid vLLM host: ${hostValidation.error}`);
      }
      this.vllmHost = newConfig.vllmHost;
    }
  }

  async getStats(): Promise<{
    availableModels: number;
    vectorStoreStatus: string;
    embeddingServiceStatus: string;
    apiEndpoint: string;
  }> {
    const models = await this.getAvailableModels();
    
    return {
      availableModels: models.length,
      vectorStoreStatus: 'connected', // TODO: Add actual health check
      embeddingServiceStatus: 'ready', // TODO: Add actual health check
      apiEndpoint: this.vllmHost,
    };
  }
} 