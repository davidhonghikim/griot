#!/bin/bash

# =============================================================================
# Starseed Node Deployment Script
# =============================================================================
# This script helps deploy Starseed Node with various configurations
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Configuration files
ENV_EXAMPLE="$PROJECT_DIR/env.example"
ENV_FILE="$PROJECT_DIR/.env"
ENV_PRODUCTION="$PROJECT_DIR/.env.production"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root. This is not recommended for security reasons."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Detect system
detect_system() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            SYSTEM="ubuntu"
        elif command -v yum &> /dev/null; then
            SYSTEM="centos"
        elif command -v pacman &> /dev/null; then
            SYSTEM="arch"
        else
            SYSTEM="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        SYSTEM="macos"
    else
        SYSTEM="unknown"
    fi
    log_info "Detected system: $SYSTEM"
}

# Get local IP address
get_local_ip() {
    if [[ "$SYSTEM" == "macos" ]]; then
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    else
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    
    if [[ -z "$LOCAL_IP" ]]; then
        LOCAL_IP="127.0.0.1"
    fi
    
    echo "$LOCAL_IP"
}

# Show deployment options
show_deployment_options() {
    echo
    log_info "Available deployment options:"
    echo "1. Direct Access (Development/Testing)"
    echo "   - Simple setup, no additional dependencies"
    echo "   - No SSL, limited security"
    echo "   - Best for: Development, testing, internal tools"
    echo
    echo "2. Nginx Reverse Proxy (Recommended Production)"
    echo "   - SSL support, load balancing, security headers"
    echo "   - Requires nginx configuration"
    echo "   - Best for: Production, high traffic, SSL termination"
    echo
    echo "3. Apache Reverse Proxy"
    echo "   - SSL support, security headers"
    echo "   - More complex configuration than nginx"
    echo "   - Best for: Existing Apache infrastructure"
    echo
    echo "4. Cloudflare Proxy"
    echo "   - Built-in security, global CDN, SSL"
    echo "   - Requires Cloudflare account"
    echo "   - Best for: CDN, DDoS protection, global distribution"
    echo
    echo "5. Docker Compose (All-in-One)"
    echo "   - Complete stack, easy deployment, isolated environment"
    echo "   - Resource overhead, Docker dependency"
    echo "   - Best for: Containerized deployment, easy scaling"
    echo
}

# Configure environment file
configure_env() {
    local deployment_type=$1
    local local_ip=$2
    local is_production=$3
    
    log_info "Configuring environment for $deployment_type deployment..."
    
    # Copy example file
    if [[ ! -f "$ENV_FILE" ]]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        log_success "Created .env file from template"
    fi
    
    # Update deployment type
    sed -i.bak "s/DEPLOYMENT_TYPE=.*/DEPLOYMENT_TYPE=$deployment_type/" "$ENV_FILE"
    
    # Update base IP
    sed -i.bak "s/BASE_IP=.*/BASE_IP=$local_ip/" "$ENV_FILE"
    
    # Update environment
    if [[ "$is_production" == "true" ]]; then
        sed -i.bak "s/NODE_ENV=.*/NODE_ENV=production/" "$ENV_FILE"
    else
        sed -i.bak "s/NODE_ENV=.*/NODE_ENV=development/" "$ENV_FILE"
    fi
    
    # Remove backup file
    rm -f "$ENV_FILE.bak"
    
    log_success "Environment configured for $deployment_type deployment"
}

# Setup direct access
setup_direct() {
    log_info "Setting up direct access deployment..."
    
    local_ip=$(get_local_ip)
    configure_env "direct" "$local_ip" "false"
    
    log_success "Direct access deployment configured"
    log_info "Application will be accessible at: http://$local_ip:30437"
}

