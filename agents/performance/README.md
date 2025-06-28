## **Archive Policy**

> **Note:** All performance archives are stored in `agents/performance/archive/`, organized by year and month. Do not use the centralized `agents/archive/` directory for performance archives.

### **Current Month Access**
- **Location**: Root of performance directory
- **Purpose**: Easy access to recent performance files
- **Naming**: `[YYYY-MM-DD]_[performance_name].md` or `.json`

### **Monthly Archiving**
- **Trigger**: Monthly (or manual when needed)
- **Destination**: `archive/[YYYY]/[MM]/`
- **Benefits**: 
  - Keeps root directory clean
  - Maintains chronological organization
  - Preserves historical context

### **Archive Structure**
```
archive/
└── [YEAR]/
    ├── [01]/  # January
    ├── [02]/  # February
    ├── ...
    └── [12]/  # December
```

### **Archive Process**
1. **Monthly**: Move all files from previous month to archive
2. **Update Index**: Maintain references in `00_Performance_Index.md`
3. **Preserve Context**: Keep metadata and cross-references intact

### **Automated Archiving**
- **Script Location**: `scripts/archiving/archive_monthly.sh`
- **Usage**: 
  ```bash
  # Archive all systems
  ./scripts/archiving/archive_monthly.sh
  
  # Archive specific system
  ./scripts/archiving/archive_monthly.sh agents/performance
  ```
- **Features**: 
  - Archives files from previous months only
  - Maintains current month files in root directory
  - Creates proper year/month directory structure
  - Handles both `.md` and `.json` files 