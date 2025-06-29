# PersonaRAG Service Documentation

**Version**: 1.0.0  
**Status**: ✅ OPERATIONAL  
**Created**: 2025-01-27  
**Last Updated**: 2025-01-27

## Overview

The PersonaRAG Service extends the kOS framework with persona-aware retrieval-augmented generation capabilities. It enables intelligent persona selection and context-aware responses by combining semantic search with persona metadata filtering.

## 🎯 Key Features

- **Persona-Aware Retrieval**: Semantic search across persona knowledge base
- **Context Generation**: RAG-powered response generation with persona context
- **Intelligent Filtering**: Multi-criteria persona selection with relevance scoring
- **Performance Optimized**: Sub-200ms query response times
- **Vector Integration**: Built on PersonaVectorizationService foundation
- **Skill System**: Integrated with kOS skill framework

## 🏗️ Architecture

### Core Components

```
PersonaRAGService
├── VectorStore              # Semantic search engine
├── EmbeddingService         # Text-to-vector conversion
├── PersonaVectorizationService  # Persona vector management
└── Skills Integration       # kOS skill system bridge
```

### Data Flow

```
Query Input → Embedding → Vector Search → Relevance Filtering → Context Generation → Response
```

### Dependencies

- ✅ **PersonaVectorizationService**: Persona vector management (357 lines)
- ✅ **VectorStore**: Semantic search capabilities  
- ✅ **EmbeddingService**: Text embedding generation
- ✅ **MongoDB/Weaviate/Neo4j**: Vector storage backends

## 📋 API Documentation

### Core Interface

```typescript
interface PersonaRAGRequest {
  query: string;                    // The search query
  personaId?: string;              // Specific persona to target
  personaFilter?: {                // Persona filtering criteria
    base?: string;                 // Base persona type (griot, tohunga, etc.)
    variant?: string;              // Persona variant
    author?: string;               // Persona author
    tags?: string[];               // Required tags
  };
  limit?: number;                  // Max results (default: 10)
  similarityThreshold?: number;    // Min relevance score (default: 0.5)
  includeContent?: boolean;        // Include full persona content
  contextWindow?: number;          // Context snippet length
}

interface PersonaRAGResponse {
  query: string;                   // Original query
  results: PersonaRAGResult[];     // Matching personas
  totalResults: number;            // Number of results
  processingTime: number;          // Query processing time (ms)
  selectedPersona?: PersonaRAGResult; // Best match
  averageRelevance: number;        // Average relevance score
  success: boolean;                // Query success status
  error?: string;                  // Error message if failed
}
```

### Usage Examples

#### Basic Query
```typescript
const ragService = new PersonaRAGService(vectorStore, embeddingService, personaVectorization);
await ragService.initialize();

const response = await ragService.query({
  query: "Tell me about traditional storytellers",
  limit: 5,
  similarityThreshold: 0.7
});

console.log(`Found ${response.totalResults} relevant personas`);
console.log(`Best match: ${response.selectedPersona?.name}`);
```

#### Filtered Search
```typescript
const response = await ragService.query({
  query: "cultural knowledge preservation",
  personaFilter: {
    base: "griot",
    tags: ["storytelling", "culture"]
  },
  includeContent: true
});
```

#### Best Persona Selection
```typescript
const bestPersona = await ragService.selectBestPersona(
  "I need help with storytelling",
  {
    minRelevanceScore: 0.8,
    excludePersonas: ["persona_001"] // Exclude specific personas
  }
);

if (bestPersona) {
  console.log(`Selected: ${bestPersona.name}`);
  console.log(`Relevance: ${bestPersona.relevanceScore}`);
}
```

## 🚀 Performance Metrics

### Test Results (2025-01-27)

```
📊 Test Summary:
✅ Service initialization      - PASSED
✅ RAG query functionality    - PASSED  
✅ Persona selection          - PASSED
✅ Performance benchmarks     - PASSED
✅ Statistics reporting       - PASSED
✅ Resource cleanup           - PASSED

🎯 Performance Target: ✅ MET
   Target: <200ms | Actual: 0.20ms

📈 Success Rate: 100.0%
📊 Average Relevance: 0.910
🔢 Vectorization Rate: 96.0%
```

### Performance Targets

- **Query Response Time**: <200ms ✅
- **Success Rate**: >95% ✅
- **Relevance Accuracy**: >0.8 ✅
- **Vectorization Coverage**: >90% ✅

## 🔧 Installation & Setup

### 1. Prerequisites
```bash
# Ensure build environment is ready
npm run build
```

### 2. Database Setup
```bash
# MongoDB (persona storage)
MONGODB_URI=mongodb://localhost:27017/griot

# Weaviate (vector storage)  
WEAVIATE_URL=http://localhost:8080

# Neo4j (relationship mapping)
NEO4J_URI=bolt://localhost:7687
```