# Setup nginx proxy
setup_nginx() {
    log_info "Setting up nginx reverse proxy deployment..."
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        log_warning "Nginx is not installed. Installing..."
        
        case $SYSTEM in
            "ubuntu")
                sudo apt update
                sudo apt install -y nginx
                ;;
            "centos")
                sudo yum install -y nginx
                sudo systemctl enable nginx
                ;;
            "arch")
                sudo pacman -S nginx
                ;;
            *)
                log_error "Cannot install nginx on this system. Please install manually."
                exit 1
                ;;
        esac
    fi
    
    local_ip=$(get_local_ip)
    configure_env "nginx" "$local_ip" "true"
    
    # Copy nginx configuration
    nginx_conf="/etc/nginx/sites-available/starseed-node"
    sudo cp "$PROJECT_DIR/deployment/nginx.conf.example" "$nginx_conf"
    
    log_info "Nginx configuration copied to $nginx_conf"
    log_warning "Please edit the nginx configuration with your domain name"
    log_info "Then enable the site with: sudo ln -s $nginx_conf /etc/nginx/sites-enabled/"
    log_info "Test configuration: sudo nginx -t"
    log_info "Reload nginx: sudo systemctl reload nginx"
    
    log_success "Nginx reverse proxy deployment configured"
}

# Setup apache proxy
setup_apache() {
    log_info "Setting up Apache reverse proxy deployment..."
    
    # Check if Apache is installed
    if ! command -v apache2 &> /dev/null && ! command -v httpd &> /dev/null; then
        log_warning "Apache is not installed. Installing..."
        
        case $SYSTEM in
            "ubuntu")
                sudo apt update
                sudo apt install -y apache2
                ;;
            "centos")
                sudo yum install -y httpd
                sudo systemctl enable httpd
                ;;
            "arch")
                sudo pacman -S apache
                ;;
            *)
                log_error "Cannot install Apache on this system. Please install manually."
                exit 1
                ;;
        esac
    fi
    
    local_ip=$(get_local_ip)
    configure_env "apache" "$local_ip" "true"
    
    # Copy Apache configuration
    apache_conf="/etc/apache2/sites-available/starseed-node.conf"
    if [[ "$SYSTEM" == "centos" ]]; then
        apache_conf="/etc/httpd/conf.d/starseed-node.conf"
    fi
    
    sudo cp "$PROJECT_DIR/deployment/apache.conf.example" "$apache_conf"
    
    log_info "Apache configuration copied to $apache_conf"
    log_warning "Please edit the Apache configuration with your domain name"
    log_info "Enable required modules: sudo a2enmod proxy proxy_http ssl"
    log_info "Enable site: sudo a2ensite starseed-node"
    log_info "Restart Apache: sudo systemctl restart apache2"
    
    log_success "Apache reverse proxy deployment configured"
}

# Setup cloudflare proxy
setup_cloudflare() {
    log_info "Setting up Cloudflare proxy deployment..."
    
    local_ip=$(get_local_ip)
    configure_env "cloudflare" "$local_ip" "true"
    
    log_info "Cloudflare proxy deployment configured"
    log_warning "Please configure your domain in Cloudflare with proxy enabled"
    log_info "Point your domain to: $local_ip"
    log_info "Enable Cloudflare proxy (orange cloud) for your domain"
    
    log_success "Cloudflare proxy deployment configured"
}

# Setup docker compose
setup_docker() {
    log_info "Setting up Docker Compose deployment..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    local_ip=$(get_local_ip)
    configure_env "direct" "$local_ip" "true"
    
    # Copy Docker Compose configuration
    cp "$PROJECT_DIR/deployment/docker-compose.production.yml" "$PROJECT_DIR/docker-compose.yml"
    
    log_info "Docker Compose configuration copied"
    log_warning "Please edit docker-compose.yml with your secure passwords"
    log_info "Start services: docker-compose up -d"
    log_info "View logs: docker-compose logs -f"
    
    log_success "Docker Compose deployment configured"
}

# Install dependencies
install_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    cd "$PROJECT_DIR"
    
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Dependencies installed"
}

