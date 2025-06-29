const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔐 Initializing PersonaRAG Vault...');
console.log('This will create default secrets for development.');

const vaultInit = spawn('npx', ['ts-node', 'src/vault/vault-cli.ts', 'init'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

vaultInit.stdout.on('data', (data) => {
    console.log(data.toString());
});

vaultInit.stderr.on('data', (data) => {
    console.error(data.toString());
});

vaultInit.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Vault initialized successfully!');
        rl.close();
    } else {
        console.error('❌ Vault initialization failed');
        process.exit(1);
    }
});
