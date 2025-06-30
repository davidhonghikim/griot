import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const chmod = promisify(fs.chmod);

export interface VaultSecret {
  key: string;
  value: string;
  encrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SecureVault {
  private vaultPath: string;
  private encryptionKey: string;
  private secrets: Map<string, VaultSecret> = new Map();
  private isInitialized: boolean = false;

  constructor(vaultPath?: string, encryptionKey?: string) {
    this.vaultPath = vaultPath || path.join(process.cwd(), '.vault');
    this.encryptionKey = encryptionKey || this.generateEncryptionKey();
  }

  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
        if (err) reject(err);
        else resolve(key);
      });
    });
  }

  private async encrypt(text: string): Promise<string> {
    try {
      // 16-byte salt and IV for AES-256-CBC
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(16);
      const key = await this.deriveKey(this.encryptionKey, salt);

      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Store as hex strings joined by ':'  ->  salt:iv:ciphertext
      return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async decrypt(encryptedText: string): Promise<string> {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [saltHex, ivHex, encryptedHex] = parts;
      const salt = Buffer.from(saltHex, 'hex');
      const iv = Buffer.from(ivHex, 'hex');
      const key = await this.deriveKey(this.encryptionKey, salt);

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getVaultFilePath(): string {
    return path.join(this.vaultPath, 'secrets.enc');
  }

  private initializing = false;

  async initialize(skipDefaultSecrets = false): Promise<void> {
    if (this.isInitialized) {
      console.log('ℹ️ Vault already initialized');
      return;
    }

    if (this.initializing) {
      console.log('ℹ️ Vault initialization already in progress');
      return;
    }

    this.initializing = true;
    console.log('🔐 Initializing vault...');
    
    try {
      // Ensure vault directory exists
      console.log(`📁 Creating vault directory: ${this.vaultPath}`);
      await mkdir(this.vaultPath, { recursive: true });
      
      // Set directory permissions to 700 (rwx------)
      await chmod(this.vaultPath, 0o700);
      
      // Load existing secrets if they exist
      console.log('🔍 Loading existing secrets...');
      await this.loadSecrets();
      
      // Initialize default secrets if vault is empty and not skipped
      if (this.secrets.size === 0 && !skipDefaultSecrets) {
        console.log('⚙️ Initializing with default secrets...');
        await this.initializeDefaultSecrets();
        console.log(`✅ Initialized ${this.secrets.size} default secrets`);
      } else if (this.secrets.size > 0) {
        console.log(`✅ Loaded ${this.secrets.size} existing secrets`);
      }
      
      this.isInitialized = true;
      console.log('✅ Vault initialized successfully');
    } catch (error) {
      throw new Error(`Failed to initialize vault: ${error}`);
    }
  }

  private async initializeDefaultSecrets(): Promise<void> {
    // Prefix default secrets to identify them and prevent recursion
    const defaultSecrets = [
      { key: 'DEFAULT_OPENWEBUI_URL', value: 'http://192.168.1.180:3000', encrypted: false },
      { key: 'DEFAULT_OPENWEBUI_API_KEY', value: '', encrypted: true },
      { key: 'DEFAULT_VECTOR_STORE_TYPE', value: 'weaviate', encrypted: false },
      { key: 'DEFAULT_WEAVIATE_URL', value: 'http://localhost:8080', encrypted: false },
      { key: 'DEFAULT_POSTGRES_URL', value: 'localhost', encrypted: false },
      { key: 'DEFAULT_POSTGRES_PASSWORD', value: '', encrypted: true },
      { key: 'DEFAULT_MONGODB_URI', value: 'mongodb://localhost:27017/griot', encrypted: false },
      { key: 'DEFAULT_REDIS_URL', value: 'redis://localhost:6379', encrypted: false },
      { key: 'DEFAULT_NEO4J_URI', value: 'bolt://localhost:7687', encrypted: false },
      { key: 'DEFAULT_NEO4J_PASSWORD', value: '', encrypted: true },
      { key: 'DEFAULT_OPENAI_API_KEY', value: '', encrypted: true },
      { key: 'DEFAULT_VAULT_ENCRYPTION_KEY', value: this.encryptionKey, encrypted: true }
    ];
    
    // Add non-prefixed versions for backward compatibility
    const legacySecrets = defaultSecrets.map(s => ({
      ...s,
      key: s.key.replace('DEFAULT_', '')
    }));
    
    // Add all secrets to the vault
    for (const secret of [...defaultSecrets, ...legacySecrets]) {
      await this.setSecret(secret.key, secret.value, secret.encrypted);
    }

    for (const secret of defaultSecrets) {
      await this.setSecret(secret.key, secret.value, secret.encrypted);
    }
  }

  async setSecret(key: string, value: string, encrypted: boolean = true): Promise<void> {
    if (!this.isInitialized && !this.initializing) {
      // Skip default secrets during initialization to prevent recursion
      await this.initialize(key.startsWith('DEFAULT_') ? true : false);
    }

    const secret: VaultSecret = {
      key,
      value: encrypted ? await this.encrypt(value) : value,
      encrypted,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.secrets.set(key, secret);
    await this.saveSecrets();
  }

  async getSecret(key: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const secret = this.secrets.get(key);
    if (!secret) {
      return null;
    }

    if (secret.encrypted) {
      try {
        return await this.decrypt(secret.value);
      } catch (error) {
        console.error(`Failed to decrypt secret ${key}:`, error);
        return null;
      }
    }

    return secret.value;
  }

  async listSecrets(): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return Array.from(this.secrets.keys());
  }

  async removeSecret(key: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const removed = this.secrets.delete(key);
    if (removed) {
      await this.saveSecrets();
    }
    return removed;
  }

  async validateSecurity(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Check encryption key strength
    if (this.encryptionKey.length < 32) {
      issues.push('Encryption key is too short (minimum 32 characters)');
    }

    // Check for weak passwords
    const weakSecrets = ['password', 'secret', 'key', 'token'];
    for (const secretKey of this.secrets.keys()) {
      if (weakSecrets.some(weak => secretKey.toLowerCase().includes(weak))) {
        const secret = this.secrets.get(secretKey);
        if (secret && !secret.encrypted) {
          issues.push(`Secret '${secretKey}' contains sensitive data but is not encrypted`);
        }
      }
    }

    // Check file permissions
    try {
      const stats = fs.statSync(this.getVaultFilePath());
      const mode = stats.mode & 0o777;
      if (mode !== 0o600) {
        issues.push(`Vault file has insecure permissions: ${mode.toString(8)} (should be 600)`);
      }
    } catch (error) {
      // File doesn't exist yet, which is fine
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  async exportToEnv(outputPath: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const envContent: string[] = [];
    
    for (const [key, secret] of this.secrets) {
      let value: string;
      if (secret.encrypted) {
        try {
          value = await this.decrypt(secret.value);
        } catch (error) {
          console.warn(`Failed to decrypt ${key}, skipping...`);
          continue;
        }
      } else {
        value = secret.value;
      }
      
      envContent.push(`${key}=${value}`);
    }

    await writeFile(outputPath, envContent.join('\n') + '\n');
    console.log(`✅ Environment file exported to: ${outputPath}`);
  }

  async importFromEnv(envPath: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const envContent = await readFile(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    for (const line of lines) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        const shouldEncrypt = this.shouldEncryptSecret(key);
        await this.setSecret(key.trim(), value.trim(), shouldEncrypt);
      }
    }

    console.log(`✅ Environment file imported from: ${envPath}`);
  }

  private shouldEncryptSecret(key: string): boolean {
    const sensitiveKeys = [
      'PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY', 'PRIVATE', 'CREDENTIAL'
    ];
    return sensitiveKeys.some(sensitive => key.toUpperCase().includes(sensitive));
  }

  private async loadSecrets(): Promise<void> {
    const vaultFile = this.getVaultFilePath();
    
    try {
      console.log(`📂 Loading vault file: ${vaultFile}`);
      const data = await readFile(vaultFile, 'utf8');
      const parsed = JSON.parse(data);
      
      // Handle both array and object formats for backward compatibility
      let secretsArray: any[];
      if (Array.isArray(parsed)) {
        secretsArray = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Convert object with numeric keys to array
        secretsArray = Object.values(parsed);
      } else {
        throw new Error('Invalid vault file format');
      }
      
      this.secrets = new Map(secretsArray.map((s: any) => [s.key, {
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      }]));
      
      console.log(`🔑 Loaded ${this.secrets.size} secrets from vault`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('ℹ️ No existing vault file found, starting with empty vault');
        this.secrets = new Map();
      } else {
        console.error('❌ Failed to load vault:', error);
        throw error;
      }
    }
  }

  private async saveSecrets(): Promise<void> {
    const vaultFile = this.getVaultFilePath();
    
    try {
      const secretsArray = Array.from(this.secrets.values()).map(secret => ({
        ...secret,
        createdAt: secret.createdAt.toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      await writeFile(vaultFile, JSON.stringify(secretsArray, null, 2));
      
      // Set secure file permissions (rw-------)
      await chmod(vaultFile, 0o600);
      
      console.log(`💾 Saved ${this.secrets.size} secrets to vault`);
    } catch (error) {
      console.error('❌ Failed to save vault:', error);
      throw new Error(`Failed to save secrets: ${error}`);
    }
  }

  getStatus(): { initialized: boolean; secretCount: number; vaultPath: string } {
    return {
      initialized: this.isInitialized,
      secretCount: this.secrets.size,
      vaultPath: this.vaultPath
    };
  }
}

// Singleton instance
let vaultInstance: SecureVault | null = null;

/**
 * Get or create the vault instance
 */
export function getVault(): SecureVault {
  if (!vaultInstance) {
    vaultInstance = new SecureVault();
  }
  return vaultInstance;
} 