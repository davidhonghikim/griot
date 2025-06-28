---
title: "Data Package Index"
version: "1.0.0"
created: "2025-06-28"
updated: "2025-06-28"
---

# Data Package Index

This package contains all the core data structures, skills, recipes, personas, and adapters for the kOS system.

## 📁 Directory Structure

```
packages/data/
├── schemas/           # Database schemas and models
├── skills/           # Capabilities - "How things work"
│   ├── api/          # API operations (HTTP client, REST, etc.)
│   ├── database/     # Database operations (MongoDB, SQL, etc.)
│   ├── security/     # Security operations (encryption, auth, etc.)
│   └── utils/        # Utility operations (file I/O, validation, etc.)
├── recipes/          # Workflows - "Step-by-step instructions"
│   ├── compliance/   # Compliance and validation workflows
│   ├── security/     # Security audit and testing workflows
│   ├── testing/      # Testing and quality assurance workflows
│   └── deployment/   # Deployment and operations workflows
├── adapters/         # Universal translators - "Connectors"
│   ├── database/     # Database adapters (MongoDB ↔ PostgreSQL)
│   ├── api/          # API adapters (REST ↔ GraphQL)
│   └── protocol/     # Protocol bridges (HTTP ↔ WebSocket)
└── personas/         # Agent personas for all 13 nodes
    ├── musa/         # Security management
    ├── griot/        # Community communication
    ├── tohunga/      # Knowledge preservation
    ├── ronin/        # Independent operations
    ├── oracle/       # Predictive analytics
    ├── skald/        # Storytelling and narrative
    ├── hakim/        # Wisdom and judgment
    ├── junzi/        # Scholarly research
    ├── yachay/       # Knowledge discovery
    ├── sachem/       # Leadership and governance
    ├── archon/       # System administration
    ├── amauta/       # Teaching and mentorship
    └── mzee/         # Elder wisdom and guidance
```

## 🎯 Conceptual Separation

### **Skills** = Capabilities ("How things work")
- **Database operations** - MongoDB CRUD, SQL queries, indexing
- **API interactions** - HTTP client, authentication, error handling
- **Security operations** - Encryption, hashing, digital signatures
- **File operations** - Read, write, manipulate files and directories

### **Recipes** = Workflows ("Step-by-step instructions")
- **Compliance checks** - Systematic validation processes
- **Security audits** - Security review workflows
- **Testing procedures** - Quality assurance processes
- **Deployment workflows** - Operational procedures

### **Adapters** = Universal Translators ("Connectors")
- **Database adapters** - Translate between different database systems
- **API adapters** - Translate between different API formats
- **Protocol bridges** - Translate between different communication protocols

## 🏷️ Tagging System

All data objects use a comprehensive tagging system:

- **Primary tags**: Main category (database, api, security, etc.)
- **Secondary tags**: Specific technologies or concepts
- **Node tags**: Which kOS nodes can use this capability
- **Priority tags**: Importance level (low, medium, high, critical)
- **Complexity tags**: Difficulty level (simple, moderate, complex, expert)
- **Cultural tags**: Cultural context and principles

## 🔄 Integration with Core Framework

This data package integrates with the core framework through:

1. **Schema validation** - All data structures are validated against schemas
2. **Skill composition** - Skills can be combined to create complex capabilities
3. **Recipe execution** - Recipes orchestrate skills in specific workflows
4. **Adapter bridging** - Adapters enable interoperability between systems
5. **Persona activation** - Personas use skills and recipes to perform tasks

## 📊 Current Status

- ✅ **Schemas**: Complete database models for all core entities
- ✅ **Skills**: Core capabilities for database, API, and security operations
- ✅ **Recipes**: Compliance, security, and testing workflows
- ✅ **Personas**: All 13 base personas with detailed specifications
- 🔄 **Adapters**: In development - database and API adapters planned
- 🔄 **Advanced Skills**: Additional capabilities for AI, ML, and analytics

## 🚀 Usage Examples

### Using a Skill
```typescript
import { MongoDBOperations } from '@griot/data/skills/database/mongodb_operations';

const db = new MongoDBOperations(config);
await db.connect();
const result = await db.create('users', userData);
```

### Using a Recipe
```typescript
import { SecurityAuditRecipe } from '@griot/data/recipes/security/security_audit';

const audit = new SecurityAuditRecipe();
const report = await audit.execute(securityConfig);
```

### Using an Adapter
```typescript
import { DatabaseAdapter } from '@griot/data/adapters/database/mongodb_postgres';

const adapter = new DatabaseAdapter();
const postgresData = await adapter.convertFromMongoDB(mongoData);
```

## 🔧 Development Guidelines

1. **Skills should be focused and composable** - Each skill should do one thing well
2. **Recipes should be deterministic** - Same inputs should produce same outputs
3. **Adapters should be bidirectional** - Support conversion in both directions
4. **All objects must be tagged** - Use the comprehensive tagging system
5. **Documentation is required** - Each skill, recipe, and adapter must be documented
6. **Testing is mandatory** - All capabilities must have corresponding tests 