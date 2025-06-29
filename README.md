# Griot Node - kOS Foundation System

**The base installer and deployment system for the complete kOS (Kind Operating System) ecosystem**

## 🎯 **Project Overview**

**griot-node** is the foundational infrastructure system that provides the core protocols, specifications, and deployment framework for the entire kOS ecosystem. It implements the **Kind Link Framework (KLF)** and serves as the foundation from which all other kOS components are built.

## 📋 **Quick Start for Agents**

### **New Agent Bootstrap (5 minutes)**
```bash
# 1. Verify project location
pwd  # Should show: /Users/danger/CascadeProjects/griot-node

# 2. Read project overview (ESSENTIAL)
cat agents/[TIMESTAMP]00_PROJECT_OVERVIEW.md

# 3. Check system status
npm run build

# 4. Review handoff document for next agent
cat agents/[TIMESTAMP]_LATEST_HANDOFF.md
```

### **For Developers**
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run examples
npx tsx src/examples/basic-system.ts
```

## 🎯 **Current Status (Core Specification: 100% Complete)**

The foundational engineering specifications for the core kOS node classes are not **100% complete**. This project has successfully transformed the high-level `ai-q` concepts into a complete set of buildable blueprints.

### **✅ COMPLETED**
- **Core Infrastructure**: KLF protocol implementation in TypeScript.
- **Node Specifications**: 8 foundational node classes are fully specified with a rigorous, 5-part documentation structure for each.
- **Architecture**: Canonical principles established and implemented across all specifications.
- **API & Schema**: Every node has a complete KLF API, data models, and database schema defined.
- **Quality Standard**: A consistent, high-quality documentation standard has been established and applied universally.

### **📝 NEXT STEPS**
The next logical phase is the **implementation** of these nodes based on their completed specifications.
- **Implementation**: Build out the node implementations in `src/nodes/` based on the detailed blueprints in `ai-q/03_node_specifications/`.
- **Testing**: Develop a comprehensive test framework to validate each node's implementation against its specification.
- **Web UI**: Restore and modernize the archived `web-app` to interact with the fully implemented node network.

## 📁 **Project Structure**

### **Core Implementation**
```
src/                    # TypeScript implementation
├── core/               # KLF protocol and base systems
├── nodes/              # Node implementations (HTTP API, LLM, etc.)
├── examples/           # Working examples and demos
└── index.ts            # Main entry point
```

### **Specifications & Documentation**
The `ai-q` directory contains the complete engineering blueprints for the kOS ecosystem.
```
ai-q/
├── 01_foundation/          # Core architecture and kOS vision
├── 02_protocols/           # KLF and communication protocols
└── 03_node_specifications/ # Detailed blueprints for each node class
    ├── 01_Griot/           # Primal Starseed: Lifecycle & Bootstrapping
    │   ├── 00_Griot_Overview.md
    │   ├── 01_Griot_Architecture.md
    │   ├── 02_Griot_Data_Models.md
    │   ├── 03_Griot_KLF_API.md
    │   └── ... and more
    ├── 03_Tohunga/         # Sensory Organ: Data Acquisition
    ├── 04_Ronin/           # Pathfinder: Network Discovery
    ├── 05_Musa/            # Guardian: Security & Auth
    ├── 06_Hakim/           # Healer: System Health & Maintenance
    ├── 07_Skald/           # Herald: Pub/Sub & Eventing
    ├── 08_Oracle/          # Seer: Reasoning & Data Fusion
    └── ... (5 more conceptual stubs)
```

### **Agent Coordination & Workflow**
The `agents/` directory contains the mandatory workflow and historical logs for all agent activity. The process is designed to be simple, auditable, and consistent.

-   `agents/[TIMESTAMP]_00_AGENT_WORKFLOW.md`: **The Rulebook.** All agents MUST follow the process defined in this file.
-   `agents/handoff/[TIMESTAMP]_LATEST_HANDOFF.md`: **The Current Task.** The single source of truth for the next agent's mission.
-   `agents/[TIMESTAMP]_01_AGENT_CHANGELOG.md`: **The Project Journal.** A running log of all actions, findings, and decisions made by every agent.

```
agents/
├── [TIMESTAMP]_00_AGENT_WORKFLOW.md       # MANDATORY: The rules for all agents.
├── [TIMESTAMP]_01_AGENT_CHANGELOG.md      # The running history of the project.
└── handoff/
    ├── [TIMESTAMP]_LATEST_HANDOFF.md      # The official task for the NEXT agent.
    └── archive/               # Historical handoff documents.
```

## 🏗️ **Architecture Overview**

### **kOS Ecosystem Relationship**
```
griot-node (FOUNDATION)
    ↓ Provides KLF protocol & core infrastructure
    ↓ 
kai-cd (NEW) ← TO BE BUILT
    ↓ Browser extension frontend
    ↓
