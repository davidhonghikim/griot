# Starseed Node

A modern, production-ready AI orchestration platform built on the kOS framework.

## Overview

Starseed Node is a complete standalone application that provides AI service orchestration, database management, and API endpoints. It's designed to be deployed in various environments from development to production.

## Features

- **Modern Architecture**: Built on the kOS core framework with TypeScript
- **Database Integration**: MongoDB, PostgreSQL, Weaviate, and Neo4j support
- **Service Orchestration**: Dynamic service discovery and management
- **Flexible Deployment**: Multiple deployment options for different use cases
- **Production Ready**: SSL/TLS, security headers, monitoring, and logging

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Docker and Docker Compose for containerized deployment

### Development Setup

1. **Clone and setup environment**:
   ```bash
   cd apps/starseed-node
   ./setup-env.sh
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Main app: http://localhost:30437
   - Health check: http://localhost:30437/health
   - API docs: http://localhost:30437/api/docs

## Deployment Options

Starseed Node supports multiple deployment configurations to suit different needs:

### 1. Direct Access (Development/Testing)
**Best for**: Development, testing, internal tools
- Simple setup, no additional dependencies
- No SSL, limited security
- Perfect for local development and testing

```bash
# Quick setup
./scripts/deploy.sh direct

# Or manually
cp env.example .env
# Edit BASE_IP in .env
npm run dev
```

### 2. Nginx Reverse Proxy (Recommended Production)
**Best for**: Production, high traffic, SSL termination
- SSL support, load balancing, security headers
- Requires nginx configuration
- Most popular production setup

```bash
# Automated setup
./scripts/deploy.sh nginx

# Manual setup
sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/starseed-node
# Edit domain name in config
sudo ln -s /etc/nginx/sites-available/starseed-node /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Apache Reverse Proxy
**Best for**: Existing Apache infrastructure
- SSL support, security headers
- More complex configuration than nginx
- Good for existing Apache environments

```bash
# Automated setup
./scripts/deploy.sh apache

# Manual setup
sudo cp deployment/apache.conf.example /etc/apache2/sites-available/starseed-node.conf
# Edit domain name in config
sudo a2enmod proxy proxy_http ssl
sudo a2ensite starseed-node
sudo systemctl restart apache2
```

### 4. Cloudflare Proxy
**Best for**: CDN, DDoS protection, global distribution
- Built-in security, global CDN, SSL
- Requires Cloudflare account
- Excellent for global applications

```bash
# Setup
./scripts/deploy.sh cloudflare

# Then configure in Cloudflare dashboard:
# 1. Add your domain
# 2. Point to your server IP
# 3. Enable proxy (orange cloud)
```

### 5. Docker Compose (All-in-One)
**Best for**: Containerized deployment, easy scaling
- Complete stack, easy deployment, isolated environment
- Resource overhead, Docker dependency
- Perfect for containerized environments

```bash
# Automated setup
./scripts/deploy.sh docker

# Manual setup
cp deployment/docker-compose.production.yml docker-compose.yml
# Edit passwords in docker-compose.yml
docker-compose up -d
```

## Environment Configuration

### Base Configuration
The application uses a flexible environment configuration system:

1. **Base Config** (`env.example`): Template with all options
2. **User Overrides** (`.env.local`): Local development overrides
3. **Environment Overrides** (`.env.override`): Specific environment overrides
4. **Production Config** (`.env.production`): Production settings

### Key Configuration Options

```bash
# Deployment Type
DEPLOYMENT_TYPE=direct|nginx|apache|cloudflare|docker

# Base IP for local services
BASE_IP=192.168.1.100

# Server Configuration
PORT=30437
HOST=0.0.0.0

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
POSTGRES_DB=starseed
WEAVIATE_URL=http://localhost:8080
NEO4J_URI=bolt://localhost:7687

# SSL/TLS (for production)
SSL_ENABLED=false
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Automatic Configuration
The setup script automatically:
- Detects your local IP address
- Creates appropriate environment files
- Configures deployment-specific settings

## Database Setup

### Development (Docker)
```bash
# Start all databases
docker-compose up -d

# Or start individual services
docker-compose up -d mongodb postgresql weaviate neo4j
```

### Production
```bash
# Using Docker Compose
docker-compose -f deployment/docker-compose.production.yml up -d

# Or manual installation
# Follow database-specific installation guides
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Service Management
```bash
GET /api/services          # List all services
GET /api/services/:id      # Get service details
POST /api/services         # Register new service
DELETE /api/services/:id   # Remove service
```

### Database Operations
```bash
GET /api/db/status         # Database status
POST /api/db/backup        # Create backup
GET /api/db/backup/:id     # Download backup
```

## Monitoring and Logging

### Application Logs
```bash
# View logs
tail -f logs/starseed-node.log

# Log levels: debug, info, warn, error
LOG_LEVEL=info
```

### Health Monitoring
```bash
# Check application health
curl http://localhost:30437/health

# Check database connections
curl http://localhost:30437/api/db/status
```

### System Monitoring
```bash
# Resource usage
htop
df -h
free -h

# Process monitoring
ps aux | grep node
```

## Security

### Production Security Checklist
- [ ] Enable SSL/TLS with Let's Encrypt
- [ ] Configure firewall rules
- [ ] Use strong database passwords
- [ ] Enable authentication for databases
- [ ] Set up log rotation
- [ ] Configure security headers
- [ ] Use reverse proxy (nginx/apache)
- [ ] Regular security updates

### SSL/TLS Setup
```bash
# Let's Encrypt (recommended)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# Manual SSL
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /path/to/key.pem \
  -out /path/to/cert.pem
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
npm run dev

# Check port availability
netstat -tulpn | grep 30437

# Check environment variables
echo $NODE_ENV
```

#### Database Connection Issues
```bash
# Test MongoDB
mongo mongodb://localhost:27017

# Test PostgreSQL
psql -h localhost -U postgres -d starseed

# Test Weaviate
curl http://localhost:8080/v1/.well-known/ready
```

#### Nginx Issues
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Performance Tuning

#### Application
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name starseed-node
```

#### Database
```bash
# MongoDB optimization
# - Enable WiredTiger compression
# - Configure appropriate cache size
# - Use indexes for queries

# PostgreSQL optimization
# - Adjust shared_buffers
# - Configure work_mem
# - Use connection pooling
```

## Development

### Project Structure
```
apps/starseed-node/
├── src/                    # Source code
│   ├── server.ts          # Main server entry point
│   ├── service-manager.ts # Service orchestration
│   └── database-manager.ts # Database management
├── deployment/            # Deployment configurations
│   ├── nginx.conf.example
│   ├── apache.conf.example
│   └── docker-compose.production.yml
├── scripts/              # Utility scripts
│   ├── deploy.sh         # Deployment automation
│   └── setup-env.sh      # Environment setup
├── env.example           # Environment template
└── README.md            # This file
```

### Building
```bash
# Development build
npm run build

# Production build
NODE_ENV=production npm run build
```

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the kOS framework and follows the same licensing terms.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the deployment guide
3. Check the logs for error messages
4. Open an issue on GitHub 