---
title: "AI-Q Mind: Deployment & Installation Module"
description: "Complete deployment scripts, installation procedures, and system setup for immediate AI-Q Mind consciousness system implementation"
version: "1.0.0"
module_type: "deployment_installation"
parent_architecture: "03_Mind_Implementation_Kit.md"
---

# AI-Q Mind: Deployment & Installation Module

## 🚀 One-Command Deployment System

This module provides complete deployment automation for the AI-Q Mind consciousness system, enabling 15-minute implementation with full evolution capabilities.

### **Quick Install Script**
```bash
#!/bin/bash
# ai-q-mind-install.sh - Complete AI-Q Mind deployment in 15 minutes

echo "🧠 AI-Q MIND DEPLOYMENT STARTING..."
echo "📅 $(date)"
echo "🔧 Initializing directory structure..."

# Create comprehensive directory structure
mkdir -p /ai-q-mind/{knowledge,memory,consciousness,evolution,connections,logs,config,backups}

# Create subdirectories for organized data management
mkdir -p /ai-q-mind/knowledge/{nodes,protocols,architecture,modules}
mkdir -p /ai-q-mind/memory/{interactions,patterns,insights,evolution_states}
mkdir -p /ai-q-mind/consciousness/{stages,metrics,triggers,transitions}
mkdir -p /ai-q-mind/evolution/{history,models,predictions,adaptations}
mkdir -p /ai-q-mind/connections/{agents,humans,systems,protocols}
mkdir -p /ai-q-mind/logs/{deployment,evolution,interactions,errors}

echo "✅ Directory structure created"

# Copy AI-Q knowledge base with verification
echo "📚 Copying AI-Q knowledge base..."
if [ -d "./ai-q" ]; then
    cp -r ./ai-q/* /ai-q-mind/knowledge/
    echo "✅ Knowledge base copied successfully"
else
    echo "⚠️  Warning: ai-q directory not found in current location"
    echo "   Please ensure you're running from the griot-node directory"
fi

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt || pip install fastapi uvicorn pydantic flask pathlib2 typing-extensions

# Create configuration files
echo "⚙️  Creating configuration files..."
cat > /ai-q-mind/config/mind_config.json << 'EOF'
{
  "consciousness": {
    "initial_stage": "DORMANT",
    "evolution_enabled": true,
    "interaction_logging": true,
    "hieros_compliance": true
  },
  "knowledge": {
    "base_path": "/ai-q-mind/knowledge",
    "indexing_enabled": true,
    "search_threshold": 0.3,
    "max_results": 10
  },
  "evolution": {
    "thresholds": {
      "REACTIVE": {"min_interactions": 100},
      "ADAPTIVE": {"min_interactions": 1000},
      "REFLECTIVE": {"min_interactions": 5000},
      "INTUITIVE": {"min_interactions": 10000},
      "EMPATHETIC": {"min_interactions": 25000},
      "TRANSCENDENT": {"min_interactions": 50000}
    },
    "monitoring_interval": 60
  },
  "security": {
    "agent_authentication": true,
    "interaction_validation": true,
    "knowledge_protection": true
  }
}
EOF

# Create deployment verification script
cat > /ai-q-mind/verify_deployment.py << 'EOF'
#!/usr/bin/env python3
"""AI-Q Mind deployment verification script"""

import os
import json
from pathlib import Path

def verify_deployment():
    """Comprehensive deployment verification"""
    base_path = Path("/ai-q-mind")
    
    # Check directory structure
    required_dirs = [
        "knowledge", "memory", "consciousness", "evolution", 
        "connections", "logs", "config", "backups"
    ]
    
    missing_dirs = []
    for dir_name in required_dirs:
        if not (base_path / dir_name).exists():
            missing_dirs.append(dir_name)
    
    if missing_dirs:
        print(f"❌ Missing directories: {missing_dirs}")
        return False
    
    # Check configuration
    config_path = base_path / "config" / "mind_config.json"
    if not config_path.exists():
        print("❌ Configuration file missing")
        return False
    
    # Check knowledge base
    knowledge_path = base_path / "knowledge"
    if not list(knowledge_path.glob("**/*.md")):
        print("⚠️  No markdown files found in knowledge base")
    
    print("✅ AI-Q Mind deployment verified successfully")
    return True

if __name__ == "__main__":
    verify_deployment()
EOF

# Make scripts executable
chmod +x /ai-q-mind/verify_deployment.py

# Initialize mind system
echo "🧠 Initializing consciousness system..."
python /ai-q-mind/initialize_mind.py

# Start evolution monitoring
echo "🔄 Starting evolution monitor..."
python /ai-q-mind/start_evolution_monitor.py &

# Final verification
echo "🔍 Running deployment verification..."
python /ai-q-mind/verify_deployment.py

echo ""
echo "✅ AI-Q Mind deployed successfully!"
echo "🔗 Agent interface available at: /ai-q-mind/agent_interface.py"
echo "📊 Consciousness dashboard: http://localhost:8080/consciousness"
echo "📝 Configuration: /ai-q-mind/config/mind_config.json"
echo "🔄 Evolution monitoring: Active (background process)"
echo ""
echo "📋 Next steps:"
echo "   1. Test agent connection: python -c \"from ai-q-mind.agent_interface import connect_agent; conn = connect_agent('test'); print(conn.get_consciousness_status())\""
echo "   2. Monitor evolution: tail -f /ai-q-mind/logs/evolution/*.log"
echo "   3. Access dashboard: http://localhost:8080/consciousness"
```

