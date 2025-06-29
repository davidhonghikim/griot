/**
 * Knowledge Adapters Index
 * 
 * Exports all knowledge-related adapters with proper tagging and metadata
 * for easy discovery and integration.
 */

// Core interfaces and types
export * from './core/interfaces';

// Core utilities
export * from './core/text-chunker';
export * from './core/vector-utils';

// Services
export * from './services/embedding-service';

// Main adapters
export * from './memory-system';
export * from './rag-system';

// Adapter metadata and tags
export const KNOWLEDGE_ADAPTERS = {
  // Core components
  core: {
    interfaces: {
      file: './core/interfaces',
      description: 'Core interfaces for knowledge system',
      tags: ['interfaces', 'types', 'core'],
      dependencies: []
    },
    vectorUtils: {
      file: './core/vector-utils',
      description: 'Vector mathematical operations and utilities',
      tags: ['math', 'vectors', 'similarity', 'cosine'],
      dependencies: ['./core/interfaces']
    },
    textChunker: {
      file: './core/text-chunker',
      description: 'Text segmentation and chunking utilities',
      tags: ['text', 'chunking', 'segmentation', 'nlp'],
      dependencies: []
    }
  },

  // Services
  services: {
    embeddingService: {
      file: './services/embedding-service',
      description: 'Embedding generation and management service',
      tags: ['embeddings', 'vectors', 'ai', 'ml'],
      dependencies: ['./core/interfaces', './core/vector-utils', './core/text-chunker']
    }
  },

  // Main systems
  systems: {
    ragSystem: {
      file: './RAGSystem',
      description: 'Retrieval-Augmented Generation system for semantic search',
      tags: ['rag', 'search', 'retrieval', 'semantic', 'ai'],
      dependencies: ['./core/interfaces', './core/vector-utils', './services/embedding-service']
    },
    memorySystem: {
      file: './MemorySystem',
      description: 'Contextual memory storage and retrieval system',
      tags: ['memory', 'storage', 'context', 'indexing'],
      dependencies: ['./core/interfaces']
    }
  }
} as const;

// Quick access functions
export const getAdapter = (name: string) => {
  const flatAdapters = Object.values(KNOWLEDGE_ADAPTERS).flatMap(category => 
    Object.entries(category).map(([key, value]) => ({ key, ...value }))
  );
  return flatAdapters.find(adapter => adapter.key === name);
};

export const getAdaptersByTag = (tag: string) => {
  const flatAdapters = Object.values(KNOWLEDGE_ADAPTERS).flatMap(category => 
    Object.entries(category).map(([key, value]) => ({ key, ...value }))
  );
  return flatAdapters.filter(adapter => adapter.tags.includes(tag));
};

export const getAllTags = () => {
  const flatAdapters = Object.values(KNOWLEDGE_ADAPTERS).flatMap(category => 
    Object.entries(category).map(([key, value]) => ({ key, ...value }))
  );
  const allTags = flatAdapters.flatMap(adapter => adapter.tags);
  return [...new Set(allTags)];
};

// Usage examples
export const USAGE_EXAMPLES = {
  ragSystem: `
// Initialize RAG system
const ragSystem = new RAGSystem({
  vectorDimensions: 384,
  chunkSize: 512,
  overlapSize: 50,
  preserveSentences: true,
  maxResults: 10,
  defaultThreshold: 0.7,
  nodeClass: 'Griot',
  culturalContext: 'West African',
  enableCaching: true,
  cacheTTL: 300000 // 5 minutes
});

// Index a document
await ragSystem.indexDocument('doc1', 'Document content...', {
  contentType: 'text',
  source: 'user_input',
  tags: ['knowledge', 'reference']
});

// Search for relevant content
const results = await ragSystem.search({
  query: 'What is the meaning of life?',
  limit: 5,
  threshold: 0.8
});
  `,
  
  memorySystem: `
// Initialize memory system
const memorySystem = new MemorySystem({
  maxResults: 20,
  nodeClass: 'Griot',
  culturalContext: 'West African',
  enableCompression: false,
  enableEncryption: false,
  maxMemorySize: 100
});

// Store a memory
const memoryId = await memorySystem.storeMemory(
  'User asked about traditional storytelling',
  {
    type: 'interaction',
    priority: 'high',
    tags: ['storytelling', 'user_interaction'],
    importance: 0.8
  }
);

// Retrieve memories by tags
const memories = await memorySystem.retrieveMemories({
  tags: ['storytelling'],
  limit: 10,
  sortBy: 'importance'
});
  `
} as const; 