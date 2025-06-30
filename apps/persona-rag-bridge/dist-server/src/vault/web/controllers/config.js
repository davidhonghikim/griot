"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ConfigController {
    constructor() {
        Object.defineProperty(this, "configPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: path_1.default.join(process.cwd(), 'config', 'services.json')
        });
    }
    async getConfig(_req, res) {
        try {
            if (fs_1.default.existsSync(this.configPath)) {
                const configData = fs_1.default.readFileSync(this.configPath, 'utf8');
                const config = JSON.parse(configData);
                res.json(config);
            }
            else {
                // Return default configuration with correct ports
                const defaultConfig = {
                    services: {
                        openWebUI: {
                            name: 'OpenWebUI',
                            url: 'http://192.168.1.180:3000',
                            apiKey: '',
                            type: 'llm',
                            healthEndpoint: '/api/v1/health'
                        },
                        personaRAG: {
                            name: 'PersonaRAG Bridge',
                            url: 'http://localhost:3001',
                            type: 'bridge',
                            healthEndpoint: '/health'
                        },
                        vectorStore: {
                            name: 'Vector Store (Weaviate)',
                            url: 'http://localhost:8080',
                            type: 'vector',
                            healthEndpoint: '/v1/.well-known/ready'
                        },
                        postgresql: {
                            name: 'PostgreSQL',
                            url: 'localhost:5432',
                            type: 'database',
                            healthEndpoint: null
                        },
                        mongodb: {
                            name: 'MongoDB',
                            url: 'localhost:27017',
                            type: 'database',
                            healthEndpoint: null
                        },
                        redis: {
                            name: 'Redis',
                            url: 'localhost:6379',
                            type: 'cache',
                            healthEndpoint: null
                        }
                    },
                    vault: {
                        port: 3001,
                        storage: 'file', // or 'database'
                        encryption: true
                    }
                };
                res.json(defaultConfig);
            }
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async saveConfig(req, res) {
        try {
            const config = req.body;
            // Ensure config directory exists
            const configDir = path_1.default.dirname(this.configPath);
            if (!fs_1.default.existsSync(configDir)) {
                fs_1.default.mkdirSync(configDir, { recursive: true });
            }
            // Save configuration
            fs_1.default.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
            res.json({ success: true, message: 'Configuration saved successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async addService(req, res) {
        try {
            const { name, url, type, apiKey, healthEndpoint } = req.body;
            if (!name || !url || !type) {
                return res.status(400).json({ error: 'Name, URL, and type are required' });
            }
            const config = await this.loadConfig();
            const serviceId = name.toLowerCase().replace(/\s+/g, '-');
            config.services[serviceId] = {
                name,
                url,
                type,
                apiKey: apiKey || '',
                healthEndpoint: healthEndpoint || null
            };
            await this.saveConfigToFile(config);
            res.json({
                success: true,
                message: 'Service added successfully',
                service: config.services[serviceId]
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async removeService(req, res) {
        try {
            const { serviceId } = req.params;
            const config = await this.loadConfig();
            if (!config.services[serviceId]) {
                return res.status(404).json({ error: 'Service not found' });
            }
            delete config.services[serviceId];
            await this.saveConfigToFile(config);
            res.json({
                success: true,
                message: 'Service removed successfully'
            });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
        }
    }
    async testConnection(req, res) {
        try {
            const { service } = req.params;
            const { url, healthEndpoint } = req.body;
            if (!url) {
                return res.status(400).json({ error: 'Service URL is required' });
            }
            let healthUrl = url;
            if (healthEndpoint) {
                healthUrl = `${url}${healthEndpoint}`;
            }
            else if (service === 'openWebUI') {
                healthUrl = `${url}/api/v1/health`;
            }
            else if (service === 'vectorStore') {
                healthUrl = `${url}/v1/.well-known/ready`;
            }
            else if (service === 'personaRAG') {
                healthUrl = `${url}/health`;
            }
            else {
                // For database services, try a simple connection test
                healthUrl = url;
            }
            const response = await axios_1.default.get(healthUrl, { timeout: 5000 });
            res.json({
                success: true,
                message: `${service} connection successful`,
                status: response.status,
                data: response.data
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
    async loadConfig() {
        if (fs_1.default.existsSync(this.configPath)) {
            const configData = fs_1.default.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        }
        else {
            return { services: {} };
        }
    }
    async saveConfigToFile(config) {
        const configDir = path_1.default.dirname(this.configPath);
        if (!fs_1.default.existsSync(configDir)) {
            fs_1.default.mkdirSync(configDir, { recursive: true });
        }
        fs_1.default.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    }
}
exports.ConfigController = ConfigController;
