# Comprehensive LLM-RAG Integration Guide

**Integrating Multiple LLM Services with the Griot RAG System**

## Overview

The Griot RAG system now supports multiple LLM (Large Language Model) services for enhanced retrieval-augmented generation capabilities. This guide covers integration with:

- **Ollama** - Local model management and inference
- **Llama.cpp** - High-performance local inference server
- **vLLM** - Fast inference and serving for LLMs
- **Hugging Face** - Cloud-based model inference API

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LLM Services  │    │   RAG System    │    │   Vector Store  │
│                 │◄──►│   (Griot)       │◄──►│   (Weaviate)    │
│ • Ollama        │    │                 │    │                 │
│ • Llama.cpp     │    │ • PersonaLoader │    │ • Document      │
│ • vLLM          │    │ • VectorStore   │    │   Storage       │
│ • Hugging Face  │    │ • EmbeddingSvc  │    │ • Similarity    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### 1. Start All Services

```bash
# Start all LLM services and infrastructure
docker-compose up -d

# Or start specific services
docker-compose up -d ollama llama-cpp vllm openwebui comfyui a1111
```

### 2. Test All Integrations

```bash
# Run comprehensive tests
node scripts/test-llm-rag-all.js

# Or test individual services
node scripts/test-ollama-rag.js
```

### 3. Use in Your Application

```typescript
import { OllamaRAGService } from '@griot/data/core/rag/ollama_rag_service';
import { LlamaCppRAGService } from '@griot/data/core/rag/llama_cpp_rag_service';
import { VLLMRAGService } from '@griot/data/core/rag/vllm_rag_service';
import { HuggingFaceRAGService } from '@griot/data/core/rag/huggingface_rag_service';

// Initialize services
const ollamaRAG = new OllamaRAGService(config, personaLoader, vectorStore, embeddingService);
await ollamaRAG.initialize();

// Query with RAG
const response = await ollamaRAG.query({
  query: "What is the role of the Griot?",
  model: "llama3.2",
  maxResults: 5
});
```

## Service Configurations

### Ollama Integration

**Configuration:**
```typescript
const ollamaConfig = {
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
```

**Features:**
- Local model management
- Easy model switching
- Streaming support
- No API keys required
- GPU acceleration

**Usage:**
```bash
# Pull models
docker exec griot-ollama ollama pull llama3.2
docker exec griot-ollama ollama pull llama3.1

# List models
docker exec griot-ollama ollama list
```

### Llama.cpp Integration

**Configuration:**
```typescript
const llamaCppConfig = {
  llamaCppHost: 'http://localhost:8080',
  defaultModel: 'llama-2-7b-chat.gguf',
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  similarityThreshold: 0.7,
  maxResults: 5,
  enableStreaming: false,
  contextSize: 4096,
  threads: 8
};
```

**Features:**
- High-performance inference
- GGUF model support
- Configurable context size
- Multi-threading support
- Memory efficient

**Usage:**
```bash
# Download GGUF models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.gguf

# Mount to container
docker run -v $(pwd)/models:/models -p 8080:8080 ghcr.io/ggerganov/llama.cpp:server \
  --server --host 0.0.0.0 --port 8080 --model /models/llama-2-7b-chat.gguf
```

### vLLM Integration

**Configuration:**
```typescript
const vllmConfig = {
  vllmHost: 'http://localhost:8000',
  defaultModel: 'microsoft/DialoGPT-medium',
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  similarityThreshold: 0.7,
  maxResults: 5,
  enableStreaming: false,
  tensorParallelSize: 1,
  gpuMemoryUtilization: 0.9
};
```

**Features:**
- OpenAI-compatible API
- Fast inference
- GPU memory optimization
- Tensor parallelism
- Continuous batching

**Usage:**
```bash
# Start vLLM server
docker run -p 8000:8000 vllm/vllm-openai:latest \
  --model microsoft/DialoGPT-medium \
  --host 0.0.0.0 --port 8000 \
  --tensor-parallel-size 1
```

### Hugging Face Integration

**Configuration:**
```typescript
const huggingfaceConfig = {
  huggingfaceHost: 'https://api-inference.huggingface.co',
  apiKey: 'your-api-key',
  defaultModel: 'microsoft/DialoGPT-medium',
  maxTokens: 512,
  temperature: 0.9,
  topP: 0.9,
  similarityThreshold: 0.7,
  maxResults: 5,
  enableStreaming: false,
  repetitionPenalty: 1.1,
  doSample: true
};
```

**Features:**
- Cloud-based inference
- Access to thousands of models
- No local GPU required
- Pay-per-use pricing
- Model search and discovery

**Usage:**
```bash
# Set API key
export HUGGINGFACE_API_KEY="your-api-key"

# Test inference
curl -X POST https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium \
  -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "Hello, how are you?"}'
```

## Docker Compose Services

The enhanced `docker-compose.yml` includes all LLM services:

### Local AI Model Services
- **Ollama** (port 11434) - Local model management
- **Llama.cpp** (port 8080) - High-performance inference
- **vLLM** (port 8000) - Fast serving

### AI Web Interfaces
- **OpenWebUI** (port 3000) - Web interface for Ollama
- **ComfyUI** (port 8188) - Image generation
- **A1111** (port 7860) - Stable Diffusion web UI

### Vector Database Services
- **ChromaDB** (port 8000) - Vector database
- **Qdrant** (ports 6333, 6334) - Vector search
- **Milvus** (ports 19530, 9091) - Vector database

