# kOS Agents System - Single Entry Point

**Purpose**: This is the **single entry point** for all AI agents working on the kOS project. Read this file first, then use the optimized onboarding command below.

---

## 🚀 **Quick Start for Agents**

### **Single Command Onboarding**
Execute this command to load all essential information:

```bash
cat agents/README.md && echo "\n---" && cat agents/bootstrap/00_AGENT_WORKFLOW.md && echo "\n---" && cat agents/handoff/LATEST_HANDOFF.md
```

This loads:
1. **This README** - System overview and structure
2. **Agent Workflow** - Core process and rules
3. **Latest Handoff** - Current mission and context

---

## 📋 **System Overview**

### **Core Mission**
Build **kOS: The Kindai Operating System** - an AI-driven orchestration framework that provides intelligent nodes (Griot, Tohunga, etc.) through the Kind Link Framework (KLF).

### **Current Project State**
- **Main Repo**: `/Users/danger/CascadeProjects/griot-node`
- **Reference Only**: `/Users/danger/CascadeProjects/kai-cd` (archived)
- **Status**: PersonaVectorizationService implemented, ready for RAG operations extension

### **Key Infrastructure**
- **Databases**: MongoDB, PostgreSQL, Weaviate, Neo4j (all configured)
- **RAG Operations**: Full 387-line skill with hybrid search
- **Persona System**: Vectorization service with <5s processing time
- **Proven Patterns**: PricingRAGService demonstrates successful integration

---

## 🏗️ **Optimized Directory Structure**

```
agents/
├── README.md                    # ← You are here (single entry point)
├── config/                      # AI-optimized configurations (JSON/YAML)
│   ├── system_config.json      # Core identity & principles
│   ├── workflow_rules.yaml     # Process & procedures
│   ├── project_context.json    # Current state & mission
│   ├── architecture.json       # System architecture
│   ├── changelog.json          # Historical sessions
│   ├── changelog_config.yml    # Changelog configuration
│   ├── plan-schema.json        # Plan schema definitions
│   ├── metrics-config.json     # Metrics configuration
│   ├── archive-config.json     # Archive configuration
│   └── README.md               # Config documentation
├── bootstrap/                   # Core agent system (Markdown)
│   ├── 00_AGENT_WORKFLOW.md    # Process and rules (loaded by onboarding)
│   ├── 01_AGENT_CHANGELOG.md   # Current session log
│   ├── 02_SYSTEM_PROMPT.md     # Agent identity and principles
│   └── archive/                # Historical versions
├── handoff/                    # Agent handoff system (Markdown)
│   ├── LATEST_HANDOFF.md       # Current mission (loaded by onboarding)
│   └── archive/                # Historical handoffs
├── performance/                # Performance tracking (Markdown + YAML)
│   ├── metrics/                # Performance metrics
│   ├── reports/                # Performance reports
│   ├── reviews/                # Performance reviews
│   └── archive/                # Performance archives
├── analysis/                   # Project analysis (Markdown)
│   ├── README.md               # Analysis system overview
│   └── archive/                # Analysis archives
├── implementation-plans/       # Development plans (Markdown)
│   ├── active/                 # Current plans
│   ├── backlog/                # Future plans
│   └── archive/                # Completed plans
├── templates/                  # Templates & schemas (Markdown)
│   ├── handoff_templates/      # Handoff templates
│   ├── changelog_templates/    # Changelog templates
│   └── report_templates/       # Report templates
├── scripts/                    # Utility scripts (Shell/Python)
│   ├── archive_monthly.sh      # Archive automation
│   └── performance_tracking.sh # Performance scripts
└── reference/                  # Reference materials (Markdown)
    ├── kitchen/                # Kitchen brigade patterns
    ├── kos_chatgpt/            # kOS ChatGPT integration
    └── vector/                 # Vector system reference
```

---

## ⚡ **Format Optimization Strategy**

### **JSON/YAML Files** (AI-Optimized)
- **Purpose**: Machine-readable, structured data for AI processing
- **Files**: `config/*.json`, `config/*.yaml`
- **Benefits**: Fast parsing, queryable, reduced context window usage

### **Markdown Files** (Human + AI Readable)
- **Purpose**: Narrative content, procedural instructions, documentation
- **Files**: `bootstrap/*.md`, `handoff/*.md`, `analysis/*.md`, `performance/*.md`
- **Benefits**: Rich formatting, code examples, hierarchical structure

### **Scripts** (Executable)
- **Purpose**: Automation and utility functions
- **Files**: `scripts/*.sh`, `scripts/*.py`
- **Benefits**: Direct execution, automation capabilities

---

## 🎯 **Current Mission Context**

### **Immediate Priority**
Extend RAG operations for persona context integration and design database schema for personas.

### **Success Metrics**
- **Performance**: Vectorization <5s, Search <200ms, Memory <100ms
- **Quality**: Persona relevance >90%, Knowledge coverage >95%
- **Integration**: System uptime >99.9%, Data consistency <0.1%

### **Key Files to Focus On**
- `packages/data/core/rag/persona_vectorization_service.ts`
- `packages/data/skills/ai/persona_vectorization.yaml`
- `packages/data/core/rag/persona_rag_service.ts` (to be created)

---

## 📚 **Additional Resources**

### **Architecture Documentation**
- `ai-q/04_architecture/02_AI_Orchestration_Framework.md` - Project constitution
- `ai-q/03_node_specifications/` - Complete node specifications

### **Development Guidelines**
- `ai-q/07_development/02_File_Size_and_Modularization_Guide.md` - File size standards
- `agents/bootstrap/00_AGENT_WORKFLOW.md` - Detailed workflow process

### **Performance & Analysis**
- `agents/performance/` - Performance metrics and optimization
- `agents/analysis/` - Project analysis and insights

---

## 🔄 **Workflow Integration**

### **For GPT-Based Agents**
- **Mandatory**: Complete tasks end-to-end before reporting
- **Required**: Fix all errors found, don't just report them
- **Prohibited**: Partial work, progress reports without completion
- **Prompt Format**: Use "Fix X completely. Don't stop until it's done."

### **Documentation Requirements**
- Update `agents/bootstrap/01_AGENT_CHANGELOG.md` with session summary
- Create comprehensive `agents/handoff/LATEST_HANDOFF.md` before archiving
- Update all relevant documentation before completing handoff

---

## 🎯 **Format Recommendations by System**

| System | Format | Reason | Example Files |
|--------|--------|---------|---------------|
| **Handoff** | Markdown | Narrative context, complex directives | `LATEST_HANDOFF.md` |
| **Workflow** | Markdown | Procedural instructions, templates | `00_AGENT_WORKFLOW.md` |
| **Changelog** | JSON | Structured data, queryable history | `config/changelog.json` |
| **System Config** | JSON | Machine-readable identity | `config/system_config.json` |
| **Project Context** | JSON | Structured state data | `config/project_context.json` |
| **Architecture** | JSON | System design data | `config/architecture.json` |
| **Performance** | YAML | Metrics and configuration | `config/metrics-config.json` |
| **Analysis** | Markdown | Narrative insights | `analysis/README.md` |
| **Plans** | Markdown | Human-readable plans | `implementation-plans/` |
| **Templates** | Markdown | Reusable templates | `templates/` |
| **Scripts** | Shell/Python | Executable automation | `scripts/` |

---

**Next Step**: Execute the onboarding command above to load the complete context and begin your mission.