# Starseed Node

## Overview

The **Starseed Node** is the primary, standalone application of the kOS ecosystem. It serves as the central orchestrator and system builder, implementing the complete kOS framework with full KLF (Kind Link Framework) compatibility.

## Architecture

- **Framework**: Built on `@griot/core` - the modern kOS framework
- **Protocol**: Full KLF (Kind Link Framework) compatibility
- **Database**: Integrated with `@griot/schemas` for MongoDB, PostgreSQL, Weaviate, and Neo4j
- **Service Management**: Uses `@griot/service-connectors` for external service orchestration
- **Data**: Leverages `@griot/data` for seed personas, skills, and recipes

## Quick Start

### 1. Environment Setup

The easiest way to get started is using the setup script:

```bash
# Run the setup script
./setup-env.sh

# This will:
# - Detect your local IP address
# - Create a base .env configuration
# - Optionally create a .env.local for personal overrides
```

### 2. Manual Environment Configuration

If you prefer manual setup, you have three configuration options:

#### Option A: Simple Setup (Recommended)
```bash
# Copy the base configuration
cp env.example .env

# Edit .env and change BASE_IP to your machine's IP
# BASE_IP=192.168.1.180
```

#### Option B: Personal Overrides (Advanced)
```bash
# Copy base configuration
cp env.example .env

# Copy personal override template
cp env.local.example .env.local

# Edit .env.local for your personal customizations
# This file will override .env settings
```

#### Option C: Direct Editing
```bash
# Edit env.example directly
# Then copy to .env
cp env.example .env
```

### 3. Environment File Priority

The system loads environment files in this order (highest priority first):

1. **`.env.local`** - Personal overrides (not committed to git)
2. **`.env`** - Base configuration (auto-generated)
3. **`env.example`** - Template (committed to git)

### 4. Start the Application

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

## Environment Variables

### Quick Configuration

For most users, you only need to change these at the top of your `.env` file:

```bash
# Your machine's IP address
BASE_IP=192.168.1.180

# Server port (optional)
PORT=30437
```

### Service-Specific Configuration

The system automatically configures all services using your `BASE_IP`:

- **Ollama**: `http://${BASE_IP}:11434`
- **ComfyUI**: `http://${BASE_IP}:8188`
- **Qdrant**: `http://${BASE_IP}:6333`
- **MongoDB**: `mongodb://${BASE_IP}:27017`
- **PostgreSQL**: `${BASE_IP}:5432`
- **Weaviate**: `http://${BASE_IP}:8080`
- **Neo4j**: `bolt://${BASE_IP}:7687`

### Advanced Configuration

For advanced users, you can override individual services in `.env.local`:

```bash
# Override specific service hosts
OLLAMA_HOST=192.168.1.50
COMFYUI_HOST=192.168.1.51

# Override database credentials
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword

# Override API keys
WEAVIATE_API_KEY=your-key
OPENAI_API_KEY=your-key

# Override service intervals
SERVICE_TEST_INTERVAL=10000
CONNECTION_TIMEOUT=3000
```

## Current Status

### ✅ Completed
- Clean, modern architecture using `@griot/core` framework
- Complete service orchestration system with environment variables
- HTTPS primary/HTTP fallback protocol support
- Flexible environment configuration system
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

## Dependencies

- `@griot/core` - Core framework and KLF protocol
- `@griot/schemas` - Database models and schemas
- `@griot/service-connectors` - External service management
- `@griot/data` - Seed data and configurations 