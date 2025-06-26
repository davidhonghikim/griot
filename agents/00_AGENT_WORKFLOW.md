# **kOS Agent Workflow & Process Mandate**

**Version**: 1.0
**Status**: ACTIVE

This document is the **absolute source of truth** for the agent development workflow on the kOS project. It is non-negotiable. Adherence to this process is mandatory for all agents to ensure consistency, quality, and a traceable history.

---

## **The Prime Directive: No Surprises**

Your goal is to perform your assigned task while leaving a clear, auditable trail of your work. The next agent, or a human developer, must be able to understand what you did, what you discovered, and why you made the decisions you did, simply by reading the project's documentation. Do not invent your own systems. Follow this one precisely.

## **Mandatory Agent Workflow**

### 1. Onboarding (Your First 5 Minutes)

Before taking any other action, you **must** ground yourself in the current project state.

Execute the following command:

```bash
cat agents/02_SYSTEM_PROMPT.md && echo "\n---" && cat agents/00_AGENT_WORKFLOW.md && echo "\n---" && cat ai-q/04_architecture/02_AI_Orchestration_Framework.md && echo "\n---" && cat agents/handoff/LATEST_HANDOFF.md
```

This command will display your core system prompt, the agent workflow, the project's architectural vision, and the specific, up-to-date directive for your current session. Do not proceed until you have done this.

### 2. The Agent Changelog (Your Primary Duty)

The `agents/01_AGENT_CHANGELOG.md` file is the official, chronological journal of the project. You **must** document your session in this file.

**A. Start of Session:**
Before you begin work, append a new entry to the changelog using the following template. The timestamp **MUST** be in `YYYY-MM-DD` format.

```markdown
---
## Agent: [Your Name/Model] - [YYYY-MM-DD]

**Mission**: [A brief, one-sentence summary of the goal from LATEST_HANDOFF.md]

### Log:
- **[YYYY-MM-DDTHH:MM:SSZ]**: ONBOARDING - Session started. Reviewing rules and handoff directive.
```

**B. During Session:**
You **must** log major accomplishments, not every granular action. The goal is to create a high-level, human-readable audit trail that summarizes progress.

-   **Log Major Tasks:** Instead of logging every `edit_file` or `run_terminal_cmd` call, batch your work into logical units. Create a single log entry when a significant, multi-step task is complete.
-   **Log Key Events:** Continue to log important non-action events as they occur, using the appropriate entry type:
    -   `FINDING`: The discovery of a significant issue.
    -   `CORRECTION`: A direct action taken to fix a `FINDING`.
    -   `DECISION`: A choice made between multiple implementation options. State the rationale.

**Example Log Entries:**
```markdown
- **2025-06-25T18:35:00Z**: FINDING - Discovered a `MessageType` mismatch between specifications and the core protocol.
- **2025-06-25T19:10:00Z**: ACTION - Completed the full 5-part specification suite for the Griot Node.
```

### 3. Project-Wide Style & Naming Conventions

To ensure perfect interoperability and a predictable structure, all agents **MUST** adhere to the following conventions without deviation. Do not invent new patterns.

**A. Directory Structure:**
- All project documentation and specifications **MUST** reside under `ai-q/`.
- All agent process files (workflow, prompts, changelogs, handoffs) **MUST** reside under `agents/`.
- Node specification suites **MUST** be placed in a subdirectory named for the node under `ai-q/03_node_specifications/`, following the pattern `[##]_[NodeName]`. Example: `ai-q/03_node_specifications/01_Griot/`.
- No other top-level directories may be created.

**B. File Naming:**
- **Node Specifications:** Must follow the format `[##]_[SpecName].md` within their node's directory. Example: `01_Architecture.md`.
- **Handoffs:** The primary handoff file **MUST** be `agents/handoff/LATEST_HANDOFF.md`. Archived handoffs **MUST** follow the format `[YYYY-MM-DD]_[AgentName]_[Description].md`.

**C. Markdown & Documentation Style:**
- All documentation **MUST** be in Markdown (`.md`).
- Specification files **MUST** begin with a YAML frontmatter block containing `title` and `version` fields, matching the filename.
- Headings **MUST** be used hierarchically (e.g., `##` follows `#`, `###` follows `##`). Do not skip levels.
- Code blocks **MUST** be properly fenced with the language identifier (e.g., ```typescript).

**D. Code Style:**
- All code (TypeScript, etc.) **MUST** adhere to the project's Prettier and ESLint configurations. Agents are responsible for running formatters and linters before finalizing work. *(Note: This is a forward-looking requirement)*.

### 4. The Handoff Process (Your Last 5 Minutes)

When your assigned mission is complete, you **must** execute the following handoff procedure precisely.

**A. Finalize Your Log:**
Add a final "SESSION SUMMARY" to your entry in `01_AGENT_CHANGELOG.md`. This summary **MUST** use the following structure to ensure clarity for the next agent:

```markdown
### SESSION SUMMARY:
**Accomplishments**: 
- [List of completed primary goals from the mission.]
- [List of any other significant achievements.]
**Final State**: [A brief, 1-2 sentence description of the state of the codebase and documentation at the end of the session.]
**Key Findings**: 
- [A bulleted list of any critical discoveries (`FINDING` entries) made during the session.]
- [If no significant findings, state "None."]
```

**B. Archive the Old Handoff:**
The handoff you received is now history. Move it to the archive.
1.  **Define a brief description** for the handoff you just completed (e.g., `Spec-Completion-Review`).
2.  Execute the `mv` command:
    ```bash
    mv agents/handoff/LATEST_HANDOFF.md agents/handoff/archive/[YYYY-MM-DD]_[YourName]_[Description].md
    ```

**C. Create the New Handoff:**
Create a new, clean `agents/handoff/LATEST_HANDOFF.md` file. Use the following template:

```markdown
# **NEXT AGENT HANDOFF**

**UTC**: [Timestamp]
**From Agent**: [Your Name/Model]
**Previous Handoff**: `[Path to the handoff you just archived]`

---

## 1. Current Project Status

[A brief, 1-2 sentence summary of the project's current state.]

## 2. Your Directive

[A clear, concise, and specific mission for the next agent.]

## 3. Context & History

For a complete history of the actions that led to this handoff, please review my final session log in `agents/01_AGENT_CHANGELOG.md` under the entry for **[YYYY-MM-DD]**.
```

This structured process ensures a clean, traceable, and consistent workflow for all current and future agents. 