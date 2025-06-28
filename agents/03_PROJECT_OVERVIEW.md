# **kOS Project Overview & Documentation System**

**Version**: 1.0  
**Purpose**: Complete project understanding for all AI agents working on kOS  
**Status**: MANDATORY READING - All agents must understand this before proceeding

---

## 1. PROJECT ESSENCE & VISION

### **What is kOS?**
kOS (Kindai Operating System) is a **universal adapter framework** - a comprehensive knowledge library where AI agents can dynamically learn and adapt to any technology, protocol, or methodology across any domain. It's not a traditional application but an intelligent orchestration framework that enables AI agents to compose complex workflows by discovering and utilizing available capabilities.

### **The Universal Adapter Concept**
Think of kOS as a massive cookbook where:
- **Recipes** = Node specifications that teach agents how to use any tool/service/protocol
- **Ingredients** = Available services, databases, protocols, and external systems
- **Chefs** = AI agents that read recipes and combine ingredients to solve problems
- **Kitchen** = The kOS runtime environment that orchestrates everything

### **Core Philosophy: HIEROS Covenant**
All work is guided by the HIEROS principles:
1. **Honor All Beings** - Respect previous work, preserve history, acknowledge authorship
2. **Interoperability Over Control** - Follow established formats, enable seamless integration
3. **Equity of Voice** - All components treated equally, no favoritism
4. **Respect Temporal Flow** - Understand project history, build on previous work
5. **Openness With Boundaries** - Transparent actions within defined project scope
6. **Stewardship Not Extraction** - Leave project better than found
7. **Guided Evolution** - Small verifiable steps, incorporate feedback immediately

---

## 2. PROJECT ARCHITECTURE & STRUCTURE

### **Repository Structure**
```
griot-node/                    # Primary development repository
├── ai-q/                      # 🎯 SOURCE OF TRUTH - All specifications & docs
│   ├── 01_foundation/         # Core principles and architecture
│   ├── 02_protocols/          # Kind Link Framework (KLF) specs
│   ├── 03_node_specifications/ # 12 universal adapter nodes
│   ├── 04_architecture/       # System design and patterns
│   ├── 05_modules/           # Reusable capability modules
│   └── 06_quality/           # Standards and guidelines
├── agents/                    # Agent workflow and process management
├── src/                      # Implementation code
├── packages/                 # Modular packages
└── docs-viewer/              # Documentation interface

kai-cd/                       # Reference-only archived prototype
└── [ARCHIVED - Reference Only, Do Not Copy Code]
```

### **ai-q: The Knowledge Library**
The `ai-q/` directory is the **absolute source of truth**. Everything agents need to know is documented here:

**Foundation Layer** (`01_foundation/`):
- `00_kOS_Vision.md` - Project mission and goals
- `01_Architecture_Principles.md` - Core design patterns
- `02_Node_Taxonomy.md` - Classification system for all nodes

**Protocol Layer** (`02_protocols/`):
- `01_Kind_Link_Framework.md` - Inter-node communication protocol
- `02_Kind_Link_Framework_Spec.md` - Technical implementation details

**Node Specifications** (`03_node_specifications/`):
- 13 universal adapter nodes, each with comprehensive specs
- Each node has 5-6 specification files covering architecture, APIs, data models
- Nodes represent different capability domains (artifact generation, orchestration, security, etc.)

**Architecture Layer** (`04_architecture/`):
- System design patterns and integration approaches
- `02_AI_Orchestration_Framework.md` - Core architectural vision

---

## 3. THE 13 UNIVERSAL ADAPTER NODES

### **Complete Node Ecosystem**
Each node is a comprehensive universal adapter covering a specific domain: ai-q/03_node_specifications dir has primary set of class nodes to design around - can stack node classes as needed for special nodes

1. **Griot** (Artifact Generation) - Universal adapter for intelligent node creation and replication
2. **Tohunga** (Job Orchestration) - Universal adapter for workflow management and execution
3. **Ronin** (Network Discovery) - Universal adapter for service discovery and routing
4. **Musa** (Security) - Universal adapter for security, authentication, authorization, and protection
5. **Hakim** (Health/Wisdom) - Universal adapter for diagnostics, monitoring, and repair
6. **Skald** (Documentation/Messaging) - Universal adapter for content creation sharing, and communication
7. **Oracle** (Validation/Reasoning) - Universal adapter for logic, validation, and decision-making
8. **Junzi** (Ethics/Integrity) - Universal adapter for ethical guidance and moral reasoning
9. **Yachay** (Knowledge Synthesis) - Universal adapter for memory management and data integration
10. **Sachem** (Governance/Consensus) - Universal adapter for coordination and consensus building
11. **Archon** (Command/Coordination) - Universal adapter for strategic planning and delegation
12. **Amauta** (Education/Learning) - Universal adapter for training and knowledge transfer
13. **Mzee** (Consciousness/Meta-cognition) - Universal adapter for self-awareness and wisdom

