---
title: "{{node}} Data Models"
version: "1.0"
node: "{{node}}"
---

# {{node}} — Data Models

## TypeScript Interfaces
```typescript
// Example interface
aexport interface {{node}}Record {
  id: string;
  createdAt: string; // ISO8601
  payload: any;
}
```

## Enum Definitions
```typescript
enum {{node}}Status {
  NEW = 'new',
  PROCESSING = 'processing',
  COMPLETE = 'complete',
}
```

## Database Schema
```sql
CREATE TABLE {{node | lowercase}}_records (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE,
  payload JSONB
);
```
