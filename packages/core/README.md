# @griot/core

## Centralized Environment Configuration

This package provides a unified, type-safe environment configuration system for all packages and apps in the monorepo.

### Usage

```typescript
import { getEnvironmentConfig } from '@griot/core';
const env = getEnvironmentConfig();
console.log(env.PORT, env.MONGODB_URI, env.LOG_LEVEL);
```

- Loads from `.env.local`, `.env`, and `env.example` (in that order of precedence)
- All environment variables are typed and documented in `src/config/environment.ts`
- Add new variables to the `EnvironmentConfig` type and the config object
- All code should use this config instead of direct `process.env` or `dotenv` usage

### Example Variables
- `PORT`, `HOST`, `BASE_IP`, `DEPLOYMENT_TYPE`
- `MONGODB_URI`, `POSTGRES_HOST`, etc.
- `LOG_LEVEL` (for logging)
- `SERVICE_TEST_INTERVAL`, `CONNECTION_TIMEOUT`

See the source for the full list and usage patterns. 