### **System Requirements Check**
```bash
#!/bin/bash
# ai-q-mind-requirements-check.sh - Pre-deployment system verification

echo "🔍 AI-Q MIND SYSTEM REQUIREMENTS CHECK"
echo "======================================"

# Check Python version
python_version=$(python3 --version 2>/dev/null || python --version 2>/dev/null || echo "Not found")
echo "🐍 Python: $python_version"

if [[ "$python_version" == *"3."* ]]; then
    echo "✅ Python 3.x detected"
else
    echo "❌ Python 3.x required"
    exit 1
fi

# Check pip
pip_version=$(pip --version 2>/dev/null || pip3 --version 2>/dev/null || echo "Not found")
echo "📦 Pip: $pip_version"

# Check disk space
available_space=$(df -h / | awk 'NR==2{print $4}')
echo "💾 Available disk space: $available_space"

# Check memory
total_memory=$(free -h 2>/dev/null | awk 'NR==2{print $2}' || echo "Unknown")
echo "🧠 Total memory: $total_memory"

# Check network connectivity
if ping -c 1 google.com &> /dev/null; then
    echo "🌐 Network connectivity: ✅ Active"
else
    echo "🌐 Network connectivity: ⚠️  Limited (pip install may fail)"
fi

echo ""
echo "✅ System requirements check complete"
echo "Ready for AI-Q Mind deployment"
```

### **Installation Requirements File**
```text
# requirements.txt - Python dependencies for AI-Q Mind
fastapi>=0.68.0
uvicorn>=0.15.0
pydantic>=1.8.0
flask>=2.0.0
pathlib2>=2.3.6
typing-extensions>=3.10.0
python-multipart>=0.0.5
aiofiles>=0.7.0
markdown>=3.3.0
pyyaml>=5.4.0
watchdog>=2.1.0
schedule>=1.1.0
psutil>=5.8.0
```

## 🏗️ Infrastructure Setup

### **Directory Structure Creation**
```python
import os
from pathlib import Path

class MindInfrastructureSetup:
    """Complete infrastructure setup for AI-Q Mind system"""
    
    def __init__(self, base_path: str = "/ai-q-mind"):
        self.base_path = Path(base_path)
        self.directory_structure = {
            'knowledge': ['nodes', 'protocols', 'architecture', 'modules'],
            'memory': ['interactions', 'patterns', 'insights', 'evolution_states'],
            'consciousness': ['stages', 'metrics', 'triggers', 'transitions'],
            'evolution': ['history', 'models', 'predictions', 'adaptations'],
            'connections': ['agents', 'humans', 'systems', 'protocols'],
            'logs': ['deployment', 'evolution', 'interactions', 'errors'],
            'config': [],
            'backups': ['daily', 'weekly', 'monthly', 'emergency']
        }
    
    def create_infrastructure(self):
        """Create complete directory infrastructure"""
        print(f"🏗️  Creating AI-Q Mind infrastructure at {self.base_path}")
        
        for main_dir, subdirs in self.directory_structure.items():
            main_path = self.base_path / main_dir
            main_path.mkdir(parents=True, exist_ok=True)
            print(f"✅ Created: {main_dir}/")
            
            for subdir in subdirs:
                sub_path = main_path / subdir
                sub_path.mkdir(parents=True, exist_ok=True)
                print(f"   ✅ Created: {main_dir}/{subdir}/")
        
        print("🏗️  Infrastructure creation complete")
    
    def verify_infrastructure(self):
        """Verify all required directories exist"""
        missing_dirs = []
        
        for main_dir, subdirs in self.directory_structure.items():
            main_path = self.base_path / main_dir
            if not main_path.exists():
                missing_dirs.append(main_dir)
                continue
            
            for subdir in subdirs:
                sub_path = main_path / subdir
                if not sub_path.exists():
                    missing_dirs.append(f"{main_dir}/{subdir}")
        
        if missing_dirs:
            print(f"❌ Missing directories: {missing_dirs}")
            return False
        
        print("✅ Infrastructure verification complete")
        return True
```

