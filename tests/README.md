# Test Suite

All integration, system, and utility test scripts for the monorepo live in this directory.

## Structure

- `unit/` - Unit tests for individual packages (if not colocated)
- `integration/` - Integration tests across packages
- `e2e/` - End-to-end tests
- `scripts/` - Utility and manual test scripts (e.g., env tests, SDK tests)

## Running Tests

To run all tests:

```bash
npm run test
```

To run a specific script:

```bash
node tests/scripts/<script-name>.js
```

## Adding Tests

- Place new tests in the appropriate subfolder.
- Use the centralized environment config from `@griot/core` in all test code. 