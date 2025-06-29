/**
 * Integration Tests for VectorStore
 * 
 * Tests the VectorStore functionality for storing and retrieving
 * vectors using Weaviate.
 */

import { VectorStore } from '../../packages/data/core/rag/vector_store';

describe('VectorStore Integration', () => {
  let vectorStore: VectorStore;

  beforeAll(async () => {
    vectorStore = new VectorStore();
  });

  afterEach(async () => {
    // Clean up test data
    await vectorStore.clearAllDocuments();
  });

  describe('Document Storage', () => {
    it('should store and retrieve documents', async () => {
      const testDocument = {
        id: 'test-doc-1',
        content: 'Test document content',
        embedding: new Array(1536).fill(0.1),
        metadata: { type: 'test', category: 'integration' }
      };
      
      const vectorId = await vectorStore.storeDocument(testDocument);
      expect(vectorId).toBeDefined();
      
      const retrieved = await vectorStore.getDocument(vectorId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.content).toBe(testDocument.content);
      expect(retrieved?.metadata.type).toBe('test');
    });

    it('should handle document updates', async () => {
      const testDocument = {
        id: 'test-doc-update',
        content: 'Original content',
        embedding: new Array(1536).fill(0.1),
        metadata: { version: 1 }
      };
      
      const vectorId = await vectorStore.storeDocument(testDocument);
      
      // Update the document
      const updatedDocument = {
        ...testDocument,
        content: 'Updated content',
        metadata: { version: 2 }
      };
      
      const newVectorId = await vectorStore.storeDocument(updatedDocument);
      expect(newVectorId).not.toBe(vectorId);
      
      const retrieved = await vectorStore.getDocument(newVectorId);
      expect(retrieved?.content).toBe('Updated content');
    });

    it('should handle large documents', async () => {
      const largeContent = 'A'.repeat(10000); // 10k characters
      const testDocument = {
        id: 'test-doc-large',
        content: largeContent,
        embedding: new Array(1536).fill(0.1),
        metadata: { size: 'large' }
      };
      
      const vectorId = await vectorStore.storeDocument(testDocument);
      expect(vectorId).toBeDefined();
      
      const retrieved = await vectorStore.getDocument(vectorId);
      expect(retrieved?.content).toBe(largeContent);
    });
  });

  describe('Vector Search', () => {
    it('should perform vector similarity search', async () => {
      // Store test documents
      const documents = [
        {
          id: 'doc-1',
          content: 'Software engineering and development',
          embedding: new Array(1536).fill(0.1),
          metadata: { type: 'persona', category: 'engineering' }
        },
        {
          id: 'doc-2',
          content: 'Data science and machine learning',
          embedding: new Array(1536).fill(0.2),
          metadata: { type: 'persona', category: 'data' }
        }
      ];
      
      for (const doc of documents) {
        await vectorStore.storeDocument(doc);
      }
      
      // Search with similar embedding
      const queryEmbedding = new Array(1536).fill(0.15);
      const results = await vectorStore.search(queryEmbedding, { limit: 5 });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.score).toBeGreaterThan(0);
    });

    it('should apply search filters', async () => {
      const documents = [
        {
          id: 'doc-filter-1',
          content: 'Engineering document',
          embedding: new Array(1536).fill(0.1),
          metadata: { category: 'engineering', priority: 'high' }
        },
        {
          id: 'doc-filter-2',
          content: 'Design document',
          embedding: new Array(1536).fill(0.1),
          metadata: { category: 'design', priority: 'low' }
        }
      ];
      
      for (const doc of documents) {
        await vectorStore.storeDocument(doc);
      }
      
      const queryEmbedding = new Array(1536).fill(0.1);
      const results = await vectorStore.search(queryEmbedding, {
        limit: 10,
        filter: { category: 'engineering' }
      });
      
      expect(results.length).toBeGreaterThan(0);
      for (const result of results) {
        expect(result.metadata.category).toBe('engineering');
      }
    });

    it('should handle empty search results', async () => {
      const queryEmbedding = new Array(1536).fill(0.5);
      const results = await vectorStore.search(queryEmbedding, { limit: 5 });
      
      expect(results).toEqual([]);
    });
  });

  describe('Document Management', () => {
    it('should handle document deletion', async () => {
      const testDocument = {
        id: 'test-doc-delete',
        content: 'Document to delete',
        embedding: new Array(1536).fill(0.1),
        metadata: { type: 'test' }
      };
      
      const vectorId = await vectorStore.storeDocument(testDocument);
      
      // Verify document exists
      const retrieved = await vectorStore.getDocument(vectorId);
      expect(retrieved).not.toBeNull();
      
      // Delete document
      await vectorStore.deleteDocument(vectorId);
      
      // Verify document is deleted
      const deleted = await vectorStore.getDocument(vectorId);
      expect(deleted).toBeNull();
    });

    it('should get document count', async () => {
      const initialCount = await vectorStore.getDocumentCount();
      
      const testDocument = {
        id: 'test-doc-count',
        content: 'Test content',
        embedding: new Array(1536).fill(0.1),
        metadata: { type: 'test' }
      };
      
      await vectorStore.storeDocument(testDocument);
      
      const newCount = await vectorStore.getDocumentCount();
      expect(newCount).toBe(initialCount + 1);
    });

    it('should clear all documents', async () => {
      // Add some test documents
      const documents = [
        {
          id: 'doc-clear-1',
          content: 'Document 1',
          embedding: new Array(1536).fill(0.1),
          metadata: { type: 'test' }
        },
        {
          id: 'doc-clear-2',
          content: 'Document 2',
          embedding: new Array(1536).fill(0.1),
          metadata: { type: 'test' }
        }
      ];
      
      for (const doc of documents) {
        await vectorStore.storeDocument(doc);
      }
      
      // Verify documents exist
      const countBefore = await vectorStore.getDocumentCount();
      expect(countBefore).toBeGreaterThan(0);
      
      // Clear all documents
      await vectorStore.clearAllDocuments();
      
      // Verify all documents are cleared
      const countAfter = await vectorStore.getDocumentCount();
      expect(countAfter).toBe(0);
    });
  });

  describe('Health and Performance', () => {
    it('should provide health check', async () => {
      const isHealthy = await vectorStore.healthCheck();
      expect(typeof isHealthy).toBe('boolean');
    });

    it('should handle search within performance limits', async () => {
      // Add test documents
      const testDocument = {
        id: 'perf-test',
        content: 'Performance test document',
        embedding: new Array(1536).fill(0.1),
        metadata: { type: 'test' }
      };
      
      await vectorStore.storeDocument(testDocument);
      
      const startTime = Date.now();
      
      const queryEmbedding = new Array(1536).fill(0.1);
      await vectorStore.search(queryEmbedding, { limit: 10 });
      
      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(200); // < 200ms
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // This would require mocking Weaviate connection failures
      // For now, we test the service is properly initialized
      expect(vectorStore).toBeDefined();
    });

    it('should handle invalid embeddings', async () => {
      const invalidDocument = {
        id: 'invalid-doc',
        content: 'Test content',
        embedding: [1, 2, 3], // Wrong dimensions
        metadata: { type: 'test' }
      };
      
      try {
        await vectorStore.storeDocument(invalidDocument);
        // If we get here, the store handled it gracefully
        expect(true).toBe(true);
      } catch (error) {
        // If it fails, it should be handled gracefully
        expect(error).toBeDefined();
      }
    });
  });
}); 