Complete kOS Ecosystem
```

### **Kind Link Framework (KLF)**
- **Message Protocol**: Typed communication between nodes
- **Transport System**: WebSocket with auto-reconnection
- **Node Management**: Lifecycle and health monitoring
- **Event System**: Pub/sub messaging patterns

## 🚀 **API Examples**

### **Basic Node Communication**
```typescript
import { createNodeManager, createMessage, MessageType } from './src';

const manager = createNodeManager();
const message = createMessage()
  .from('source-node')
  .to('target-node') 
  .type(MessageType.DATA_QUERY)
  .payload({ query: 'SELECT * FROM users' })
  .build();

await manager.routeMessage(message);
```

### **HTTP API Bridge**
```bash
# Start the example system
npx tsx src/examples/basic-system.ts

# Test HTTP to KLF bridge
curl http://localhost:3000/echo -d '{"message":"Hello kOS"}'
```

## 📋 **Quality Standards**

All work follows established patterns:
- **TypeScript Strict**: No `any` types, full type safety
- **Specifications**: 700+ lines with complete API docs
- **Cultural Attribution**: Respectful community consultation language
- **Architecture**: Framework-first, not application-specific

## 🔄 **Development Workflow**

The development workflow is now enforced by the rules in `agents/[TIMESTAMP]_00_AGENT_WORKFLOW.md`.

### **For Agents**
1.  **Onboard**: Read `agents/[TIMESTAMP]_00_AGENT_SYSTEM_PROMPT.md` and `agents/bootstrap/[TIMESTAMP]_01_AGENT_WORKFLOW.md` and `agents/bootstrap/[TIMESTAMP]_02_PROJECT_CONTEXT.json` and `agents/bootstrap/[TIMESTAMP]_03_AGENT_RULES.md` and `agents/handoff/[TIMESTAMP]_LATEST_HANDOFF.md`
2.  **Execute**: Perform the task defined in the handoff, following the established quality standards.
3.  **Log**: Document all actions, findings, and errors in `agents/changelog/[TIMESTAMP]_01_AGENT_CHANGELOG.md`.
4.  **Handoff**: Follow the procedure in the workflow to archive the old handoff first and then create a new one. Do not overwrite the old handoff before archiving it!

### **For Implementation**
1. **Select a node class from `ai-q/03_node_specifications/`.**
2. **Implement the node in `src/nodes/` following its blueprint precisely.**
3. Adhere to the defined KLF message patterns, data models, and database schema.
4. Maintain TypeScript strictness
5. Test with working examples

## 🎯 **Next Steps Options**

### **Option A: Complete Documentation**
Expand the 5 remaining node specifications:
- Archon Node (Byzantine coordination)
- Yachay Node (Andean wisdom)
- Sachem Node (Algonquian consensus)  
- Amauta Node (Incan teaching)
- Mzee Node (Swahili awareness)

### **Option B: Implementation**
Restore and enhance archived systems:
- FastAPI backend integration
- React frontend modernization
- Database layer implementation
- Complete testing framework

## ⚠️ **Important Notes**

### **Project Timeline Context**
- **kai-cd (old)**: Obsolete prototype from before griot-node design
- **griot-node**: Current foundation system (you are here). The specifications are now complete.
- **kai-cd (new)**: Future browser extension to be built FROM the `griot-node` implementation

### **Agent Guidelines**
- Work in `agents/` directory for coordination
- Use ai-q specifications as authority
- Don't reference old kai-cd patterns
- Maintain detailed execution logs

## 📚 **Key Documentation**

**Essential Reading Order:**
1.  `agents/00_AGENT_WORKFLOW.md` - The mandatory process for all contributors.
2.  `agents/handoff/LATEST_HANDOFF.md` - The current task.
3.  `ai-q/01_foundation/01_Architecture_Principles.md` - Core design principles.
4.  Browse the `ai-q/03_node_specifications/` directories to understand the detailed architecture of each node.

## 🤝 **Contributing**

1.  Follow the mandatory workflow in `agents/00_AGENT_WORKFLOW.md`.
2.  Use established patterns from completed work in `ai-q/`.
3.  Maintain TypeScript strictness and quality standards
4.  Update documentation with detailed progress logs
5.  Present work to user for final verification

## Environment Configuration

All environment variables are loaded and managed centrally via `@griot/core`.

- Use `getEnvironmentConfig()` from `@griot/core` in all packages and apps.
- Do **not** use `dotenv` or `process.env` directly in your code.
- See `packages/core/src/config/environment.ts` for the full list of supported variables and types.

## Test Structure

- All integration and system test scripts are in the `tests/` directory.
- To run all tests:
  ```bash
  npm run test
  ```
- To add a new test, place it in the appropriate subfolder of `tests/`.

## Build and Run

- Build all packages before running any app:
  ```bash
  npm install
  npm run build
  ```
- Each app may have a `prestart` script to check that all packages are built.

---

**Core Specifications**: 100% Complete | **Next Phase**: Implementation
**Last Updated**: 2025-01-28 | **Contact**: See `agents/` directory for coordination 