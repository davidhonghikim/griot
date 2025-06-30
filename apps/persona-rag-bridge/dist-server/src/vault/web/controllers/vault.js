"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultController = void 0;
const secure_vault_1 = require("../../secure-vault");
class VaultController {
    async getSecrets(_req, res) {
        try {
            const vault = (0, secure_vault_1.getVault)();
            const secrets = await vault.listSecrets();
            const secretData = [];
            for (const key of secrets) {
                const value = await vault.getSecret(key);
                secretData.push({
                    id: Date.now().toString(), // Generate unique ID for frontend
                    key,
                    value: value || '',
                    description: '', // Placeholder for description field
                    masked: this.maskValue(value),
                    hasValue: !!value,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            res.json(secretData);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async addSecret(req, res) {
        try {
            const { key, value, description } = req.body;
            if (!key || !value) {
                return res.status(400).json({ error: 'Key and value are required' });
            }
            const vault = (0, secure_vault_1.getVault)();
            await vault.setSecret(key, value, true);
            res.json({
                success: true,
                message: 'Secret added successfully',
                secret: {
                    id: Date.now().toString(),
                    key,
                    value,
                    description: description || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async updateSecret(req, res) {
        try {
            // const { id } = req.params; // ID used for response // ID used for response
            const { key, value, description } = req.body;
            if (!key || !value) {
                return res.status(400).json({ error: 'Key and value are required' });
            }
            const vault = (0, secure_vault_1.getVault)();
            await vault.setSecret(key, value, true);
            res.json({
                success: true,
                message: 'Secret updated successfully',
                secret: {
                    id: Date.now().toString(),
                    key,
                    value,
                    description: description || '',
                    updatedAt: new Date().toISOString()
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async deleteSecret(req, res) {
        try {
            // const { id } = req.params; // ID used for response // ID used for response
            const { key } = req.body; // We need the key to delete from vault
            if (!key) {
                return res.status(400).json({ error: 'Secret key is required for deletion' });
            }
            const vault = (0, secure_vault_1.getVault)();
            const removed = await vault.removeSecret(key);
            if (removed) {
                res.json({ success: true, message: 'Secret deleted successfully' });
            }
            else {
                res.status(404).json({ error: 'Secret not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async bulkImport(req, res) {
        try {
            const { secrets } = req.body;
            if (!Array.isArray(secrets)) {
                return res.status(400).json({ error: 'Secrets must be an array' });
            }
            const vault = (0, secure_vault_1.getVault)();
            let imported = 0;
            for (const secret of secrets) {
                if (secret.key && secret.value) {
                    await vault.setSecret(secret.key, secret.value, true);
                    imported++;
                }
            }
            res.json({
                success: true,
                message: `Imported ${imported} secrets successfully`
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async importEnv(req, res) {
        try {
            const { envContent } = req.body;
            if (!envContent) {
                return res.status(400).json({ error: 'Environment content is required' });
            }
            const vault = (0, secure_vault_1.getVault)();
            const imported = await this.parseAndImportEnv(vault, envContent);
            res.json({ success: true, message: `Imported ${imported} secrets` });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async exportEnv(_req, res) {
        try {
            const vault = (0, secure_vault_1.getVault)();
            const secrets = await vault.listSecrets();
            let envContent = '# PersonaRAG Bridge Environment Configuration\n';
            envContent += '# Generated by vault web interface\n\n';
            for (const secretKey of secrets) {
                const value = await vault.getSecret(secretKey);
                if (value) {
                    envContent += `${secretKey}=${value}\n`;
                }
            }
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="persona-rag.env"');
            res.send(envContent);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async getStatus(_req, res) {
        try {
            const vault = (0, secure_vault_1.getVault)();
            const secrets = await vault.listSecrets();
            const validation = await vault.validateSecurity();
            const status = vault.getStatus();
            res.json({
                initialized: status.initialized,
                secretCount: secrets.length,
                vaultPath: status.vaultPath,
                securityValid: validation.valid,
                issues: validation.issues
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    maskValue(value) {
        if (!value || value.length <= 8)
            return value || '';
        return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
    }
    async parseAndImportEnv(vault, envContent) {
        const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#') && line.includes('='));
        let imported = 0;
        for (const line of lines) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=');
            if (!key || !value)
                continue;
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            await vault.setSecret(trimmedKey, trimmedValue);
            imported++;
        }
        return imported;
    }
}
exports.VaultController = VaultController;
