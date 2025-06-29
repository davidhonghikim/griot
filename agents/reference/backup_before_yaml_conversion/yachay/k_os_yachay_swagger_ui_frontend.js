// kOS Yachay Swagger UI Frontend Setup
// Node Class: Yachay (Memory Starseed)

import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger-spec.js';

import { validateDocs } from './validate-docs.js';
import { generateManifest } from './generate-manifest.js';
import { pruneArchives } from './prune-archives.js';
import { exportForDb } from './export-for-db.js';

const app = express();
const port = 3000;
app.use(bodyParser.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// REST Endpoints
app.post('/api/yachay/validate', (req, res) => {
  try {
    validateDocs('./agents');
    res.json({ status: 'success', message: 'Validation complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/yachay/manifest', (req, res) => {
  try {
    generateManifest('./agents', './agents/system_manifest.json');
    res.json({ status: 'success', message: 'Manifest generated.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/yachay/prune', (req, res) => {
  const { targetDir, retentionDays } = req.body;
  try {
    pruneArchives(targetDir, retentionDays || 30);
    res.json({ status: 'success', message: 'Pruning complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/yachay/export', (req, res) => {
  try {
    exportForDb('./agents', './db_exports/agents_export.jsonl');
    res.json({ status: 'success', message: 'Export complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Yachay REST API + Swagger UI running at http://localhost:${port}/api-docs`);
});

// ---
// ✅ Swagger UI now available at: http://localhost:3000/api-docs
// ✅ Next optional step: Generate Kubernetes deployment YAML or release packaging script.
