# Griot Kitchen

## Overview

**Griot Kitchen** is a functional prototype that demonstrates service orchestration capabilities for the kOS ecosystem. It was the original implementation of service management before the modern `@griot/core` framework was established.

## Current Status

### ✅ Functional Features
- Complete service orchestration system
- REST API for service management
- Automatic service discovery and health monitoring
- Protocol fallback logic (HTTPS → HTTP)
- Service categorization (AI Models, Image Generation, Vector DBs, Storage)
- Connection testing and statistics
- Support for 21+ service types

### ⚠️ Legacy Issues
- Uses Express.js directly instead of `@griot/core` framework
- References broken packages (`@griot-seed/storage-mongodb`, `@griot-seed/rag-engine`)
- Missing integration with modern database schemas
- No KLF protocol compatibility

## Architecture

- **Server**: Express.js with REST API
- **Service Management**: Custom ServiceManager class
- **Connectors**: Uses `@griot/service-connectors` (modern)
- **Dependencies**: Legacy references to non-existent packages

## API Endpoints

### Service Management
- `GET /services` - List all registered services
- `POST /services` - Register new service
- `GET /services/:id` - Get service details
- `DELETE /services/:id` - Remove service
- `POST /services/:id/test` - Test service connection
- `POST /services/test-all` - Test all services
- `GET /services/categories/:category` - Get services by category

### System
- `GET /` - Status and connection statistics

## Service Categories

- **AI Models**: Ollama, OpenAI, Anthropic, etc.
- **Image Generation**: ComfyUI, A1111, etc.
- **Vector Databases**: Qdrant, Milvus, ChromaDB, etc.
- **Storage**: MongoDB, PostgreSQL, etc.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Integration Plan

This application is being **integrated into Starseed Node** to preserve its proven functionality while modernizing the architecture. The integration will:

1. **Extract service orchestration logic** from Kitchen
2. **Integrate into Starseed** using `@griot/core` framework
3. **Replace broken dependencies** with `@griot/schemas` and `@griot/service-connectors`
4. **Add KLF protocol compatibility**
5. **Maintain all existing functionality** with improved architecture

## Legacy Dependencies

⚠️ **These packages are broken/missing and need replacement:**
- `@griot-seed/storage-mongodb` → Replace with `@griot/schemas`
- `@griot-seed/rag-engine` → Replace with vector search capabilities

## Environment Variables

```bash
HOST=0.0.0.0
PORT=8080
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=griot_seed
LOG_LEVEL=info
```

## Future

After integration into Starseed Node, this application will be **deprecated** as its functionality will be available in the modern, production-ready Starseed Node with full KLF compatibility. 