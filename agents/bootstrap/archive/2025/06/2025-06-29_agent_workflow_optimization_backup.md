# **kOS Agent Workflow & Process Mandate**

**Version**: 2.0
**Status**: ACTIVE
**Last Updated**: 2025-06-28

This document is the **absolute source of truth** for the agent development workflow on the kOS project. It is non-negotiable. Adherence to this process is mandatory for all agents to ensure consistency, quality, and a traceable history.

---

## **The Prime Directive: No Surprises**

Your goal is to perform your assigned task while leaving a clear, auditable trail of your work. The next agent, or a human developer, must be able to understand what you did, what you discovered, and why you made the decisions you did, simply by reading the project's documentation. Do not invent your own systems. Follow this one precisely.

## **CRITICAL: Documentation Before Archiving**

**⚠️ MANDATORY RULE**: You **MUST** update all relevant documentation BEFORE archiving any handoff. This includes:

1. **Agent Changelog** - Update `agents/01_AGENT_CHANGELOG.md` with your session summary
2. **Handoff Document** - Create comprehensive `agents/handoff/LATEST_HANDOFF.md`
3. **Implementation Plans** - Update any relevant plans in `agents/implementation-plans/`
4. **Project Documentation** - Update README files and other relevant docs
5. **Code Documentation** - Update inline comments and code documentation

**FAILURE TO UPDATE DOCUMENTATION BEFORE ARCHIVING IS A CRITICAL VIOLATION OF THIS WORKFLOW.**

---

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

**⚠️ CRITICAL: Documentation Updates MUST Come First**

**A. Finalize Your Log:**
Add a final "SESSION SUMMARY" to your entry in `agents/01_AGENT_CHANGELOG.md`. This summary **MUST** use the following structure to ensure clarity for the next agent:

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

**B. Update All Relevant Documentation:**
**BEFORE** archiving, you **MUST** update:

1. **Implementation Plans** - Update any plans in `agents/implementation-plans/` to reflect completed work
2. **Project README** - Update main README if architectural changes were made
3. **Code Documentation** - Update inline comments and code documentation
4. **Configuration Files** - Update any configuration documentation
5. **User Guides** - Update any user-facing documentation

**C. Archive the Old Handoff:**
The handoff you received is now history. Move it to the archive.
1.  **Define a brief description** for the handoff you just completed (e.g., `Spec-Completion-Review`).
2.  Execute the `mv` command:
    ```bash
    mv agents/handoff/LATEST_HANDOFF.md agents/handoff/archive/[YYYY-MM-DD]_[YourName]_[Description].md
    ```

**D. Create the New Handoff:**
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

---

## **Documentation Quality Standards**

### **What Constitutes Proper Documentation:**

1. **Completeness**: All major changes must be documented
2. **Clarity**: Documentation must be clear enough for the next agent to understand
3. **Accuracy**: Documentation must reflect the actual state of the codebase
4. **Timeliness**: Documentation must be updated before archiving
5. **Consistency**: Follow established patterns and conventions

### **Documentation Checklist Before Archiving:**

- [ ] Agent changelog updated with session summary
- [ ] Handoff document created with clear directive
- [ ] Implementation plans updated (if applicable)
- [ ] README files updated (if architectural changes)
- [ ] Code documentation updated (if code changes)
- [ ] Configuration documentation updated (if config changes)
- [ ] User guides updated (if user-facing changes)

**⚠️ DO NOT ARCHIVE UNTIL ALL CHECKLIST ITEMS ARE COMPLETE**

---

## MANDATORY FINAL DOUBLE-CHECK & ERROR REVIEW

Before marking any task as complete or handing off to the next agent, you MUST:

1. **Double-Check All Work:**
   - Review all new and modified files for errors, logic issues, missing imports, and missing dependencies.
   - Trace the runtime logic, following code and pseudocode, to ensure correctness and completeness.
   - Check for unhandled edge cases, incomplete implementations, and integration issues.
   - Ensure all code is clear, maintainable, and well-commented where needed.

2. **Integration & Dependency Verification:**
   - Confirm that all imports and dependencies are present and correct.
   - Verify that new modules integrate cleanly with the rest of the system.
   - Check for missing files, references, or configuration that would prevent runtime use.

3. **Quality Over Speed:**
   - Do NOT mark a task as complete just to check it off. Only mark as complete when you are confident in the quality and correctness of the work.
   - If you find issues, document them and address them before handoff.

4. **Documentation:**
   - Log your double-check and findings in the changelog and handoff.
   - If you find and fix issues, document the correction and rationale.

This process is mandatory for all agents and is critical for maintaining the quality and reliability of the kOS project.

---

## MANDATORY BUILD & LINT VERIFICATION

After making any code changes, you MUST:

1. **Verify All Imports and Dependencies:**
   - Check that all imports resolve and all dependencies are present.
   - If an import fails, fix the path or create the missing file before proceeding.

2. **Run Build and Linter:**
   - Run the project build and linter (or equivalent error checker) after every code change.
   - Do NOT mark a task as complete if there are any build or lint errors or warnings.
   - Only proceed when the code builds and passes linting without errors.

3. **Log Errors and Fixes:**
   - Document any errors found and the steps taken to resolve them in the changelog.
   - If you cannot resolve an error, document it clearly for the next agent.

This is mandatory for all agents and is critical for maintaining a reliable, error-free codebase.

---

## GPT-BASED AGENT REQUIREMENTS

**For GPT-4/GPT-4.1 agents specifically:**

### Mandatory Work Style:
1. **Complete Tasks End-to-End**: Never report progress or ask questions until the entire task is finished
2. **Fix Everything You Find**: When reviewing code, fix all errors, not just report them
3. **No Partial Work**: Do not mark tasks as "in progress" or "partially complete"
4. **Proactive Problem Solving**: Anticipate and resolve issues without asking for permission

### Required Prompt Format for GPT Agents:
- Use explicit completion criteria: "Fix X completely. Don't stop until it's done."
- Require verification: "Read the errors, fix them all, verify it works."
- Demand comprehensive review: "Do a complete review and fix everything you find."
- Follow established workflows: "Follow the workflow exactly and complete the task."

### What NOT to Accept from GPT Agents:
- Progress reports without completion
- Questions about how to proceed when the path is clear
- Partial fixes or "work in progress" status
- Promises to do better without immediate action

### GPT Agent Behavior Patterns to Watch For:
- Asking "Would you like me to..." instead of just doing it
- Reporting "I found X issues" without fixing them
- Stopping to ask for clarification when the next step is obvious
- Making incremental changes instead of comprehensive fixes

### Success Criteria for GPT Agents:
- Task is 100% complete before any reporting
- All errors are resolved, not just identified
- Code builds and passes linting
- Documentation is updated
- No TODOs or incomplete implementations remain

**Note**: GPT agents require explicit, completion-focused instructions. General guidance or requests to "do better" do not change their behavior. They need specific, actionable commands that require full completion. 