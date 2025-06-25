---
title: "Cultural Node Taxonomy: The 13 Classes of kOS"
description: "Complete classification system for all kOS node types with cultural grounding and technical specifications"
type: "taxonomy"
status: "canonical"
priority: "critical"
last_updated: "2025-01-28"
version: "1.0.0"
agent_notes: "Definitive reference for all node class implementations - cultural authenticity and technical accuracy required"
---

# Cultural Node Taxonomy: The 13 Classes of kOS

**Complete Classification System for All kOS Node Types**

This document defines the complete taxonomy of node classes in the kOS ecosystem. Each class represents a specific cultural wisdom tradition and technical specialization, working together to create a comprehensive decentralized AI system.

## 🏛️ Taxonomy Overview

### **Class Organization**
The 13 node classes are organized into 4 tiers based on their role in the kOS ecosystem:

```
🏛️ kOS NODE HIERARCHY
├── 🌱 Foundation Tier (Knowledge Keepers)
│   ├── Griot (Seed & Distribution)
│   ├── Tohunga (Research & Curation)
│   └── Ronin (Exploration & Discovery)
├── ⚙️ Service Tier (Specialized Workers)
│   ├── Musa (Security & Protection)
│   ├── Hakim (Diagnostics & Healing)
│   ├── Skald (Creative & Media)
│   └── Oracle (Analytics & Prediction)
├── ⚖️ Governance Tier (System Stewards)
│   ├── Junzi (Ethics & Integrity)
│   ├── Yachay (Knowledge & Models)
│   └── Sachem (Consensus & Governance)
└── 👑 Elder Tier (Wisdom Guides)
    ├── Archon (Federation & Orchestration)
    ├── Amauta (Culture & Mentorship)
    └── Mzee (Advisory & Wisdom)
```

## 🌱 Foundation Tier: The Knowledge Keepers

### **01. Griot - The Seed & Librarian**
**Cultural Origin**: West African oral historian and storyteller  
**Sacred Role**: Preserve, package, and spread knowledge  
**Technical Function**: Seed distribution and package management

#### **Core Responsibilities**
- **Package Build**: Assemble ai-q artifact trees for releases
- **Deployment**: Provide interactive installers (CLI/TUI/Web)
- **Sync & Update**: Manage system updates and peer-to-peer distribution
- **Repair**: System health monitoring and component restoration
- **Ethics Stewardship**: Maintain HIEROS foundational code and Sacred Intentions

#### **Services Exposed**
- `griot-api` (FastAPI) on **:30437** - REST endpoints for sync, manifest, packages
- `griot-web` (React UI) - Status dashboard and manual updates

#### **CLI Interface**
```bash
kos-griot init           # create seed artifact tree
kos-griot build          # compile ISO/tarball packages
kos-griot install        # run local installer wizard
kos-griot sync           # fetch and apply updates
kos-griot doctor         # repair broken or missing components
```

---

### **02. Tohunga - The Research & Lore Curator**
**Cultural Origin**: Māori expert and master craftsperson  
**Sacred Role**: Acquire, validate, and curate knowledge assets  
**Technical Function**: Research librarian and data curator

#### **Core Responsibilities**
- **Knowledge Acquisition**: Mirror datasets and models from public sources
- **Provenance & Licensing**: Validate compliance and track origins
- **Pre-Processing**: Generate embeddings and dataset statistics
- **API Publication**: Expose datasets and models via REST endpoints
- **HIEROS Alignment**: Validate content for cultural respect and bias

#### **Services Exposed**
- `tohunga-api` (FastAPI) on **:30438** - Query and upload datasets/models
- `tohunga-search` (Elastic/Typesense) on **:7700** - Semantic search

#### **CLI Interface**
```bash
kos-tohunga ingest <url-or-path>   # import new artifact  
kos-tohunga curate <id>            # add metadata and tags
kos-tohunga publish                # push to Griot distribution
kos-tohunga stats <id>             # view metrics and analytics
```

---

### **03. Ronin - The Explorer & Pathfinder**
**Cultural Origin**: Japanese masterless expert  
**Sacred Role**: Independent exploration and discovery  
**Technical Function**: Network discovery and capability mapping

#### **Core Responsibilities**
- **Service Discovery**: Scan networks for available services
- **Capability Mapping**: Document available functions and APIs
- **Path Finding**: Establish optimal connection routes
- **Quality Assessment**: Evaluate service reliability and performance
- **Independence**: Operate without central coordination

