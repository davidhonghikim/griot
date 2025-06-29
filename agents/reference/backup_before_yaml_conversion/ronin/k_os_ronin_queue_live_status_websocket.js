// kOS Ronin - Queue Live Status WebSocket Integration
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const QUEUE_FILE = './queue/reticulum_outbox_priority.jsonl';

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return fs.readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(l => l).map(l => JSON.parse(l));
}

function broadcastQueue() {
  const queueData = JSON.stringify({ queue: loadQueue() });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(queueData);
    }
  });
}

wss.on('connection', ws => {
  console.log('✅ WebSocket client connected');
  ws.send(JSON.stringify({ queue: loadQueue() }));
});

app.post('/api/ronin/queue/trigger-broadcast', (req, res) => {
  broadcastQueue();
  res.json({ status: 'broadcasted' });
});

app.use('/', (req, res) => {
  res.sendFile(path.resolve('./public/queue_dashboard_live.html'));
});

server.listen(6005, () => {
  console.log('✅ Ronin Queue Live WebSocket running at http://localhost:6005');
});

// --- public/queue_dashboard_live.html ---
/*
<!DOCTYPE html>
<html>
<head><title>Ronin Queue Live Dashboard</title></head>
<body>
  <h1>🌌 Ronin Live Queue</h1>
  <ul id="queueList"></ul>
  <script>
    const ws = new WebSocket('ws://localhost:6005');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const list = document.getElementById('queueList');
      list.innerHTML = '';
      data.queue.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `MsgID: ${msg.message_id} | Target: ${msg.target} | Priority: ${msg.priority}`;
        list.appendChild(li);
      });
    };
  </script>
</body>
</html>
*/

// ---
// ✅ WebSocket-based live queue updates
// ✅ Broadcast on API trigger
// ✅ Next step: Auto-broadcast on queue change and add delivery status tags
