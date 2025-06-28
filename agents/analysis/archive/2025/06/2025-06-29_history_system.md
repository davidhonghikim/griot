# kOS History & Changelog System

**Version**: 1.0  
**Last Updated**: 2025-06-27

---

## 1. Purpose
Provide a concise, high-signal, and easily navigable record of all significant actions taken by both AI agents and humans working on the kOS project.

---

## 2. Core Principles
1. **Newest-First Order** – Entries are prepended so the latest information is always at the top.
2. **Quarterly Archives** – Each UTC quarter resides in its own file inside `agents/history/01_agent_archives/`.
3. **Single-Line Events** – Each bullet captures exactly one _high-value_ event.
4. **Strict Event Keywords** – One of `CHANGE`, `FIX`, `ERROR`, `DECISION`, or `SPEC_UPDATE` _must_ prefix every bullet.
5. **Automation First** – The `scripts/kos-log.js` CLI handles timestamping and formatting via `agents/agents_docs_templates/changelog_entry.md.tpl`.

---

## 3. Directory Layout
```
agents/
├── 01_AGENT_CHANGELOG_LATEST.md   # Active log for the current quarter (editable)
├── 01_agent_archives/             # 💾 Rolled-over changelogs
│   ├── CHANGELOG_2025_Q1.md
│   └── …
├── 04_HISTORY_SYSTEM.md           # ← you are here
├── templates/
│   └── changelog_entry.md.tpl     # Log entry template
└── config.yml                     # History-system configuration
scripts/
└── kos-log.js                     # Logging CLI helper
```

---

## 4. Quarterly Rollover Procedure
| Step | Action |
|------|--------|
| 1 | **Trigger** – At 00:00:00 **UTC** on 1 Jan, 1 Apr, 1 Jul, 1 Oct (CI job or manual). |
| 2 | Derive filename: `CHANGELOG_<YYYY>_Q<n>.md`. |
| 3 | `git mv` `01_AGENT_CHANGELOG_LATEST.md` → `01_agent_archives/` with derived name. |
| 4 | Create a fresh `01_AGENT_CHANGELOG_LATEST.md` with header. |
| 5 | Commit both moves plus a `SPEC_UPDATE` entry documenting the rollover. |

---

## 5. Log Entry Format
Template variables are wrapped in double‐curly braces.
```markdown
## {{timestamp}} – {{agent}}{{#if mission}} (MISSION: {{mission}}){{/if}}
* {{event_type}}: {{message}}
```

Guidelines:
* Place all **new** entries at the **very top** of the file.
* Keep each bullet to a _single_ concise sentence.
* Batch related low-level actions into a single bullet.
* Do **not** mix event types in one bullet.

---

## 6. Accepted Event Keywords
| Keyword      | Use Case |
|--------------|----------|
| `CHANGE`     | Committed modification to code or documentation. |
| `FIX`        | Bug correction or refactor that removes faulty logic. |
| `ERROR`      | New, unresolved problem discovered. |
| `DECISION`   | Architectural/process choice – include rationale. |
| `SPEC_UPDATE`| Update to canonical specs, prompts, or workflow docs. |

---

## 7. Using `kos-log.js`
```bash
node scripts/kos-log.js <EVENT_TYPE> "<message>" "<optional mission>"
```
Example:
```bash
node scripts/kos-log.js FIX "Corrected KLF message type enum" "refactor KLF spec"
```
The script:
1. Reads `agents/history/history_config.yml` for default paths.
2. Determines the current UTC timestamp.
3. Uses `$AGENT_NAME` (env) or `default_agent` from the config file.
4. Prepends the formatted entry to `agents/history/01_AGENT_CHANGELOG_LATEST.md`.

---

## 8. Manual Logging Fallback
When automation is unavailable, copy the template, fill out variables, and paste it at the top of `agents/history/01_AGENT_CHANGELOG_LATEST.md`.

---

## 9. Responsibility Matrix
* **All Contributors** – Ensure significant events are logged before commit/push.
* **CI Pipeline** – Enforce quarterly rollovers and validate entry format.
* **Repository Owners** – Periodically review archives for completeness.

---

## 10. Non-Goals
* Fine-grained action tracing (Git already handles this).
* Duplicating minor shell commands or exploratory edits.

---

_End of specification_
