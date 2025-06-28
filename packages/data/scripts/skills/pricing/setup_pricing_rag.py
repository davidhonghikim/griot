#!/usr/bin/env python3
"""
Setup script for RAG-based pricing system
Initializes vector database and loads default pricing data
"""

import json
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, List
import sys
import os

# Add the project root to the path
sys.path.append(str(Path(__file__).parent.parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PricingRAGSetup:
    def __init__(self, config_path: str = "packages/data/config/default_pricing.json"):
        self.config_path = Path(config_path)
        self.project_root = Path(__file__).parent.parent
        
    async def setup(self):
        """Main setup function"""
        logger.info("🚀 Starting RAG-based pricing system setup...")
        
        try:
            # 1. Validate configuration
            await self.validate_configuration()
            
            # 2. Initialize vector database
            await self.initialize_vector_database()
            
            # 3. Load and process pricing data
            await self.load_pricing_data()
            
            # 4. Create provider directory structure
            await self.create_provider_structure()
            
            # 5. Generate documentation
            await self.generate_documentation()
            
            logger.info("✅ RAG-based pricing system setup completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Setup failed: {e}")
            raise
    
    async def validate_configuration(self):
        """Validate the default pricing configuration"""
        logger.info("📋 Validating configuration...")
        
        if not self.config_path.exists():
            raise FileNotFoundError(f"Default pricing config not found: {self.config_path}")
        
        with open(self.config_path, 'r') as f:
            config = json.load(f)
        
        # Validate required fields
        required_fields = ['version', 'providers', 'metadata']
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate providers
        for provider_key, provider_data in config['providers'].items():
            required_provider_fields = ['display_name', 'status']
            for field in required_provider_fields:
                if field not in provider_data:
                    raise ValueError(f"Provider {provider_key} missing field: {field}")
            
            # Validate models if present
            if 'models' in provider_data:
                for model_key, model_data in provider_data['models'].items():
                    required_model_fields = [
                        'display_name', 'input_price_per_1m_tokens', 
                        'output_price_per_1m_tokens', 'context_window'
                    ]
                    for field in required_model_fields:
                        if field not in model_data:
                            raise ValueError(f"Model {model_key} missing field: {field}")
        
        logger.info(f"✅ Configuration validated: {len(config['providers'])} providers found")
    
    async def initialize_vector_database(self):
        """Initialize vector database for RAG system"""
        logger.info("🗄️ Initializing vector database...")
        
        # Create vector database directory
        vector_db_path = self.project_root / "data" / "vector_db"
        vector_db_path.mkdir(parents=True, exist_ok=True)
        
        # Create metadata file
        metadata = {
            "version": "1.0.0",
            "created_at": self.get_timestamp(),
            "description": "Vector database for AI pricing RAG system",
            "total_documents": 0,
            "last_updated": self.get_timestamp()
        }
        
        metadata_path = vector_db_path / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"✅ Vector database initialized at: {vector_db_path}")
    
    async def load_pricing_data(self):
        """Load and process pricing data for vectorization"""
        logger.info("📊 Loading pricing data...")
        
        with open(self.config_path, 'r') as f:
            pricing_data = json.load(f)
        
        # Convert to documents for vectorization
        documents = self.convert_pricing_to_documents(pricing_data)
        
        # Store documents in vector database
        await self.store_documents(documents)
        
        logger.info(f"✅ Loaded {len(documents)} pricing documents")
    
    def convert_pricing_to_documents(self, pricing_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Convert pricing data to documents for vectorization"""
        documents = []
        
        for provider_key, provider_data in pricing_data['providers'].items():
            # Provider document
            provider_doc = {
                "id": f"provider_{provider_key}",
                "type": "provider",
                "content": f"{provider_data['display_name']} - {provider_data.get('description', '')}. Website: {provider_data.get('website', 'N/A')}. Status: {provider_data['status']}",
                "metadata": {
                    "provider_key": provider_key,
                    "display_name": provider_data['display_name'],
                    "website": provider_data.get('website'),
                    "status": provider_data['status'],
                    "provider_type": "ai_service"
                }
            }
            documents.append(provider_doc)
            
            # Model documents
            if 'models' in provider_data:
                for model_key, model_data in provider_data['models'].items():
                    model_doc = {
                        "id": f"model_{provider_key}_{model_key}",
                        "type": "model",
                        "content": f"{model_data['display_name']} by {provider_data['display_name']}. {model_data.get('description', '')}. Input: ${model_data['input_price_per_1m_tokens']}/1M tokens, Output: ${model_data['output_price_per_1m_tokens']}/1M tokens. Context window: {model_data['context_window']} tokens.",
                        "metadata": {
                            "provider_key": provider_key,
                            "model_key": model_key,
                            "display_name": model_data['display_name'],
                            "input_price_per_1m_tokens": model_data['input_price_per_1m_tokens'],
                            "output_price_per_1m_tokens": model_data['output_price_per_1m_tokens'],
                            "context_window": model_data['context_window'],
                            "max_tokens": model_data.get('max_tokens', 4096),
                            "is_active": model_data.get('is_active', True),
                            "model_type": "text_generation"
                        }
                    }
                    documents.append(model_doc)
            
            # Media pricing documents
            if 'media_pricing' in provider_data:
                for media_type, media_data in provider_data['media_pricing'].items():
                    media_doc = {
                        "id": f"media_{provider_key}_{media_type}",
                        "type": "media_pricing",
                        "content": f"{provider_data['display_name']} {media_type} generation. Base cost: ${media_data['base_cost']} per {media_data['pricing_model']}.",
                        "metadata": {
                            "provider_key": provider_key,
                            "media_type": media_type,
                            "pricing_model": media_data['pricing_model'],
                            "base_cost": media_data['base_cost'],
                            "resolution_multipliers": media_data.get('resolution_multipliers'),
                            "quality_multipliers": media_data.get('quality_multipliers'),
                            "media_type_category": media_type
                        }
                    }
                    documents.append(media_doc)
        
        return documents
    
    async def store_documents(self, documents: List[Dict[str, Any]]):
        """Store documents in vector database"""
        logger.info(f"💾 Storing {len(documents)} documents...")
        
        # Create documents directory
        docs_path = self.project_root / "data" / "vector_db" / "documents"
        docs_path.mkdir(parents=True, exist_ok=True)
        
        # Store each document
        for doc in documents:
            doc_path = docs_path / f"{doc['id']}.json"
            with open(doc_path, 'w') as f:
                json.dump(doc, f, indent=2)
        
        # Update metadata
        metadata_path = self.project_root / "data" / "vector_db" / "metadata.json"
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        metadata["total_documents"] = len(documents)
        metadata["last_updated"] = self.get_timestamp()
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info("✅ Documents stored successfully")
    
    async def create_provider_structure(self):
        """Create provider-specific directory structure"""
        logger.info("📁 Creating provider directory structure...")
        
        providers_path = self.project_root / "config" / "providers"
        providers_path.mkdir(parents=True, exist_ok=True)
        
        # Load pricing data to get provider list
        with open(self.config_path, 'r') as f:
            pricing_data = json.load(f)
        
        # Create provider directories
        for provider_key in pricing_data['providers'].keys():
            provider_path = providers_path / provider_key
            provider_path.mkdir(exist_ok=True)
            
            # Create provider-specific files
            config_file = provider_path / "config.json"
            if not config_file.exists():
                with open(config_file, 'w') as f:
                    json.dump({
                        "provider_key": provider_key,
                        "display_name": pricing_data['providers'][provider_key]['display_name'],
                        "description": pricing_data['providers'][provider_key].get('description', ''),
                        "website": pricing_data['providers'][provider_key].get('website'),
                        "status": "active",
                        "created_at": self.get_timestamp()
                    }, f, indent=2)
        
        # Create templates directory
        templates_path = providers_path / "templates"
        templates_path.mkdir(exist_ok=True)
        
        # Create base config template
        base_config = {
            "provider_key": "new_provider",
            "display_name": "New Provider",
            "description": "Provider description",
            "website": "https://provider.com",
            "status": "active",
            "models": {},
            "media_pricing": {},
            "scraping_config": {
                "enabled": false,
                "method": "web_scraping",
                "selectors": {}
            },
            "api_config": {
                "enabled": false,
                "endpoint": null,
                "auth_required": true
            }
        }
        
        template_path = templates_path / "base_config.json"
        with open(template_path, 'w') as f:
            json.dump(base_config, f, indent=2)
        
        logger.info(f"✅ Created provider structure for {len(pricing_data['providers'])} providers")
    
    async def generate_documentation(self):
        """Generate documentation for the RAG system"""
        logger.info("📚 Generating documentation...")
        
        docs_path = self.project_root / "docs" / "pricing_rag"
        docs_path.mkdir(parents=True, exist_ok=True)
        
        # Generate README
        readme_content = self.generate_readme()
        readme_path = docs_path / "README.md"
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        
        # Generate API documentation
        api_docs = self.generate_api_docs()
        api_path = docs_path / "API.md"
        with open(api_path, 'w') as f:
            f.write(api_docs)
        
        logger.info("✅ Documentation generated")
    
    def generate_readme(self) -> str:
        """Generate README documentation"""
        return """# RAG-Based Pricing System

## Overview

The RAG (Retrieval-Augmented Generation) pricing system provides semantic search capabilities for AI model pricing data. This system allows for intelligent model selection based on use cases, budgets, and performance requirements.

## Features

- **Semantic Search**: Find models using natural language queries
- **Use Case Optimization**: Get recommendations based on specific use cases
- **Budget Management**: Find models within budget constraints
- **Performance Tuning**: Balance cost vs performance requirements
- **Dynamic Updates**: Easy to add new providers and models

## Architecture

```
pricing_rag/
├── core/
│   ├── rag/
│   │   └── pricing_rag_service.ts    # Main RAG service
│   └── types/
│       └── pricing_types.ts          # TypeScript interfaces
├── config/
│   ├── default_pricing.json          # Default pricing data
│   └── providers/                    # Provider-specific configs
├── data/
│   └── vector_db/                    # Vector database storage
└── skills/
    └── ai/
        └── token_calculator_rag.yaml # RAG-enabled token calculator
```

## Usage

### Basic Model Search

```typescript
const pricingRAG = new PricingRAGService(vectorStore, embeddingService);
await pricingRAG.initialize();

// Find best model for summarization
const bestModel = await pricingRAG.findBestModel(
  "summarization",
  5.0, // max budget
  "balanced" // performance
);
```

### Cost Calculation

```typescript
const calculator = new TokenCalculatorRAG(pricingRAG);
const cost = await calculator.calculateTextCost(
  "Input text here",
  "Output text here",
  { useCase: "code generation", maxBudget: 10.0 }
);
```

## Configuration

### Adding New Providers

1. Create provider directory: `config/providers/new_provider/`
2. Add configuration files:
   - `config.json` - Provider metadata
   - `scraping_rules.json` - Web scraping rules
   - `api_spec.json` - API specifications

3. Update default pricing data
4. Reinitialize RAG system

### Updating Pricing

```bash
# Run price aggregation
python scripts/generic_price_aggregator.py

# Update RAG system
python scripts/setup_pricing_rag.py --update
```

## API Reference

See `API.md` for detailed API documentation.

## Contributing

1. Follow the provider template structure
2. Validate pricing data before submission
3. Include comprehensive model descriptions
4. Test with semantic queries
"""
    
    def generate_api_docs(self) -> str:
        """Generate API documentation"""
        return """# Pricing RAG API Reference

## PricingRAGService

### Methods

#### `initialize(): Promise<void>`
Initialize the RAG system with default pricing data.

#### `searchPricing(query: PricingQuery): Promise<PricingResult[]>`
Search for pricing information using semantic queries.

**Parameters:**
- `query`: PricingQuery object with search criteria

**Returns:** Array of pricing results sorted by relevance

#### `findBestModel(useCase: string, maxBudget: number, performance: string): Promise<PricingResult | null>`
Find the best model for a specific use case and budget.

**Parameters:**
- `useCase`: Description of the use case
- `maxBudget`: Maximum budget in USD
- `performance`: 'fast', 'balanced', or 'high_quality'

**Returns:** Best matching model or null

#### `getModelPricing(modelKey: string, providerKey?: string): Promise<PricingResult | null>`
Get specific model pricing information.

**Parameters:**
- `modelKey`: Model identifier
- `providerKey`: Optional provider identifier

**Returns:** Model pricing or null

## TokenCalculatorRAG

### Methods

#### `calculateCost(inputTokens: number, outputTokens: number, model?: string, provider?: string): Promise<CostBreakdown>`
Calculate cost for token usage.

#### `findBestModel(query: SemanticPricingQuery): Promise<ModelPricing | null>`
Find best model for semantic query.

#### `estimateUseCaseCost(useCase: string, estimatedTokens: number, budget: number, performance: string): Promise<UseCaseEstimate>`
Estimate cost for specific use case.

## Types

### PricingQuery
```typescript
interface PricingQuery {
  provider?: string;
  model?: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio';
  maxPrice?: number;
  minPrice?: number;
  contextWindow?: number;
  useCase?: string;
  performance?: 'fast' | 'balanced' | 'high_quality';
}
```

### PricingResult
```typescript
interface PricingResult {
  model: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  maxTokens: number;
  description: string;
  confidence: number;
  metadata: Record<string, any>;
}
```

### CostBreakdown
```typescript
interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
  modelKey: string;
  providerKey: string;
  tokenCount: {
    input: number;
    output: number;
  };
}
```
"""
    
    def get_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()

async def main():
    """Main setup function"""
    setup = PricingRAGSetup()
    await setup.setup()

if __name__ == "__main__":
    asyncio.run(main()) 