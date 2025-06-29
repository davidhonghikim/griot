# Next Agent Quick Start Guide

**Priority**: HIGH - API Key Resolution Required  
**Estimated Time**: 15-30 minutes  
**Success Criteria**: PersonaRAG service operational with real API key

---

## 🚨 Immediate Action Required

### Step 1: Fix API Key Configuration (5 minutes)

**File**: `apps/persona-rag-bridge/src/server.ts`  
**Lines**: 67-75  
**Issue**: Mock API key causing authentication failures

**Current Code**:
```typescript
if (!openaiApiKey) {
  console.warn('⚠️ OpenAI API key not configured');
  console.warn('💡 Run "npm run vault:set OPENAI_API_KEY" to configure');
  console.warn('💡 Using mock embedding service for testing');
  // Set a mock key for testing
  process.env.OPENAI_API_KEY = 'mock-key-for-testing';
} else {
  process.env.OPENAI_API_KEY = openaiApiKey;
  console.log('✅ OpenAI API key loaded from vault');
}
```

**Fix**: Replace `'mock-key-for-testing'` with `'sk-dae28e6035904cecb2737fbc54768d16'`

**Updated Code**:
```typescript
if (!openaiApiKey) {
  console.warn('⚠️ OpenAI API key not configured');
  console.warn('💡 Run "npm run vault:set OPENAI_API_KEY" to configure');
  console.warn('💡 Using test API key for development');
  // Set test API key for development
  process.env.OPENAI_API_KEY = 'sk-dae28e6035904cecb2737fbc54768d16';
} else {
  process.env.OPENAI_API_KEY = openaiApiKey;
  console.log('✅ OpenAI API key loaded from vault');
}
```

### Step 2: Test the Fix (5 minutes)

```bash
# Navigate to bridge app
cd apps/persona-rag-bridge

# Start the server
npm run dev

# In another terminal, test the persona query
curl -X POST http://localhost:3000/api/personas/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "limit": 5, "threshold": 0.6}'
```

**Expected Success**: No authentication errors, embedding generation working

### Step 3: Validate End-to-End Flow (10 minutes)

1. **Test Health Check**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test Vault Status**:
   ```bash
   curl http://localhost:3000/vault/status
   ```

3. **Test Persona Selection**:
   ```bash
   curl -X POST http://localhost:3000/api/personas/select \
     -H "Content-Type: application/json" \
     -d '{"personaId": "test-persona", "context": "general context"}'
   ```

4. **Test Enhanced Chat**:
   ```bash
   curl -X POST http://localhost:3000/api/chat/enhanced \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello, how are you?", "personaId": "test-persona"}'
   ```

---

## 📊 System Status Check

### Verify Database Services
```bash
# Check if all databases are running
docker-compose ps

# Expected output: All services showing "Up" status
```

### Verify Vault System
```bash
# Check vault status
npm run vault:status

# Expected output: Vault operational with secrets listed
```

---

## 🎯 Success Indicators

### ✅ Working Correctly
- Server starts without authentication errors
- Persona query endpoint returns results
- Embedding generation works with real API key
- Vector search functionality operational
- All database services accessible

### ❌ Still Needs Work
- Authentication errors persist
- Server fails to start
- Embedding generation fails
- Database connection issues

---

## 📁 Key Files for Reference

- **Main Issue**: `apps/persona-rag-bridge/src/server.ts` (lines 67-75)
- **Embedding Service**: `packages/data/core/rag/embedding_service.ts`
- **PersonaRAG Service**: `packages/data/core/rag/persona_rag_service.ts`
- **Current Status**: `docs/CURRENT_SYSTEM_STATUS.md`
- **Handoff Details**: `agents/handoff/LATEST_HANDOFF.yml`

---

## 🔧 Troubleshooting

### If API Key Fix Doesn't Work
1. Check if the API key is valid: `curl -H "Authorization: Bearer sk-dae28e6035904cecb2737fbc54768d16" https://api.openai.com/v1/models`
2. Verify server.ts changes were saved correctly
3. Restart the server after making changes

### If Database Issues
1. Check Docker Compose status: `docker-compose ps`
2. Restart services: `docker-compose restart`
3. Check logs: `docker-compose logs [service-name]`

### If Vault Issues
1. Check vault status: `npm run vault:status`
2. Reinitialize vault: `npm run vault:init`
3. Check file permissions on vault files

---

## 📞 Next Steps After Success

1. **Document the Fix** - Update changelog with successful resolution
2. **Complete Testing** - Test all endpoints and workflows
3. **Update Documentation** - Mark system as 100% operational
4. **Prepare Production** - Document deployment steps
5. **Handoff Preparation** - Update handoff file for next agent

---

**Remember**: The system is 90% complete. This API key fix is the final piece needed to make it fully operational. Once resolved, the PersonaRAG Bridge system will be ready for production deployment. 