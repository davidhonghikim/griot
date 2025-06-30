#!/bin/bash
echo "🚀 Starting PersonaRAG Bridge in REMOTE mode..."
echo "📡 OpenWebUI will connect to: http://192.168.1.180:3000"
echo "🌐 Server will be available at: http://localhost:30436"
echo ""

export USE_LOCAL=false
npm run build
node dist-server/src/server.js 