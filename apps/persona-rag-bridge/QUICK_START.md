# 🚀 Quick Start Guide

## For OpenWebUI Integration

This guide will get you up and running with the PersonaRAG Bridge connected to your OpenWebUI instance at `http://192.168.1.180:3000`.

## Step 1: Setup Vault and Configuration

```bash
# Navigate to the bridge directory
cd apps/persona-rag-bridge

# Run the automated setup (recommended)
./scripts/setup-vault.sh
```

**OR** manually:

```bash
# Install dependencies
npm install

# Initialize the secure vault
npm run vault:init

# Set your OpenWebUI API key (you'll be prompted)
npm run vault:set OPENWEBUI_API_KEY

# Build the project
npm run build
```

## Step 2: Configure OpenWebUI API Key

You need to get your OpenWebUI API key:

1. **Open your OpenWebUI** at `http://192.168.1.180:3000`
2. **Go to Settings** → **API Keys**
3. **Create a new API key** or copy an existing one
4. **Store it in the vault**:

```bash
npm run vault:set OPENWEBUI_API_KEY
# Enter your API key when prompted
```

## Step 3: Start the Bridge

```bash
# Start in development mode
npm run dev
```

You should see:
```
🚀 PersonaRAG Bridge running on port 3000
📡 WebSocket server ready
🔐 Vault system active
```

## Step 4: Test the Integration

### Test Health Check
```bash
curl http://localhost:3000/health
```

### Test Persona Query
```bash
curl -X POST http://localhost:3000/api/personas/query \
  -H "Content-Type: application/json" \
  -d '{"query": "I need help with storytelling"}'
```

### Test Enhanced Chat
```bash
curl -X POST http://localhost:3000/api/chat/enhanced \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me a story about wisdom", "personaId": "griot_001"}'
```

## Step 5: Verify OpenWebUI Connection

```bash
# Test OpenWebUI connectivity
curl http://192.168.1.180:3000/health

# Check your API key is working
npm run vault:get OPENWEBUI_API_KEY
```

## 🔧 Troubleshooting

### If OpenWebUI Connection Fails

1. **Check OpenWebUI is running**:
   ```bash
   curl http://192.168.1.180:3000/health
   ```

2. **Verify API key**:
   ```bash
   npm run vault:get OPENWEBUI_API_KEY
   ```

3. **Update OpenWebUI URL if needed**:
   ```bash
   npm run vault:set OPENWEBUI_URL -- --value "http://your-actual-url:3000"
   ```

### If Vault Has Issues

1. **Check vault status**:
   ```bash
   npm run vault:status
   ```

2. **Validate security**:
   ```bash
   npm run vault:validate
   ```

3. **Reinitialize if needed**:
   ```bash
   npm run vault:init -- --force
   ```

## 🎯 What You Get

Once running, your OpenWebUI will have:

- **🔐 Secure API key management** via encrypted vault
- **🤖 Automatic persona selection** based on your queries
- **📡 Real-time WebSocket communication**
- **🛡️ Enterprise-grade security** with encrypted secrets

## 📋 Next Steps

1. **Test with different personas**: Try queries about "wisdom", "storytelling", "culture"
2. **Monitor logs**: Check `logs/persona-rag.log` for detailed information
3. **Add more API keys**: Configure OpenAI, Hugging Face, etc. as needed
4. **Scale up**: Add MongoDB and Weaviate for production use

## 🆘 Need Help?

- **Vault commands**: `npm run vault:help`
- **Check logs**: `tail -f logs/persona-rag.log`
- **Security audit**: `npm run vault:validate`
- **Full documentation**: See `README.md`

---

**Your PersonaRAG Bridge is now ready to enhance OpenWebUI with cultural wisdom! 🎉** 