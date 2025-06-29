// kOS Ronin Monitoring Web Dashboard (Node.js + Express + Chart.js)
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

app.get('/api/mesh-health-log', (req, res) => {
  const logData = fs.readFileSync('./logs/mesh_health.log', 'utf8');
  res.json({ log: logData });
});

app.get('/api/mesh-health-trend', (req, res) => {
  const imgPath = './logs/mesh_health_report.png';
  if (fs.existsSync(imgPath)) {
    res.sendFile(path.resolve(imgPath));
  } else {
    res.status(404).send('Trend graph not found.');
  }
});

app.listen(port, () => {
  console.log(`✅ Ronin Monitoring Dashboard running at http://localhost:${port}`);
});

// --- public/index.html ---
/*
<!DOCTYPE html>
<html>
<head>
  <title>Ronin Mesh Monitoring Dashboard</title>
</head>
<body>
  <h1>🌌 Ronin Mesh Health Dashboard</h1>
  <h2>Recent Mesh Health Log</h2>
  <pre id="log"></pre>
  <h2>Health Trend Graph</h2>
  <img id="trendGraph" width="800" />

  <script>
    fetch('/api/mesh-health-log')
      .then(res => res.json())
      .then(data => {
        document.getElementById('log').textContent = data.log;
      });

    document.getElementById('trendGraph').src = '/api/mesh-health-trend';
  </script>
</body>
</html>
*/

// ---
// ✅ Lightweight dashboard served on port 5000
// ✅ Shows live health log and trend graph
// ✅ Next optional step: Add historical analytics database and full frontend styling
