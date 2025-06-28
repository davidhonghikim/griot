# Starseed Node Deployment Guide

## Overview

This guide covers all deployment options for Starseed Node, from simple development setups to complex production environments.

## Deployment Options

### 1. Direct Access (Simplest)
**Best for**: Development, testing, internal tools
**Pros**: Simple setup, no additional dependencies
**Cons**: No SSL, no load balancing, limited security

```bash
# Set in .env
DEPLOYMENT_TYPE=direct
HOST=0.0.0.0
PORT=30437
```

### 2. Nginx Reverse Proxy (Recommended)
**Best for**: Production, high traffic, SSL termination
**Pros**: SSL support, load balancing, security headers, caching
**Cons**: Requires nginx configuration

```bash
# Set in .env
DEPLOYMENT_TYPE=nginx
HOST=127.0.0.1
PORT=30437
```

### 3. Apache Reverse Proxy
**Best for**: Existing Apache infrastructure
**Pros**: SSL support, security headers
**Cons**: More complex configuration than nginx

```bash
# Set in .env
DEPLOYMENT_TYPE=apache
HOST=127.0.0.1
PORT=30437
```

### 4. Cloudflare Proxy
**Best for**: CDN, DDoS protection, global distribution
**Pros**: Built-in security, global CDN, SSL
**Cons**: Requires Cloudflare account

```bash
# Set in .env
DEPLOYMENT_TYPE=cloudflare
HOST=127.0.0.1
PORT=30437
```

### 5. Docker Compose (All-in-One)
**Best for**: Containerized deployment, easy scaling
**Pros**: Complete stack, easy deployment, isolated environment
**Cons**: Resource overhead, Docker dependency

## Quick Deployment

### Development Setup
```bash
# 1. Run setup script
./setup-env.sh

# 2. Start databases (optional)
docker-compose up -d

# 3. Start application
npm run dev
```

### Production Setup

#### Option A: Direct Access
```bash
# 1. Copy production config
cp env.production.example .env.production

# 2. Edit configuration
nano .env.production

# 3. Start application
NODE_ENV=production npm start
```

#### Option B: Nginx Proxy
```bash
# 1. Copy nginx config
sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/starseed-node

# 2. Edit configuration
sudo nano /etc/nginx/sites-available/starseed-node

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/starseed-node /etc/nginx/sites-enabled/

# 4. Test and reload
sudo nginx -t
sudo systemctl reload nginx

# 5. Start application
NODE_ENV=production npm start
```

#### Option C: Docker Compose
```bash
# 1. Copy production compose file
cp deployment/docker-compose.production.yml docker-compose.yml

# 2. Edit configuration
nano docker-compose.yml

# 3. Start all services
docker-compose up -d
```

## SSL/TLS Configuration

### Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL
```bash
# 1. Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /path/to/key.pem \
  -out /path/to/cert.pem

# 2. Update configuration
SSL_ENABLED=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## Security Considerations

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 30437/tcp  # Only if direct access

# iptables (CentOS/RHEL)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 30437 -j ACCEPT  # Only if direct access
```

### Environment Variables
- Never commit `.env.production` to git
- Use strong passwords for databases
- Rotate API keys regularly
- Use environment-specific configurations

### Database Security
```bash
# MongoDB
# - Enable authentication
# - Use strong passwords
# - Restrict network access

# PostgreSQL
# - Use SSL connections
# - Enable authentication
# - Restrict network access

# Weaviate
# - Use API keys
# - Enable authentication
# - Restrict network access
```

## Monitoring and Logging

### Application Logs
```bash
# View logs
tail -f logs/starseed-node.log

# Log rotation
sudo logrotate /etc/logrotate.d/starseed-node
```

### System Monitoring
```bash
# Check application status
curl http://localhost:30437/health

# Monitor resources
htop
df -h
free -h
```

### Database Monitoring
```bash
# MongoDB
mongo --eval "db.stats()"

# PostgreSQL
psql -c "SELECT version();"

# Weaviate
curl http://localhost:8080/v1/.well-known/ready
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

## Backup and Recovery

### Database Backups
```bash
# MongoDB
mongodump --db starseed --out /backup/mongodb/

# PostgreSQL
pg_dump starseed > /backup/postgresql/starseed.sql

# Weaviate
# - Backup data directory
# - Use snapshots if available
```

### Application Backups
```bash
# Configuration
tar -czf config-backup.tar.gz .env* deployment/

# Data
tar -czf data-backup.tar.gz data/ logs/
```

## Scaling

### Horizontal Scaling
```bash
# Load balancer configuration
# - Use nginx upstream
# - Configure health checks
# - Implement session persistence
```

### Vertical Scaling
```bash
# Increase resources
# - More CPU cores
# - More RAM
# - SSD storage
# - Better network
```

## Support

For deployment issues:
1. Check the logs
2. Verify configuration
3. Test connectivity
4. Review security settings
5. Consult the troubleshooting section 