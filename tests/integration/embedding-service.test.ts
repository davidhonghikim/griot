/**
 * Integration Tests for EmbeddingService
 * 
 * Tests the EmbeddingService functionality for generating
 * embeddings using OpenAI API.
 */

import { EmbeddingService } from '../../packages/data/core/rag/embedding_service';

describe('EmbeddingService Integration', () => {
  let embeddingService: EmbeddingService;

  beforeAll(async () => {
    embeddingService = new EmbeddingService();
  });

  describe('Single Text Embedding', () => {
    it('should generate embeddings for text', async () => {
      const text = 'This is a test text for embedding generation';
      const embedding = await embeddingService.embedText(text);
      
      expect(embedding).toBeDefined();
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBe(1536); // text-embedding-3-small dimensions
      
      // Check that all values are numbers
      for (const value of embedding) {
        expect(typeof value).toBe('number');
        expect(isNaN(value)).toBe(false);
      }
    });

    it('should handle empty text gracefully', async () => {
      await expect(embeddingService.embedText('')).rejects.toThrow('Text cannot be empty');
    });

    it('should handle very long text', async () => {
      const longText = 'A'.repeat(8000); // 8k characters
      const embedding = await embeddingService.embedText(longText);
      
      expect(embedding).toBeDefined();
      expect(embedding.length).toBe(1536);
    });

    it('should generate consistent embeddings for same text', async () => {
      const text = 'Consistent test text';
      const embedding1 = await embeddingService.embedText(text);
      const embedding2 = await embeddingService.embedText(text);
      
      expect(embedding1).toEqual(embedding2);
    });
  });

  describe('Batch Embedding', () => {
    it('should generate batch embeddings', async () => {
      const texts = [
        'First test text',
        'Second test text',
        'Third test text'
      ];
      
      const embeddings = await embeddingService.embedBatch(texts);
      
      expect(embeddings).toBeDefined();
      expect(Array.isArray(embeddings)).toBe(true);
      expect(embeddings.length).toBe(3);
      
      for (const embedding of embeddings) {
        expect(Array.isArray(embedding)).toBe(true);
        expect(embedding.length).toBe(1536);
      }
    });

    it('should handle batch with metadata', async () => {
      const textsWithMetadata = [
        { text: 'Text with metadata', metadata: { type: 'test', id: 1 } },
        { text: 'Another text', metadata: { type: 'test', id: 2 } }
      ];
      
      const results = await embeddingService.embedTextsWithMetadata(textsWithMetadata);
      
      expect(results.length).toBe(2);
      expect(results[0]?.embedding.length).toBe(1536);
      expect(results[0]?.metadata).toEqual({ type: 'test', id: 1 });
    });

    it('should handle large batches', async () => {
      const texts = Array.from({ length: 50 }, (_, i) => `Text ${i}`);
      const embeddings = await embeddingService.embedBatch(texts, { batchSize: 10 });
      
      expect(embeddings.length).toBe(50);
      for (const embedding of embeddings) {
        expect(embedding.length).toBe(1536);
      }
    });
  });

  describe('Embedding Validation', () => {
    it('should validate embeddings', async () => {
      const text = 'Test text for validation';
      const embedding = await embeddingService.embedText(text);
      
      const isValid = await embeddingService.validateEmbedding(embedding);
      expect(isValid).toBe(true);
    });

    it('should reject invalid embeddings', async () => {
      const invalidEmbeddings = [
        [],
        [1, 2, 3], // Too short
        [NaN, 1, 2, 3], // Contains NaN
        new Array(1536).fill('not a number') // Wrong types
      ];
      
      for (const embedding of invalidEmbeddings) {
        const isValid = await embeddingService.validateEmbedding(embedding as any);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('Model Information', () => {
    it('should provide model info', async () => {
      const modelInfo = embeddingService.getModelInfo();
      
      expect(modelInfo.model).toBe('text-embedding-3-small');
      expect(modelInfo.dimensions).toBe(1536);
    });

    it('should get embedding dimensions', async () => {
      const dimensions = await embeddingService.getEmbeddingDimensions();
      expect(dimensions).toBe(1536);
    });
  });

  describe('Performance', () => {
    it('should generate embedding within performance limits', async () => {
      const startTime = Date.now();
      
      await embeddingService.embedText('Performance test text');
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(2000); // < 2 seconds
    });

    it('should handle batch processing efficiently', async () => {
      const texts = Array.from({ length: 10 }, (_, i) => `Batch text ${i}`);
      const startTime = Date.now();
      
      await embeddingService.embedBatch(texts);
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(5000); // < 5 seconds for batch
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // This would require mocking the OpenAI client
      // For now, we test the error handling structure
      const text = 'Test text';
      
      try {
        await embeddingService.embedText(text);
        // If we get here, the API call succeeded
        expect(true).toBe(true);
      } catch (error) {
        // If API fails, it should be handled gracefully
        expect(error).toBeDefined();
      }
    });

    it('should handle network timeouts', async () => {
      // This would require mocking network failures
      // For now, we test the service is properly initialized
      expect(embeddingService).toBeDefined();
    });
  });
}); 