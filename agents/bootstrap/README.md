---
title: "Agent Bootstrap System"
version: "1.0"
status: "Active"
created: "2025-06-29"
updated: "2025-06-29"
---

# **Agent Bootstrap System**

**Status**: OPTIMIZED FOR AI PROCESSING

This directory contains the core bootstrap files for agent initialization and workflow management. These files provide the essential context and procedures that every agent needs to operate effectively on the kOS project.

## **Directory Structure**

```
agents/bootstrap/
├── 00_AGENT_WORKFLOW.md                    # Core workflow mandate
├── 01_AGENT_CHANGELOG.md                   # Main changelog (chronological)
├── 02_SYSTEM_PROMPT.md                     # Agent system prompt
├── archive/                                 # Historical archives
│   └── 2025/                               # Year-based organization
│       └── 06/                             # June 2025 (when archived)
│           ├── 2025-06-29_agent_workflow.md
│           ├── 2025-06-29_system_prompt.md
│           └── 2025-06-29_project_overview.md
└── README.md                               # This file
```

## **Core Files**

### **00_AGENT_WORKFLOW.md**
- **Purpose**: Mandatory workflow and process mandate
- **Key Features**:
  - Onboarding procedure
  - Changelog requirements
  - Implementation plans integration
  - Handoff process
  - Style & naming conventions

### **01_AGENT_CHANGELOG.md**
- **Purpose**: Chronological project history
- **Key Features**:
  - Session-based logging
  - Major task tracking
  - Finding/Correction/Decision logging
  - Session summaries

### **02_SYSTEM_PROMPT.md**
- **Purpose**: Agent identity and core principles
- **Key Features**:
  - Agent identity definition
  - HIEROS covenant principles
  - Operational context
  - Procedural mandates

## **Archive Policy**

> **Note:** All bootstrap archives are stored in `agents/bootstrap/archive/`, organized by year and month. Do not use the centralized `agents/archive/` directory for bootstrap archives.

### **Current Month Access**
- **Location**: Root of bootstrap directory
- **Purpose**: Easy access to current bootstrap files
- **Naming**: `[YYYY-MM-DD]_[bootstrap_name].md`

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
2. **Update References**: Maintain cross-references in other systems
3. **Preserve Context**: Keep metadata and version history intact

### **Automated Archiving**
- **Script Location**: `scripts/archiving/archive_monthly.sh`
- **Usage**: 
  ```bash
  # Archive all systems
  ./scripts/archiving/archive_monthly.sh
  
  # Archive specific system
  ./scripts/archiving/archive_monthly.sh agents/bootstrap
  ```
- **Features**: 
  - Archives files from previous months only
  - Maintains current month files in root directory
  - Creates proper year/month directory structure
  - Handles both `.md` and `.json` files

## **Bootstrap Process**

### **For New Agents**
1. **Read Core Documents** (in order):
   - `02_SYSTEM_PROMPT.md` - Your identity and core principles
   - `00_AGENT_WORKFLOW.md` - Mandatory workflow procedures
   - `01_AGENT_CHANGELOG.md` - Project history and context

2. **Check Current State**:
   - Read `handoff/LATEST_HANDOFF.md` for your specific mission
   - Review latest changelog entry
   - Check active implementation plans

3. **Initialize Your Session**:
   - Add entry to changelog using template
   - Review any incomplete work from previous agent

## **Integration with Other Systems**

### **Cross-System Dependencies**
- **Workflow → Changelog**: All sessions must be logged
- **Workflow → Handoff**: Session summaries inform handoffs
- **Workflow → Implementation Plans**: Complex tasks use plans
- **Performance → All Systems**: Metrics collected across all activities

### **Data Flow**
```
Agent Session → Changelog → Performance Metrics → Reports
     ↓
Implementation Plans → Metrics → Analytics → Handoff
```

## **Quality Assurance**

### **Before Completing Any Task**
- [ ] Changelog entry added with proper format
- [ ] Performance metrics logged
- [ ] Implementation plan updated (if applicable)
- [ ] Cross-references added between systems
- [ ] Handoff prepared with clear next steps

### **Error Prevention**
- **Always cross-reference**: Link entries between systems
- **Use templates**: Don't create files from scratch
- **Check for completeness**: Ensure all systems are updated
- **Validate format**: Use provided schemas and templates
- **Assume errors**: Review previous agent's work critically

## **Maintenance**

### **Regular Tasks**
- **Daily**: Update changelog with session activities
- **Weekly**: Review performance metrics
- **Monthly**: Archive completed files
- **Quarterly**: Generate comprehensive reports

### **System Health**
- Validate implementation plans against schema
- Check handoff archive for completeness
- Review performance metrics for trends
- Update templates as needed

---

**Last Updated**: 2025-06-29
**Next Review**: 2025-07-01 

# Bootstrap System

**Status**: OPTIMIZED FOR AI PROCESSING

This directory contains the core agent workflow and identity system for the kOS project.

## Quick Access

- **Workflow**: `00_AGENT_WORKFLOW.md` - Mandatory workflow process
- **Changelog**: `changelog.json` - Complete session history (chronological)
- **Project Context**: `project_context.json` - Project state and architecture
- **Identity**: `02_SYSTEM_PROMPT.md` - Agent identity and principles
- **Archive**: `archive/` - Historical workflow versions

## System Overview

The bootstrap system provides:
- **Workflow Process**: Mandatory procedures for all agents
- **Session History**: Complete changelog with chronological ordering
- **Project Context**: Current project state and mission context
- **Agent Identity**: Core principles and operational context
- **Version Control**: Historical workflow versions

## Format Strategy

- **JSON**: Structured data (changelog.json, project_context.json)
- **Markdown**: Narrative content (workflow, identity, documentation)
- **Archive**: Historical versions with proper timestamps

## Usage

To view session history:
```bash
cat agents/bootstrap/changelog.json
```

To view project context:
```bash
cat agents/bootstrap/project_context.json
```

To add a new session entry:
```bash
# Update changelog.json with new session data
# Follow the format in agents/bootstrap/00_AGENT_WORKFLOW.md
```

To view workflow:
```bash
cat agents/bootstrap/00_AGENT_WORKFLOW.md
```

## Archive Policy

- **Monthly archiving**: First day of each month
- **Time-based structure**: `archive/YYYY/MM/` format
- **Timestamp naming**: Use timestamps for better organization
- **Automation**: `scripts/archiving/archive_monthly.sh`

## Changelog Format

The changelog.json contains:
- **Sessions**: Complete session history in chronological order
- **Metadata**: Agent info, dates, missions, log entries
- **Statistics**: Entry types, agent usage, date ranges
- **Summaries**: Accomplishments, final state, key findings

## Project Context Format

The project_context.json contains:
- **Current Status**: Project state and infrastructure
- **Mission**: Current mission and immediate priorities
- **Architecture**: System architecture and design
- **Success Metrics**: Performance and quality targets
- **Key Files**: Important files and their purposes

---

**Note**: This system is mandatory for all agent sessions and provides the foundation for consistent workflow execution. 