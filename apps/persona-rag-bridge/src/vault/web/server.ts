import express from 'express';
import path from 'path';
import { vaultRoutes } from './routes/vault';
import { configRoutes } from './routes/config';
import { serviceRoutes } from './routes/services';
import { getVaultServiceManager } from '../vault-service-manager';

const app = express();
const PORT = process.env.VAULT_WEB_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize vault service manager
const initializeVaultServices = async () => {
  try {
    const manager = getVaultServiceManager();
    await manager.initialize();
    console.log('✅ Vault Service Manager initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Vault Service Manager:', error);
  }
};

// API Routes
app.use('/api/vault', vaultRoutes);
app.use('/api/config', configRoutes);
app.use('/api', serviceRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vault-web' });
});

// Serve the web interface
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

export { app }; 