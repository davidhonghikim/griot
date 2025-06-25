# 🚨 THIS README IS OUTDATED - PLEASE READ THE HANDOFF DOC 🚨

> **Warning:** The information in this README describes an aspirational state and **does not reflect the current reality of the project**. The application structure described below (`server/`, `web-app/`) exists only in the `archives/` directory and is not active.
>
> **For the true project status, architectural rules, and development priorities, you MUST read the handoff document:**
>
> ### 👉 [`griot-node/agents/handoff.md`](./agents/handoff.md) 👈
>
> Do not begin any work without first reading and understanding the handoff document.

---

# Griot Node - Seed Protocol Server

A complete implementation of the **Griot Seed Protocol V1** with FastAPI backend, React frontend, and TypeScript SDK. This node serves as the librarian and seed distributor in the kOS ecosystem, enabling AI service orchestration and job management.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   uvicorn server.main:app --port 8003 --reload
   ```

3. **API Documentation:** Visit http://localhost:8003/docs

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd web-app
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the UI:** Visit http://localhost:5173

### Default Login
- **Username:** Any non-empty string
- **Password:** Any non-empty string

## 📋 Features

### ✅ Implemented
- **Authentication:** JWT-based auth with token management
- **Services Management:** Full CRUD for AI service configurations
- **Jobs System:** Create, track, and manage long-running operations
- **Proxy Gateway:** Secure forwarding to backend AI services
- **Modern UI:** React-based web interface with real-time updates
- **Type Safety:** Complete TypeScript SDK and frontend

### 🔄 API Endpoints

#### Core
- `GET /api/v1/identity` - Node identification
- `POST /api/v1/auth/login` - Authentication

#### Services
- `GET /api/v1/services` - List all services
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/{id}` - Update service
- `DELETE /api/v1/services/{id}` - Delete service

#### Jobs
- `GET /api/v1/jobs` - List all jobs
- `POST /api/v1/jobs` - Create job
- `GET /api/v1/jobs/{id}` - Get job status
- `DELETE /api/v1/jobs/{id}` - Cancel/delete job

#### Proxy
- `{METHOD} /api/v1/proxy/{serviceId}/{path}` - Forward requests to services

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │───▶│  FastAPI Server │───▶│  AI Services    │
│  (Port 5173)    │    │   (Port 8003)   │    │  (External)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  TypeScript SDK │    │  In-Memory DB   │
│                 │    │  (Temporary)    │
└─────────────────┘    └─────────────────┘
```

## 🧪 Testing

### Manual Testing
```bash
# Test identity endpoint
curl http://localhost:8003/api/v1/identity

# Login and get token
curl -X POST http://localhost:8003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Test authenticated endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8003/api/v1/services
```

### Frontend Testing
1. Open http://localhost:5173
2. Login with any credentials
3. Navigate between Dashboard, Services, and Jobs
4. Test CRUD operations

## 📁 Project Structure

```
griot-node/
├── server/                 # FastAPI backend
│   ├── main.py            # Application entry point
│   ├── routes/            # API endpoints
│   ├── models.py          # Pydantic models
│   ├── deps.py            # Dependencies (auth, etc.)
│   └── settings.py        # Configuration
├── web-app/               # React frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Services, Jobs
│   │   ├── components/    # Navigation, etc.
│   │   ├── hooks/         # useAuth
│   │   └── api/           # SDK client
│   └── package.json
├── sdk/                   # TypeScript SDK
│   └── GriotSeedClient.ts
├── documentation/         # Complete project docs
└── requirements.txt       # Python dependencies
```

## 🔧 Configuration

### Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXP_MIN=60

# Database (future)
POSTGRES_URL=postgresql://user:pass@localhost/griot

# CORS
ALLOWED_ORIGINS=["http://localhost:5173"]
```

### Frontend Environment
```bash
# .env in web-app/
VITE_API_BASE_URL=http://localhost:8003
```

## 🚧 Development Roadmap

### Phase 3 - Database & Production
- [ ] SQLModel + PostgreSQL integration
- [ ] Database migrations
- [ ] Docker deployment
- [ ] Environment-based configuration

### Phase 4 - Enhanced Features
- [ ] Real-time job status updates (WebSocket)
- [ ] Service health monitoring
- [ ] Advanced proxy features (load balancing)
- [ ] User management and RBAC

### Phase 5 - Testing & CI/CD
- [ ] Pytest backend tests
- [ ] Playwright E2E tests
- [ ] GitHub Actions CI/CD
- [ ] Performance testing

## 📖 API Documentation

Full API documentation is available at http://localhost:8003/docs when the server is running.

## 🤝 Contributing

1. Follow the agent rules in `documentation/01_agents/01_core/agent-rules.md`
2. Use the Two-Edit rule for iterative development
3. Update execution plans and documentation
4. Test thoroughly before committing

## 📄 License

This project is part of the kOS ecosystem implementing the Griot Seed Protocol V1.

---

*Generated by Claude Sonnet 4 on 2025-06-24* 