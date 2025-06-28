# Performance System

**Status**: OPTIMIZED FOR AI PROCESSING

This directory contains the kOS Agent Performance & Analytics System, optimized for AI processing with JSON configuration.

## Quick Access

- **Configuration**: `performance_metrics.json` - Complete system configuration
- **Current Metrics**: `metrics/current/` - Live performance data
- **Reports**: `reports/` - Generated performance reports
- **Templates**: `templates/` - Performance analysis templates

## System Overview

The performance system tracks:
- **Agent Performance**: Success rates, completion times, quality scores
- **Task Categories**: Classification and difficulty assessment  
- **Prompt Effectiveness**: Success rates by prompt type and complexity
- **Execution Plans**: Adherence, completion rates, deviation analysis
- **Resource Utilization**: Time spent, tools used, efficiency metrics

## Directory Structure

```
performance/
├── performance_metrics.json    # System configuration (JSON)
├── metrics/                    # Performance data (JSON format)
│   ├── current/               # Live metrics
│   ├── archives/              # Historical data by quarter
│   └── reports/               # Generated reports (Markdown)
├── prompts/                   # Prompt templates and analysis
│   ├── current/               # Active prompts
│   ├── archives/              # Historical prompts
│   └── templates/             # Prompt templates
├── execution_plans/           # Plan tracking and analysis
│   ├── current/               # Active plans
│   ├── archives/              # Completed/abandoned plans
│   └── templates/             # Plan templates
└── reviews/                   # Agent review system
    ├── current/               # Active reviews
    ├── archives/              # Historical reviews
    └── templates/             # Review templates
```

## Format Strategy

- **JSON**: Structured data (performance_metrics.json, metrics)
- **Markdown**: Narrative content (reports, documentation, templates)
- **YAML**: Configuration files (when hierarchical structure needed)

## Usage

To view system configuration:
```bash
cat agents/performance/performance_metrics.json
```

To add performance metrics:
```bash
# Update the appropriate JSON file in metrics/current/
```

To generate reports:
```bash
# Use templates in reports/ directory
```

## Quality Standards

The system tracks quality across three dimensions:
- **Code Quality**: Clean, well-documented, follows best practices
- **Documentation Quality**: Comprehensive, clear, actionable  
- **Handoff Quality**: Complete context, clear next steps

Each dimension uses a 4-point scale: poor, fair, good, excellent.

---

**Note**: This system is mandatory for all agent sessions and provides data-driven insights for continuous improvement.

## **Archive Policy**

> **Note:** All performance archives are stored in `agents/performance/archive/`, organized by year and month. Do not use the centralized `agents/archive/` directory for performance archives.

### **Current Month Access**
- **Location**: Root of performance directory
- **Purpose**: Easy access to recent performance files
- **Naming**: `[YYYY-MM-DD]_[performance_name].md` or `.json`

### **Monthly Archiving**
- **Trigger**: Monthly (or manual when needed)
- **Destination**: `archive/[YYYY]/[MM]/`
- **Benefits**: 
  - Keeps root directory clean
  - Maintains chronological organization
  - Preserves historical context

### **Archive Structure**
```
archive/
└── [YEAR]/
    ├── [01]/  # January
    ├── [02]/  # February
    ├── ...
    └── [12]/  # December
```

### **Archive Process**
1. **Monthly**: Move all files from previous month to archive
2. **Update Index**: Maintain references in `00_Performance_Index.md`
3. **Preserve Context**: Keep metadata and cross-references intact

### **Automated Archiving**
- **Script Location**: `scripts/archiving/archive_monthly.sh`
- **Usage**: 
  ```bash
  # Archive all systems
  ./scripts/archiving/archive_monthly.sh
  
  # Archive specific system
  ./scripts/archiving/archive_monthly.sh agents/performance
  ```
- **Features**: 
  - Archives files from previous months only
  - Maintains current month files in root directory
  - Creates proper year/month directory structure
  - Handles both `.md` and `.json` files 