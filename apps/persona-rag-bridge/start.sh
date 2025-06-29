#!/bin/bash

# PersonaRAG Bridge Quick Start Script
# Connects PersonaRAG engine to OpenWebUI for persona-aware AI interactions

echo "🚀 PersonaRAG Bridge Quick Start"
echo "================================"

# Set environment variables
export PERSONA_RAG_PORT=3000
export OPENWEBUI_URL=http://192.168.1.180:3000
export NODE_ENV=development
export DEBUG_PERSONA_SELECTION=true

echo "📋 Configuration:"
echo "   Bridge Port: $PERSONA_RAG_PORT"
echo "   OpenWebUI URL: $OPENWEBUI_URL"
echo "   Environment: $NODE_ENV"
echo ""

# Create .env file
cat > .env << EOF
PERSONA_RAG_PORT=3000
OPENWEBUI_URL=http://192.168.1.180:3000
NODE_ENV=development
DEBUG_PERSONA_SELECTION=true
ALLOWED_ORIGINS=http://192.168.1.180:3000,http://localhost:3000,http://127.0.0.1:3000
EOF

echo "✅ Environment configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the bridge service
echo "🚀 Starting PersonaRAG Bridge..."
echo "   API will be available at: http://localhost:$PERSONA_RAG_PORT"
echo "   Health check: http://localhost:$PERSONA_RAG_PORT/health"
echo ""
echo "💡 Try these endpoints:"
echo "   POST /api/persona/query - Query available personas"
echo "   POST /api/persona/select - Select best persona for query"
echo "   POST /api/chat/enhanced - Enhanced chat with persona context"
echo ""
echo "🎯 Test queries:"
echo "   'Tell me a story about wisdom' -> Should select Griot"
echo "   'I need spiritual guidance' -> Should select Tohunga"
echo ""

npm run build && npm start 