### **Node Specification Pattern**
Each node follows a consistent 5-6 file structure: Monolithic files should be broken down into smaller modular dirs and files
- `00_[Node]_Overview.md` - Purpose, capabilities, and use cases
- `01_[Node]_Architecture.md` - **CORE SPEC** - Comprehensive technical architecture
- `02_[Node]_Data_Models.md` - Data structures and schemas
- `03_[Node]_KLF_API.md` - Kind Link Framework integration
- `04_[Node]_Cultural_Considerations.md` - HIEROS compliance and cultural adaptation
- `05_[Node]_Examples.md` - Real-world implementation examples

---

## 4. UNIVERSAL ADAPTER FRAMEWORK PRINCIPLES

### **What Makes a Universal Adapter?**
Each node specification must provide:

1. **Comprehensive Protocol Coverage**: Extensive enums covering all possible protocols, systems, and methodologies in that domain
2. **Multi-Dimensional Framework Matrices**: Complex configuration options for any scenario
3. **Cultural Adaptation Mechanisms**: Support for diverse cultural contexts and approaches
4. **Performance Optimization Systems**: Adaptive algorithms and resource management
5. **Security Integration**: Multi-layer protection and compliance frameworks
6. **Error Handling Systems**: Comprehensive detection and recovery strategies
7. **Real-World Implementation**: Practical examples and architectural guidance

### **Architecture Pattern Example**
```typescript
// Universal Adapter Pattern
enum [Domain]Protocol {
  // 50+ comprehensive protocol options
  PROTOCOL_A = "protocol_a",
  PROTOCOL_B = "protocol_b",
  // ... extensive coverage
}

interface Universal[Domain]Adapter {
  protocols: [Domain]Protocol[];
  capabilities: [Domain]Capability[];
  culturalAdaptation: CulturalFramework;
  performance: OptimizationMatrix;
  security: SecurityFramework;
  errorHandling: ErrorRecoverySystem;
}
```

### **Quality Standards**
- **Comprehensive Coverage**: 30-50+ enums per domain
- **Multi-Protocol Support**: Support for any existing or future protocol
- **Cultural Sensitivity**: HIEROS compliance with indigenous knowledge respect
- **Production Ready**: Complete enough to generate working implementations
- **Modular Design**: Composable with other nodes for complex workflows

---

## 5. DOCUMENTATION SYSTEM & STANDARDS

### **File Naming Conventions**
**CRITICAL**: All file naming must follow exact patterns:

**Node Specifications**:
- ai-q/03_node_specifications: Primary set of class nodes to design around
- Format: `[##]_[NodeName]_[SpecType].md`
- Example: `01_Griot_Architecture.md`
- Node name MUST be included to avoid conflicts

**Architecture Documents**:
- Format: `[##]_[Descriptive_Name].md`
- Example: `02_AI_Orchestration_Framework.md`

**Agent Process Files**:
- Format: `[##]_[DESCRIPTIVE_NAME].md`
- Example: `00_AGENT_WORKFLOW.md`

