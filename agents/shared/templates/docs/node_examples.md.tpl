---
title: "{{node}} Examples"
version: "1.0"
node: "{{node}}"
---

# {{node}} — Examples

## Quick Start
```bash
# Install dependencies
npm install @kos/{{node | lowercase}}

# Run a hello world example
node examples/hello.js
```

## Usage in Orchestration
```typescript
import { {{node}} } from '@kos/{{node | lowercase}}';

const adapter = new {{node}}();
const result = await adapter.generateArtifact({ /* ... */ });
```
