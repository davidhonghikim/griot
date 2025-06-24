# Execution Plan – Griot Front-End UI Revamp

**Author:** o3-AI agent
**Created:** 2025-06-24
**Status:** Draft (living document – update after every significant action)

---

## 0. Scope
Redesign the `web-app` frontend so that Griot delivers an engaging, modern UI that blends the best UX patterns of **Open WebUI** and **kai-cd**, while surfacing all Griot features (installer, services, jobs, advanced settings) in a single cohesive application.

This plan follows the mandatory workflow defined in `documentation/01_agents/01_core/agent-rules.md`.

---

## 1. High-Level Objectives
1. Migrate styling to a robust design system (Tailwind CSS with shadcn/ui primitives) mirroring OWU's cleanliness and kai-cd's dashboard density.
2. Establish a responsive, left-nav + main-content layout with dark/light themes.
3. Implement page scaffolds for:
   • Dashboard
   • Services
   • Jobs
   • Installer
   • Settings / Advanced
4. Refactor shared components (Header, Sidebar, Cards, Tables, Modals, Toasts).
5. Replace ad-hoc CSS with utility classes + variables.
6. Wire each page to the existing backend endpoints (auth, services, jobs).
7. Provide polished empty-state UX, loading skeletons, and error boundaries.
8. Maintain accessibility (WCAG AA) and keyboard navigation.
9. Add full Jest/Vitest component tests for new primitives.

---

## 2. Milestone Breakdown
| Phase | Deliverable | Key Files | Verification |
|-------|-------------|-----------|--------------|
| M0 | Baseline snapshot & branch set-up | `archive.sh`, `npm run build` passes | Baseline build passes |
| M1 | Design system bootstrap (Tailwind, shadcn) | `web-app/tailwind.config.ts`, new `components/ui/` | Storybook renders primitives |
| M2 | Core layout (Shell, Sidebar, Header) | `App.tsx`, `components/Layout.tsx` | App shows nav + outlet |
| M3 | Page scaffolds & routing map | `pages/*` | Route navigation works |
| M4 | Services page (list, detail) | `pages/Services.tsx`, `api/services.ts` | Data fetched & rendered |
| M5 | Jobs page (table, filters) | `pages/Jobs.tsx`, `api/jobs.ts` | Live job status updates |
| M6 | Installer wizard | `pages/Installer.tsx` & sub-components | Can run dummy installer |
| M7 | Advanced settings & feature toggles | `pages/Settings.tsx` | Toggles persist |
| M8 | Theming, a11y, polish | global CSS, focus rings, color tokens | Axe-core passes |
| M9 | Unit / component tests | `__tests__/` | `npm test` green |
| M10 | Final QA & user sign-off | all | User acceptance |

---

## 3. Detailed Task List (Next 48 h)
1. **Environment audit**
   1.1. Run `npm install` in `web-app/` and ensure Tailwind peer deps installed.
   1.2. Snapshot current UI (`npm run dev` screenshots).
2. **Add Tailwind + shadcn**
   2.1. Install Tailwind, autoprefixer, postcss.
   2.2. Generate `tailwind.config.ts` with OWU + kai-cd color palette.
   2.3. Replace `index.css` with Tailwind base layers.
3. **Lay out application shell**
   3.1. Create `components/Layout/RootShell.tsx` with responsive sidebar.
   3.2. Route via React Router v6 inside `App.tsx`.
4. **Mid-Progress Review #1** (after tasks 2–3) – run build, lint, update this plan.
5. **Scaffold pages** – placeholder H1 elements, ensure navigation links active.
6. **Mid-Progress Review #2**.
7. **Commit (user approved) & proceed to service integration**.

---

## 4. Risk Register
• Tailwind class bloat → enforce eslint-plugin-tailwindcss.
• Style clash with existing CSS → phase out legacy selectors gradually.
• API shape drift → generate TS types from OpenAPI schema.

---

## 5. Communication Log
_2025-06-24 14:36 UTC – Plan initialized._
_2025-06-24 15:55 UTC – M3 partial: Added Installer & Settings page scaffolds, extended navigation & routing; build passes._

---

*(Update this file after each significant action as per the Two-Edit Rule.)* 