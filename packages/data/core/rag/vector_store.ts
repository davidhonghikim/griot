import weaviate, { WeaviateClient, ObjectsBatcher } from 'weaviate-ts-client';

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface SearchOptions {
  limit?: number;
  filter?: Record<string, any>;
  nearVector?: number[];
}

export interface SearchResult {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  score: number;
}

export class VectorStore {
  private client: WeaviateClient;
  private className: string;
  private isInitialized: boolean = false;

  constructor() {
    const host = process.env.WEAVIATE_HOST || 'localhost:8080';
    const scheme = process.env.WEAVIATE_SCHEME || 'http';
    
    this.client = weaviate.client({
      scheme,
      host,
    });
    this.className = 'PersonaDocument';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      console.log('🔄 Initializing VectorStore...');
      
      // Check if class exists, create if not
      await this.ensureClassExists();
      
      this.isInitialized = true;
      console.log('✅ VectorStore initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize VectorStore:', error);
      throw error;
    }
  }

  async storeDocument(document: VectorDocument): Promise<string> {
    try {
      await this.initialize();
      
      console.log(`💾 Storing document: ${document.id}`);
      
      const result = await this.client.data.creator()
        .withClassName(this.className)
        .withProperties({
          content: document.content,
          metadata: document.metadata,
          documentId: document.id,
        })
        .withVector(document.embedding)
        .do();

      console.log(`✅ Stored document: ${document.id} -> ${result.id}`);
      return result.id || '';
      
    } catch (error) {
      console.error(`❌ Failed to store document ${document.id}:`, error);
      throw error;
    }
  }

  async getDocument(id: string): Promise<VectorDocument | null> {
    try {
      await this.initialize();
      
      console.log(`📖 Getting document: ${id}`);
      
      const result = await this.client.data.getterById()
        .withClassName(this.className)
        .withId(id)
        .do();

      if (!result) {
        console.warn(`⚠️ Document not found: ${id}`);
        return null;
      }

      const document: VectorDocument = {
        id: (result.properties?.documentId as string) || result.id || '',
        content: (result.properties?.content as string) || '',
        embedding: (result.vector as number[]) || [],
        metadata: (result.properties?.metadata as Record<string, any>) || {},
      };

      console.log(`✅ Retrieved document: ${id}`);
      return document;
      
    } catch (error) {
      console.error(`❌ Failed to get document ${id}:`, error);
      return null;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.initialize();
      
      console.log(`🗑️ Deleting document: ${id}`);
      
      await this.client.data.deleter()
        .withClassName(this.className)
        .withId(id)
        .do();

      console.log(`✅ Deleted document: ${id}`);
      
    } catch (error) {
      console.error(`❌ Failed to delete document ${id}:`, error);
      throw error;
    }
  }

  async search(embedding: number[], options: SearchOptions = {}): Promise<SearchResult[]> {
    try {
      await this.initialize();
      
      console.log(`🔍 Searching with embedding length: ${embedding.length}`);
      
      const searchQuery = this.client.graphql
        .get()
        .withClassName(this.className)
        .withNearVector({ vector: embedding })
        .withLimit(options.limit || 10);

      // Add filters if provided
      if (options.filter) {
        for (const [key, value] of Object.entries(options.filter)) {
          searchQuery.withWhere({
            path: [key],
            operator: 'Equal',
            valueString: value,
          });
        }
      }

      const result = await searchQuery.do();

      if (!result.data.Get[this.className]) {
        console.warn('⚠️ No search results found');
        return [];
      }

      const results: SearchResult[] = result.data.Get[this.className].map((item: any) => ({
        id: item._additional.id,
        content: item.content,
        embedding: item._additional.vector,
        metadata: item.metadata,
        score: 1 - item._additional.distance,
      }));

      console.log(`✅ Found ${results.length} search results`);
      return results;
      
    } catch (error) {
      console.error('❌ Failed to search documents:', error);
      return [];
    }
  }

  async getDocumentCount(): Promise<number> {
    try {
      await this.initialize();
      
      const result = await this.client.graphql
        .aggregate()
        .withClassName(this.className)
        .withFields('meta { count }')
        .do();

      const count = result.data.Aggregate[this.className][0]?.meta?.count || 0;
      console.log(`📊 Document count: ${count}`);
      return count;
      
    } catch (error) {
      console.error('❌ Failed to get document count:', error);
      return 0;
    }
  }

  async clearAllDocuments(): Promise<void> {
    try {
      await this.initialize();
      
      console.log('🗑️ Clearing all documents...');
      
      // Delete the class and recreate it
      await this.client.schema.classDeleter()
        .withClassName(this.className)
        .do();
      
      await this.ensureClassExists();
      
      console.log('✅ Cleared all documents');
      
    } catch (error) {
      console.error('❌ Failed to clear documents:', error);
      throw error;
    }
  }

  private async ensureClassExists(): Promise<void> {
    try {
      // Check if class exists
      const schema = await this.client.schema.getter().do();
      const classExists = schema.classes?.some((cls: any) => cls.class === this.className);
      
      if (!classExists) {
        console.log(`📝 Creating class: ${this.className}`);
        
        await this.client.schema.classCreator()
          .withClass({
            class: this.className,
            vectorizer: 'none', // We'll provide vectors manually
            properties: [
              {
                name: 'content',
                dataType: ['text'],
                description: 'Document content',
              },
              {
                name: 'documentId',
                dataType: ['string'],
                description: 'Original document ID',
              },
            ],
          })
          .do();
        
        console.log(`✅ Created class: ${this.className}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to ensure class exists:`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.misc.metaGetter().do();
      return true;
    } catch (error) {
      console.error('❌ VectorStore health check failed:', error);
      return false;
    }
  }
} 