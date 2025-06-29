# kOS Yachay - Memory Starseed Documentation System

## Node Class: Yachay (Memory Starseed)
> Responsible for long-term memory consolidation, knowledge management, and documentation integrity within the kOS ecosystem.

---

## 📌 Overview
Yachay handles:
- ✅ Documentation validation
- ✅ Manifest generation
- ✅ Pruning & archive management
- ✅ Export for database migration
- ✅ REST API exposure
- ✅ Git pre-commit hook enforcement
- ✅ CI/CD validation via GitHub Actions

---

## 📂 Directory Structure
```plaintext
/agents
/scripts
/db_exports
.git/hooks
.github/workflows
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Git Hook (Pre-commit Validation)
```bash
npm run yachay:hook:install
```

### 3. Run Validation Manually
```bash
npm run yachay:validate
```

### 4. Generate Manifest
```bash
npm run yachay:manifest
```

### 5. Prune Archives
```bash
npm run yachay:prune
```

### 6. Export Data for DB
```bash
npm run yachay:export
```

### 7. Run Full CI Pipeline Locally
```bash
npm run yachay:ci
```

---

## 🌐 REST API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/yachay/validate` | POST | Run validation |
| `/api/yachay/manifest` | POST | Generate manifest |
| `/api/yachay/prune` | POST | Prune archives |
| `/api/yachay/export` | POST | Export data |

Start the server:
```bash
node ./scripts/yachay-rest-server.js
```

---

## ✅ CI/CD Pipeline (GitHub Actions)
Runs on:
- Push to any branch affecting `/agents/` or `/scripts/`
- Any Pull Request affecting same paths

Workflow File: `.github/workflows/yachay.yml`

---

## 🧪 Running Unit Tests (Optional Step)
After implementing tests:
```bash
npm test
```

---

## ✅ Dependencies
- Node.js 20+
- `ajv`
- `gray-matter`
- `fs-extra`
- `fast-glob`
- `express`
- `body-parser`

---

## 🚩 Future Extensions
- OpenAPI Swagger UI
- Authentication middleware
- CLI with yargs/commander help menus
- DB migration tooling (MongoDB, Postgres, Neo4j, VectorDB)

---

**Yachay - The Memory Starseed**  
Keeping the history of kOS clear, clean, and complete.