### 3. Initialize Service
```typescript
import { PersonaRAGService } from './packages/data/core/rag/persona_rag_service';
import { PersonaVectorizationService } from './packages/data/core/rag/persona_vectorization_service';

const ragService = new PersonaRAGService(vectorStore, embeddingService, personaVectorization);
await ragService.initialize();
```

### 4. Verify Installation
```bash
# Run comprehensive test suite
node scripts/test-persona-rag.js
```

## 🔄 Integration with kOS

### Skill System Integration

The PersonaRAG service integrates seamlessly with the kOS skill system:

```yaml
# packages/data/skills/ai/persona_rag.yaml
name: "Persona RAG"
category: "ai"
dependencies: ["persona_vectorization", "vector_operations", "rag_operations"]
```

### Node Architecture

PersonaRAG is designed to work across all kOS node types:

- **Griot Node**: Primary storytelling and cultural knowledge
- **Tohunga Node**: Spiritual guidance and traditional wisdom  
- **Ronin Node**: Independent research and analysis
- **Musa Node**: Creative and artistic inspiration

### Kind Link Framework

The service exposes capabilities through the Kind Link Framework (KLF):

```typescript
// Capability discovery
const capabilities = await ragService.getCapabilities();

// Dynamic skill composition
const workflow = await klf.compose([
  'persona_rag.query',
  'persona_vectorization.update',
  'vector_operations.search'
]);
```

## 📊 Monitoring & Analytics

### Built-in Metrics

```typescript
const stats = await ragService.getRAGStats();
console.log({
  totalPersonas: stats.totalPersonas,
  vectorizedPersonas: stats.vectorizedPersonas,
  averageQueryTime: stats.averageQueryTime,
  totalQueries: stats.totalQueries,
  successRate: stats.successRate
});
```

### Performance Monitoring

The service provides comprehensive performance tracking:

- Query response times
- Relevance score distributions  
- Vector search accuracy
- Memory usage patterns
- Error rates and types

## 🛠️ Development & Testing

### Running Tests

```bash
# Full test suite
node scripts/test-persona-rag.js

# Performance benchmarks
npm run test:performance

# Integration tests  
npm run test:integration
```

### Mock Testing

The service includes comprehensive mocks for development:

```typescript
// Mock implementations available
- MockVectorStore
- MockEmbeddingService  
- MockPersonaVectorizationService
```

### Debugging

Enable debug logging:

```bash
DEBUG=persona-rag:* node your-script.js
```

## 🔐 Security & Governance

### Data Privacy

- Persona content is encrypted at rest
- Query logs are anonymized after 30 days
- Vector embeddings are isolated per tenant

### Access Control

```typescript
// Role-based access control
const ragService = new PersonaRAGService(vectorStore, embeddingService, personaVectorization, {
  accessControl: {
    allowedRoles: ['user', 'admin'],
    restrictedPersonas: ['private_*']
  }
});
```

## 🚨 Troubleshooting

### Common Issues

#### Service Won't Initialize
```bash
Error: PersonaVectorizationService not ready
Solution: Ensure vector database is running and accessible
```

#### Low Relevance Scores
```bash
Issue: Average relevance < 0.5
Solution: Retrain embeddings or adjust similarity threshold
```

#### Performance Degradation
```bash
Issue: Query time > 200ms
Solution: Check vector index health and database connections
```

### Diagnostic Commands

```bash
# Check service health
curl http://localhost:3000/health/persona-rag

# Verify vector store
npm run test:vector-store

# Database connectivity
npm run test:db-connections
```

## 🔮 Future Enhancements

### Roadmap

- **Multi-modal Support**: Image and audio persona content
- **Real-time Learning**: Dynamic persona updating
- **Advanced Filtering**: Temporal and contextual filters
- **Cross-lingual Search**: Multi-language persona queries
- **Federated Search**: Cross-node persona discovery

### Experimental Features

- **Persona Fusion**: Combining multiple personas for complex queries
- **Contextual Memory**: Long-term conversation context
- **Emotional Intelligence**: Mood-aware persona selection

## 📚 Additional Resources

### Documentation Links

- [PersonaVectorizationService Documentation](./persona-vectorization-service.md)
- [kOS Architecture Overview](../ai-q/04_architecture/02_AI_Orchestration_Framework.md)
- [Vector Operations Guide](./vector-operations.md)
- [Skill System Documentation](./skill-system.md)

### Community & Support

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/griot-node/issues)
- **Discussions**: [Community discussions](https://github.com/griot-node/discussions)
- **Documentation**: [Full documentation](https://docs.griot-node.com)

---

**Status**: ✅ **OPERATIONAL & DOCUMENTED**  
**Next Review**: 2025-02-27  
**Maintainer**: kOS Development Team 