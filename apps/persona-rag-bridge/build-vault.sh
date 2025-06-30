#!/bin/bash
echo "Building vault web server..."
npx tsc src/vault/web/server.ts --outDir dist/vault/web --target ES2020 --module CommonJS --esModuleInterop --allowSyntheticDefaultImports
echo "Copying public files..."
cp -r src/vault/web/public dist/vault/web/web/
echo "Vault build complete!"
