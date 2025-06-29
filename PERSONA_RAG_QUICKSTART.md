# 🚀 PersonaRAG Bridge - One Button Startup

## Quick Start

Just run this single command from the project root:

```bash
./start-persona-rag.sh
```

That's it! The script will:

1. ✅ Check prerequisites (Node.js, npm)
2. ✅ Install all dependencies
3. ✅ Initialize the secure vault with default settings
4. ✅ Build the project
5. ✅ Start the bridge service on port 3000

## What You Get

- **🌉 PersonaRAG Bridge** running on `http://localhost:3000`
- **🔗 OpenWebUI Integration** ready for `http://192.168.1.180:3000`
- **🔐 Secure Vault** with encrypted credential storage
- **📡 REST API** endpoints for persona queries
- **🛡️ WebSocket** support for real-time communication

## Next Steps (Optional)

If you want to connect to your actual OpenWebUI instance:

1. Get your API key from OpenWebUI (Settings → API Keys)
2. Run: `cd apps/persona-rag-bridge && npm run vault:set OPENWEBUI_API_KEY`
3. Enter your API key when prompted

## Testing the Connection

Once running, test with:

```bash
# Health check
curl http://localhost:3000/health

# Test persona query
curl -X POST http://localhost:3000/api/personas/query \
  -H "Content-Type: application/json" \
  -d '{"query": "I need help with storytelling"}'
```

## Stop the Service

Press `Ctrl+C` in the terminal where the script is running.

---

**That's it! Your PersonaRAG Bridge is ready to enhance OpenWebUI with cultural wisdom! 🎉** 