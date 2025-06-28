# Persona-Driven Asset Loading System for kOS

A sophisticated asset loading system that allows each persona to specify which assets to load by default, optimizing token usage and context windows for AI agents.

## 🎯 Overview

The persona-driven loading system solves the context window problem by:
- **Persona-Specific Loading**: Each persona defines its own asset preferences
- **Token Optimization**: Load only relevant assets to stay within context limits
- **Dynamic Selection**: Filter assets by type, category, tags, and priority
- **Size Management**: Enforce file size limits for optimal performance
- **Backward Compatibility**: Support both new and legacy persona formats

## 📁 Persona Configuration Structure

### Directory Layout
```
packages/data/personas/
├── griot-v1/
│   ├── persona.yml          # Persona configuration
│   └── griot-persona.yml    # Legacy format (backward compatible)
├── musa/
│   ├── persona.yml          # Security-focused persona
│   └── 01_musa_security_agent.yaml
└── [other-personas]/
    └── persona.yml
```

### Configuration File Format

```yaml
# Persona Configuration Example
name: "Persona Name"
version: "1.0.0"
description: "Description of the persona's role and specialization"

# Asset loading preferences
asset_preferences:
  # Asset types to load by default
  types:
    - "skills"
    - "recipes"
    - "scripts"
    - "configs"
  
  # Categories to prioritize
  categories:
    - "ai"
    - "security"
    - "workflow"
  
  # Tags to include
  tags:
    - "core"
    - "essential"
    - "critical"
  
  # Specific files to always load
  priority_files:
    - "skills/ai/token_calculator_rag.yaml"
    - "recipes/ai/budget_aware_chat.yaml"
  
  # Patterns to exclude
  exclude_patterns:
    - "deprecated"
    - "experimental"
  
  # Maximum context size in bytes (default: 100KB)
  max_context_size: 102400

# Legacy format support
imports:
  - "skills/core-engineering-v1"

# Persona identity
identity:
  role: "Software Engineer"
  specialization: "Core Development"
  cultural_framework: "HIEROS"

# Core skills
skills:
  - "core_engineering"
  - "system_architecture"
```

## 🚀 Quick Start

### 1. Create a Persona Configuration

```bash
# Create a template for a new persona
python3 scripts/persona_loader.py --persona new-persona --template

# Or create manually in packages/data/personas/new-persona/persona.yml
```

### 2. Load Assets for a Persona

```python
from packages.data.scripts.persona_loader import PersonaLoader
from packages.data.scripts.agent_bootstrap import AgentBootstrap

# Initialize loaders
persona_loader = PersonaLoader()
bootstrap_loader = AgentBootstrap()

# Load assets for a specific persona
assets = persona_loader.load_assets_for_persona("griot-v1", bootstrap_loader)

print(f"Loaded {assets['chunks_loaded']} assets")
print(f"Total size: {assets['total_size']} bytes")
```

### 3. Command Line Usage

```bash
# Show persona summary
python3 scripts/persona_loader.py --persona griot-v1 --summary

# Validate persona configuration
python3 scripts/persona_loader.py --persona griot-v1 --validate

# Load assets for persona
python3 scripts/persona_loader.py --persona griot-v1
```

## 🔧 Configuration Options

### Asset Preferences

| Option | Description | Example |
|--------|-------------|---------|
| `types` | Asset types to load | `["skills", "recipes", "scripts"]` |
| `categories` | Categories to prioritize | `["ai", "security", "workflow"]` |
| `tags` | Tags to include | `["core", "essential", "critical"]` |
| `priority_files` | Specific files to always load | `["skills/ai/token_calculator.yaml"]` |
| `exclude_patterns` | Patterns to exclude | `["deprecated", "experimental"]` |
| `max_context_size` | Maximum context size in bytes | `102400` (100KB) |

### File Size Limits

The system enforces file size limits for optimal token usage:

| File Type | Size Limit | Purpose |
|-----------|------------|---------|
| Persona Files | 50KB | Persona configuration files |
| Skill Files | 100KB | Individual skill definitions |
| Recipe Files | 200KB | Workflow recipes |
| Config Files | 1MB | Configuration files |
| Agent Context | 100KB | Total context per agent input |

## 📊 Asset Loading Process

### 1. Configuration Loading
```python
# Load persona configuration
config = persona_loader.load_persona_config("griot-v1")

# Extract preferences
preferences = persona_loader.get_persona_asset_preferences(config)
```

### 2. Asset Filtering
```python
# Get all assets of a type
type_assets = bootstrap_loader.get_assets_by_type("skills")

# Filter by persona preferences
filtered_assets = persona_loader.filter_assets_by_preferences(
    type_assets, preferences
)
```

### 3. Size Management
```python
# Check context size limit
if total_size > preferences['max_context_size']:
    # Implement smart filtering to reduce size
    logger.warning("Assets exceed context size limit")
```

## 🎯 Use Cases

### 1. Specialized Personas
```yaml
# Security-focused persona (Musa)
asset_preferences:
  categories:
    - "security"
    - "compliance"
    - "threat-detection"
  tags:
    - "security"
    - "authentication"
    - "authorization"
```

### 2. General Purpose Personas
```yaml
# Core engineering persona (Griot)
asset_preferences:
  categories:
    - "core-engineering"
    - "ai"
    - "workflow"
  tags:
    - "core"
    - "essential"
    - "development"
```

