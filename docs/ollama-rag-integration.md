# Ollama-RAG Integration Guide

**Integrating Ollama Local Models with the Griot RAG System**

## Overview

The Ollama-RAG integration combines the power of local language models with the existing Retrieval-Augmented Generation (RAG) system in Griot. This integration allows you to:

- Use local Ollama models for text generation
- Leverage the existing vector database (Weaviate) for document retrieval
- Combine local AI capabilities with the persona system
- Run everything locally without external API dependencies

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ollama        │    │   RAG System    │    │   Vector Store  │
│   (Local LLM)   │◄──►│   (Griot)       │◄──►│   (Weaviate)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   OpenWebUI     │    │   Persona       │    │   MongoDB       │
│   (Web Interface)│   │   System        │    │   (Metadata)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### System Requirements

- **Docker & Docker Compose**: For running all services
- **8GB+ RAM**: Minimum for running Ollama models
- **16GB+ RAM**: Recommended for multiple models
- **GPU Support**: Optional but recommended for better performance
- **50GB+ Storage**: For models and data

### Supported Platforms

- **macOS**: Intel and Apple Silicon (M1/M2)
- **Linux**: Ubuntu 20.04+, CentOS 8+
- **Windows**: WSL2 with Docker Desktop

## Quick Start

### 1. Start All Services

```bash
# Start all services including Ollama, RAG system, and web interfaces
docker-compose up -d

# Check service status
docker-compose ps
```

### 2. Pull Ollama Models

```bash
# Pull a base model
docker exec griot-ollama ollama pull llama3.2

# Pull additional models
docker exec griot-ollama ollama pull codellama
docker exec griot-ollama ollama pull mistral
docker exec griot-ollama ollama pull phi3
```

### 3. Test the Integration

```bash
# Run the integration test
node scripts/test-ollama-rag.js

# Or test individual components
npm run test:ollama-rag
```

### 4. Access Web Interfaces

- **OpenWebUI**: http://localhost:3000
- **ComfyUI**: http://localhost:8188
- **A1111**: http://localhost:7860
- **n8n**: http://localhost:5678

## Service Configuration

### Docker Compose Services

The integration includes the following services:

#### Core RAG Infrastructure
- **MongoDB**: Document metadata and persona storage
- **Weaviate**: Vector database for semantic search
- **Neo4j**: Graph database for relationships
- **PostgreSQL**: Additional data storage

#### AI Model Services
- **Ollama**: Local language model server
- **OpenWebUI**: Web interface for Ollama
- **ComfyUI**: Advanced image generation
- **A1111**: Stable Diffusion WebUI

#### Management & Automation
- **n8n**: Workflow automation platform

### Environment Variables

```bash
# Ollama Configuration
OLLAMA_HOST=http://ollama:11434
OLLAMA_DEFAULT_MODEL=llama3.2

# Web Interface Configuration
OPENWEBUI_HOST=http://openwebui:3000
COMFYUI_HOST=http://comfyui:8188
A1111_HOST=http://a1111:7860

# RAG System Configuration
MONGODB_URI=mongodb://mongo:27017/griot
WEAVIATE_HOST=http://weaviate:8080
```

## Usage Examples

### Basic Ollama-RAG Query

```typescript
import { OllamaRAGService } from '@griot/data/core/rag/ollama_rag_service';

const ollamaRAG = new OllamaRAGService(config, personaLoader, vectorStore, embeddingService);

// Initialize the service
await ollamaRAG.initialize();

// Perform a RAG query
const response = await ollamaRAG.query({
  query: "What is the role of the Griot in West African culture?",
  model: "llama3.2",
  maxTokens: 500,
  temperature: 0.7,
  includeMetadata: true
});

console.log(response.response);
console.log(`Retrieved ${response.metadata.documentCount} documents`);
```

### Advanced Configuration

```typescript
const config = {
  ollamaHost: 'http://localhost:11434',
  defaultModel: 'llama3.2',
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  similarityThreshold: 0.7,
  maxResults: 5,
  enableStreaming: false
};

const ollamaRAG = new OllamaRAGService(config, personaLoader, vectorStore, embeddingService);
```

### Model Management

```typescript
// Get available models
const models = await ollamaRAG.getAvailableModels();
console.log('Available models:', models.map(m => m.name));

// Pull a new model
await ollamaRAG.pullModel('codellama:7b');

// Delete a model
await ollamaRAG.deleteModel('old-model');
```

## Integration with Existing RAG System

### Persona Integration

The Ollama-RAG service integrates with the existing persona system:

```typescript
// Load personas and create embeddings
const personas = await personaLoader.loadAllPersonas();
await embeddingService.generateEmbeddings(personas);

// Query with persona context
const response = await ollamaRAG.query({
  query: "How does the Tohunga preserve knowledge?",
  context: "Focus on the Tohunga persona's capabilities",
  model: "llama3.2"
});
```

### Vector Store Integration

