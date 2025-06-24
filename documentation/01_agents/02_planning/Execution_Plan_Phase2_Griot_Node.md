# Execution Plan: Phase 2 – Griot Node Implementation

**Status**: `In Progress`
**Current Phase**: Phase 2 – Backend, SDK & Web App Alignment
**Lead Agent**: o3 AI Assistant
**Last Update**: 2025-06-24

---

## 1. Objective

Build a production-ready Griot Node server that fully implements the Griot Seed Protocol V1, align the TypeScript SDK, clean up documentation and directory structure left inconsistent by the previous hand-off, **and ship a React-based operator web app**.

## 2. Mandatory Workflow Compliance

All tasks must follow `documentation/01_agents/01_core/agent-rules.md` including the Two-Edit rule, test-driven debugging, and detailed logging in this plan.

---

## Phase 2 Task Breakdown

| Task ID | Description | Owner | Status | Notes |
|---------|-------------|-------|--------|-------|
| 2.0 | **Create Phase 2 Execution Plan** | o3 | 🟩 | Current task – plan drafted. |
| 2.1 | **Directory Re-org**<br/>• Remove stale `griot_ai-q/` directory.<br/>• Ensure canonical path is `griot-node/`.<br/>• Move SDK to `griot-node/sdk/` and export as NPM package/workspace. | o3 | ⬜ |  |
| 2.2 | **Documentation Cleanup**<br/>• Replace `2025-06-24` placeholders.<br/>• Drop `.tmp` suffix from Phase 1 plan.<br/>• Update paths & links after re-org.<br/>• Add checksums for canonical docs. | o3 | ⬜ |  |
| 2.3 | **Protocol Deep Review**<br/>• Validate `01_Griot_Seed_Protocol.md` against project requirements.<br/>• Identify missing endpoints or fields.<br/>• Produce change-log & update spec if needed. | o3 | ⬜ |  |
| 2.4 | **FastAPI Server Scaffold**<br/>• New module `griot-node/server/main.py` using FastAPI.<br/>• JWT auth, error handler middleware, pydantic models mirroring SDK types.<br/>• Unit tests (pytest) asserting schema compliance. | o3 | ⬜ |  |
| 2.5 | **Endpoint Implementation**<br/>Implement routes:<br/>• `GET /identity`<br/>• `POST /auth/login`<br/>• CRUD `/services`<br/>• Proxy `POST /proxy/{serviceId}/{...}`<br/>• `GET /jobs/{jobId}` | o3 | ⬜ |  |
| 2.6 | **SDK Alignment Tests**<br/>• Use existing TS SDK in Vitest to call running server.<br/>• All tests must pass. | o3 | ⬜ |  |
| 2.7 | **Docker Compose & Env**<br/>• Compose file with FastAPI, Postgres, and a mock backend service.<br/>• `.env.example` for secrets. | o3 | ⬜ |  |
| 2.8 | **CI & Linting**<br/>• Pre-commit hooks: ruff, black, isort.<br/>• GitHub Actions workflow running pytest & SDK tests. | o3 | ⬜ |  |
| 2.9 | **Final Verification & Handoff**<br/>• Run `npm run build` & `pytest`.<br/>• Update this plan to `Complete`.<br/>• Notify user for validation. | o3 | ⬜ |  |
| 2.10 | **Web App Scaffold**<br/>• Create Vite + React + TypeScript app in `web-app/`.<br/>• Integrate Tailwind for styling.<br/>• Baseline pages: Dashboard, Services, Jobs. | o3 | 🟩 | Scaffold + baseline pages done |
| 2.11 | **Frontend SDK Wiring & Auth Flow**<br/>• Use `GriotSeedClient` for API calls.<br/>• Implement login, session storage, error boundaries. | o3 | ⬜ | Depends on 2.10 |
| 2.12 | **E2E Tests**<br/>• Playwright tests covering critical paths (login, service CRUD, proxy request). | o3 | ⬜ |  |

---

## 3. Log

> _A chronological log of actions and findings will be appended here as tasks progress._ 

### 2025-06-24 – Backend Auth & Services CRUD MVP
1. Implemented Pydantic `Settings` loader (`server/settings.py`).
2. Added JWT auth dependency (`server/deps.py`) and protected `/services` routes.
3. Completed in-memory Service CRUD with hidden `apiKey` field.
4. Added `/auth/login` stub and verified 401/200 flows via curl.
5. Updated `requirements.txt` with `pydantic-settings`.
6. Smoke-tested endpoints; compilation passes.
7. Updated docs & created handoff archive `agents/handoffs/2025-06-24_backend_auth_services.md`. 

### 2025-06-24 – Web App Scaffold
1. Vite React-TS project created (`web-app`).
2. Added Tailwind CSS & react-query, router.
3. Implemented Login, Dashboard, Services pages with SDK client.
4. Linked local `sdk` via new `package.json`. 