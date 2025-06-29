# Skald Module Specification: Conversational Flow Director (CFD)

## Module Name
**Conversational Flow Director (CFD)**

## Node Class
**Skald**

## Overview
The Conversational Flow Director (CFD) is the Skald submodule responsible for managing, directing, and orchestrating the logical progression of dialogue, storytelling, instructional content, or system-driven conversations. The CFD ensures that all conversational outputs follow a coherent structure, stay on-topic, and align with user intents and system goals.

## Purpose
To provide a high-level conversation management layer that controls topic transitions, dialogue state tracking, follow-up prompting, error recovery, and narrative pacing across all Skald interactions.

## Functional Requirements

### 1. Dialogue State Management
- **Conversation State Machine:** Track current dialogue state (e.g., Greeting → Information Gathering → Solution Delivery → Closing).
- **State Persistence:** Maintain state across multiple user inputs and agent outputs.
- **Multi-Threaded State Tracking:** Handle parallel dialogue threads with separate state contexts.

### 2. Topic and Intent Control
- **Intent Recognition Integration:** Consume intent signals from NLP engine.
- **Topic Tracking:** Maintain current topic, subtopics, and topic stack for nested discussions.
- **Topic Shift Handling:** Detect and smoothly transition between topics.
- **Topic Re-engagement:** Return to previous topics after diversions.

### 3. Flow Control
- **Prompt Sequencing:** Control the order and timing of Skald prompts and responses.
- **Branching Logic:** Support conditional dialogue branches based on user inputs or system states.
- **Fallback and Error Recovery:** Route to clarification, rephrasing, or help states when confusion is detected.
- **Pacing Adjustment:** Dynamically slow down or speed up conversation based on user engagement level.

### 4. Multi-Actor Coordination
- **Role-Based Flow Mapping:** Coordinate multi-agent conversations with distinct speaker roles.
- **Speaker Turn Management:** Ensure orderly turn-taking in group conversations.
- **Scene Flow Director Mode:** Orchestrate multi-character narrative scenes with dialogue pacing and mood control.

### 5. Interaction History Access
- **State-Aware Memory Lookup:** Pull relevant prior conversation states from the Conversational Memory Manager (CMM).
- **Context Window Management:** Selectively include prior turns for next-step planning.
- **Temporal Flow Awareness:** Incorporate time-based pacing (e.g., pause for effect, dramatic timing).

## Non-Functional Requirements
- **Latency:** Sub-200ms decision-making time per flow transition.
- **Scalability:** Support thousands of concurrent active conversational flows.
- **Reliability:** Maintain flow integrity during high system load or failure recovery.
- **Extensibility:** Allow new dialogue templates and flow scripts to be added dynamically.

## Data Flow Diagram (Textual)
1. **User Input / System Trigger** → 2. **Intent and Context Analyzer** → 3. **State Machine Evaluator** → 4. **Flow Decision Engine** → 5. **Output Generator / Next Module Call**

## Interfaces
- **Input Interfaces:** Skald NLP Engine, External Triggers, CMM, Intent Detection Engine.
- **Output Interfaces:** Skald Narrative Generator, Personality Engine, Summary Engine, External System Interfaces.

## Configuration Options
- **State Machine Definition Files:** YAML/JSON-based dialogue state definitions.
- **Topic Stack Depth Limit:** Configurable per deployment.
- **Timeouts and Inactivity Handlers:** Default timeouts and escalation behaviors.
- **Pacing Profiles:** Slow / Normal / Fast conversational pacing presets.

## Example Use Cases
- Managing customer support chat flow.
- Driving a multi-step educational tutorial.
- Guiding a user through troubleshooting dialogues.
- Orchestrating roleplay scenes in entertainment applications.

## Extensibility Hooks
- **Custom Flow Scripts:** Developers can upload new flow logic scripts.
- **External API-Driven Flow Modifications:** Allow external systems to influence flow state.
- **Plugin-based Flow Interceptors:** Insert conditional logic or hooks at specific flow states.

## Testing and Validation Plan
- Unit tests for state transitions.
- Scenario-based dialogue flow tests.
- Load tests with concurrent dialogue sessions.
- Error state injection tests for recovery path validation.

## Dependencies
- **kOS Event Bus**
- **Skald NLP Engine**
- **Conversational Memory Manager (CMM)**
- **Intent Detection Engine (or external NLP service)**

## Future Enhancements
- Visual dialogue flow designer for non-technical users.
- AI-driven dynamic flow reconfiguration.
- Real-time user sentiment-driven flow adjustment.
- Support for multi-language flow definitions.

---

**Next module:** `skald_output_formatter.md`

Let me know when you want to proceed.

