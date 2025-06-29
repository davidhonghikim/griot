#!/bin/bash

# PersonaRAG Vault Web GUI Launcher
echo "🔐 Starting PersonaRAG Vault Web GUI..."

cd apps/persona-rag-bridge

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the vault web GUI
echo "🌐 Launching Vault Web GUI on http://localhost:3001"
npx ts-node src/vault/web/server.ts 