### Infrastructure
- **MongoDB** (port 27017) - Document storage
- **Weaviate** (port 8080) - Vector database
- **Neo4j** (ports 7474, 7687) - Graph database
- **PostgreSQL** (port 5432) - Relational database

## Testing and Validation

### Comprehensive Testing

```bash
# Test all LLM-RAG integrations
node scripts/test-llm-rag-all.js

# Test individual services
node scripts/test-ollama-rag.js
```

### Test Coverage

The test suite validates:

1. **Health Checks** - Service connectivity
2. **Model Availability** - Model loading and access
3. **RAG Integration** - End-to-end query processing
4. **Performance** - Response time validation
5. **Error Handling** - Graceful failure handling

### Environment Variables

```bash
# Service endpoints
export OLLAMA_HOST="http://localhost:11434"
export LLAMA_CPP_HOST="http://localhost:8080"
export VLLM_HOST="http://localhost:8000"
export HUGGINGFACE_HOST="https://api-inference.huggingface.co"

# API keys
export HUGGINGFACE_API_KEY="your-huggingface-api-key"
export OPENAI_API_KEY="your-openai-api-key"

# Test configuration
export MAX_GENERATION_TIME="10000"
export MAX_RETRIEVAL_TIME="1000"
```

## Performance Optimization

### GPU Acceleration

All local services support GPU acceleration:

```yaml
# In docker-compose.yml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

### Memory Management

- **Ollama**: Automatic model loading/unloading
- **Llama.cpp**: Configurable context size and threads
- **vLLM**: GPU memory utilization control
- **Hugging Face**: Cloud-based, no local memory concerns

### Caching Strategies

```typescript
// Implement caching for embeddings
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  
  const embedding = await embeddingService.generateEmbedding(text);
  embeddingCache.set(text, embedding);
  return embedding;
}
```

## Troubleshooting

### Common Issues

1. **Service Not Starting**
   ```bash
   # Check logs
   docker-compose logs ollama
   docker-compose logs llama-cpp
   docker-compose logs vllm
   ```

2. **Model Not Found**
   ```bash
   # Pull models for Ollama
   docker exec griot-ollama ollama pull llama3.2
   
   # Download GGUF for Llama.cpp
   wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.gguf
   ```

3. **GPU Issues**
   ```bash
   # Check GPU availability
   nvidia-smi
   
   # Install NVIDIA Docker runtime
   sudo apt-get install nvidia-docker2
   ```

4. **API Key Issues**
   ```bash
   # Verify API keys
   echo $HUGGINGFACE_API_KEY
   echo $OPENAI_API_KEY
   ```

### Performance Issues

1. **Slow Response Times**
   - Reduce model size
   - Increase GPU memory
   - Use quantization (GGUF models)

2. **Memory Issues**
   - Reduce batch size
   - Lower context size
   - Use model offloading

3. **Network Issues**
   - Check firewall settings
   - Verify port mappings
   - Test connectivity

## Security Considerations

### Local Services
- No external API calls
- Data stays on-premises
- Full control over models

### Cloud Services
- Use API keys securely
- Monitor usage and costs
- Implement rate limiting

### General Security
- Use HTTPS for external APIs
- Implement authentication
- Monitor access logs
- Regular security updates

## Monitoring and Logging

### Health Checks

```typescript
// Implement health monitoring
async function monitorServices() {
  const services = [
    { name: 'Ollama', url: 'http://localhost:11434/api/tags' },
    { name: 'Llama.cpp', url: 'http://localhost:8080/health' },
    { name: 'vLLM', url: 'http://localhost:8000/v1/models' }
  ];
  
  for (const service of services) {
    try {
      const response = await fetch(service.url);
      console.log(`${service.name}: ${response.ok ? 'OK' : 'ERROR'}`);
    } catch (error) {
      console.error(`${service.name}: DOWN - ${error.message}`);
    }
  }
}
```

### Metrics Collection

- Response times
- Token usage
- Error rates
- Model performance
- Resource utilization

## Best Practices

### Model Selection

1. **Use Case Matching**
   - Chat: Llama, DialoGPT
   - Code: CodeLlama, StarCoder
   - Reasoning: GPT-4, Claude

2. **Resource Constraints**
   - Limited GPU: Use quantized models
   - No GPU: Use cloud APIs
   - High throughput: Use vLLM

3. **Quality vs Speed**
   - Production: Larger models
   - Development: Smaller models
   - Testing: Fast models

### Configuration Management

```typescript
// Environment-based configuration
const getConfig = () => ({
  ollama: {
    host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2'
  },
  llamaCpp: {
    host: process.env.LLAMA_CPP_HOST || 'http://localhost:8080',
    model: process.env.LLAMA_CPP_MODEL || 'llama-2-7b-chat.gguf'
  }
});
```

### Error Handling

```typescript
// Implement fallback strategies
async function queryWithFallback(query: string) {
  const services = [ollamaRAG, llamaCppRAG, vllmRAG, huggingfaceRAG];
  
  for (const service of services) {
    try {
      return await service.query({ query });
    } catch (error) {
      console.warn(`Service failed: ${error.message}`);
      continue;
    }
  }
  
  throw new Error('All services failed');
}
```

## Conclusion

The comprehensive LLM-RAG integration provides flexibility to choose the best model service for your specific use case. Whether you need local control, cloud scalability, or high performance, there's a solution that fits your requirements.

For more information, see:
- [Ollama Documentation](https://ollama.ai/docs)
- [Llama.cpp Documentation](https://github.com/ggerganov/llama.cpp)
- [vLLM Documentation](https://docs.vllm.ai)
- [Hugging Face API Documentation](https://huggingface.co/docs/api-inference) 