---
title: "Archiving Scripts"
version: "1.0"
status: "Active"
created: "2025-06-29"
updated: "2025-06-29"
---

# **Archiving Scripts**

This directory contains scripts for managing archives across the kOS project, including agent system archives and project-wide archives.

## **Scripts Overview**

### **archive_monthly.sh**
**Purpose**: Monthly archiving for agent systems  
**Target Systems**: 
- `agents/analysis/`
- `agents/bootstrap/`
- `agents/implementation-plans/`
- `agents/performance/`

**Features**:
- Archives files from previous months only
- Maintains current month files in root directory
- Creates proper year/month directory structure
- Handles both `.md` and `.json` files
- Can archive all systems or target specific systems

**Usage**:
```bash
# Archive all agent systems
./scripts/archiving/archive_monthly.sh

# Archive specific system
./scripts/archiving/archive_monthly.sh agents/analysis
./scripts/archiving/archive_monthly.sh agents/bootstrap
./scripts/archiving/archive_monthly.sh agents/implementation-plans
./scripts/archiving/archive_monthly.sh agents/performance
```

### **archive.sh**
**Purpose**: Project-wide archive creation  
**Features**:
- Creates compressed tar.gz archives of the entire project
- Excludes development files (.git, node_modules, etc.)
- Maintains an index of all archives
- Accepts notes/description for each archive

**Usage**:
```bash
./scripts/archiving/archive.sh "Archive notes describing the current state"
```

## **Archive Policy**

### **Agent System Archives**
- **Location**: Per-system archive directories (e.g., `agents/analysis/archive/`)
- **Structure**: `archive/[YYYY]/[MM]/`
- **Naming**: `[YYYY-MM-DD]_[description].md`
- **Trigger**: Monthly or manual execution

### **Project Archives**
- **Location**: `archives/` directory
- **Format**: Compressed tar.gz files
- **Naming**: `archive-[YYYY-MM-DD_HH-MM-SS].tar.gz`
- **Index**: `archives/INDEX.md`

## **Integration with Agent Workflow**

### **Monthly Archiving Process**
1. **Run Archive Script**: Execute `archive_monthly.sh` for all systems
2. **Update Indexes**: Maintain references in system index files
3. **Verify Structure**: Ensure proper year/month organization
4. **Log Activity**: Document archiving in agent changelog

### **Quality Assurance**
- **Before Archiving**: Verify all files follow naming conventions
- **After Archiving**: Check that current month files remain accessible
- **Cross-References**: Update any system indexes or documentation
- **Backup**: Ensure archives are properly backed up

## **File Naming Conventions**

### **Agent System Files**
- Format: `[YYYY-MM-DD]_[system_name]_[description].md`
- Examples:
  - `[TIMESTAMP]_comprehensive_project_analysis.md`
  - `[TIMESTAMP]_agent_workflow.md`
  - `[TIMESTAMP]_performance_metrics.json`

### **Archive Files**
- Format: `archive-[YYYY-MM-DD_HH-MM-SS].tar.gz`
- Examples:
  - `archive-[TIMESTAMP]_14-30-00.tar.gz`

## **Maintenance**

### **Regular Tasks**
- **Monthly**: Run `archive_monthly.sh` for all agent systems
- **Quarterly**: Review archive structure and cleanup old archives
- **Annually**: Verify archive integrity and update documentation

### **Troubleshooting**
- **Missing Files**: Check if files were moved to archive directories
- **Naming Issues**: Ensure files follow `YYYY-MM-DD_` pattern
- **Permission Errors**: Verify script has execute permissions
- **Path Issues**: Ensure script is run from project root

## **Future Enhancements**

### **Planned Features**
- Automated monthly archiving via cron jobs
- Archive compression and deduplication
- Integration with external backup systems
- Archive search and retrieval tools
- Archive validation and integrity checks

---

**Last Updated**: 2025-06-29
**Next Review**: 2025-07-01 