#!/bin/bash

# PersonaRAG Bridge - One Button Startup
# This script handles the complete setup and launch process

set -e  # Exit on any error

echo "🚀 PersonaRAG Bridge - One Button Startup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Navigate to the bridge directory
cd "$(dirname "$0")/apps/persona-rag-bridge" || {
    print_error "Could not find persona-rag-bridge directory"
    exit 1
}

print_status "Starting PersonaRAG Bridge setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Prerequisites check passed"

# Install dependencies
print_status "Installing dependencies..."
npm install --silent
print_success "Dependencies installed"

# Check if vault is already initialized
if [ ! -f "vault/secrets.enc" ]; then
    print_status "Initializing secure vault..."
    
    # Create a temporary script to handle the vault initialization
    cat > temp_vault_init.js << 'EOF'
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Initializing PersonaRAG Vault...');
console.log('This will create default secrets for development.');

const vaultInit = spawn('npx', ['ts-node', 'src/vault/vault-cli.ts', 'init'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

vaultInit.stdout.on('data', (data) => {
    console.log(data.toString());
});

vaultInit.stderr.on('data', (data) => {
    console.error(data.toString());
});

vaultInit.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Vault initialized successfully!');
        rl.close();
    } else {
        console.error('❌ Vault initialization failed');
        process.exit(1);
    }
});
EOF

    node temp_vault_init.js
    rm temp_vault_init.js
    print_success "Vault initialized"
else
    print_success "Vault already exists"
fi

# Build the project
print_status "Building project..."
npm run build --silent
print_success "Project built"

# Check if OpenWebUI API key is set
print_status "Checking OpenWebUI configuration..."

# Try to get the API key
API_KEY=$(npx ts-node src/vault/vault-cli.ts get OPENWEBUI_API_KEY 2>/dev/null || echo "")

if [ -z "$API_KEY" ]; then
    print_warning "OpenWebUI API key not found"
    echo ""
    echo "To complete the setup, you need to:"
    echo "1. Get your OpenWebUI API key from http://192.168.1.180:3000 (Settings → API Keys)"
    echo "2. Run: npm run vault:set OPENWEBUI_API_KEY"
    echo "3. Enter your API key when prompted"
    echo ""
    echo "For now, the bridge will start with default settings."
    echo ""
else
    print_success "OpenWebUI API key found"
fi

# Start the bridge service
print_status "Starting PersonaRAG Bridge service..."
echo ""
echo "🌉 Bridge will be available at: http://localhost:3000"
echo "🔗 OpenWebUI integration: http://192.168.1.180:3000"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the development server
npm run dev 