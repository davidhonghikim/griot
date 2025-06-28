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

## Current Plan Pointer

The `active/current-plan.md` is a symbolic link that should always point to the `plan.md` file inside the directory within `active/`. It must be updated whenever a new plan is moved to `active`. 