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

## 🏗️ **Directory Structure**

```
agents/
├── README.md                    # ← You are here (single entry point)
├── bootstrap/                   # Core agent system files
│   ├── 00_AGENT_WORKFLOW.md    # Process and rules (loaded by onboarding)
│   ├── 01_AGENT_CHANGELOG.md   # Project history
│   ├── 02_SYSTEM_PROMPT.md     # Agent identity and principles
│   └── archive/                # Historical versions
├── handoff/                    # Agent handoff system
│   ├── LATEST_HANDOFF.md       # Current mission (loaded by onboarding)
│   └── archive/                # Historical handoffs
├── analysis/                   # Project analysis and insights
├── implementation-plans/       # Development plans and tracking
├── performance/                # Performance metrics and optimization
└── reference/                  # Reference materials and examples
```

---

## ⚡ **Optimized Information Loading**

### **AI-Optimized Formats**
The following files have been converted to JSON/YAML for optimal AI processing:

- **System Configuration**: `agents/config/system_config.json`
- **Workflow Rules**: `agents/config/workflow_rules.yaml`
- **Project Context**: `agents/config/project_context.json`
- **Architecture Overview**: `agents/config/architecture.json`

### **Reduced Context Window Usage**
- **Before**: 4 separate markdown files (~800 lines total)
- **After**: 1 README + 3 optimized config files (~200 lines total)
- **Savings**: ~75% reduction in context window usage

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

**Next Step**: Execute the onboarding command above to load the complete context and begin your mission.