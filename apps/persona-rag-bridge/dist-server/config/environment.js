"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionConfig = exports.aiServiceConfig = exports.reticulumConfig = exports.klfConfig = void 0;
exports.getSection = getSection;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Configuration sections
const klfConfig = {
    nodeId: process.env.KLF_NODE_ID || 'griot-node',
    discoveryUrl: process.env.KLF_DISCOVERY_URL || 'http://localhost:3001',
    orchestrationUrl: process.env.KLF_ORCHESTRATION_URL || 'http://localhost:3002',
    timeout: parseInt(process.env.KLF_TIMEOUT || '5000'),
    capabilities: ['persona-rag', 'vectorization', 'orchestration']
};
exports.klfConfig = klfConfig;
const reticulumConfig = {
    nodeId: process.env.RETICULUM_NODE_ID || 'griot-node',
    host: process.env.RETICULUM_HOST || 'localhost',
    port: parseInt(process.env.RETICULUM_PORT || '3003'),
    encryptionKey: process.env.RETICULUM_ENCRYPTION_KEY || 'default-key'
};
exports.reticulumConfig = reticulumConfig;
const aiServiceConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openwebuiUrl: process.env.OPENWEBUI_URL || 'http://192.168.1.180:3000',
    openwebuiApiKey: process.env.OPENWEBUI_API_KEY || ''
};
exports.aiServiceConfig = aiServiceConfig;
const extensionConfig = {
    name: 'OWU Plus Extension',
    version: '1.0.0',
    description: 'Enhanced OpenWebUI integration with PersonaRAG capabilities'
};
exports.extensionConfig = extensionConfig;
// Configuration getter function
function getSection(section) {
    switch (section) {
        case 'klf':
            return klfConfig;
        case 'reticulum':
            return reticulumConfig;
        case 'ai':
            return aiServiceConfig;
        case 'extension':
            return extensionConfig;
        default:
            throw new Error(`Unknown configuration section: ${section}`);
    }
}