```typescript
// Search for relevant documents
const searchResults = await vectorStore.search({
  vector: queryEmbedding,
  limit: 5,
  threshold: 0.7
});

// Use results in RAG query
const response = await ollamaRAG.query({
  query: "Explain the RAG architecture",
  retrievedDocuments: searchResults
});
```

## Performance Optimization

### Model Selection

Choose models based on your requirements:

- **llama3.2**: Good balance of performance and quality
- **codellama**: Excellent for code generation
- **mistral**: Fast and efficient
- **phi3**: Lightweight and fast

### Resource Management

```bash
# Monitor resource usage
docker stats

# Check Ollama model usage
docker exec griot-ollama ollama list

# Monitor Weaviate performance
curl http://localhost:8080/v1/meta
```

### Caching Strategies

- **Model Caching**: Ollama caches models in memory
- **Vector Caching**: Weaviate caches search results
- **Response Caching**: Implement application-level caching

## Troubleshooting

### Common Issues

#### Ollama Service Not Starting

```bash
# Check Ollama logs
docker-compose logs ollama

# Verify GPU support
docker exec griot-ollama nvidia-smi

# Check available models
docker exec griot-ollama ollama list
```

#### Vector Store Connection Issues

```bash
# Check Weaviate health
curl http://localhost:8080/v1/.well-known/ready

# Verify schema
curl http://localhost:8080/v1/schema
```

#### Memory Issues

```bash
# Check available memory
free -h

# Reduce model size
docker exec griot-ollama ollama pull llama3.2:3b

# Adjust Docker memory limits
docker-compose down
docker system prune -a
```

### Debug Mode

Enable debug logging:

```typescript
const config = {
  ...baseConfig,
  debug: true,
  logLevel: 'debug'
};
```

### Health Checks

```bash
# Run comprehensive health check
node scripts/test-ollama-rag.js

# Check individual services
curl http://localhost:11434/api/tags
curl http://localhost:8080/v1/.well-known/ready
curl http://localhost:27017
```

## Security Considerations

### Local Deployment

- All services run locally - no external API calls
- No data leaves your system
- Full control over models and data

### Access Control

```bash
# Secure n8n access
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure-password

# Secure OpenWebUI
WEBUI_SECRET_KEY=your-secret-key
```

### Data Privacy

- Persona data stored locally in MongoDB
- Vector embeddings stored locally in Weaviate
- No external data transmission

## Monitoring and Logging

### Service Monitoring

```bash
# Monitor all services
docker-compose ps

# View logs
docker-compose logs -f ollama
docker-compose logs -f weaviate
docker-compose logs -f mongo

# Check resource usage
docker stats
```

### Performance Metrics

- **Query Response Time**: Track RAG query performance
- **Model Loading Time**: Monitor Ollama model startup
- **Vector Search Speed**: Track Weaviate search performance
- **Memory Usage**: Monitor resource consumption

### Log Analysis

```bash
# Search logs for errors
docker-compose logs | grep ERROR

# Monitor specific service
docker-compose logs -f --tail=100 ollama
```

## Advanced Features

### Streaming Responses

```typescript
const response = await ollamaRAG.query({
  query: "Explain quantum computing",
  stream: true,
  onChunk: (chunk) => {
    console.log('Received chunk:', chunk);
  }
});
```

### Batch Processing

```typescript
const queries = [
  "What is AI?",
  "How does machine learning work?",
  "Explain neural networks"
];

const responses = await Promise.all(
  queries.map(query => ollamaRAG.query({ query }))
);
```

### Custom Prompts

```typescript
const customPrompt = `
You are a helpful AI assistant with expertise in West African culture.
Use the context below to answer questions about the Griot tradition.

Context: {context}

Question: {query}

Answer:`;

const response = await ollamaRAG.query({
  query: "What is the role of the Griot?",
  customPrompt
});
```

## Development

### Adding New Models

1. Pull the model to Ollama
2. Update the service configuration
3. Test the integration
4. Update documentation

### Extending the Service

```typescript
class CustomOllamaRAGService extends OllamaRAGService {
  async customQuery(query: string): Promise<string> {
    // Custom implementation
    return this.query({ query, model: 'custom-model' });
  }
}
```

### Testing

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run Ollama-RAG specific tests
npm run test:ollama-rag
```

## Support and Resources

### Documentation

- [Ollama Documentation](https://ollama.ai/docs)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [OpenWebUI Documentation](https://docs.openwebui.com)

### Community

- [Griot Project Issues](https://github.com/your-repo/issues)
- [Ollama Community](https://github.com/ollama/ollama/discussions)
- [Weaviate Community](https://forum.weaviate.io)

### Troubleshooting Guide

For additional troubleshooting, see the [Troubleshooting Guide](./troubleshooting.md).

---

**Note**: This integration is designed to work with the existing Griot RAG system. Make sure all prerequisites are met and services are properly configured before use. 