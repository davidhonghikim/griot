#!/bin/bash

# PersonaRAG Quick Test Launcher
echo "🔐 PersonaRAG Quick Test Launcher"
echo "=================================="

# Get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML_PATH="$PROJECT_ROOT/apps/persona-rag-bridge/simple-chat/index.html"

echo "📁 Project root: $PROJECT_ROOT"
echo "🌐 HTML file: $HTML_PATH"

# Check if the HTML file exists
if [ ! -f "$HTML_PATH" ]; then
    echo "❌ HTML file not found: $HTML_PATH"
    exit 1
fi

# Convert to file:// URL
FILE_URL="file://$HTML_PATH"

echo ""
echo "🚀 Opening Quick Test in browser..."
echo "📋 URL: $FILE_URL"
echo ""
echo "💡 Manual commands (if needed):"
echo "   Main Bridge: cd $PROJECT_ROOT && ./start-persona-rag.sh"
echo "   Vault GUI:   cd $PROJECT_ROOT && ./start-vault-gui.sh"
echo ""

# Try to open in browser
if command -v open &> /dev/null; then
    # macOS
    open "$FILE_URL"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "$FILE_URL"
elif command -v start &> /dev/null; then
    # Windows
    start "$FILE_URL"
else
    echo "❌ Could not automatically open browser"
    echo "📋 Please manually open: $FILE_URL"
fi

echo ""
echo "✅ Quick Test page should now be open in your browser!"
echo "🔧 Use the page to:"
echo "   - Launch services (or copy manual commands)"
echo "   - Configure API keys and URLs"
echo "   - Test the chat functionality"
echo "" 