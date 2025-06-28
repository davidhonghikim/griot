README.md
archive.sh
kos-log.js
migrate_personas.py
performance
temp
validate_frontmatter.py

# Project Scripts Index

## **Script Categories**

### **Archiving System** (`archiving/`)
- **archive_monthly.sh**: Monthly archiving for agent systems (analysis, bootstrap, plans, performance)
- **archive.sh**: Project-wide archive creation with compression and indexing
- **README.md**: Complete documentation for the archiving system

### **Agent Management** (`agents/`)
- Agent-specific scripts and utilities
- Performance tracking and analysis tools

### **Documentation** (`documentation/`)
- Documentation generation and validation scripts
- Frontmatter validation and formatting tools

### **Performance** (`performance/`)
- Performance monitoring and analysis scripts
- Metrics collection and reporting tools

### **Personas** (`personas/`)
- Persona management and migration scripts
- Persona validation and processing tools

## **Key Scripts**

### **archive_monthly.sh**
```bash
# Archive all agent systems
./scripts/archiving/archive_monthly.sh

# Archive specific system
./scripts/archiving/archive_monthly.sh agents/analysis
```

### **archive.sh**
```bash
# Create project archive with notes
./scripts/archiving/archive.sh "Archive notes describing the current state"
```

### **kos-log.js**
```bash
# Add changelog entry
node scripts/kos-log.js <EVENT_TYPE> "<message>" "<optional mission>"
```

### **migrate_personas.py**
```bash
# Migrate persona files to new structure
python3 scripts/migrate_personas.py
```

### **validate_frontmatter.py**
```bash
# Validate YAML frontmatter in agent docs
python3 scripts/validate_frontmatter.py
```

## **Usage Guidelines**

### **Archiving**
- **Monthly**: Run `archive_monthly.sh` to archive all agent systems
- **Project**: Use `archive.sh` for major milestones or releases
- **Documentation**: All archiving activities should be logged in agent changelog

### **Agent Workflow**
- **Changelog**: Use `kos-log.js` for consistent changelog entries
- **Validation**: Run `validate_frontmatter.py` before committing agent docs
- **Performance**: Use performance scripts for metrics collection

### **Quality Assurance**
- **Before Committing**: Validate all documentation and scripts
- **After Archiving**: Verify archive structure and update indexes
- **Cross-References**: Maintain links between systems and archives

## **Directory Structure**

```
scripts/
├── archiving/           # Archive management scripts
│   ├── archive_monthly.sh
│   ├── archive.sh
│   └── README.md
├── agents/              # Agent management scripts
├── documentation/       # Documentation tools
├── performance/         # Performance scripts
├── personas/            # Persona management
├── temp/                # Temporary scripts
└── README.md           # This file
```

---

**Last Updated**: 2025-06-29
