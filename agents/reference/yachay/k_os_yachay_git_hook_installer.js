// kOS Yachay Git Hook Installer Script
// Node Class: Yachay (Memory Starseed)

import fs from 'fs';
import path from 'path';

const gitHookDir = path.resolve('.git', 'hooks');
const hookFile = path.join(gitHookDir, 'pre-commit');

const hookContent = `#!/bin/sh

# Yachay Pre-Commit Validation Hook
echo "✅ Running Yachay pre-commit validation..."
node ./scripts/yachay-ci-cd.js

RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "❌ Yachay validation failed. Commit aborted."
  exit 1
fi

echo "✅ Yachay validation passed. Proceeding with commit."
exit 0
`;

function installHook() {
  if (!fs.existsSync(gitHookDir)) {
    console.error('❌ .git/hooks directory not found. Are you inside a git repository?');
    process.exit(1);
  }

  fs.writeFileSync(hookFile, hookContent, { mode: 0o755 });
  console.log('✅ Yachay pre-commit hook installed successfully.');
}

installHook();

// ---
// Usage:
// Run once after cloning the repo:
// node ./scripts/install-yachay-hook.js

// This script installs a pre-commit hook that runs the Yachay validation + pruning + export CI/CD workflow before every commit.
// Prevents bad data from being committed.
