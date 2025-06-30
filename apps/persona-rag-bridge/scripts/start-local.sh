#!/bin/bash
echo "🚀 Starting PersonaRAG Bridge in LOCAL mode..."
echo "📡 OpenWebUI will connect to: http://localhost:3000"
echo "🌐 Server will be available at: http://localhost:30436"
echo ""

export USE_LOCAL=true
npm run build
node dist-server/src/server.js 