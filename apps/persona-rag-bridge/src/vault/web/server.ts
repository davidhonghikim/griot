import express from 'express';
import path from 'path';
import { vaultRoutes } from './routes/vault';
import { configRoutes } from './routes/config';

const app = express();
const PORT = process.env.VAULT_WEB_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/vault', vaultRoutes);
app.use('/api/config', configRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'vault-web' });
});

// Serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Vault Web GUI: http://localhost:${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api/vault`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}`);
});

export { app }; 