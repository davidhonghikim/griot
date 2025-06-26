# Agent Rules - Griot Node Project

**Simple, focused rules for working on the griot-node foundation system**

## 🎯 **Core Principles**

1. **griot-node is the foundation** - NOT kai-cd (old prototype)
2. **Work in `agents/` directory** - NOT `md/agent/` or other wrong structures
3. **Build upon existing patterns** - Follow completed node specifications
4. **TypeScript strict mode** - No shortcuts, no `any` types
5. **User verification required** - Only user can mark work "complete"

## ⚠️ **Critical DON'Ts**

### **Project Confusion Prevention**
- ❌ **Don't apply kai-cd rules** - It's an old prototype, ignore its documentation standards
- ❌ **Don't create `md/` directories** - Use `agents/` for agent work
- ❌ **Don't reference kai-cd documentation system** - It doesn't apply here
- ❌ **Don't put files in root directory** - Everything goes in proper subdirectories

### **File Organization**
- ❌ **Don't create wrong directory structures** (`md/agent/`, `documentation/`, etc.)
- ❌ **Don't mix old prototype patterns** with new griot-node work
- ❌ **Don't copy frontmatter** from kai-cd docs (wrong project)

## ✅ **What TO Do**

### **Work Location & Organization**
- ✅ **Use `agents/` directory** for all agent coordination
- ✅ **Follow ai-q specifications** as the authority for node design
- ✅ **Study completed nodes** in `ai-q/03_node_specifications/`
- ✅ **Maintain execution plan** in `agents/Execution_Plan.md`

### **Development Workflow**
```bash
# 1. Bootstrap (5 minutes)
cat agents/00_PROJECT_OVERVIEW.md
cat agents/Next_Agent_Brief.md

# 2. Verify system works
npm run build

# 3. Check current status
ls -la ai-q/03_node_specifications/
wc -l ai-q/03_node_specifications/*.md

# 4. Follow established patterns
cat ai-q/03_node_specifications/01_Griot_Node_Spec.md | head -50
```

### **Quality Standards**
- ✅ **TypeScript strict**: No `any` types, full type safety
- ✅ **Complete specifications**: 700+ lines with full API documentation
- ✅ **Cultural sensitivity**: Respectful attribution with consultation language
- ✅ **Framework approach**: Generic tools, not specific applications

## 🔄 **The Two-Edit Rule**

After making 1-2 significant changes:
1. **STOP** and read your changes completely
2. **Trace the logic** - how could this break?
3. **Check for errors** - imports, types, references
4. **Fix issues immediately** - don't wait for build failures
5. **Update execution plan** with detailed findings

## 📋 **Required Documentation Updates**

When you complete work:
1. **Update** `agents/Execution_Plan.md` with detailed log
2. **Update** `agents/Next_Agent_Brief.md` with current status  
3. **Verify** builds pass: `npm run build`
4. **Present** to user for verification (never mark "complete" yourself)

## 🎯 **Project Context (MEMORIZE THIS)**

### **Timeline Reality**
1. **kai-cd (OLD)** - Obsolete prototype built BEFORE griot-node
2. **griot-node (CURRENT)** - Foundation system you're working on
3. **kai-cd (NEW)** - Future browser extension TO BE BUILT from griot-node

### **Directory Structure**
```
griot-node/               # You are here
├── ai-q/                 # Specifications (THE AUTHORITY)
├── src/                  # TypeScript implementation  
├── agents/               # Agent coordination (YOUR WORKSPACE)
├── archives/             # Old implementations for restoration
└── [other dirs]          # Development and deployment

kai-cd/                   # OLD PROTOTYPE - IGNORE ITS RULES
└── [don't work here]     # Reference only, wrong project
```

## 🚀 **Quick Success Pattern**

### **For Documentation Work**
1. Read completed node spec as example
2. Follow the same structure and quality level
3. Research cultural context respectfully
4. Include community consultation language
5. Aim for 700+ lines with complete APIs

### **For Implementation Work**
1. Study existing TypeScript patterns in `src/`
2. Follow KLF message protocols
3. Maintain strict type checking
4. Test with working examples
5. Document progress in execution plan

## 🎯 **Success Metrics**

You're successful when:
- ✅ You work in correct directories (`agents/`, `ai-q/`, `src/`)
- ✅ You ignore kai-cd old prototype patterns
- ✅ You follow established griot-node patterns
- ✅ Your code builds without errors (`npm run build`)
- ✅ User verifies your work meets their needs

---

**Remember**: griot-node is the foundation for the entire kOS ecosystem. Your work here enables everything else to be built properly. 