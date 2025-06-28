## **Archive Policy**

> **Note:** All archives are stored in their respective system directories (e.g., `agents/performance/archive/`). The centralized `agents/archive/` directory is not used for system archives. Do not place performance archives in `agents/archive/`.

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