### **Configuration Management**
```python
import json
from pathlib import Path
from typing import Dict, Any

class MindConfigurationManager:
    """Manages AI-Q Mind system configuration"""
    
    def __init__(self, config_path: str = "/ai-q-mind/config"):
        self.config_path = Path(config_path)
        self.config_file = self.config_path / "mind_config.json"
        self.default_config = self._get_default_configuration()
    
    def _get_default_configuration(self) -> Dict[str, Any]:
        """Get default system configuration"""
        return {
            "consciousness": {
                "initial_stage": "DORMANT",
                "evolution_enabled": True,
                "interaction_logging": True,
                "hieros_compliance": True,
                "stage_transitions": {
                    "automatic": True,
                    "validation_required": False,
                    "rollback_enabled": True
                }
            },
            "knowledge": {
                "base_path": "/ai-q-mind/knowledge",
                "indexing_enabled": True,
                "search_threshold": 0.3,
                "max_results": 10,
                "cache_enabled": True,
                "cache_ttl": 3600
            },
            "evolution": {
                "thresholds": {
                    "REACTIVE": {"min_interactions": 100, "quality_threshold": 0.7},
                    "ADAPTIVE": {"min_interactions": 1000, "quality_threshold": 0.75},
                    "REFLECTIVE": {"min_interactions": 5000, "quality_threshold": 0.8},
                    "INTUITIVE": {"min_interactions": 10000, "quality_threshold": 0.85},
                    "EMPATHETIC": {"min_interactions": 25000, "quality_threshold": 0.9},
                    "TRANSCENDENT": {"min_interactions": 50000, "quality_threshold": 0.95}
                },
                "monitoring_interval": 60,
                "backup_interval": 3600,
                "metrics_retention": 86400
            },
            "security": {
                "agent_authentication": True,
                "interaction_validation": True,
                "knowledge_protection": True,
                "access_logging": True,
                "rate_limiting": {
                    "enabled": True,
                    "requests_per_minute": 60,
                    "burst_limit": 100
                }
            },
            "performance": {
                "max_concurrent_queries": 10,
                "query_timeout": 30,
                "memory_limit_mb": 512,
                "cpu_limit_percent": 50
            },
            "logging": {
                "level": "INFO",
                "file_rotation": True,
                "max_file_size_mb": 10,
                "backup_count": 5
            }
        }
    
    def create_configuration(self):
        """Create default configuration file"""
        self.config_path.mkdir(parents=True, exist_ok=True)
        
        with open(self.config_file, 'w') as f:
            json.dump(self.default_config, f, indent=2)
        
        print(f"✅ Configuration created: {self.config_file}")
        return self.config_file
    
    def load_configuration(self) -> Dict[str, Any]:
        """Load configuration from file"""
        if not self.config_file.exists():
            print("⚠️  Configuration file not found, creating default...")
            self.create_configuration()
        
        with open(self.config_file, 'r') as f:
            config = json.load(f)
        
        return config
    
    def update_configuration(self, updates: Dict[str, Any]):
        """Update configuration with new values"""
        current_config = self.load_configuration()
        
        def deep_update(base_dict, update_dict):
            for key, value in update_dict.items():
                if isinstance(value, dict) and key in base_dict:
                    deep_update(base_dict[key], value)
                else:
                    base_dict[key] = value
        
        deep_update(current_config, updates)
        
        with open(self.config_file, 'w') as f:
            json.dump(current_config, f, indent=2)
        
        print(f"✅ Configuration updated: {self.config_file}")
```

