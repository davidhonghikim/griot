// kOS Ronin Mesh Event Logger and Health Trend Grapher
// Node Class: Ronin (Nomadic Starseed)

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const logFile = path.join('./logs', 'mesh_health.log');

class MeshEventLogger {
  static logEvent(node, status, latency = null) {
    const timestamp = new Date().toISOString();
    const entry = `${timestamp} | Node: ${node} | Status: ${status}${latency !== null ? ` | Latency: ${latency}ms` : ''}\n`;
    fs.appendFileSync(logFile, entry);
  }

  static readLog() {
    return fs.readFileSync(logFile, 'utf8');
  }
}

async function pollNodes(nodes) {
  for (const node of nodes) {
    const start = Date.now();
    try {
      await axios.post(`http://${node}/api/ronin/metrics`, {});
      const latency = Date.now() - start;
      MeshEventLogger.logEvent(node, 'online', latency);
    } catch (err) {
      MeshEventLogger.logEvent(node, 'offline');
    }
  }
}

async function generateTrendGraph(outputFile) {
  const rawLog = MeshEventLogger.readLog();
  const lines = rawLog.split('\n').filter(l => l);
  const timestamps = [];
  const nodeStatus = {};

  lines.forEach(line => {
    const [timePart, nodePart, statusPart] = line.split('|').map(p => p.trim());
    const nodeName = nodePart.split(': ')[1];
    const status = statusPart.split(': ')[1];

    if (!nodeStatus[nodeName]) nodeStatus[nodeName] = [];
    nodeStatus[nodeName].push(status === 'online' ? 1 : 0);
    if (!timestamps.includes(timePart)) timestamps.push(timePart);
  });

  const chart = new ChartJSNodeCanvas({ width: 800, height: 400 });
  const config = {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: Object.keys(nodeStatus).map(node => ({
        label: node,
        data: nodeStatus[node],
        fill: false,
        borderColor: 'blue'
      }))
    },
    options: { scales: { y: { min: 0, max: 1 } } }
  };

  const buffer = await chart.renderToBuffer(config);
  fs.writeFileSync(outputFile, buffer);
  console.log(`✅ Mesh health trend graph saved as ${outputFile}`);
}

// --- Usage Example ---
(async () => {
  const nodes = ['localhost:4000', 'node2.local:4000'];
  await pollNodes(nodes);
  await generateTrendGraph('./logs/mesh_health_trend.png');
})();

// ---
// ✅ Logs all mesh health events to file
// ✅ Generates time-series trend graphs of node online/offline status
// ✅ Next optional step: Build alert system for downtime threshold breaches
