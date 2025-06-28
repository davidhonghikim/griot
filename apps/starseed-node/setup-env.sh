#!/bin/bash

# Starseed Node Environment Setup Script
# This script helps you quickly configure your environment for development

echo "🚀 Starseed Node Environment Setup"
echo "=================================="

# Detect local IP address
echo "🔍 Detecting your local IP address..."
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="192.168.1.180"
    echo "⚠️  Could not auto-detect IP, using default: $LOCAL_IP"
else
    echo "✅ Detected IP: $LOCAL_IP"
fi

# Ask user to confirm or change IP
read -p "📝 Use this IP for local services? [$LOCAL_IP]: " USER_IP
BASE_IP=${USER_IP:-$LOCAL_IP}

echo ""
echo "🔧 Creating environment configuration..."

# Create .env file from template
cp env.example .env

# Replace BASE_IP in the .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/BASE_IP=192.168.1.180/BASE_IP=$BASE_IP/g" .env
else
    # Linux
    sed -i "s/BASE_IP=192.168.1.180/BASE_IP=$BASE_IP/g" .env
fi

echo "✅ Base configuration created: .env"

# Ask if user wants to create a personal override file
echo ""
read -p "🔧 Create personal override file (.env.local) for customizations? [y/N]: " CREATE_OVERRIDE

if [[ $CREATE_OVERRIDE =~ ^[Yy]$ ]]; then
    cp env.local.example .env.local
    
    # Replace BASE_IP in the override file too
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/BASE_IP=192.168.1.100/BASE_IP=$BASE_IP/g" .env.local
    else
        # Linux
        sed -i "s/BASE_IP=192.168.1.100/BASE_IP=$BASE_IP/g" .env.local
    fi
    
    echo "✅ Personal override file created: .env.local"
    echo "   📝 Edit this file for your personal customizations"
fi

echo ""
echo "📋 Quick Configuration Summary:"
echo "   • Base IP: $BASE_IP"
echo "   • Server Port: 30437"
echo "   • MongoDB: mongodb://$BASE_IP:27017"
echo "   • PostgreSQL: $BASE_IP:5432"
echo "   • Weaviate: http://$BASE_IP:8080"
echo "   • Neo4j: bolt://$BASE_IP:7687"
echo ""
echo "🔧 Configuration Files:"
echo "   • .env - Base configuration (auto-generated)"
if [[ $CREATE_OVERRIDE =~ ^[Yy]$ ]]; then
    echo "   • .env.local - Personal overrides (edit this for customizations)"
fi
echo ""
echo "🔧 Next Steps:"
echo "   1. Edit .env.local if you created it, or .env for basic changes"
echo "   2. Start your database services (Docker Compose recommended)"
echo "   3. Run: npm run dev"
echo ""
echo "📖 Environment File Priority:"
echo "   1. .env.local (personal overrides)"
echo "   2. .env (base configuration)"
echo "   3. env.example (template)" 