# Build application
build_application() {
    log_info "Building application..."
    
    cd "$PROJECT_DIR"
    npm run build
    
    log_success "Application built"
}

# Start application
start_application() {
    local deployment_type=$1
    
    log_info "Starting application..."
    
    cd "$PROJECT_DIR"
    
    case $deployment_type in
        "docker")
            docker-compose up -d
            log_success "Docker services started"
            ;;
        *)
            if [[ "$NODE_ENV" == "production" ]]; then
                npm start
            else
                npm run dev
            fi
            ;;
    esac
}

# Main deployment function
deploy() {
    local deployment_type=$1
    local auto_start=$2
    
    log_info "Starting deployment for type: $deployment_type"
    
    # Check root access
    check_root
    
    # Detect system
    detect_system
    
    # Show deployment options if not specified
    if [[ -z "$deployment_type" ]]; then
        show_deployment_options
        echo
        read -p "Select deployment type (1-5): " -n 1 -r
        echo
        
        case $REPLY in
            1) deployment_type="direct" ;;
            2) deployment_type="nginx" ;;
            3) deployment_type="apache" ;;
            4) deployment_type="cloudflare" ;;
            5) deployment_type="docker" ;;
            *) log_error "Invalid selection"; exit 1 ;;
        esac
    fi
    
    # Setup based on deployment type
    case $deployment_type in
        "direct")
            setup_direct
            ;;
        "nginx")
            setup_nginx
            ;;
        "apache")
            setup_apache
            ;;
        "cloudflare")
            setup_cloudflare
            ;;
        "docker")
            setup_docker
            ;;
        *)
            log_error "Unknown deployment type: $deployment_type"
            exit 1
            ;;
    esac
    
    # Install dependencies
    install_dependencies
    
    # Build application
    build_application
    
    # Start application if requested
    if [[ "$auto_start" == "true" ]]; then
        start_application "$deployment_type"
    fi
    
    log_success "Deployment completed successfully!"
    
    # Show next steps
    echo
    log_info "Next steps:"
    case $deployment_type in
        "direct")
            log_info "1. Start the application: npm run dev"
            log_info "2. Access at: http://$(get_local_ip):30437"
            ;;
        "nginx"|"apache")
            log_info "1. Configure your domain in the proxy configuration"
            log_info "2. Enable SSL with Let's Encrypt"
            log_info "3. Start the application: npm start"
            ;;
        "cloudflare")
            log_info "1. Configure your domain in Cloudflare"
            log_info "2. Start the application: npm start"
            ;;
        "docker")
            log_info "1. Edit docker-compose.yml with secure passwords"
            log_info "2. Start services: docker-compose up -d"
            ;;
    esac
}

# Show help
show_help() {
    echo "Starseed Node Deployment Script"
    echo
    echo "Usage: $0 [OPTIONS] [DEPLOYMENT_TYPE]"
    echo
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --start    Start application after deployment"
    echo
    echo "Deployment Types:"
    echo "  direct         Direct access (development)"
    echo "  nginx          Nginx reverse proxy (recommended)"
    echo "  apache         Apache reverse proxy"
    echo "  cloudflare     Cloudflare proxy"
    echo "  docker         Docker Compose (all-in-one)"
    echo
    echo "Examples:"
    echo "  $0                    # Interactive deployment"
    echo "  $0 direct             # Direct access deployment"
    echo "  $0 nginx --start      # Nginx deployment with auto-start"
    echo "  $0 docker             # Docker Compose deployment"
}

# Parse command line arguments
AUTO_START=false
DEPLOYMENT_TYPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--start)
            AUTO_START=true
            shift
            ;;
        -*)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
        *)
            if [[ -z "$DEPLOYMENT_TYPE" ]]; then
                DEPLOYMENT_TYPE="$1"
            else
                log_error "Multiple deployment types specified"
                exit 1
            fi
            shift
            ;;
    esac
done

# Run deployment
deploy "$DEPLOYMENT_TYPE" "$AUTO_START" 