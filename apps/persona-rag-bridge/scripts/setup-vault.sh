#!/bin/bash

# PersonaRAG Bridge Vault Setup Script
# This script initializes the secure vault and guides users through configuration

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local secret="$2"
    local default="$3"
    
    if [ "$secret" = "true" ]; then
        read -s -p "$prompt: " input
        echo
    else
        if [ -n "$default" ]; then
            read -p "$prompt [$default]: " input
            input=${input:-$default}
        else
            read -p "$prompt: " input
        fi
    fi
    
    echo "$input"
}

# Function to validate API key format
validate_api_key() {
    local key="$1"
    if [[ "$key" =~ ^[A-Za-z0-9_-]{20,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate URL format
validate_url() {
    local url="$1"
    if [[ "$url" =~ ^https?://[^\s/$.?#].[^\s]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Main setup function
main() {
    echo "🔐 PersonaRAG Bridge Vault Setup"
    echo "================================="
    echo
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
    
    # Initialize vault
    print_status "Initializing secure vault..."
    npm run vault:init
    print_success "Vault initialized"
    
    echo
    echo "🔧 Configuration Setup"
    echo "======================"
    echo
    
    # OpenWebUI Configuration
    print_status "Configuring OpenWebUI integration..."
    
    openwebui_url=$(prompt_input "Enter OpenWebUI URL" "false" "http://192.168.1.180:3000")
    
    if ! validate_url "$openwebui_url"; then
        print_error "Invalid URL format: $openwebui_url"
        exit 1
    fi
    
    echo "Testing connection to OpenWebUI..."
    if curl -s --connect-timeout 5 "$openwebui_url/health" > /dev/null 2>&1; then
        print_success "OpenWebUI connection successful"
    else
        print_warning "Could not connect to OpenWebUI. Please ensure it's running."
    fi
    
    # API Key Configuration
    print_status "Configuring API keys..."
    
    echo
    echo "You'll need to provide API keys for various services."
    echo "If you don't have a key for a service, you can skip it for now."
    echo
    
    # OpenWebUI API Key
    openwebui_api_key=$(prompt_input "Enter OpenWebUI API Key (optional)" "true" "")
    if [ -n "$openwebui_api_key" ]; then
        npm run vault:set OPENWEBUI_API_KEY -- --value "$openwebui_api_key"
        print_success "OpenWebUI API key stored"
    fi
    
    # OpenAI API Key
    openai_api_key=$(prompt_input "Enter OpenAI API Key (optional)" "true" "")
    if [ -n "$openai_api_key" ]; then
        if validate_api_key "$openai_api_key"; then
            npm run vault:set OPENAI_API_KEY -- --value "$openai_api_key"
            print_success "OpenAI API key stored"
        else
            print_warning "OpenAI API key format appears invalid. Storing anyway..."
            npm run vault:set OPENAI_API_KEY -- --value "$openai_api_key"
        fi
    fi
    
    # Hugging Face API Key
    hf_api_key=$(prompt_input "Enter Hugging Face API Key (optional)" "true" "")
    if [ -n "$hf_api_key" ]; then
        npm run vault:set HUGGINGFACE_API_KEY -- --value "$hf_api_key"
        print_success "Hugging Face API key stored"
    fi
    
    # Database Configuration
    echo
    print_status "Configuring database connections..."
    
    # MongoDB
    echo "MongoDB Configuration:"
    mongo_host=$(prompt_input "MongoDB host" "false" "localhost")
    mongo_port=$(prompt_input "MongoDB port" "false" "27017")
    mongo_db=$(prompt_input "MongoDB database name" "false" "griot")
    mongo_user=$(prompt_input "MongoDB username (optional)" "false" "")
    
    if [ -n "$mongo_user" ]; then
        mongo_pass=$(prompt_input "MongoDB password" "true" "")
        npm run vault:set MONGODB_USERNAME -- --value "$mongo_user"
        npm run vault:set MONGODB_PASSWORD -- --value "$mongo_pass"
    fi
    
    npm run vault:set MONGODB_DATABASE -- --value "$mongo_db"
    
    # Weaviate
    echo
    echo "Weaviate Configuration:"
    weaviate_url=$(prompt_input "Weaviate URL" "false" "http://localhost:8080")
    if ! validate_url "$weaviate_url"; then
        print_error "Invalid Weaviate URL format: $weaviate_url"
        exit 1
    fi
    
    npm run vault:set WEAVIATE_URL -- --value "$weaviate_url"
    
    # Security Configuration
    echo
    print_status "Configuring security settings..."
    
    # Generate JWT secret
    jwt_secret=$(openssl rand -hex 32 2>/dev/null || echo "fallback_jwt_secret_$(date +%s)")
    npm run vault:set JWT_SECRET -- --value "$jwt_secret"
    print_success "JWT secret generated"
    
    # Generate encryption key
    encryption_key=$(openssl rand -hex 32 2>/dev/null || echo "fallback_encryption_key_$(date +%s)")
    npm run vault:set SECRETS_ENCRYPTION_KEY -- --value "$encryption_key"
    print_success "Encryption key generated"
    
    # Validate vault security
    echo
    print_status "Validating vault security..."
    npm run vault:validate
    
    # Show vault status
    echo
    print_status "Vault status:"
    npm run vault:status
    
    # Create .env file from vault
    echo
    print_status "Creating .env file from vault..."
    npm run vault:export -- --output .env
    print_success ".env file created"
    
    # Set proper permissions
    chmod 600 .env
    chmod 700 vault/
    print_success "File permissions set"
    
    # Build the project
    echo
    print_status "Building project..."
    npm run build
    print_success "Project built successfully"
    
    echo
    echo "🎉 Setup Complete!"
    echo "=================="
    echo
    print_success "PersonaRAG Bridge vault has been configured successfully!"
    echo
    echo "📋 Next Steps:"
    echo "1. Start the bridge: npm run dev"
    echo "2. Test the connection: curl http://localhost:3000/health"
    echo "3. View vault status: npm run vault:status"
    echo "4. Add more secrets: npm run vault:set <KEY>"
    echo
    echo "🔐 Security Notes:"
    echo "- Your secrets are encrypted and stored in vault/secrets.enc"
    echo "- The .env file contains your configuration"
    echo "- Keep your encryption key secure - it's required to decrypt secrets"
    echo
    echo "📚 Documentation:"
    echo "- Vault CLI: npm run vault:help"
    echo "- API Documentation: See README.md"
    echo "- Troubleshooting: Check logs in logs/ directory"
    echo
}

# Run main function
main "$@" 