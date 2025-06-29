---
title: "Quick Reference - Established Standards"
version: "1.0"
status: "Active"
created: "2025-06-30"
updated: "2025-06-30"
---

# **Quick Reference - Established Standards**

**For Next Agent**: Use these patterns when standardizing other packages

## **File Naming Standards**

### **✅ CORRECT**
- `index.ts` (main exports)
- `[feature]-adapter.ts` (adapter implementations)
- `config.ts` (configuration)
- `factory.ts` (factory patterns)
- `types.ts` (type definitions)

### **❌ AVOID**
- `__init__.ts` (use `index.ts` instead)
- `[Feature]Adapter.ts` (use kebab-case)
- `utils.ts` (be specific about purpose)
- `helper.ts` (be specific about purpose)

## **Export Patterns**

### **✅ CORRECT**
```typescript
// Default export for adapter classes
export default DocumentSearchAdapter;

// Named exports for utilities
export { SearchRequest, SearchResponse } from './types';

// Index file pattern
export { default as DocumentSearchAdapter } from './document-search-adapter';
export { createNodeDocumentationAdapter } from './factory';
```

### **❌ AVOID**
```typescript
// Named exports for adapter classes
export { DocumentSearchAdapter };

// Mixed patterns
export default DocumentSearchAdapter;
export { DocumentSearchAdapter };
```

## **Directory Structure**

### **✅ CORRECT**
```
packages/[package-name]/adapters/[domain]/
├── core/                    # Utilities, types, infrastructure
│   ├── types.ts
│   ├── index.ts
│   └── [utility].ts
└── adapters/               # Modular adapter implementations
    ├── index.ts            # Main exports
    ├── [feature]-adapter.ts
    ├── config.ts
    └── factory.ts
```

### **❌ AVOID**
```
packages/[package-name]/
├── __init__.ts
├── [Feature]Adapter.ts
├── utils.ts
└── helper.ts
```

## **Size Limits**

- **Maximum file size**: 200 lines
- **Single responsibility**: One clear purpose per file
- **Modular design**: Break large files into focused modules

## **Type Safety**

### **✅ CORRECT**
```typescript
export interface [Feature]Config {
  timeout: number;
  retries: number;
  endpoint: string;
}

export interface [Feature]Response<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class [Feature]Adapter {
  private config: [Feature]Config;
  
  constructor(config: [Feature]Config) {
    this.config = config;
  }
  
  async performOperation(): Promise<[Feature]Response> {
    // Implementation
  }
}
```

### **❌ AVOID**
```typescript
export class [Feature]Adapter {
  private config: any;
  
  constructor(config: any) {
    this.config = config;
  }
  
  async performOperation(): Promise<any> {
    // Implementation
  }
}
```

## **Error Handling Pattern**

```typescript
export class [Feature]Adapter {
  async performOperation(): Promise<[Feature]Response> {
    try {
      const result = await this.execute();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}
```

## **Configuration Pattern**

```typescript
export interface [Feature]Config {
  timeout: number;
  retries: number;
  endpoint: string;
  enableCache: boolean;
  cacheTtl: number;
}

export class [Feature]Adapter {
  private config: [Feature]Config;
  
  constructor(config: [Feature]Config) {
    this.config = {
      timeout: 30000,
      retries: 3,
      enableCache: true,
      cacheTtl: 3600,
      ...config
    };
  }
}
```

## **Testing Pattern**

```typescript
// [feature]-adapter.test.ts
import { [Feature]Adapter } from './[feature]-adapter';

describe('[Feature]Adapter', () => {
  let adapter: [Feature]Adapter;
  let mockConfig: [Feature]Config;
  
  beforeEach(() => {
    mockConfig = {
      timeout: 1000,
      retries: 1,
      endpoint: 'http://test.com'
    };
    adapter = new [Feature]Adapter(mockConfig);
  });
  
  it('should perform operation successfully', async () => {
    const result = await adapter.performOperation();
    expect(result.success).toBe(true);
  });
  
  it('should handle errors gracefully', async () => {
    // Mock error condition
    const result = await adapter.performOperation();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## **Documentation Pattern**

### **README.md Structure**
```markdown
---
title: "[Package Name]"
version: "1.0"
status: "Active"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---

# **[Package Name]**

**Status**: ACTIVE - [PURPOSE]

Brief description of the package.

## **Quick Start**

```typescript
// Usage example
```

## **Module Catalog**

| Module | Purpose | Key Features |
|--------|---------|--------------|
| `[Feature]Adapter` | [Purpose] | [Features] |

## **Architecture Principles**

## **Development Guidelines**

## **Testing**

## **Performance Considerations**

## **Monitoring & Observability**

## **Deployment**

## **Contributing**
```

## **Commands for Next Agent**

```bash
# Find large files
find packages/ -name "*.ts" -exec wc -l {} + | sort -nr | head -20

# Find naming violations
find packages/ -name "__init__.ts"

# TypeScript check
npm run build
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

**Remember**: Consistency is key. Every package should follow these exact same patterns. 