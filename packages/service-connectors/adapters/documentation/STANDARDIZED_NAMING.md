---
title: "Standardized Naming System"
version: "1.0"
status: "Active"
created: "2025-06-29"
updated: "2025-06-29"
---

# **Standardized Naming System**

**Status**: ACTIVE - MANDATORY FOR ALL NEW CODE

This document defines the standardized naming conventions for the kOS project to ensure consistency, clarity, and maintainability across all modules.

## **Directory Structure Standards**

### **Core Pattern**
```
packages/[package-name]/adapters/[domain]/
├── core/                    # Core utilities, types, and infrastructure
│   ├── types.ts            # TypeScript type definitions
│   ├── index.ts            # Main module exports
│   ├── [utility].ts        # Utility functions
│   └── [registry].ts       # Registry and configuration
└── adapters/               # Modular adapter implementations
    ├── index.ts            # Main adapter exports (NOT __init__.ts)
    ├── [feature]-adapter.ts # Single-purpose adapter modules
    ├── config.ts           # Configuration management
    └── factory.ts          # Factory pattern implementation
```

### **Naming Conventions**

#### **Files**
- **Core files**: `types.ts`, `index.ts`, `[utility].ts`
- **Adapter files**: `[feature]-adapter.ts` (e.g., `search-adapter.ts`, `creation-adapter.ts`)
- **Configuration**: `config.ts`
- **Factory**: `factory.ts`
- **Main exports**: `index.ts` (NOT `__init__.ts`)

#### **Classes and Interfaces**
- **Adapters**: `[Feature]Adapter` (e.g., `DocumentSearchAdapter`)
- **Configs**: `[Feature]Config` (e.g., `DocumentSearchConfig`)
- **Factories**: `create[Feature]Adapter` (e.g., `createNodeDocumentationAdapter`)

## **Export Standards**

### **Default Exports**
All adapter classes must use default exports:

```typescript
// ✅ CORRECT
export default DocumentSearchAdapter;

// ❌ INCORRECT
export { DocumentSearchAdapter };
```

### **Index File Pattern**
```typescript
/**
 * [Domain] Adapters Package
 * 
 * Provides modular [domain] adapter functionality.
 */

export { default as [Feature]Adapter } from './[feature]-adapter';
export { create[Feature]Adapter } from './factory';
```

## **Implementation Standards**

### **Single Responsibility**
- Each adapter file handles ONE specific feature
- Maximum file size: 200 lines
- Clear, focused class names

### **Type Safety**
- All interfaces defined in `core/types.ts`
- Strict typing for all parameters and returns
- No `any` types without justification

### **Error Handling**
- Consistent error response patterns
- Graceful degradation
- Clear error messages

## **Examples**

### **✅ Good Structure**
```
documentation/
├── core/
│   ├── types.ts
│   ├── index.ts
│   └── document-search.ts
└── adapters/
    ├── index.ts
    ├── search-adapter.ts
    ├── creation-adapter.ts
    ├── validation-adapter.ts
    ├── config.ts
    └── factory.ts
```

### **❌ Avoid**
```
documentation/
├── __init__.ts              # Use index.ts instead
├── generic-documentation-adapter.ts  # Too large, split it
├── types.ts
└── utils.ts
```

## **Migration Checklist**

When refactoring existing code:

- [ ] Rename `__init__.ts` to `index.ts`
- [ ] Split large files (>200 lines) into focused modules
- [ ] Use default exports for all adapter classes
- [ ] Update import statements to use new structure
- [ ] Ensure all types are properly defined
- [ ] Add proper error handling
- [ ] Update documentation

## **Enforcement**

This standard is **mandatory** for:
- All new adapter implementations
- All refactoring of existing code
- All code reviews
- All documentation updates

**Violations will be flagged during code review and must be corrected before merge.**

---

**Last Updated**: 2025-06-29
**Next Review**: 2025-07-01 