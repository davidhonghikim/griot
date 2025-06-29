import OpenAI from 'openai';

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
  truncate?: 'NONE' | 'START' | 'END';
}

export interface BatchEmbeddingOptions extends EmbeddingOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
}

export class EmbeddingService {
  private openai: OpenAI | null = null;
  private defaultModel: string;
  private defaultDimensions: number;

  constructor(apiKey?: string) {
    const resolvedApiKey = apiKey || process.env.OPENAI_API_KEY;
    if (!resolvedApiKey) {
      console.warn("⚠️ OPENAI_API_KEY not provided - embedding features will be disabled");
      // Do not throw or exit
    } else {
      this.openai = new OpenAI({ apiKey: resolvedApiKey, dangerouslyAllowBrowser: true });
    }
    this.defaultModel = 'text-embedding-3-small';
    this.defaultDimensions = 1536; // text-embedding-3-small dimensions
  }

  async embedText(text: string, options: EmbeddingOptions = {}): Promise<number[]> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - using mock embedding");
      return Array(this.defaultDimensions).fill(0);
    }
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }
      const model = options.model || this.defaultModel;
      const dimensions = options.dimensions || this.defaultDimensions;
      const response = await this.openai.embeddings.create({
        model,
        input: text,
        dimensions,
        encoding_format: 'float',
      });
      const embedding = response.data[0]?.embedding;
      return embedding || Array(dimensions).fill(0);
    } catch (error) {
      console.error('❌ Failed to generate embedding:', error);
      return Array(this.defaultDimensions).fill(0);
    }
  }

  async embedBatch(texts: string[], options: BatchEmbeddingOptions = {}): Promise<number[][]> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - using mock batch embeddings");
      return texts.map(() => Array(this.defaultDimensions).fill(0));
    }
    try {
      if (!texts || texts.length === 0) {
        throw new Error('Texts array cannot be empty');
      }
      const batchSize = options.batchSize || 100;
      const model = options.model || this.defaultModel;
      const dimensions = options.dimensions || this.defaultDimensions;
      const allEmbeddings: number[][] = [];
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const response = await this.openai.embeddings.create({
          model,
          input: batch,
          dimensions,
          encoding_format: 'float',
        });
        const batchEmbeddings = response.data.map((item: any) => item.embedding || Array(dimensions).fill(0));
        allEmbeddings.push(...batchEmbeddings);
      }
      return allEmbeddings;
    } catch (error) {
      console.error('❌ Failed to generate batch embeddings:', error);
      return texts.map(() => Array(this.defaultDimensions).fill(0));
    }
  }

  async embedTextsWithMetadata(
    texts: Array<{ text: string; metadata?: Record<string, any> }>,
    options: BatchEmbeddingOptions = {}
  ): Promise<Array<{ embedding: number[]; metadata?: Record<string, any> }>> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - using mock embeddings with metadata");
      return texts.map(t => ({ embedding: Array(this.defaultDimensions).fill(0), metadata: t.metadata || {} }));
    }
    try {
      const textStrings = texts.map(item => item.text);
      const embeddings = await this.embedBatch(textStrings, options);
      return embeddings.map((embedding, index) => ({
        embedding,
        metadata: texts[index]?.metadata || {},
      }));
    } catch (error) {
      console.error('❌ Failed to generate embeddings with metadata:', error);
      return texts.map(t => ({ embedding: Array(this.defaultDimensions).fill(0), metadata: t.metadata || {} }));
    }
  }

  async getEmbeddingDimensions(model?: string): Promise<number> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - returning default dimensions");
      return this.defaultDimensions;
    }
    try {
      const modelName = model || this.defaultModel;
      switch (modelName) {
        case 'text-embedding-3-small':
          return 1536;
        case 'text-embedding-3-large':
          return 3072;
        case 'text-embedding-ada-002':
          return 1536;
        default:
          const response = await this.openai.models.retrieve(modelName);
          return this.defaultDimensions;
      }
    } catch (error) {
      console.error('❌ Failed to get embedding dimensions:', error);
      return this.defaultDimensions;
    }
  }

  async validateEmbedding(embedding: number[]): Promise<boolean> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - cannot validate embedding");
      return false;
    }
    try {
      if (!Array.isArray(embedding)) return false;
      if (embedding.length === 0) return false;
      for (const value of embedding) {
        if (typeof value !== 'number' || isNaN(value)) return false;
      }
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      if (magnitude === 0) return false;
      return true;
    } catch (error) {
      console.error('❌ Failed to validate embedding:', error);
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.openai) {
      console.warn("⚠️ EmbeddingService not initialized - health check failed");
      return false;
    }
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error('❌ EmbeddingService health check failed:', error);
      return false;
    }
  }

  getModelInfo(): { model: string; dimensions: number } {
    return {
      model: this.defaultModel,
      dimensions: this.defaultDimensions,
    };
  }
} 
