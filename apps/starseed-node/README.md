# Starseed Node

## Overview

The **Starseed Node** is the primary, standalone application of the kOS ecosystem. It serves as the central orchestrator and system builder, implementing the complete kOS framework with full KLF (Kind Link Framework) compatibility.

## Architecture

- **Framework**: Built on `@griot/core` - the modern kOS framework
- **Protocol**: Full KLF (Kind Link Framework) compatibility
- **Database**: Integrated with `@griot/schemas` for MongoDB, PostgreSQL, Weaviate, and Neo4j
- **Service Management**: Uses `@griot/service-connectors` for external service orchestration
- **Data**: Leverages `@griot/data` for seed personas, skills, and recipes

## Current Status

### ✅ Completed
- Clean, modern architecture using `@griot/core` framework
- Basic HTTP API server with health endpoints
- Proper monorepo structure and dependencies
- Database schemas for Skills and Personas

### 🔄 In Progress
- **Integration Phase**: Merging service orchestration from Griot Kitchen
- Database connection integration
- Service management API endpoints
- Persona and skill management systems

### 📋 Planned
- Complete service orchestration (AI models, vector DBs, storage)
- Recipe system implementation
- Advanced logging and monitoring
- Production deployment configuration

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Current
- `GET /health` - Health check
- `GET /api/nodes` - Node information

### Planned (Integration)
- `GET /services` - List all registered services
- `POST /services` - Register new service
- `GET /services/:id` - Get service details
- `POST /services/:id/test` - Test service connection
- `GET /personas` - List personas
- `POST /personas` - Create persona
- `GET /skills` - List skills
- `POST /skills` - Create skill

## Integration with Griot Kitchen

This application is currently integrating the proven service orchestration functionality from `apps/griot-kitchen` while maintaining the clean, modern architecture. The integration will provide:

- Service discovery and registration
- Connection management and health monitoring
- Protocol fallback logic
- Service categorization and management
- Full KLF ecosystem compatibility

## Environment Variables

```bash
PORT=30437                    # Server port
MONGODB_URI=mongodb://...     # MongoDB connection
POSTGRES_URI=postgresql://... # PostgreSQL connection
WEAVIATE_URL=http://...       # Weaviate connection
NEO4J_URI=bolt://...          # Neo4j connection
```

## Dependencies

- `@griot/core` - Core framework and KLF protocol
- `@griot/schemas` - Database models and schemas
- `@griot/service-connectors` - External service management
- `@griot/data` - Seed data and configurations 