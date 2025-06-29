// kOS Ronin - Message Retry Logic and Web UI for Queue Management
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 6003;
app.use(bodyParser.json());

const QUEUE_FILE = './queue/reticulum_outbox_priority.jsonl';

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return fs.readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(l => l).map(l => JSON.parse(l));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, queue.map(q => JSON.stringify(q)).join('\n') + '\n');
}

app.get('/api/ronin/queue/list', (req, res) => {
  res.json({ queue: loadQueue() });
});

app.post('/api/ronin/queue/delete', (req, res) => {
  const { messageId } = req.body;
  let queue = loadQueue();
  const before = queue.length;
  queue = queue.filter(entry => entry.message_id !== messageId);
  saveQueue(queue);
  res.json({ status: 'deleted', removed: before - queue.length });
});

app.post('/api/ronin/queue/retry', (req, res) => {
  const { messageId } = req.body;
  const queue = loadQueue();
  const message = queue.find(entry => entry.message_id === messageId);
  if (message) {
    console.log(`🚀 Retrying message ${messageId}:`, message);
    // TODO: Integrate real Reticulum send logic here
    res.json({ status: 'retry triggered', message });
  } else {
    res.status(404).json({ error: 'Message ID not found' });
  }
});

app.use('/', (req, res) => {
  res.send(`
    <h1>Ronin Queue Manager</h1>
    <form method="POST" action="/api/ronin/queue/delete">
      <input name="messageId" placeholder="Message ID to delete"/>
      <button type="submit">Delete Message</button>
    </form>
    <form method="POST" action="/api/ronin/queue/retry">
      <input name="messageId" placeholder="Message ID to retry"/>
      <button type="submit">Retry Message</button>
    </form>
    <p>GET /api/ronin/queue/list for full JSON queue dump</p>
  `);
});

app.listen(port, () => {
  console.log(`✅ Ronin Queue Web UI running at http://localhost:${port}`);
});

// ---
// ✅ Provides REST API for queue list, delete, retry
// ✅ Includes a basic web UI form for manual control
// ✅ Next step: Wire in real Reticulum send logic for retries
