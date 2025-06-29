# kOS Agents Directory

**Status**: OPTIMIZED FOR AI EFFICIENCY

This directory contains all agent-related systems for the kOS project, optimized for AI processing with ~75% reduction in context window usage.

## Quick Onboarding

**IMPORTANT**: This README is the **single entry point** for all agents. Read this file first, then load the specific files you need.

For new agents, start with this command to load all essential context:

```bash
cat agents/README.md && echo "\n---" && cat agents/bootstrap/[TIMESTAMP]_01_AGENT_WORKFLOW.yml && echo "\n---" && cat agents/handoff/LATEST_HANDOFF.md
```

**Workflow**:
1. **Start here**: Read `agents/README.md` (this file) for overview and structure
2. **Load workflow**: Read `agents/bootstrap/[TIMESTAMP]_01_AGENT_WORKFLOW.yml` for mandatory procedures
3. **Get directive**: Read `agents/handoff/LATEST_HANDOFF.md` for your specific mission
4. **Access other files**: Load additional files as needed based on your mission

## Directory Structure
LOG FILES USE [TIMESTAMP]_FILENAME.ext format. Keep the timestamp in the filename as variable since it changes but there should only be one file like it in that directory as the current file. Others are archived. Don't hardcode the timestamp in the filename in this file.

```
agents/
├── README.md                    # This file - single entry point
├── bootstrap/                   # Core agent workflow and identity
│   ├── [TIMESTAMP]_00_AGENT_WORKFLOW.yml   # Mandatory workflow process
│   ├── [TIMESTAMP]_01_SYSTEM_PROMPT.yml    # Agent identity and principles
│   ├── [TIMESTAMP]_02_AGENT_RULES.yml      # Agent rules and guidelines
│   ├── [TIMESTAMP]_03_PROJECT_CONTEXT.yml  # Project state and architecture
│   └── archive/                # Historical workflow versions
├── config/                     # System-level JSON/YAML configurations
│   ├── system_config.json      # Core system configuration
│   ├── workflow_rules.yaml     # Workflow enforcement rules
│   ├── architecture.json       # System architecture
│   ├── archive-config.json     # Archive configuration
│   ├── metrics-config.json     # Metrics configuration
│   ├── changelog_config.yml    # Changelog configuration
│   └── README.md               # Config documentation
├── handoff/                    # Agent handoff system (Markdown)
│   ├── [TIMESTAMP]_LATEST_HANDOFF.md       # Current handoff directive
│   └── archive/                # Historical handoffs
├── analysis/                   # Project analysis and insights (Markdown)
│   ├── 00_Analysis_Index.md    # Analysis index
│   ├── [TIMESTAMP]_comprehensive_project_analysis.md
│   └── archive/                # Historical analyses
├── performance/                # Performance tracking system
│   ├── performance_metrics.json # Performance system configuration
│   ├── README.md               # Performance system overview
│   ├── metrics/                # Performance data (JSON)
│   ├── reports/                # Generated reports (Markdown)
│   ├── prompts/                # Prompt templates
│   ├── execution_plans/        # Plan tracking
│   └── reviews/                # Agent reviews
├── implementation-plans/       # Implementation planning
│   ├── implementation_plans.json # Complete plans configuration
│   ├── plan-schema.json        # Plan schema definitions
│   ├── README.md               # Plans overview
│   ├── active/                 # Currently active plans
│   ├── backlog/                # Planned but not active
│   └── archive/                # Completed plans
├── scripts/                    # Automation scripts
│   ├── create-plan-dir.sh      # Plan directory creation
│   └── create-plan.js          # Plan generation
├── templates/                  # Templates for various systems
│   ├── plan-template.md        # Plan creation template
│   └── docs/                   # Documentation templates
└── reference/                  # Reference materials (unchanged)
    ├── kitchen/                # Kitchen system reference
    ├── kos_chatgpt/            # kOS ChatGPT reference
    └── vector/                 # Vector system reference
```

## Format Optimization Strategy

