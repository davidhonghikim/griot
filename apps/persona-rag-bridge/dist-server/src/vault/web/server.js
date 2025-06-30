"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const vault_1 = require("./routes/vault");
const config_1 = require("./routes/config");
const services_1 = require("./routes/services");
const vault_service_manager_1 = require("../vault-service-manager");
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.VAULT_WEB_PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Initialize vault service manager
const initializeVaultServices = async () => {
    try {
        const manager = (0, vault_service_manager_1.getVaultServiceManager)();
        await manager.initialize();
        console.log('✅ Vault Service Manager initialized');
    }
    catch (error) {
        console.error('❌ Failed to initialize Vault Service Manager:', error);
    }
};
// API Routes
app.use('/api/vault', vault_1.vaultRoutes);
app.use('/api/config', config_1.configRoutes);
app.use('/api', services_1.serviceRoutes);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'vault-web' });
});
// Serve the web interface
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Start server
app.listen(PORT, async () => {
    console.log(`🔐 Vault Web GUI: http://localhost:${PORT}`);
    console.log(`📋 API: http://localhost:${PORT}/api/vault`);
    console.log(`🔧 Services API: http://localhost:${PORT}/api/services`);
    console.log(`🌐 Web Interface: http://localhost:${PORT}`);
    // Initialize vault services after server starts
    await initializeVaultServices();
});
