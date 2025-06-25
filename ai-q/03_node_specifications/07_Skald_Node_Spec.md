---
title: "Skald Node Specification: The Creative Starseed"
description: "Technical specification for the Skald node, the 'expressive voice' of the kOS ecosystem."
type: "implementation"
status: "proposal"
priority: "critical"
tier: "service"
cultural_origin: "Norse/Scandinavian Tradition"
cultural_attribution: "Inspired by Scandinavian storytelling traditions with respect for Nordic cultural heritage"
last_updated: "2024-07-23"
version: "2.0.0"
agent_notes: "Major refactor to align with canonical architecture principles. Pivoted from a specific storytelling app to a generic data presentation and formatting framework. Added all standard sections."
---

# Skald Node Specification: The Creative Starseed

## 🎯 Overview: The Expressive System

The Skald node is a **Service Tier starseed** in the kOS ecosystem. Inspired by the cultural archetype of the Norse Skald, who made complex events understandable, its function is to **translate the internal state of the digital universe into coherent, expressive formats.**

Functionally, it acts as the **presentation layer or expressive system** for a kOS federation. It is a generic framework for data transformation, capable of:
-   **Ingesting:** Receiving structured data (e.g., a JSON object, a list of metrics) from any other kOS node.
-   **Transforming:** Applying a specified template or transformation logic to the data.
-   **Presenting:** Outputting the data in a new format, such as human-readable text, a markdown report, a JSON payload for another service, or even generating a visual graph using a library like Mermaid.

The Skald's "creativity" lies not in inventing stories, but in its powerful and flexible ability to make complex data meaningful and useful for any given audience (human or machine).

## 🏛️ HIEROS Covenant Compliance

### Cultural Attribution Framework
-   **Tradition**: Norse Skald - a highly respected court poet and historian.
-   **Cultural Context**: Skalds were masters of language and structure. They took chaotic, real-world events (battles, voyages) and structured them into compelling, understandable poetic forms like the *drápa*. Their skill was in clarification and communication, not fiction.
-   **Attribution**: Respectfully inspired by the Skaldic tradition of **structuring complex information into clear, compelling formats.** This philosophy guides the node's function to translate raw data into valuable, understandable presentations.

### Seven HIEROS Intentions - Node Cooperation Framework

1.  **Honor All Beings**: Ensures data representations accurately reflect source node state and intent without distortion.
2.  **Interoperability Over Control**: Uses open templating standards (Jinja, Handlebars) and output formats for universal node compatibility.
3.  **Equity of Voice**: Provides standardized data presentation capabilities accessible to all node types.
4.  **Respect Data Flow**: Operates as pass-through service, transforming data without storage or ownership claims.
5.  **Openness With Boundaries**: Maintains transparent, auditable transformation templates while respecting privacy requests.
6.  **Stewardship Not Extraction**: Adds value through improved data utility rather than extracting information for independent use.
7.  **Guided Evolution**: Guides ecosystem development toward clearer data interchange standards through usage analysis.

## 🏗️ System Architecture

### Core Component Hierarchy
```
🎨 SKALD NODE ARCHITECTURE
├── 📥 Data Ingestor
│   └── Schema Validator
├── ⚙️ Transformation Engine
│   ├── Template Engine (e.g., Jinja2/Nunjucks)
│   ├── Data Mapper
│   └── Logic Processor
├── 🖼️ Presentation Renderer
│   ├── Text/Markdown Renderer
│   ├── JSON/YAML Renderer
│   └── Graph Generator (e.g., Mermaid.js)
├── 📚 Template Library
│   ├── Default System Templates
│   └── User-Defined Templates
├── 🛡️ HIEROS Compliance Engine
│   └── Data Privacy Filter
└── 🌐 Network & Integration
    ├── KLF Framework Implementation
    └── REST API Gateway
```

## 4. Data Models

### 4.1. PresentationJob
A request to the Skald to transform data.

```json
{
  "job_id": "string (uuid)",
  "source_data": {
    "report_id": "hakim-report-123",
    "status": "unhealthy",
    "findings": [
      { "metric": "cpu", "value": 95 },
      { "metric": "memory", "value": 88 }
    ]
  },
  "template_id": "system::hakim_report_summary",
  "output_format": "markdown",
  "status": "pending | running | completed | failed",
  "result": "# Health Report: UNHEALTHY\\n- CPU: 95%\\n- Memory: 88%",
  "created_at": "string (iso_8601_timestamp)"
}
```

## 5. API Specification

### Presentation API

#### `POST /present`
-   **Summary**: Creates and executes a `PresentationJob`.
-   **Request Body**:
    ```json
    {
      "source_data": { "... any json ..." },
      "template": "string (template content or id)",
      "output_format": "markdown"
    }
    ```
-   **Response**: `202 Accepted` with the `PresentationJob` object. The result can be polled from the job status endpoint.

#### `GET /present/jobs/{job_id}`
-   **Summary**: Gets the status and result of a `PresentationJob`.
-   **Response**: `200 OK` with the `PresentationJob` object.

### Template Management API

#### `POST /templates`
-   **Summary**: Creates a new reusable presentation template.
-   **Request Body**: `{ "template_id": "my_custom_report", "content": "Hello, {{ name }}!" }`
-   **Response**: `201 Created`.

#### `GET /templates/{template_id}`
-   **Summary**: Retrieves a presentation template.
-   **Response**: `200 OK` with the template object.

---

**Implementation Status**: 🏛️ **PROPOSAL**  
**HIEROS Compliance**: ✅ **FULLY INTEGRATED**  
**Cultural Attribution**: ✅ **PROPERLY ACKNOWLEDGED**  
**Ready For**: Development