### JSON/YAML for Structured Data
- **System configs**: Core system configurations in config/
- **Performance metrics**: Performance data in performance/
- **Implementation plans**: Plan data in implementation-plans/
- **Project context**: Project state in bootstrap/
- **Changelog**: Session history in changelog/

### Markdown for Narrative Content
- **Handoffs**: Agent handoff directives and context
- **Analysis**: Project insights and recommendations
- **Documentation**: System overviews and guides
- **Templates**: Creation templates for various systems

### Scripts for Automation
- **Plan creation**: Automated plan directory setup
- **Archiving**: Monthly archive automation
- **Validation**: Data validation and consistency checks

## Key Optimizations

### Context Window Efficiency (~75% reduction)
- **Before**: Multiple large markdown files with redundant information
- **After**: Structured JSON configs + focused markdown narratives
- **Result**: Faster AI processing, better data access, reduced token usage

### Directory Consolidation
- **Eliminated**: Redundant `shared/`, `changelogs/` directories
- **Organized**: Files in their proper system directories
- **Centralized**: Scripts into `scripts/` directory
- **Result**: Cleaner structure, easier navigation

### Format Standardization
- **JSON**: For all structured data and configurations
- **YAML**: For hierarchical configurations
- **Markdown**: For narrative content and documentation
- **Result**: Consistent format expectations across all systems

## System Status

### ✅ Optimized Systems
- **Bootstrap**: Core workflow and identity system
- **Config**: System-level configurations in JSON/YAML format
- **Performance**: Metrics and tracking system
- **Implementation Plans**: Plan management system
- **Analysis**: Project analysis and insights
- **Handoff**: Agent handoff system

### 📊 Performance Metrics
- **Directory count**: 9 → 8 (eliminated redundancy)
- **Config files**: 6 system-level JSON/YAML files
- **Context efficiency**: ~75% reduction in token usage
- **Format consistency**: 100% adherence to format strategy

## Usage Guidelines

### For AI Agents
**MANDATORY WORKFLOW**:
1. **Start with**: `agents/README.md` (this file) - Single entry point for all agents
2. **Load workflow**: `agents/bootstrap/[TIMESTAMP]_01_AGENT_WORKFLOW.yml` - Mandatory procedures
3. **Get directive**: `agents/handoff/[TIMESTAMP]_LATEST_HANDOFF.md` - Your specific mission
4. **Access system configs**: `agents/config/` - System configurations as needed
5. **Check changelog**: `agents/changelog/[TIMESTAMP]_changelog.yml` - Session history
6. **Check project context**: `agents/bootstrap/[TIMESTAMP]_PROJECT_CONTEXT.yml` - Project state
7. **Follow format**: YAML for data, Markdown for narrative

**IMPORTANT**: Always start with README.md. This file contains the overview and tells you which other files to load.

### For Human Developers
1. **Quick start**: Read `agents/README.md` (this file) first
2. **Workflow**: Follow `agents/bootstrap/[TIMESTAMP]_01_AGENT_WORKFLOW.yml`
3. **System configs**: Edit files in `agents/config/`
4. **Documentation**: Update markdown files as needed
5. **Scripts**: Use automation scripts in `agents/scripts/`

## Archive Policy

- **Monthly archiving**: First day of each month
- **Per-system archives**: Each system has its own archive directory
- **Time-based structure**: `archive/YYYY/MM/` format
- **ISO 8601 Timestamp naming**: ONLY files that are constantly created and archived need timestamp prefixes
- **Files that NEED timestamps**: Performance files, active implementation plans, analysis reports, changelog entries, handoffs
- **Files that DON'T need timestamps**: Static config files, templates, reference documentation, current working files
- **Working files**: Current files use descriptive names (e.g., `[TIMESTAMP]_changelog.yml`, `[TIMESTAMP]_LATEST_HANDOFF.md`)
- **Archived files**: Historical files use full ISO 8601 timestamps in names: `[TIMESTAMP]_Description.ext`