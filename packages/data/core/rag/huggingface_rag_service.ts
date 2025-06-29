/*
 * Hugging Face-RAG Integration Service
 * 
 * Integrates Hugging Face Inference API with the existing RAG system for
 * enhanced retrieval-augmented generation capabilities.
 */

import { PersonaLoader } from '../persona_loader';
import { VectorStore } from './vector_store';
import { EmbeddingService } from './embedding_service';

export interface HuggingFaceRAGConfig {
  huggingfaceHost?: string;
  apiKey?: string;
  defaultModel?: string;
  enableStreaming?: boolean;
  maxTokens?: number;
  topP?: number;
  repetitionPenalty?: number;
  do_sample?: boolean;
  similarityThreshold?: number;
}

export interface HuggingFaceRAGRequest {
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
  repetitionPenalty?: number;
  do_sample?: boolean;
}

export interface HuggingFaceRAGResponse {
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

export interface HuggingFaceModelInfo {
  id: string;
  name: string;
  description: string;
  tags: string[];
  task: string;
  downloads: number;
  likes: number;
  author: string;
}

export class HuggingFaceRAGService {
  private config: HuggingFaceRAGConfig;
  private huggingfaceHost: string;
  private apiKey: string;
  private personaLoader: PersonaLoader;
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;

  constructor(
    config: HuggingFaceRAGConfig,
    personaLoader: PersonaLoader,
    vectorStore: VectorStore,
    embeddingService: EmbeddingService
  ) {
    this.config = {
      ...config,
    };
    this.personaLoader = personaLoader;
    this.vectorStore = vectorStore;
    this.embeddingService = embeddingService;
    this.huggingfaceHost = this.config.huggingfaceHost || "";
    this.apiKey = this.config.apiKey || "";
  }

  async initialize(): Promise<void> {
    await this.checkHuggingFaceHealth();
    const models = await this.getAvailableModels();
    if (!models.find((m: HuggingFaceModelInfo) => m.id === this.config.defaultModel)) {
      this.config.defaultModel = models[0]?.id || 'microsoft/DialoGPT-medium';
    }
  }

  async query(request: HuggingFaceRAGRequest): Promise<HuggingFaceRAGResponse> {
    const startTime = Date.now();
    const model = request.model || this.config.defaultModel;
    try {
      const retrievalStart = Date.now();
      const retrievedDocuments = await this.retrieveDocuments(request);
      const retrievalTime = Date.now() - retrievalStart;
      const context = this.buildContext(retrievedDocuments, request.query);
      const generationStart = Date.now();
      const huggingfaceResponse = await this.generateWithHuggingFace({
        model: model || "",
        prompt: this.buildPrompt(context, request.query),
        stream: request.stream || this.config.enableStreaming,
        options: {
          max_new_tokens: request.maxTokens || this.config.maxTokens,
          top_p: request.topP || this.config.topP,
          repetition_penalty: request.repetitionPenalty || this.config.repetitionPenalty,
          do_sample: request.do_sample !== undefined ? request.do_sample : this.config.do_sample,
        }
      });
      const generationTime = Date.now() - generationStart;
      return {
        query: request.query,
        model: model || "",
        response: huggingfaceResponse.response,
        retrievedDocuments: request.includeMetadata ? retrievedDocuments : 
          retrievedDocuments.map(doc => ({ 
            id: doc.id, 
            content: doc.content, 
            score: doc.score 
          })),
        context,
        metadata: {
          retrievalTime,
          generationTime,
          totalTokens: huggingfaceResponse.usage?.total_tokens || 0,
          documentCount: retrievedDocuments.length,
          modelUsed: model || "",
          apiEndpoint: this.huggingfaceHost,
        },
      };
    } catch (error) {
      throw new Error(`Hugging Face-RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async retrieveDocuments(request: HuggingFaceRAGRequest): Promise<Array<{
    id: string;
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>> {
    const queryEmbedding = await this.embeddingService.embedText(request.query);
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      limit: request.maxResults || 10,
    });
    return searchResults.map(result => ({
      id: result.id,
      content: result.content,
      score: result.score,
      metadata: result.metadata,
    }));
  }

  private buildContext(documents: Array<{ id: string; content: string; score: number; metadata?: Record<string, any> }>, query: string): string {
    const contextParts = documents.map(doc => doc.content);
    return `Context: ${contextParts.join('\n\n')}\n\nQuery: ${query}`;
  }

  private buildPrompt(context: string, query: string): string {
    return `Based on the following context, please answer the query:\n\n${context}\n\nAnswer:`;
  }

  private async generateWithHuggingFace(request: {
    model: string;
    prompt: string;
    stream?: boolean;
    options?: Record<string, any>;
  }): Promise<{ response: string; usage?: { total_tokens: number } }> {
    const response = await fetch(`${this.huggingfaceHost}/models/${request.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        ...request.options,
      }),
    });
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as any;
    let responseText = '';
    if (Array.isArray(data)) {
      responseText = data[0]?.generated_text || '';
    } else if (typeof data === 'string') {
      responseText = data;
    } else {
      responseText = data.generated_text || data.text || '';
    }
    return {
      response: responseText,
      usage: { total_tokens: responseText.length },
    };
  }

  async checkHuggingFaceHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.huggingfaceHost}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return true;
    } catch (error) {
      throw new Error(`Hugging Face service not available at ${this.huggingfaceHost}`);
    }
  }

  async getAvailableModels(): Promise<HuggingFaceModelInfo[]> {
    try {
      const response = await fetch(`${this.huggingfaceHost}/api/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      const data = await response.json() as any;
      return data || [];
    } catch (error) {
      return [];
    }
  }

  async searchModels(query: string, task?: string): Promise<HuggingFaceModelInfo[]> {
    try {
      const params = new URLSearchParams({
        search: query,
        ...(task && { filter: task }),
      });
      const response = await fetch(`${this.huggingfaceHost}/api/models?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to search models: ${response.status}`);
      }
      const data = await response.json() as any;
      return data || [];
    } catch (error) {
      return [];
    }
  }

  async getModelInfo(modelId: string): Promise<HuggingFaceModelInfo | null> {
    try {
      const response = await fetch(`${this.huggingfaceHost}/api/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to get model info: ${response.status}`);
      }
      const data = await response.json() as any;
      return data;
    } catch (error) {
      return null;
    }
  }

  getConfig(): HuggingFaceRAGConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<HuggingFaceRAGConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.apiKey = this.config.apiKey || "";
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
      vectorStoreStatus: 'connected',
      embeddingServiceStatus: 'ready',
      apiEndpoint: this.huggingfaceHost,
    };
  }
}
