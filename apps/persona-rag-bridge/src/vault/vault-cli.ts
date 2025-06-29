#!/usr/bin/env node

/**
 * PersonaRAG Vault CLI
 * 
 * Command-line interface for managing secure credentials and configuration
 * Usage: npx ts-node src/vault/vault-cli.ts [command] [options]
 */

import { getVault } from './secure-vault';
import { Command } from 'commander';
import readline from 'readline';
import fs from 'fs/promises';
import path from 'path';

const program = new Command();

// Create readline interface for secure input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', (chunk) => {
      const char = chunk.toString();
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        default:
          stdout.write('*');
          password += char;
          break;
      }
    });
  });
}

// Initialize vault
program
  .name('persona-rag-vault')
  .description('Secure vault management for PersonaRAG Bridge')
  .version('1.0.0');

// Initialize vault with default secrets
program
  .command('init')
  .description('Initialize vault with default secrets')
  .option('-f, --force', 'Force reinitialization')
  .action(async (options) => {
    try {
      console.log('🔐 Initializing PersonaRAG Vault...\n');
      
      const vault = getVault();
      
      if (options.force) {
        console.log('⚠️ Force reinitialization enabled');
      }
      
      await vault.initialize();
      
      console.log('\n✅ Vault initialized successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Run "vault set" to configure your actual API keys');
      console.log('2. Run "vault validate" to check security');
      console.log('3. Run "vault list" to see all secrets');
      
    } catch (error) {
      console.error('❌ Failed to initialize vault:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Set a secret
program
  .command('set <key>')
  .description('Set a secret in the vault')
  .option('-v, --value <value>', 'Secret value (will prompt if not provided)')
  .option('-p, --plaintext', 'Store as plaintext (not recommended)')
  .action(async (key, options) => {
    try {
      const vault = getVault();
      
      let value = options.value;
      if (!value) {
        if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
          value = await questionHidden(`Enter ${key}: `);
        } else {
          value = await question(`Enter ${key}: `);
        }
      }
      
      if (!value) {
        console.error('❌ Value cannot be empty');
        process.exit(1);
      }
      
      await vault.setSecret(key, value, !options.plaintext);
      console.log(`✅ Secret "${key}" stored successfully`);
      
    } catch (error) {
      console.error('❌ Failed to set secret:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Get a secret
program
  .command('get <key>')
  .description('Get a secret from the vault')
  .option('-m, --mask', 'Mask the output (show only first/last 4 chars)')
  .action(async (key, options) => {
    try {
      const vault = getVault();
      const value = await vault.getSecret(key);
      
      if (value === null) {
        console.error(`❌ Secret "${key}" not found`);
        process.exit(1);
      }
      
      if (options.mask && value.length > 8) {
        const masked = value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
        console.log(`${key}: ${masked}`);
      } else {
        console.log(`${key}: ${value}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to get secret:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// List all secrets
program
  .command('list')
  .description('List all secrets in the vault')
  .option('-s, --show-values', 'Show secret values (use with caution)')
  .option('-m, --mask', 'Mask values when showing them')
  .action(async (options) => {
    try {
      const vault = getVault();
      const secrets = await vault.listSecrets();
      
      if (secrets.length === 0) {
        console.log('📭 No secrets found in vault');
        return;
      }
      
      console.log(`📋 Found ${secrets.length} secrets:\n`);
      
      for (const secretKey of secrets) {
        if (options.showValues) {
          const value = await vault.getSecret(secretKey);
          if (value) {
            if (options.mask && value.length > 8) {
              const masked = value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
              console.log(`${secretKey}: ${masked}`);
            } else {
              console.log(`${secretKey}: ${value}`);
            }
          }
        } else {
          console.log(`• ${secretKey}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to list secrets:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Remove a secret
program
  .command('remove <key>')
  .description('Remove a secret from the vault')
  .option('-f, --force', 'Force removal without confirmation')
  .action(async (key, options) => {
    try {
      const vault = getVault();
      
      if (!options.force) {
        const confirm = await question(`Are you sure you want to remove "${key}"? (y/N): `);
        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
          console.log('❌ Operation cancelled');
          return;
        }
      }
      
      const removed = await vault.removeSecret(key);
      if (removed) {
        console.log(`✅ Secret "${key}" removed successfully`);
      } else {
        console.log(`⚠️ Secret "${key}" not found`);
      }
      
    } catch (error) {
      console.error('❌ Failed to remove secret:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Validate vault security
program
  .command('validate')
  .description('Validate vault security and configuration')
  .action(async () => {
    try {
      const vault = getVault();
      const validation = await vault.validateSecurity();
      
      console.log('🔍 Validating vault security...\n');
      
      if (validation.valid) {
        console.log('✅ Vault security validation passed!');
      } else {
        console.log('❌ Vault security validation failed:');
        validation.issues.forEach(issue => {
          console.log(`  • ${issue}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to validate vault:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Export secrets to environment file
program
  .command('export')
  .description('Export secrets to .env file')
  .option('-o, --output <file>', 'Output file (default: .env)')
  .option('-t, --template', 'Export as template with placeholder values')
  .action(async (options) => {
    try {
      const vault = getVault();
      const secrets = await vault.listSecrets();
      const outputFile = options.output || '.env';
      
      let envContent = '# PersonaRAG Bridge Environment Configuration\n';
      envContent += '# Generated by vault export\n\n';
      
      for (const secretKey of secrets) {
        if (options.template) {
          envContent += `${secretKey}=your_${secretKey.toLowerCase()}_here\n`;
        } else {
          const value = await vault.getSecret(secretKey);
          if (value) {
            envContent += `${secretKey}=${value}\n`;
          }
        }
      }
      
      await fs.writeFile(outputFile, envContent);
      console.log(`✅ Exported ${secrets.length} secrets to ${outputFile}`);
      
    } catch (error) {
      console.error('❌ Failed to export secrets:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Import secrets from environment file
program
  .command('import')
  .description('Import secrets from .env file')
  .option('-f, --file <file>', 'Input file (default: .env)')
  .option('-o, --overwrite', 'Overwrite existing secrets')
  .action(async (options) => {
    try {
      const vault = getVault();
      const inputFile = options.file || '.env';
      
      if (!await fs.access(inputFile).then(() => true).catch(() => false)) {
        console.error(`❌ File not found: ${inputFile}`);
        process.exit(1);
      }
      
      const content = await fs.readFile(inputFile, 'utf8');
      const lines = content.split('\n').filter(line => 
        line.trim() && !line.startsWith('#') && line.includes('=')
      );
      
      let imported = 0;
      let skipped = 0;
      
      for (const line of lines) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        
        if (!key || !value) continue;
        
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        
        if (!options.overwrite && (await vault.getSecret(trimmedKey)) !== null) {
          skipped++;
          continue;
        }
        
        await vault.setSecret(trimmedKey, trimmedValue);
        imported++;
      }
      
      console.log(`✅ Imported ${imported} secrets`);
      if (skipped > 0) {
        console.log(`⚠️ Skipped ${skipped} existing secrets (use --overwrite to force)`);
      }
      
    } catch (error) {
      console.error('❌ Failed to import secrets:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Show vault status
program
  .command('status')
  .description('Show vault status and statistics')
  .action(async () => {
    try {
      const vault = getVault();
      const secrets = await vault.listSecrets();
      const validation = await vault.validateSecurity();
      
      console.log('📊 PersonaRAG Vault Status\n');
      console.log(`Total Secrets: ${secrets.length}`);
      console.log(`Security Status: ${validation.valid ? '✅ Secure' : '❌ Issues Found'}`);
      
      if (secrets.length > 0) {
        console.log('\n📋 Secret Categories:');
        const categories = {
          'API Keys': secrets.filter(s => s.includes('API_KEY')).length,
          'Passwords': secrets.filter(s => s.includes('PASSWORD')).length,
          'Secrets': secrets.filter(s => s.includes('SECRET')).length,
          'Tokens': secrets.filter(s => s.includes('TOKEN')).length,
          'Other': secrets.filter(s => 
            !s.includes('API_KEY') && 
            !s.includes('PASSWORD') && 
            !s.includes('SECRET') && 
            !s.includes('TOKEN')
          ).length
        };
        
        Object.entries(categories).forEach(([category, count]) => {
          if (count > 0) {
            console.log(`  • ${category}: ${count}`);
          }
        });
      }
      
      if (!validation.valid) {
        console.log('\n⚠️ Security Issues:');
        validation.issues.forEach(issue => {
          console.log(`  • ${issue}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to get vault status:', error);
      process.exit(1);
    } finally {
      rl.close();
    }
  });

// Parse command line arguments
program.parse();

// Handle unknown commands
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 