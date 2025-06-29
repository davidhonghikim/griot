// kOS Yachay OpenAPI REST Server
// Node Class: Yachay (Memory Starseed)

import express from 'express';
import bodyParser from 'body-parser';
import { validateDocs } from './validate-docs.js';
import { generateManifest } from './generate-manifest.js';
import { pruneArchives } from './prune-archives.js';
import { exportForDb } from './export-for-db.js';

const app = express();
const port = 3000;
app.use(bodyParser.json());

// API: Validate Docs
app.post('/api/yachay/validate', (req, res) => {
  try {
    validateDocs('./agents');
    res.json({ status: 'success', message: 'Validation complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: Generate Manifest
app.post('/api/yachay/manifest', (req, res) => {
  try {
    generateManifest('./agents', './agents/system_manifest.json');
    res.json({ status: 'success', message: 'Manifest generated.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: Prune Archives
app.post('/api/yachay/prune', (req, res) => {
  const { targetDir, retentionDays } = req.body;
  if (!targetDir) return res.status(400).json({ status: 'error', message: 'targetDir is required.' });
  try {
    pruneArchives(targetDir, retentionDays || 30);
    res.json({ status: 'success', message: 'Pruning complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// API: Export for DB
app.post('/api/yachay/export', (req, res) => {
  try {
    exportForDb('./agents', './db_exports/agents_export.jsonl');
    res.json({ status: 'success', message: 'Export complete.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Yachay REST API server running on port ${port}`);
});

// ---
// Optional Next Steps:
// - Add OpenAPI spec definition (swagger.json)
// - Add input validation for request bodies
// - Add auth middleware if externalized
// - Add detailed logging