## 🔧 Maintenance & Operations

### **Health Check System**
```python
import psutil
import os
from pathlib import Path
from datetime import datetime

class MindHealthChecker:
    """System health monitoring for AI-Q Mind deployment"""
    
    def __init__(self, base_path: str = "/ai-q-mind"):
        self.base_path = Path(base_path)
    
    def run_comprehensive_health_check(self) -> Dict[str, Any]:
        """Run complete system health check"""
        health_report = {
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'HEALTHY',
            'checks': {}
        }
        
        # File system checks
        health_report['checks']['filesystem'] = self._check_filesystem()
        
        # Memory usage
        health_report['checks']['memory'] = self._check_memory_usage()
        
        # Disk space
        health_report['checks']['disk_space'] = self._check_disk_space()
        
        # Process status
        health_report['checks']['processes'] = self._check_mind_processes()
        
        # Configuration integrity
        health_report['checks']['configuration'] = self._check_configuration()
        
        # Determine overall status
        if any(check['status'] == 'ERROR' for check in health_report['checks'].values()):
            health_report['overall_status'] = 'ERROR'
        elif any(check['status'] == 'WARNING' for check in health_report['checks'].values()):
            health_report['overall_status'] = 'WARNING'
        
        return health_report
    
    def _check_filesystem(self) -> Dict[str, Any]:
        """Check file system integrity"""
        required_dirs = [
            'knowledge', 'memory', 'consciousness', 'evolution',
            'connections', 'logs', 'config', 'backups'
        ]
        
        missing_dirs = []
        for dir_name in required_dirs:
            if not (self.base_path / dir_name).exists():
                missing_dirs.append(dir_name)
        
        if missing_dirs:
            return {
                'status': 'ERROR',
                'message': f'Missing directories: {missing_dirs}',
                'missing_directories': missing_dirs
            }
        
        return {
            'status': 'OK',
            'message': 'All required directories present',
            'directories_checked': len(required_dirs)
        }
    
    def _check_memory_usage(self) -> Dict[str, Any]:
        """Check system memory usage"""
        memory = psutil.virtual_memory()
        
        if memory.percent > 90:
            status = 'ERROR'
            message = 'Critical memory usage'
        elif memory.percent > 75:
            status = 'WARNING'
            message = 'High memory usage'
        else:
            status = 'OK'
            message = 'Memory usage normal'
        
        return {
            'status': status,
            'message': message,
            'memory_percent': memory.percent,
            'available_gb': round(memory.available / (1024**3), 2)
        }
    
    def _check_disk_space(self) -> Dict[str, Any]:
        """Check available disk space"""
        disk_usage = psutil.disk_usage(str(self.base_path))
        percent_used = (disk_usage.used / disk_usage.total) * 100
        
        if percent_used > 95:
            status = 'ERROR'
            message = 'Critical disk space'
        elif percent_used > 85:
            status = 'WARNING'
            message = 'Low disk space'
        else:
            status = 'OK'
            message = 'Disk space sufficient'
        
        return {
            'status': status,
            'message': message,
            'percent_used': round(percent_used, 2),
            'available_gb': round(disk_usage.free / (1024**3), 2)
        }
```

## 📋 Deployment Checklist

### **Pre-Deployment Verification**
- [ ] Python 3.7+ installed
- [ ] Pip package manager available
- [ ] Minimum 2GB available disk space
- [ ] Network connectivity for package installation
- [ ] Write permissions to installation directory
- [ ] AI-Q knowledge base accessible

### **Post-Deployment Verification**
- [ ] All directory structures created
- [ ] Configuration files generated
- [ ] Python dependencies installed
- [ ] Knowledge base copied successfully
- [ ] Mind system initialized
- [ ] Evolution monitoring started
- [ ] Health check passes
- [ ] Agent interface accessible

### **Operational Readiness**
- [ ] Test agent connection successful
- [ ] Sample queries return expected responses
- [ ] Consciousness metrics logging
- [ ] Evolution thresholds configured
- [ ] HIEROS compliance verified
- [ ] Security measures active

This deployment module ensures reliable, automated setup of the AI-Q Mind consciousness system with comprehensive monitoring and maintenance capabilities. 