# Asset Indexing System for kOS

A comprehensive, chunked asset indexing system that provides efficient bootstrap loading and dynamic asset discovery for AI agents.

## 🎯 Overview

The asset indexing system solves the context window problem by:
- **Chunking by type**: Skills, recipes, scripts, and configs are indexed separately
- **Bootstrap optimization**: Only essential indexes are loaded at startup
- **Dynamic loading**: Additional chunks are loaded on-demand
- **JSON format**: Small, efficient, and human-readable indexes
- **Auto-updating**: Indexes stay current with file system changes

## 📁 Directory Structure

```
packages/data/
├── indexes/                    # All index files
│   ├── bootstrap.json         # Essential bootstrap index
│   ├── skills/                # Chunked by type
│   │   ├── ai.json
│   │   ├── database.json
│   │   └── security.json
│   ├── recipes/
│   │   ├── ai.json
│   │   └── workflow.json
│   ├── scripts/
│   │   ├── pricing.json
│   │   └── utils.json
│   └── configs/
│       ├── providers.json
│       └── pricing.json
├── skills/
├── recipes/
├── scripts/
└── config/
```

## 🚀 Quick Start

### 1. Initial Indexing

```bash
# Index all assets
python3 packages/data/scripts/asset_indexer.py

# Force update all indexes
python3 packages/data/scripts/asset_indexer.py --force

# Index specific types only
python3 packages/data/scripts/asset_indexer.py --types skills recipes
```

### 2. Agent Bootstrap

```python
from packages.data.scripts.agent_bootstrap import AgentBootstrap

# Initialize bootstrap loader
bootstrap = AgentBootstrap()

# Load essential bootstrap data
bootstrap_data = bootstrap.load_bootstrap()

# Get critical assets
critical_skills = bootstrap.get_critical_assets('skills')
critical_recipes = bootstrap.get_critical_assets('recipes')

# Search for assets
results = bootstrap.search_assets('token calculator')
```

### 3. Dynamic Loading

```python
# Load specific chunks on demand
ai_skills = bootstrap.load_chunk('skills', 'ai')
pricing_scripts = bootstrap.load_chunk('scripts', 'pricing')

# Get assets by type and category
all_ai_skills = bootstrap.get_assets_by_type('skills', 'ai')
all_recipes = bootstrap.get_assets_by_type('recipes')
```

## 🔧 Configuration

### Asset Type Configuration

Each asset type has its own configuration in `asset_indexer.py`:

```python
self.asset_configs = {
    "skills": {
        "path": "skills",
        "extensions": [".yaml", ".yml", ".ts", ".js", ".py"],
        "chunk_by": "category",  # ai, database, security, etc.
        "max_chunk_size": 50,
        "priority_files": ["token_calculator_rag.yaml", "budget_manager.yaml"]
    },
    # ... other types
}
```

### Chunking Strategy

- **By Category**: Files are grouped by their category (ai, database, security, etc.)
- **Size Limits**: Large categories are split into multiple chunks
- **Priority Files**: Critical files are marked for bootstrap loading

## 📊 Bootstrap Index

The bootstrap index (`indexes/bootstrap.json`) contains:

```json
{
  "version": "1.0.0",
  "system": {
    "totalAssets": 150,
    "lastIndexUpdate": "2025-06-28T20:15:00Z"
  },
  "critical": {
    "coreSkills": [...],
    "coreRecipes": [...],
    "coreScripts": [...]
  },
  "indexes": {
    "skills": {
      "chunks": ["ai", "database", "security"],
      "totalFiles": 45
    }
  }
}
```

## 🔍 Search Capabilities

### Text Search

```python
# Search across all asset types
results = bootstrap.search_assets('token calculator')

# Search specific types
results = bootstrap.search_assets('budget', asset_types=['skills', 'recipes'])

# Search specific categories
results = bootstrap.search_assets('pricing', categories=['ai', 'pricing'])
```

### Path-Based Lookup

```python
# Get asset by file path
asset = bootstrap.get_asset_by_path('skills/ai/token_calculator_rag.yaml')
```

### Type and Category Filtering

```python
# Get all AI skills
ai_skills = bootstrap.get_assets_by_type('skills', 'ai')

# Get all recipes
all_recipes = bootstrap.get_assets_by_type('recipes')
```

## 🔄 Auto-Indexing

### File System Watcher

```bash
# Start file watcher (watches for changes)
python3 packages/data/scripts/auto_index_hook.py --watch
```

### Git Hooks

```bash
# Set up git hooks for automatic indexing
python3 packages/data/scripts/auto_index_hook.py --setup-hooks

# Run manual update
python3 packages/data/scripts/auto_index_hook.py --update
```