### 3. Task-Specific Personas
```yaml
# Data analysis persona
asset_preferences:
  categories:
    - "data"
    - "analytics"
    - "visualization"
  priority_files:
    - "skills/data/data_processor.yaml"
    - "recipes/analytics/report_generator.yaml"
```

## 🔍 Validation and Quality Assurance

### Configuration Validation
```python
# Validate persona configuration
issues = persona_loader.validate_persona_config(config)

if issues:
    print("Configuration issues:")
    for issue in issues:
        print(f"  - {issue}")
```

### Size Compliance
```python
# Check file size compliance
summary = persona_loader.get_persona_summary("griot-v1")

print(f"Config file size: {summary['config']['file_size']} bytes")
print(f"Total assets size: {summary['assets']['total_size']} bytes")
print(f"Validation issues: {len(summary['validation']['issues'])}")
```

## 🔄 Integration with Agent Bootstrap

### Enhanced Bootstrap Process
```python
from packages.data.scripts.agent_bootstrap import AgentBootstrap
from packages.data.scripts.persona_loader import PersonaLoader

class PersonaAwareBootstrap(AgentBootstrap):
    def __init__(self, project_root: str = "packages/data"):
        super().__init__(project_root)
        self.persona_loader = PersonaLoader(project_root)
    
    def load_for_persona(self, persona_name: str):
        """Load assets optimized for a specific persona"""
        return self.persona_loader.load_assets_for_persona(
            persona_name, self
        )
    
    def get_persona_context(self, persona_name: str):
        """Get optimized context for persona"""
        assets = self.load_for_persona(persona_name)
        
        # Build context from loaded assets
        context = {
            'persona': assets['persona'],
            'preferences': assets['preferences'],
            'assets': assets['assets']
        }
        
        return context
```

## 📈 Performance Optimization

### Caching Strategy
```python
# Cache persona configurations
persona_cache = {}

def get_cached_persona(persona_name: str):
    if persona_name not in persona_cache:
        persona_cache[persona_name] = persona_loader.load_persona_config(persona_name)
    return persona_cache[persona_name]
```

### Lazy Loading
```python
# Load assets only when needed
def load_assets_on_demand(persona_name: str, asset_type: str):
    if asset_type not in loaded_assets:
        loaded_assets[asset_type] = persona_loader.load_assets_for_persona(
            persona_name, bootstrap_loader
        )
    return loaded_assets[asset_type]
```

## 🚨 Troubleshooting

### Common Issues

1. **Persona not found**
   ```bash
   # Check persona directory exists
   ls packages/data/personas/persona-name/
   
   # Verify config file exists
   ls packages/data/personas/persona-name/persona.yml
   ```

2. **Assets not loading**
   ```bash
   # Check asset indexes exist
   ls packages/data/indexes/
   
   # Rebuild indexes if needed
   python3 scripts/asset_indexer.py --force
   ```

3. **Size limit exceeded**
   ```bash
   # Check file sizes
   python3 scripts/persona_loader.py --persona persona-name --validate
   
   # Reduce asset preferences or increase limits
   ```

### Debug Mode
```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Enable debug logging for troubleshooting
persona_loader = PersonaLoader()
assets = persona_loader.load_assets_for_persona("griot-v1")
```

## 📋 Best Practices

### 1. Persona Design
- **Single Responsibility**: Each persona should have a clear, focused purpose
- **Minimal Dependencies**: Load only essential assets for the persona's role
- **Clear Naming**: Use descriptive names for personas and their components

### 2. Asset Organization
- **Logical Grouping**: Group related assets by category and tags
- **Consistent Tagging**: Use consistent tag naming across all assets
- **Priority Management**: Mark critical assets as priority files

### 3. Performance
- **Size Monitoring**: Regularly check file sizes and context usage
- **Caching**: Implement appropriate caching for frequently used personas
- **Lazy Loading**: Load assets only when needed

### 4. Maintenance
- **Regular Validation**: Validate persona configurations regularly
- **Size Audits**: Monitor and optimize file sizes
- **Documentation**: Keep persona documentation up to date

## 🔮 Future Enhancements

- **Dynamic Persona Switching**: Switch personas during runtime
- **Persona Composition**: Combine multiple personas for complex tasks
- **Learning Preferences**: Adapt asset preferences based on usage patterns
- **Distributed Personas**: Support for distributed persona configurations
- **Persona Versioning**: Version control for persona configurations

## 📚 API Reference

### PersonaLoader Class

- `load_persona_config(persona_name)`: Load persona configuration
- `get_persona_asset_preferences(config)`: Extract asset preferences
- `load_assets_for_persona(persona_name, bootstrap_loader)`: Load assets for persona
- `filter_assets_by_preferences(assets, preferences)`: Filter assets by preferences
- `create_persona_config_template(persona_name)`: Create template configuration
- `validate_persona_config(config)`: Validate configuration
- `get_persona_summary(persona_name)`: Get persona summary

### Command Line Interface

- `--persona`: Specify persona name
- `--template`: Create template configuration
- `--summary`: Show persona summary
- `--validate`: Validate persona configuration
- `--project-root`: Specify project root path

This system provides a robust foundation for persona-driven asset loading in the kOS project, enabling efficient token usage and optimal AI agent performance. 