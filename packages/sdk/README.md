# @griot/sdk

TypeScript client for the Starseed Node API. This SDK provides type-safe access to all Starseed Node features including service orchestration, persona management, recipe execution, and database operations.

## Installation

```bash
npm install @griot/sdk
```

## Quick Start

```typescript
import { StarseedClient } from '@griot/sdk';

// Create a client instance
const client = new StarseedClient({
  baseUrl: 'http://localhost:30437',
  apiKey: 'your-api-key', // optional
  timeout: 30000 // optional, default 30s
});

// Check system health
const health = await client.getHealth();
console.log('System status:', health.status);

// List all services
const { services, stats } = await client.services.list();
console.log(`Connected services: ${stats.connected}/${stats.total}`);

// Get all personas
const { personas } = await client.forge.getPersonas();
console.log('Available personas:', personas.map(p => p.name));

// Execute a recipe
const execution = await client.recipes.execute('recipe-id', {
  input1: 'value1',
  input2: 'value2'
});
console.log('Execution started:', execution.executionId);
```

## Features

### 🔧 Service Management
- Register and manage service instances
- Test service connections
- Get service statistics and health
- Categorize services by type

### 🏭 Persona Forge
- Import skills and personas from YAML files
- Create and manage skills with parameters
- Build and edit personas with skill composition
- Export personas to file system

### 📋 Recipe System
- Create and manage workflow recipes
- Execute recipes with dynamic inputs
- Monitor recipe execution progress
- Handle recipe dependencies and conditions

### 🗄️ Database Operations
- Check database connection status
- Monitor MongoDB, PostgreSQL, Weaviate, and Neo4j
- Get system health information

### 🔐 Authentication
- API key-based authentication
- Secure token management
- Request timeout configuration

## API Reference

### Client Configuration

```typescript
interface StarseedClientOptions {
  baseUrl: string;           // Base URL of the Starseed Node
  apiKey?: string;          // Optional API key for authentication
  timeout?: number;         // Request timeout in milliseconds
}
```

### Service Management

```typescript
// List all services
const { services, stats } = await client.services.list();

// Register a new service
const service = await client.services.register('ollama', 'localhost', 11434);

// Test a service connection
const result = await client.services.test('service-id');

// Get services by category
const { services } = await client.services.getByCategory('ai');
```

### Persona Forge

```typescript
// Import from YAML files
const result = await client.forge.import();

// Get all skills
const { skills } = await client.forge.getSkills();

// Create a new skill
const skill = await client.forge.createSkill({
  name: 'My Skill',
  description: 'A custom skill',
  category: 'custom',
  code: 'console.log("Hello World");',
  parameters: []
});

// Get all personas
const { personas } = await client.forge.getPersonas();

// Get a specific persona with composed skills
const persona = await client.forge.getPersona('persona-id');

// Update a persona (live edit)
const updated = await client.forge.updatePersona('persona-id', {
  systemPrompt: 'Updated prompt'
});
```

### Recipe System

```typescript
// List all recipes
const { recipes } = await client.recipes.list();

// Create a new recipe
const recipe = await client.recipes.create({
  name: 'My Recipe',
  description: 'A workflow recipe',
  version: '1.0.0',
  trigger_phrases: ['hello', 'hi'],
  steps: [
    {
      skill: 'skill-id',
      input: { message: 'Hello World' }
    }
  ],
  dependencies: [],
  tags: ['workflow']
});

// Execute a recipe
const execution = await client.recipes.execute('recipe-id', {
  userInput: 'Hello there'
});

// Check execution status
const status = await client.recipes.getExecution('execution-id');
```

### System Health

```typescript
// Get overall system health
const health = await client.getHealth();

// Get database status
const dbStatus = await client.getDatabaseStatus();

// Get node information for KLF compatibility
const { nodes } = await client.getNodes();
```

## Error Handling

The SDK provides comprehensive error handling with detailed error messages:

```typescript
try {
  const result = await client.services.test('invalid-id');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  }
}
```

## Authentication

```typescript
// Set API key
client.setApiKey('your-api-key');

// Clear API key
client.clearApiKey();

// Set custom timeout
client.setTimeout(60000); // 60 seconds
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Watch for changes
npm run dev

# Clean build artifacts
npm run clean
```

## Types

All API responses are fully typed. Import types for use in your own code:

```typescript
import type {
  ServiceInstance,
  Persona,
  Recipe,
  RecipeExecution,
  HealthStatus
} from '@griot/sdk';
```

## License

Private - Part of the kOS project 