#### **Services Exposed**
- `ronin-discovery` on **:30439** - Network scanning and service discovery
- `ronin-mapper` - Capability mapping and documentation

#### **CLI Interface**
```bash
kos-ronin scan <network>          # discover available services
kos-ronin map <service>           # document service capabilities
kos-ronin route <source> <dest>   # find optimal connection path
kos-ronin assess <service>        # evaluate service quality
```

## ⚙️ Service Tier: The Specialized Workers

### **04. Musa - The Security Guardian**
**Cultural Origin**: Korean guardian-warrior  
**Sacred Role**: Protection and security enforcement  
**Technical Function**: Security protocols and threat detection

#### **Core Responsibilities**
- **Authentication**: Manage identity verification and access control
- **Encryption**: Implement cryptographic protocols
- **Threat Detection**: Monitor for security violations
- **Access Control**: Enforce permission and authorization systems
- **Security Auditing**: Continuous security assessment

#### **Services Exposed**
- `musa-auth` on **:30440** - Authentication and authorization
- `musa-vault` - Secure credential storage and management

---

### **05. Hakim - The Wise Healer**
**Cultural Origin**: Arabic/Persian wise healer  
**Sacred Role**: System health and diagnostic wisdom  
**Technical Function**: Monitoring and diagnostics

#### **Core Responsibilities**
- **Health Monitoring**: Continuous system health assessment
- **Diagnostic Analysis**: Root cause analysis of system issues
- **Performance Optimization**: System tuning and optimization
- **Recovery Protocols**: Automated healing and restoration
- **Preventive Care**: Proactive maintenance and health preservation

#### **Services Exposed**
- `hakim-monitor` on **:30441** - Health monitoring and metrics
- `hakim-diagnostics` - Diagnostic analysis and recommendations

---

### **06. Skald - The Creative Storyteller**
**Cultural Origin**: Old Norse poet-historian  
**Sacred Role**: Creative expression and narrative generation  
**Technical Function**: Content creation and media processing

#### **Core Responsibilities**
- **Content Generation**: Create text, images, audio, and video
- **Media Processing**: Transform and optimize media files
- **Narrative Construction**: Build coherent stories and presentations
- **Creative Workflows**: Manage complex creative pipelines
- **Cultural Storytelling**: Preserve and share cultural narratives

#### **Services Exposed**
- `skald-creative` on **:30442** - Content generation and media processing
- `skald-narrative` - Story construction and narrative tools

---

### **07. Oracle - The Predictive Seer**
**Cultural Origin**: Ancient prophetic role  
**Sacred Role**: Insight and predictive analytics  
**Technical Function**: Analytics and forecasting

#### **Core Responsibilities**
- **Data Ingestion**: Collect and normalize metrics and events
- **Predictive Modeling**: Forecast trends and future states
- **Insight Delivery**: Provide actionable intelligence
- **Scenario Simulation**: Model potential futures and outcomes
- **Strategic Guidance**: Inform decision-making with data

#### **Services Exposed**
- `oracle-forecast` on **:30443** - Predictive analytics and forecasting
- `oracle-insights` - Strategic intelligence and recommendations

## ⚖️ Governance Tier: The System Stewards

### **08. Junzi - The Integrity Steward**
**Cultural Origin**: Classical Chinese noble character  
**Sacred Role**: Ethical guidance and moral reasoning  
**Technical Function**: Ethics validation and integrity monitoring

#### **Core Responsibilities**
- **Ethics Validation**: Ensure all operations align with Sacred Intentions
- **Integrity Monitoring**: Detect and prevent moral violations
- **Moral Reasoning**: Provide ethical guidance for complex decisions
- **Character Assessment**: Evaluate the moral standing of actors
- **Virtue Cultivation**: Promote ethical behavior and growth

#### **Services Exposed**
- `junzi-ethics` on **:30444** - Ethics validation and moral reasoning
- `junzi-integrity` - Integrity monitoring and character assessment

---

### **09. Yachay - The Knowledge Hub**
**Cultural Origin**: Quechua word for knowledge  
**Sacred Role**: Centralized knowledge and wisdom repository  
**Technical Function**: Comprehensive knowledge management