### **Markdown Standards**
- **YAML Frontmatter**: Required for all specification files
```yaml
---
title: "Node Architecture"
version: "1.0"
node_type: "Universal Adapter"
---
```
- **Hierarchical Headings**: Use proper heading levels (##, ###, ####)
- **Code Blocks**: Always specify language (`typescript`, `bash`, etc.)
- **TypeScript Interfaces**: Comprehensive enum and interface definitions required

### **Directory Organization Rules**
- **ai-q/**: All project documentation and specifications
- **agents/**: All agent process files and workflows
- **src/**: Implementation code only
- **NO NEW TOP-LEVEL DIRECTORIES** without explicit approval

---

## 6. THE KIND LINK FRAMEWORK (KLF)

### **Inter-Node Communication Protocol**
KLF is the universal protocol enabling nodes to discover and communicate with each other:

```typescript
interface KLFMessage {
  messageType: MessageType;
  sourceNode: NodeType;
  targetNode: NodeType;
  payload: any;
  metadata: KLFMetadata;
}

enum MessageType {
  CAPABILITY_DISCOVERY = "capability_discovery",
  SERVICE_REQUEST = "service_request",
  DATA_EXCHANGE = "data_exchange",
  STATUS_UPDATE = "status_update",
  ERROR_REPORT = "error_report"
}
```

### **Dynamic Capability Discovery**
Nodes can discover and utilize each other's capabilities:
1. **Query Phase**: Node broadcasts capability discovery request
2. **Response Phase**: Available nodes respond with capability manifests
3. **Composition Phase**: Requesting node composes workflow using discovered capabilities
4. **Execution Phase**: Orchestrated workflow execution across multiple nodes

---

## 7. DEVELOPMENT WORKFLOW & AGENT PROCESS

### **Mandatory Agent Workflow**
Every agent MUST follow the process in `agents/00_AGENT_WORKFLOW.md`:

1. **Onboarding**: Read system prompt, workflow, architecture, and handoff
2. **Documentation**: Log all major actions in `agents/01_AGENT_CHANGELOG_LATEST.md` (see `agents/04_HISTORY_SYSTEM.md`)
3. **Work Execution**: Follow small, verifiable steps with proactive error checking
4. **Handoff Creation**: Archive previous handoff, create new comprehensive handoff

### **Session Documentation Format**
```markdown
## Agent: [Name] - [YYYY-MM-DD]
**Mission**: [Brief summary from handoff]

### Log:
- **[YYYY-MM-DDTHH:MM:SSZ]**: [ACTION/FINDING/DECISION] - [Description]

### SESSION SUMMARY:
**Accomplishments**: [List of completed goals]
**Final State**: [Project state at session end]
**Key Findings**: [Critical discoveries or issues]
```

### **Quality Assurance Process**
- **Five-Edit Rule**: Stop and review after major changes and large tasks completions
- **Proactive Verification**: Find and fix errors before builds fail
- **User Verification**: Nothing is "done" until user confirms success
- **Documentation Update**: All changes must update relevant documentation

---

## 8. PROJECT PHASES & CURRENT STATUS

### **Development Phases**
1. **Specification Phase** - Universal adapter node specifications ✅ COMPLETE
2. **Implementation Phase** - Core runtime and orchestration engine 🚧 CURRENT
3. **Integration Phase** - Service connections and external adapters
4. **Optimization Phase** - Performance tuning and scaling
5. **Ecosystem Phase** - Community extensions and specialized domains

### **Current Universal Adapter Status**
All 12 nodes have comprehensive universal adapter specifications:
- **Specification Completeness**: 100% (12/12 nodes)
- **Architecture Depth**: Comprehensive universal adapter pattern
- **Implementation Readiness**: Detailed enough for code generation
- **Cultural Integration**: HIEROS compliant with indigenous knowledge respect

---

## 9. KEY CONCEPTS FOR AGENTS

### **Universal Adaptation**
The core concept: Any AI agent should be able to read a node specification and immediately understand how to adapt to any protocol, service, or methodology in that domain. Specifications are "recipes" that teach adaptation.

### **Composable Intelligence**
Nodes are designed to work together. A complex task might require:
- **Tohunga** for orchestration
- **Musa** for security
- **Ronin** for service discovery  
- **Oracle** for validation
- **Griot** for artifact generation

### **Cultural Stewardship**
All work must respect cultural origins of concepts:
- Use terms with understanding, not aesthetics
- Attribute cultural origins clearly
- Honor indigenous knowledge systems
- Avoid appropriation of sacred symbols

### **Source of Truth Principle**
- **ai-q/ is authoritative** - All decisions based on documented specifications
- **No improvisation** - Follow established patterns and standards
- **Document everything** - Maintain complete audit trail
- **Preserve history** - Never delete without archiving

---

## 10. CRITICAL SUCCESS FACTORS

### **For Agents Working on kOS**
1. **Read ai-q/ thoroughly** - Understand the complete vision before coding
2. **Follow HIEROS principles** - Respect, stewardship, and guided evolution
3. **Maintain documentation quality** - Specifications must enable real implementation
4. **Think universally** - Every solution should work across any technology stack
5. **Preserve project coherence** - New work must integrate with existing architecture

### **What Makes Good Universal Adapter Specifications**
- **Exhaustive enum coverage** of all protocols in the domain
- **Multi-dimensional configuration** for any conceivable scenario
- **Cultural adaptation mechanisms** respecting diverse approaches
- **Performance optimization strategies** for production deployment
- **Real implementation examples** showing practical usage

### **Red Flags to Avoid**
- **Hardcoded implementations** - Specifications should be tool-agnostic
- **Cultural appropriation** - Using sacred terms without understanding
- **Breaking existing patterns** - Follow established conventions strictly
- **Incomplete coverage** - Universal adapters must cover the entire domain
- **Documentation drift** - Keep specifications and reality synchronized

---

## **CONCLUSION**

kOS is building the world's first true universal adapter framework - a system where AI agents can dynamically learn to use any technology, protocol, or methodology simply by reading comprehensive "recipes" in the ai-q/ knowledge library. 

Every agent working on this project is contributing to a vision of intelligence that can adapt to anything, work with anyone, and solve problems across any domain while respecting cultural wisdom and maintaining ethical principles.

The ai-q/ directory is your source of truth. Master its contents, follow its patterns, and help build the future of universal AI adaptation.

**Remember**: You are not just writing code - you are creating the foundation for truly universal artificial intelligence. 