# 🏠 AI Kitchen Overview

AI Kitchen is the **hardware-aware runtime** that powers the Griot “Kitchen” node and the Skald creator node.

* Auto-detect local GPUs / CPUs / accelerators.
* Dynamically loads *skills* (Python modules) and auto-installs missing pip dependencies.
* Exposes REST (and future gRPC) endpoints for skill execution and recipe orchestration.
* Designed for cross-platform packaging (Docker, Homebrew, winget, deb/rpm).

Directory structure (excerpt):

```
ai_kitchen/
  core/              # hardware, skills, API
  nodes/
    kitchen/         # RAG, inference orchestration
    skald/           # recipe templating, asset mgr
  skills/            # pluggable user skills
  install.sh         # cross-platform bootstrap
agents/reference/kitchen/
  README.md          # ← you are here
  USER_GUIDE.md      # end-user how-to
  AGENT_EDITING.md   # conventions for contributors
  DOC_VIEWER.md      # instructions for local docs UI
```

For a deeper architecture diagram see `kitchen_griot_skald_deepseek.md` in the same folder.