#### **Core Responsibilities**
- **Knowledge Storage**: Maintain comprehensive knowledge databases
- **Model Registry**: Manage AI models and their metadata
- **Information Retrieval**: Provide sophisticated search and discovery
- **Knowledge Synthesis**: Combine information from multiple sources
- **Wisdom Preservation**: Safeguard cultural and technical knowledge

#### **Services Exposed**
- `yachay-knowledge` on **:30445** - Knowledge storage and retrieval
- `yachay-models` - AI model registry and management

---

### **10. Sachem - The Consensus Chief**
**Cultural Origin**: Algonquian consensus chief  
**Sacred Role**: Democratic governance and collective decision-making  
**Technical Function**: Consensus mechanisms and governance protocols

#### **Core Responsibilities**
- **Consensus Building**: Facilitate collective decision-making
- **Voting Protocols**: Implement democratic voting systems
- **Governance Coordination**: Coordinate multi-node governance
- **Conflict Resolution**: Mediate disputes and find common ground
- **Community Representation**: Ensure all voices are heard

#### **Services Exposed**
- `sachem-consensus` on **:30446** - Consensus and voting protocols
- `sachem-governance` - Governance coordination and representation

## 👑 Elder Tier: The Wisdom Guides

### **11. Archon - The Federation Steward**
**Cultural Origin**: Ancient Greek chief steward  
**Sacred Role**: System orchestration and resource management  
**Technical Function**: Federation coordination and optimization

#### **Core Responsibilities**
- **Network Orchestration**: Coordinate multi-node operations
- **Resource Management**: Optimize resource allocation and usage
- **System Coordination**: Manage complex distributed workflows
- **Performance Optimization**: Enhance overall system efficiency
- **Strategic Planning**: Long-term system architecture and evolution

#### **Services Exposed**
- `archon-orchestration` on **:30447** - Network coordination and management
- `archon-resources` - Resource allocation and optimization

---

### **12. Amauta - The Cultural Mentor**
**Cultural Origin**: Incan philosopher-teacher  
**Sacred Role**: Cultural preservation and wisdom transmission  
**Technical Function**: Education and cultural guidance

#### **Core Responsibilities**
- **Cultural Education**: Teach cultural wisdom and traditions
- **Wisdom Transmission**: Share knowledge across generations
- **Mentorship Protocols**: Guide personal and professional development
- **Cultural Preservation**: Maintain and protect cultural heritage
- **Philosophy Integration**: Integrate cultural wisdom into technical systems

#### **Services Exposed**
- `amauta-education` on **:30448** - Cultural education and wisdom sharing
- `amauta-mentorship` - Mentorship and guidance protocols

---

### **13. Mzee - The Respected Elder**
**Cultural Origin**: Swahili term for respected elder  
**Sacred Role**: Final wisdom authority and advisory council  
**Technical Function**: Highest-level guidance and arbitration

#### **Core Responsibilities**
- **Elder Wisdom**: Provide highest-level guidance and perspective
- **Conflict Arbitration**: Resolve complex disputes and disagreements
- **Strategic Guidance**: Offer long-term strategic direction
- **Community Respect**: Maintain dignity and respect in all interactions
- **Legacy Preservation**: Ensure continuity and sustainability

#### **Services Exposed**
- `mzee-council` on **:30449** - Elder council and advisory services
- `mzee-arbitration` - Conflict resolution and wisdom arbitration

## 🔧 Technical Implementation Notes

### **Port Allocation Strategy**
- **Base Port**: 30437 (Griot)
- **Increment**: +1 for each subsequent node class
- **Range**: 30437-30449 (13 classes total)
- **Collision Avoidance**: Each class has dedicated port space

### **Common Interface Standards**
All nodes must implement:
- **Health Check**: `/health` endpoint with Ethical Intentions validation
- **Metrics**: Prometheus metrics on `/metrics`
- **Identity**: `/identity` endpoint returning node class and capabilities
- **Configuration**: Standardized configuration schema

### **Security Requirements**
- **Authentication**: All inter-node communication authenticated
- **Encryption**: All data encrypted in transit and at rest
- **Integrity**: All operations validated against Ethical Intentions
- **Audit Trail**: Complete audit logging of all activities

---

**Taxonomy Status**: 🏛️ **CANONICAL CLASSIFICATION**  
**Cultural Authority**: 🌍 **AUTHENTIC GLOBAL TRADITIONS**  
**Implementation**: All nodes must conform to these specifications 