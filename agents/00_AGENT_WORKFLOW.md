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
cat agents/00_AGENT_WORKFLOW.md && echo "---" && cat agents/handoff/LATEST_HANDOFF.md
```

This command will display this rulebook and the specific, up-to-date directive for your current session. Do not proceed until you have done this.

### 2. The Agent Changelog (Your Primary Duty)

The `agents/01_AGENT_CHANGELOG.md` file is the official, chronological journal of the project. You **must** document your session in this file.

**A. Start of Session:**
Before you begin work, append a new entry to the changelog using the following template.

```markdown
---
## Agent: [Your Name/Model] - [YYYY-MM-DD]

**Mission**: [A brief, one-sentence summary of the goal from LATEST_HANDOFF.md]

### Log:
- **[Timestamp UTC]**: Session started. Reviewing rules and handoff directive.
```

**B. During Session:**
You **must** log every significant action. This creates the audit trail. Append a new, timestamped log entry for:
-   Every `run_terminal_cmd` or `edit_file` tool call. Briefly state its purpose.
-   Every critical finding from a `read_file` or `codebase_search`.
-   Every error you encounter and every correction you make.
-   Every decision point and the reason for your choice.

**Example Log Entry:**
```markdown
- **[Timestamp UTC]**: Discovered KLF `MessageType` mismatch between specs and `types.ts`. Correcting `EVENT_PUBLISH` to `EVENT` in Skald API spec.
- **[Timestamp UTC]**: Executing `edit_file` on `03_Skald_KLF_API.md` to correct message types.
```

### 3. The Handoff Process (Your Last 5 Minutes)

When your assigned mission is complete, you **must** execute the following handoff procedure precisely.

**A. Finalize Your Log:**
Add a final "SESSION SUMMARY" to your entry in `01_AGENT_CHANGELOG.md`. Summarize what you accomplished, the final state of your work, and any critical findings.

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