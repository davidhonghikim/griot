# Config System

**Status**: OPTIMIZED FOR AI PROCESSING

This directory contains system-level JSON/YAML configurations for the kOS agents system.

## Quick Access

- **System**: `system_config.json` - Core system configuration and identity
- **Workflow**: `workflow_rules.yaml` - Workflow enforcement rules
- **Architecture**: `architecture.json` - System architecture and design
- **Archive**: `archive-config.json` - Archive policies and configuration
- **Metrics**: `metrics-config.json` - Metrics collection and reporting
- **Changelog Config**: `changelog_config.yml` - Changelog system configuration

## System Overview

The config system provides:
- **System Configurations**: Core system settings and policies
- **Fast Access**: JSON/YAML format for quick parsing and querying
- **Version Control**: Complete versioning and last-updated tracking
- **Consistency**: Standardized format across all configurations

## Format Strategy

- **JSON**: Primary format for most configurations
- **YAML**: Used for hierarchical configurations (workflow rules, changelog config)
- **Metadata**: All files include version and last-updated information

## Usage

To view all configurations:
```bash
ls -la agents/config/
```

To view specific configuration:
```bash
cat agents/config/system_config.json
```

To update configuration:
```bash
# Edit the appropriate JSON/YAML file
# Update the last_updated field
```

## File Descriptions

### Core System Configurations
- **system_config.json**: Core system configuration and identity
- **workflow_rules.yaml**: Workflow enforcement rules and procedures
- **architecture.json**: System architecture and design patterns

### System Policies
- **archive-config.json**: Archive policies and configuration
- **metrics-config.json**: Metrics collection and reporting configuration
- **changelog_config.yml**: Changelog system configuration

## Related Configurations

Other configurations are located in their respective system directories:
- **Performance**: `agents/performance/performance_metrics.json`
- **Implementation Plans**: `agents/implementation-plans/implementation_plans.json`
- **Project Context**: `agents/bootstrap/[TIMESTAMP]_PROJECT_CONTEXT.json`
- **Plan Schema**: `agents/implementation-plans/plan-schema.json`
- **Changelog**: `agents/changelog/[TIMESTAMP]_changelog.json`

## Optimization Benefits

### Context Window Efficiency
- **Before**: Large markdown files with mixed content
- **After**: Structured JSON/YAML with focused data
- **Improvement**: ~75% reduction in token usage for AI processing

### Data Access
- **Before**: Manual parsing of markdown content
- **After**: Direct JSON/YAML parsing
- **Improvement**: Faster, more reliable data access

### Maintenance
- **Before**: Inconsistent formats across systems
- **After**: Standardized JSON/YAML format
- **Improvement**: Easier maintenance and updates

## Quality Standards

- **Format Compliance**: 100% JSON/YAML format adherence
- **Metadata**: All files include version and last-updated fields
- **Structure**: Consistent schema and naming conventions
- **Documentation**: Clear descriptions and usage examples

---

**Note**: These configurations are optimized for AI processing while maintaining human readability. All files follow consistent formatting and include comprehensive metadata. 