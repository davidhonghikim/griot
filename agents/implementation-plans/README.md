# Implementation Plans Workflow

This directory manages the lifecycle of implementation plans for the project. All plans follow a strict `backlog -> active -> archive` workflow.

## Plan Lifecycle

1.  **`backlog/`**: Contains all approved but not-yet-started implementation plans.
    -   **To Create a New Plan**: Do NOT create directories manually. Use the helper script to ensure correct date formatting.
        ```bash
        ./agents/shared/scripts/create-plan-dir.sh "your-plan-name"
        ```
    -   This will create a new directory like `backlog/2025-07-01_your-plan-name/`. Add your `plan.md` and other assets there.

2.  **`active/`**: Contains the **one** plan that is currently in progress.
    -   **To Start Work**: Move the plan's entire directory from `backlog/` to `active/`.
        ```bash
        mv agents/implementation-plans/backlog/[date_plan-name] agents/implementation-plans/active/
        ```
    -   There should only ever be one plan directory in `active/`.

3.  **`archive/`**: Contains all completed, abandoned, or superseded implementation plans.
    -   **To Finish Work**: Move the plan's entire directory from `active/` to `archive/`.
    -   **Purpose**: This directory serves as a historical record. Per user instruction, it is a "dirty quick zip system" and should not be deleted.

## **Archive Policy**

> **Note:** All plan archives are stored in `agents/implementation-plans/archive/`, organized by year and month. Do not use the centralized `agents/archive/` directory for plan archives.

### **Current Month Access**
- **Location**: Root of implementation-plans directory
- **Purpose**: Easy access to recent plans
- **Naming**: `[YYYY-MM-DD]_[plan_name].md` or `.json`

### **Monthly Archiving**
- **Trigger**: Monthly (or manual when needed)
- **Destination**: `archive/[YYYY]/[MM]/`
- **Benefits**: 
  - Keeps root directory clean
  - Maintains chronological organization
  - Preserves historical context

### **Archive Structure**
```
archive/
└── [YEAR]/
    ├── [01]/  # January
    ├── [02]/  # February
    ├── ...
    └── [12]/  # December
```

### **Archive Process**
1. **Monthly**: Move all files from previous month to archive
2. **Update Index**: Maintain references in `00_Plans_Index.md`
3. **Preserve Context**: Keep metadata and cross-references intact

### **Automated Archiving**
- **Script Location**: `scripts/archiving/archive_monthly.sh`
- **Usage**: 
  ```bash
  # Archive all systems
  ./scripts/archiving/archive_monthly.sh
  
  # Archive specific system
  ./scripts/archiving/archive_monthly.sh agents/implementation-plans
  ```
- **Features**: 
  - Archives files from previous months only
  - Maintains current month files in root directory
  - Creates proper year/month directory structure
  - Handles both `.md` and `.json` files

## Current Plan Pointer

The `active/current-plan.md` is a symbolic link that should always point to the `plan.md` file inside the directory within `active/`. It must be updated whenever a new plan is moved to `active`. 