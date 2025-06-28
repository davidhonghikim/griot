# **Agents Directory Organization**

**Version**: 1.0  
**Last Updated**: 2025-06-28  
**Status**: ACTIVE

This document provides a comprehensive overview of the organized agents directory structure and systems.

---

## **📁 Directory Structure**

```
agents/
├── 00_AGENT_WORKFLOW.md                    # Core workflow mandate
├── 01_AGENT_CHANGELOG.md                   # Main changelog (chronological)
├── 02_SYSTEM_PROMPT.md                     # Agent system prompt
├── 03_PROJECT_OVERVIEW.md                  # Project overview
├── 04_HISTORY_SYSTEM.md                    # History system documentation
├── 05_AGENT_PERFORMANCE_SYSTEM.md          # Performance system overview
├── 06_PERFORMANCE_SYSTEM_OVERVIEW.md       # Performance metrics
├── 07_SYSTEM_IMPLEMENTATION_SUMMARY.md     # Implementation summary
├── AGENTS_DIRECTORY_ORGANIZATION.md        # This file
├── agent_leftover_work.md                  # Unfinished work tracking
│
├── handoff/                                # Handoff system
│   ├── LATEST_HANDOFF.md                   # Current handoff
│   └── archive/                            # Archived handoffs
│       └── [YYYY-MM-DD]_[Agent]_[Desc].md
│
├── changelogs/                             # Changelog and historical archives
│   ├── 01_AGENT_CHANGELOG.md               # Main changelog (chronological)
│   ├── 01_AGENT_CHANGELOG_LATEST.md        # Latest changelog (current day)
│   └── history_config.yml                  # Changelog configuration
│
├── performance/                            # Performance & analytics
│   ├── execution_plans/                    # Execution planning
│   ├── metrics/                            # Performance metrics
│   ├── prompts/                            # Prompt management
│   ├── reports/                            # Generated reports
│   └── reviews/                            # Performance reviews
│
├── implementation-plans/                   # Implementation plans system
│   ├── README.md                           # System documentation
│   ├── package.json                        # Dependencies & scripts
│   ├── config/                             # Configuration files
│   │   ├── plan-schema.json               # JSON schema validation
│   │   ├── metrics-config.json            # Metrics configuration
│   │   └── archive-config.json            # Archive configuration
│   ├── templates/                          # Plan templates
│   │   └── plan-template.md               # Standard plan template
│   ├── scripts/                            # Management scripts
│   │   └── create-plan.js                 # Plan creation script
│   ├── active/                             # Active plans
│   ├── archive/                            # Archived plans
│   ├── metrics/                            # Plan metrics
│   └── reports/                            # Plan reports
│
├── agents_docs_templates/                  # Documentation templates
│   ├── changelog_entry.md.tpl             # Changelog template
│   ├── jest_test.ts.tpl                   # Test template
│   ├── node_architecture.md.tpl           # Architecture template
│   └── [+6 files & 0 dirs]
│
└── reference/                              # Reference materials
    ├── kitchen/                            # Kitchen brigade references
    └── kos_chatgpt/                        # kOS ChatGPT references
```

---

## **🔧 Core Systems**

### **1. Agent Workflow System**
- **File**: `00_AGENT_WORKFLOW.md`
- **Purpose**: Mandatory workflow and process mandate
- **Key Features**:
  - Onboarding procedure
  - Changelog requirements
  - Implementation plans integration
  - Handoff process
  - Style & naming conventions

### **2. Changelog System**
- **File**: `01_AGENT_CHANGELOG.md`
- **Purpose**: Chronological project history
- **Key Features**:
  - Session-based logging
  - Major task tracking
  - Finding/Correction/Decision logging
  - Session summaries

### **3. Handoff System**
- **Directory**: `handoff/`
- **Purpose**: Agent-to-agent communication
- **Key Features**:
  - Current handoff tracking
  - Archived handoff history
  - Structured handoff templates

### **4. Performance System**
- **Directory**: `performance/`
- **Purpose**: Agent performance tracking
- **Key Features**:
  - Execution planning
  - Metrics collection
  - Prompt management
  - Performance reviews
  - Report generation

### **5. Implementation Plans System**
- **Directory**: `implementation-plans/`
- **Purpose**: Complex task management
- **Key Features**:
  - Plan creation & validation
  - Phase/milestone/task tracking
  - Metrics & analytics
  - Archive management
  - Template system

---

## **📊 System Integration**

### **Cross-System Dependencies**
1. **Workflow → Changelog**: All sessions must be logged
2. **Workflow → Handoff**: Session summaries inform handoffs
3. **Workflow → Implementation Plans**: Complex tasks use plans
4. **Performance → All Systems**: Metrics collected across all activities
5. **Implementation Plans → Performance**: Plan metrics feed performance system

### **Data Flow**
```
Agent Session → Changelog → Performance Metrics → Reports
     ↓
Implementation Plans → Metrics → Analytics → Handoff
```

---

## **🚀 Usage Guidelines**

### **For New Agents**
1. Read `00_AGENT_WORKFLOW.md` first
2. Review `02_SYSTEM_PROMPT.md` for identity
3. Check `handoff/LATEST_HANDOFF.md` for mission
4. Start logging in `01_AGENT_CHANGELOG.md`

### **For Complex Tasks**
1. Use implementation plans system:
   ```bash
   cd agents/implementation-plans
   npm run create
   ```
2. Track progress through phases/milestones/tasks
3. Update metrics and generate reports

### **For Performance Tracking**
1. All activities automatically feed performance system
2. Review metrics in `performance/metrics/`
3. Generate reports as needed

---

## **🔍 Maintenance**

### **Regular Tasks**
- **Daily**: Update changelog with session activities
- **Weekly**: Review performance metrics
- **Monthly**: Archive completed plans
- **Quarterly**: Generate comprehensive reports

### **System Health**
- Validate implementation plans against schema
- Check handoff archive for completeness
- Review performance metrics for trends
- Update templates as needed

---

## **📈 Future Enhancements**

### **Planned Features**
- Automated metrics collection
- AI-powered plan optimization
- Integration with external project management tools
- Advanced analytics and forecasting
- Cross-project plan coordination

### **Integration Opportunities**
- Git hooks for automatic logging
- CI/CD pipeline integration
- External monitoring systems
- Knowledge base integration

---

**Note**: This organization ensures all agent-related documentation and systems are properly organized within the `agents/` directory, maintaining clear separation of concerns and easy navigation for both agents and human developers. 

For a complete history of the actions that led to this handoff, please review my final session log in `agents/changelogs/01_AGENT_CHANGELOG.md` under the entry for **[YYYY-MM-DD]**. 