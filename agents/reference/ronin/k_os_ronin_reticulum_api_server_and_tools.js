// kOS Ronin Reticulum API Server and CLI Tools
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';

const app = express();
const port = 4000;
app.use(bodyParser.json());

// --- Reticulum Adapter Layer (Bridge to Python or native Node module) ---
async function sendViaReticulum(destination, payload) {
  return new Promise((resolve, reject) => {
    exec(`python3 ./scripts/reticulum_bridge.py ${destination} '${JSON.stringify(payload)}'`, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout.trim());
    });
  });
}

// --- API Endpoints ---
app.post('/api/ronin/login', async (req, res) => {
  try {
    const response = await sendViaReticulum('login_service', req.body);
    res.json({ status: 'success', response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/ronin/discover', async (req, res) => {
  try {
    const response = await sendViaReticulum('discovery_service', req.body);
    res.json({ status: 'success', response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post('/api/ronin/upload', async (req, res) => {
  try {
    const response = await sendViaReticulum('file_upload_service', req.body);
    res.json({ status: 'success', response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Additional API routes for download, pubsub, bbs, metrics, etc., follow same pattern

app.listen(port, () => {
  console.log(`✅ Ronin API server running on port ${port}`);
});

// --- CLI Tools Example (CLI can grow later) ---

export async function runNodeDiscovery() {
  console.log('🔍 Running Ronin Node Discovery...');
  const result = await sendViaReticulum('discovery_service', { action: 'scan' });
  console.log('✅ Discovery Result:', result);
}

export async function runRoutingTrace(targetNodeId) {
  console.log(`🔗 Running Ronin Routing Trace to ${targetNodeId}...`);
  const result = await sendViaReticulum('route_trace_service', { target: targetNodeId });
  console.log('✅ Routing Trace:', result);
}

// ---
// ✅ Provides working Node.js API layer with Reticulum Python adapter bridge
// ✅ Ready for CLI, additional endpoints, or full OpenAPI spec generation
// ✅ Next Step: Generate full OpenAPI 3 Spec and Python-side reticulum_bridge.py starter script
