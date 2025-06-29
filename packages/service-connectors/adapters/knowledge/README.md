# Knowledge Adapters

**Category**: Knowledge Management & AI  
**Tags**: `rag`, `memory`, `embeddings`, `search`, `ai`, `nlp`, `vectors`

A comprehensive suite of modular knowledge management adapters for the kOS project. These adapters provide RAG (Retrieval-Augmented Generation), memory systems, and vector operations that can be used by any node class.

## Architecture

The knowledge adapters follow a modular, layered architecture:

```
knowledge/
├── core/                    # Core interfaces and utilities
│   ├── interfaces.ts       # Type definitions and contracts
│   ├── vector-utils.ts     # Vector mathematical operations
│   └── text-chunker.ts     # Text segmentation utilities
├── services/               # Service layer
│   └── embedding-service.ts # Embedding generation and management
├── RAGSystem.ts           # Main RAG system
├── MemorySystem.ts        # Main memory system
├── index.ts              # Exports and metadata
└── README.md             # This file
```

## Components

### Core Layer

#### `interfaces.ts` (150 lines)
- **Purpose**: Core type definitions and contracts
- **Tags**: `interfaces`, `types`, `core`
- **Dependencies**: None
- **Key Features**:
  - Vector and embedding interfaces
  - Search query and response types
  - Memory entry and metadata types
  - System metrics interfaces

#### `vector-utils.ts` (200 lines)
- **Purpose**: Vector mathematical operations
- **Tags**: `math`, `vectors`, `similarity`, `cosine`
- **Dependencies**: `./core/interfaces`
- **Key Features**:
  - Cosine similarity calculation
  - Vector normalization
  - Euclidean distance
  - Vector arithmetic operations

#### `text-chunker.ts` (250 lines)
- **Purpose**: Text segmentation and chunking
- **Tags**: `text`, `chunking`, `segmentation`, `nlp`
- **Dependencies**: None
- **Key Features**:
  - Paragraph-aware chunking
  - Sentence preservation
  - Overlap management
  - Metadata tracking

### Service Layer

#### `embedding-service.ts` (200 lines)
- **Purpose**: Embedding generation and management
- **Tags**: `embeddings`, `vectors`, `ai`, `ml`
- **Dependencies**: Core layer components
- **Key Features**:
  - Provider-based embedding generation
  - Embedding storage and retrieval
  - Similarity search
  - Document management

### System Layer

#### `RAGSystem.ts` (250 lines)
- **Purpose**: Retrieval-Augmented Generation system
- **Tags**: `rag`, `search`, `retrieval`, `semantic`, `ai`
- **Dependencies**: Core and service layers
- **Key Features**:
  - Document indexing
  - Semantic search
  - Caching with TTL
  - Filtering and ranking
  - Metrics tracking

#### `MemorySystem.ts` (250 lines)
- **Purpose**: Contextual memory storage and retrieval
- **Tags**: `memory`, `storage`, `context`, `indexing`
- **Dependencies**: Core layer
- **Key Features**:
  - Memory storage with metadata
  - Tag-based indexing
  - Temporal indexing
  - Association-based retrieval
  - Sorting and filtering

## Usage

### Quick Start

```typescript
import { RAGSystem, MemorySystem, getAdaptersByTag } from './knowledge';

// Get all AI-related adapters
const aiAdapters = getAdaptersByTag('ai');

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
  cacheTTL: 300000
});

// Initialize memory system
const memorySystem = new MemorySystem({
  maxResults: 20,
  nodeClass: 'Griot',
  culturalContext: 'West African',
  enableCompression: false,
  enableEncryption: false,
  maxMemorySize: 100
});
```

### RAG System Example

```typescript
// Set embedding provider (you need to implement this)
ragSystem.setEmbeddingProvider({
  generateEmbedding: async (text: string) => {
    // Your embedding generation logic here
    return new Array(384).fill(0).map(() => Math.random() * 2 - 1);
  }
});

// Index a document
await ragSystem.indexDocument('doc1', 'Your document content...', {
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

console.log(`Found ${results.totalCount} relevant results`);
```

### Memory System Example

```typescript
// Store a memory
const memoryId = await memorySystem.storeMemory(
  'User asked about traditional storytelling',
  {
    type: 'interaction',
    priority: 'high',
    tags: ['storytelling', 'user_interaction'],
    importance: 0.8,
    associations: ['culture', 'tradition']
  }
);

// Retrieve memories by tags
const memories = await memorySystem.retrieveMemories({
  tags: ['storytelling'],
  limit: 10,
  sortBy: 'importance'
});

// Retrieve memories by temporal range
const recentMemories = await memorySystem.retrieveMemories({
  temporalRange: {
    start: '2025-06-01',
    end: '2025-06-29'
  },
  sortBy: 'recent'
});
```

## Tagging System

The knowledge adapters use a comprehensive tagging system for easy discovery:

### Available Tags
- `ai` - Artificial intelligence components
- `core` - Core system components
- `embeddings` - Vector embedding systems
- `interfaces` - Type definitions
- `math` - Mathematical operations
- `memory` - Memory management
- `nlp` - Natural language processing
- `rag` - Retrieval-augmented generation
- `retrieval` - Information retrieval
- `search` - Search functionality
- `segmentation` - Text segmentation
- `semantic` - Semantic analysis
- `similarity` - Similarity calculations
- `storage` - Data storage
- `text` - Text processing
- `types` - Type definitions
- `vectors` - Vector operations

### Finding Adapters

```typescript
import { getAdaptersByTag, getAllTags } from './knowledge';

// Get all available tags
const allTags = getAllTags();

// Find all AI-related adapters
const aiAdapters = getAdaptersByTag('ai');

// Find all vector-related adapters
const vectorAdapters = getAdaptersByTag('vectors');
```

## Integration with Node Classes

These adapters are designed to be used by any node class in the kOS system:

```typescript
// Example: Griot node using knowledge adapters
class GriotNode {
  private ragSystem: RAGSystem;
  private memorySystem: MemorySystem;

  constructor() {
    this.ragSystem = new RAGSystem({
      // ... configuration
      nodeClass: 'Griot',
      culturalContext: 'West African'
    });

    this.memorySystem = new MemorySystem({
      // ... configuration
      nodeClass: 'Griot',
      culturalContext: 'West African'
    });
  }

  async processQuery(query: string) {
    // Search for relevant knowledge
    const searchResults = await this.ragSystem.search({
      query,
      limit: 5
    });

    // Store interaction in memory
    await this.memorySystem.storeMemory(query, {
      type: 'interaction',
      tags: ['user_query', 'griot_response']
    });

    return searchResults;
  }
}
```

## Performance Considerations

- **Vector Operations**: Optimized for cosine similarity calculations
- **Caching**: RAG system includes configurable caching with TTL
- **Indexing**: Memory system uses efficient tag and temporal indexing
- **Chunking**: Text chunker preserves semantic boundaries
- **Memory Management**: Configurable memory limits and cleanup

## Extensibility

The modular design allows for easy extension:

1. **Custom Embedding Providers**: Implement the `EmbeddingProvider` interface
2. **Custom Chunking Strategies**: Extend the `TextChunker` class
3. **Custom Vector Operations**: Add methods to `VectorUtils`
4. **Custom Memory Types**: Extend the memory metadata interfaces

## Quality Standards

- **Modular Design**: Each component is focused and under 250 lines
- **Type Safety**: Full TypeScript support with strict typing
- **Error Handling**: Comprehensive error handling and validation
- **Documentation**: Inline documentation for all public APIs
- **Testing Ready**: Designed for easy unit testing 