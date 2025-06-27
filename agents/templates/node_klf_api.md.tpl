---
title: "{{node}} KLF API"
version: "1.0"
node: "{{node}}"
---

# {{node}} — Kind Link Framework API

## Message Types
```typescript
enum {{node}}MessageType {
  REQUEST = 'request',
  RESPONSE = 'response',
  ERROR = 'error',
}
```

## Sample Message
```json
{
  "messageType": "REQUEST",
  "sourceNode": "{{node}}",
  "targetNode": "OtherNode",
  "payload": {
    "example": "value"
  },
  "metadata": {
    "traceId": "abc-123"
  }
}
```
