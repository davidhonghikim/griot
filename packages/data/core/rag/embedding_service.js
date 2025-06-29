import OpenAI from 'openai';
export class EmbeddingService {
    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        this.openai = new OpenAI({
            apiKey,
        });
        this.defaultModel = 'text-embedding-3-small';
        this.defaultDimensions = 1536;
    }
    async embedText(text, options = {}) {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Text cannot be empty');
            }
            console.log(`🧠 Generating embedding for text (${text.length} chars)`);
            const model = options.model || this.defaultModel;
            const dimensions = options.dimensions || this.defaultDimensions;
            const truncate = options.truncate || 'NONE';
            const response = await this.openai.embeddings.create({
                model,
                input: text,
                dimensions,
                encoding_format: 'float',
            });
            const embedding = response.data[0]?.embedding;
            console.log(`✅ Generated embedding (${embedding?.length || 0} dimensions)`);
            return embedding || [];
        }
        catch (error) {
            console.error('❌ Failed to generate embedding:', error);
            throw error;
        }
    }
    async embedBatch(texts, options = {}) {
        try {
            if (!texts || texts.length === 0) {
                throw new Error('Texts array cannot be empty');
            }
            console.log(`🧠 Generating batch embeddings for ${texts.length} texts`);
            const batchSize = options.batchSize || 100;
            const delayBetweenBatches = options.delayBetweenBatches || 1000;
            const model = options.model || this.defaultModel;
            const dimensions = options.dimensions || this.defaultDimensions;
            const truncate = options.truncate || 'NONE';
            const allEmbeddings = [];
            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize);
                console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
                const response = await this.openai.embeddings.create({
                    model,
                    input: batch,
                    dimensions,
                    encoding_format: 'float',
                });
                const batchEmbeddings = response.data.map((item) => item.embedding);
                allEmbeddings.push(...batchEmbeddings);
                if (i + batchSize < texts.length) {
                    console.log(`⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
            }
            console.log(`✅ Generated ${allEmbeddings.length} embeddings`);
            return allEmbeddings;
        }
        catch (error) {
            console.error('❌ Failed to generate batch embeddings:', error);
            throw error;
        }
    }
    async embedTextsWithMetadata(texts, options = {}) {
        try {
            console.log(`🧠 Generating embeddings with metadata for ${texts.length} texts`);
            const textStrings = texts.map(item => item.text);
            const embeddings = await this.embedBatch(textStrings, options);
            const results = embeddings.map((embedding, index) => ({
                embedding,
                metadata: texts[index]?.metadata,
            }));
            console.log(`✅ Generated ${results.length} embeddings with metadata`);
            return results;
        }
        catch (error) {
            console.error('❌ Failed to generate embeddings with metadata:', error);
            throw error;
        }
    }
    async getEmbeddingDimensions(model) {
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
        }
        catch (error) {
            console.error('❌ Failed to get embedding dimensions:', error);
            return this.defaultDimensions;
        }
    }
    async validateEmbedding(embedding) {
        try {
            if (!Array.isArray(embedding)) {
                return false;
            }
            if (embedding.length === 0) {
                return false;
            }
            for (const value of embedding) {
                if (typeof value !== 'number' || isNaN(value)) {
                    return false;
                }
            }
            const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
            if (magnitude === 0) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('❌ Failed to validate embedding:', error);
            return false;
        }
    }
    async healthCheck() {
        try {
            await this.openai.models.list();
            return true;
        }
        catch (error) {
            console.error('❌ EmbeddingService health check failed:', error);
            return false;
        }
    }
    getModelInfo() {
        return {
            model: this.defaultModel,
            dimensions: this.defaultDimensions,
        };
    }
}
//# sourceMappingURL=embedding_service.js.map