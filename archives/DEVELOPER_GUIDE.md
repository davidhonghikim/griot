# Developer Guide - Griot Node

## Overview

This guide provides comprehensive information for developers working with the Griot Node implementation. The project follows the kOS ecosystem architecture patterns and implements the Griot Seed Protocol V1.

## Architecture Deep Dive

### Backend (FastAPI)

```
server/
├── main.py          # Application setup, CORS, middleware
├── routes/          # API endpoint implementations
│   ├── auth.py      # JWT authentication
│   ├── node.py      # Node identity
│   ├── services.py  # Service CRUD operations
│   ├── jobs.py      # Job management
│   └── proxy.py     # Service proxying
├── models.py        # Pydantic data models
├── deps.py          # Dependency injection (auth, DB)
└── settings.py      # Configuration management
```

### Frontend (React + TypeScript)

```
web-app/src/
├── pages/           # Route components
│   ├── Dashboard.tsx
│   ├── Services.tsx
│   ├── Jobs.tsx
│   └── Login.tsx
├── components/      # Reusable UI components
│   └── Navigation.tsx
├── hooks/           # Custom React hooks
│   └── useAuth.ts
└── api/             # API client setup
    └── client.ts
```

### SDK (TypeScript)

The SDK provides type-safe access to all Griot Node endpoints:

```typescript
import { GriotSeedClient } from 'griot-sdk';

const client = new GriotSeedClient({ 
  baseUrl: 'http://localhost:8003' 
});

// Authentication
await client.login('username', 'password');

// Services
const services = await client.services.list();
const service = await client.services.create({...});

// Jobs
const jobs = await client.jobs.list();
const job = await client.jobs.create({...});

// Proxy
const result = await client.proxy.post('service-id', '/chat', {...});
```

## Development Workflow

### 1. Environment Setup

```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd web-app && npm install
```

### 2. Development Servers

**Terminal 1 - Backend:**
```bash
uvicorn server.main:app --port 8003 --reload
```

**Terminal 2 - Frontend:**
```bash
cd web-app && npm run dev
```

### 3. Testing Endpoints

```bash
# Get JWT token
TOKEN=$(curl -s -X POST "http://localhost:8003/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

# Test services
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8003/api/v1/services/"

# Create a service
curl -X POST "http://localhost:8003/api/v1/services/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Local Ollama",
    "type": "ollama",
    "url": "http://localhost:11434",
    "capabilities": ["llm_chat"]
  }'
```

## Key Components

### Authentication System

The application uses JWT tokens for authentication:

1. **Login:** `POST /api/v1/auth/login` returns an access token
2. **Storage:** Token stored in localStorage and set in API client
3. **Usage:** All protected endpoints require `Authorization: Bearer <token>`
4. **Validation:** Backend validates JWT signature and expiration

### Service Management

Services represent external AI services that the Griot can proxy to:

- **Types:** `ollama`, `openai`, `comfyui`, `custom`
- **Capabilities:** `llm_chat`, `llm_embedding`, `image_generation`
- **Security:** API keys are stored but never exposed in responses
- **Metadata:** Creation/update timestamps tracked automatically

### Job System

Jobs represent long-running operations:

- **Status:** `pending`, `running`, `completed`, `failed`
- **Metadata:** Flexible key-value storage
- **Lifecycle:** Create → Monitor → Complete/Fail
- **Management:** Full CRUD operations available

### Proxy Gateway

The proxy system forwards requests to backend services:

- **Path Rewriting:** `/proxy/{serviceId}/{path}` → `{service.url}/{path}`
- **Authentication:** Strips Griot auth, adds service API key
- **Security:** Validates service exists and user has access
- **Streaming:** Supports streaming responses

## Data Models

### Service Model
```typescript
interface Service {
  id: string;
  name: string;
  type: 'ollama' | 'openai' | 'comfyui' | 'custom';
  url: string;
  capabilities: ('llm_chat' | 'llm_embedding' | 'image_generation')[];
  apiKey?: string; // Never exposed in responses
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}
```

### Job Model
```typescript
interface Job {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: {
    code: string;
    message: string;
  };
  metadata: {
    type: string;
    createdAt: string;
    completedAt?: string;
    parameters: string; // JSON string
  };
}
```

## Error Handling

### Backend Errors
All API errors follow a consistent format:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Service 'xyz' not found",
    "requestId": "uuid-v4"
  }
}
```

### Frontend Error Handling
- React Query handles API errors automatically
- Toast notifications for user feedback
- Loading states for better UX
- Error boundaries prevent crashes

## Configuration

### Backend Settings
```python
# server/settings.py
class Settings(BaseSettings):
    jwt_secret: str = "dev-secret-key"
    jwt_algorithm: str = "HS256" 
    jwt_exp_minutes: int = 60
    postgres_url: str = "sqlite:///./dev.db"
    allowed_origins: List[str] = ["*"]
```

### Frontend Environment
```bash
# web-app/.env
VITE_API_BASE_URL=http://localhost:8003
```

## Security Considerations

1. **JWT Security:** Use strong secrets in production
2. **CORS:** Configure allowed origins properly
3. **API Keys:** Never log or expose service API keys
4. **Input Validation:** All inputs validated with Pydantic
5. **Proxy Security:** Sanitize forwarded requests

## Testing Strategy

### Manual Testing
1. Start both servers
2. Login via UI at http://localhost:5173
3. Test all CRUD operations
4. Verify proxy functionality with real services

### API Testing
```bash
# Run the comprehensive test script
./scripts/test_api.sh
```

### Future Testing
- **Backend:** pytest with test database
- **Frontend:** React Testing Library + Playwright
- **E2E:** Full user journey testing
- **Performance:** Load testing with realistic workloads

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.9+)
- Verify all dependencies installed
- Check port 8003 availability

**Frontend errors:**
- Verify Node.js version (18+)
- Check web-app/node_modules exists
- Ensure backend is running

**Authentication issues:**
- Clear localStorage and try again
- Check JWT token expiration
- Verify backend auth endpoint

**SDK errors:**
- Ensure base URL is correct
- Check token is set properly
- Verify API responses match interfaces

## Contributing

1. **Follow Agent Rules:** See `documentation/01_agents/01_core/agent-rules.md`
2. **Two-Edit Rule:** Make small, verifiable changes
3. **Update Documentation:** Keep this guide current
4. **Test Thoroughly:** Verify all functionality works
5. **Log Changes:** Update execution plans

## Next Steps

1. **Database Migration:** Replace in-memory storage with PostgreSQL
2. **Real-time Updates:** WebSocket support for job status
3. **Enhanced Security:** RBAC and rate limiting
4. **Monitoring:** Prometheus metrics and health checks
5. **Deployment:** Docker containers and CI/CD

---

*This guide is maintained alongside the codebase and should be updated with any architectural changes.* 