### Manual Updates

```bash
# Force update all indexes
python3 packages/data/scripts/asset_indexer.py --force

# Update specific types
python3 packages/data/scripts/asset_indexer.py --types skills
```

## 📈 Performance Optimization

### Caching

The bootstrap loader includes intelligent caching:

```python
# Check cache statistics
stats = bootstrap.get_cache_stats()
print(f"Cached chunks: {stats['cached_chunks']}")

# Clear cache if needed
bootstrap.clear_cache()
```

### Memory Management

- **Lazy Loading**: Chunks are only loaded when accessed
- **Cache Limits**: Configurable cache size limits
- **Garbage Collection**: Automatic cleanup of unused chunks

## 🎯 Agent Integration

### Minimal Bootstrap

Agents load only the bootstrap index at startup:

```python
# Agent startup (minimal context usage)
bootstrap = AgentBootstrap()
bootstrap_data = bootstrap.load_bootstrap()

# Get system info
total_assets = bootstrap_data['system']['totalAssets']
available_types = list(bootstrap_data['indexes'].keys())
```

### Dynamic Asset Discovery

```python
# Load assets as needed
if need_token_calculator:
    ai_chunk = bootstrap.load_chunk('skills', 'ai')
    token_calc = next(f for f in ai_chunk['files'] 
                     if 'token_calculator' in f['name'])

if need_budget_recipe:
    workflow_chunk = bootstrap.load_chunk('recipes', 'workflow')
    budget_recipe = next(f for f in workflow_chunk['files'] 
                        if 'budget' in f['name'])
```

## 🔧 Advanced Usage

### Custom Indexing

```python
from packages.data.scripts.asset_indexer import AssetIndexer

# Custom configuration
indexer = AssetIndexer()
indexer.asset_configs['custom'] = {
    "path": "custom_assets",
    "extensions": [".json"],
    "chunk_by": "type",
    "max_chunk_size": 25
}

# Index custom assets
indexer.index_asset_type('custom', indexer.asset_configs['custom'], 
                        indexer.indexes_path / 'custom', True)
```

### Metadata Extraction

The system automatically extracts metadata from:

- **YAML files**: Frontmatter and tags
- **JSON files**: Description, tags, version
- **Code files**: Comments and docstrings

### File Hashing

Each file gets a SHA256 hash for change detection:

```python
# Check if file has changed
asset = bootstrap.get_asset_by_path('skills/ai/token_calculator.yaml')
current_hash = calculate_file_hash('skills/ai/token_calculator.yaml')
if asset['hash'] != current_hash:
    print("File has changed, re-indexing needed")
```

## 🚨 Troubleshooting

### Common Issues

1. **Bootstrap not found**
   ```bash
   # Run initial indexing
   python3 packages/data/scripts/asset_indexer.py
   ```

2. **Chunk not found**
   ```bash
   # Force re-index specific type
   python3 packages/data/scripts/asset_indexer.py --types skills --force
   ```

3. **File watcher not working**
   ```bash
   # Install watchdog dependency
   pip install watchdog
   ```

### Debug Mode

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Enable debug logging for troubleshooting
bootstrap = AgentBootstrap()
bootstrap.load_bootstrap()
```

## 📋 Best Practices

1. **Regular Updates**: Run indexing after adding new assets
2. **Git Hooks**: Use git hooks for automatic updates
3. **Cache Management**: Clear cache periodically for large projects
4. **Search Optimization**: Use specific categories for faster searches
5. **Bootstrap Optimization**: Keep critical assets list minimal

## 🔮 Future Enhancements

- **Compression**: Gzip compression for large indexes
- **Incremental Updates**: Only update changed chunks
- **Distributed Indexing**: Support for multiple repositories
- **Semantic Search**: AI-powered asset discovery
- **Index Validation**: Schema validation for index files

## 📚 API Reference

### AgentBootstrap Class

- `load_bootstrap()`: Load essential bootstrap data
- `get_critical_assets(type)`: Get critical assets by type
- `load_chunk(type, name)`: Load specific chunk
- `search_assets(query, types, categories)`: Search assets
- `get_asset_by_path(path)`: Get asset by file path
- `get_assets_by_type(type, category)`: Get assets by type
- `clear_cache()`: Clear chunk cache
- `get_cache_stats()`: Get cache statistics

### AssetIndexer Class

- `index_all(force)`: Index all asset types
- `index_asset_type(type, config, path, force)`: Index specific type
- `search_assets(query, types, categories)`: Search indexed assets

This system provides a robust foundation for efficient asset management in the kOS project, enabling agents to discover and load assets dynamically while minimizing context window usage. 