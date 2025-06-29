// kOS Ronin - Global ACK Stats Dashboard
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 6002;
app.use(express.json());

const ACK_LOG = './logs/delivery_tracker.jsonl';

app.get('/api/ronin/ack-stats', (req, res) => {
  const lines = fs.existsSync(ACK_LOG) ? fs.readFileSync(ACK_LOG, 'utf8').split('\n').filter(l => l) : [];
  const ackCountByNode = {};
  const ackCountByMessage = {};

  lines.forEach(line => {
    const entry = JSON.parse(line);
    const node = entry.ack_from;
    const msg = entry.message_id;
    ackCountByNode[node] = (ackCountByNode[node] || 0) + 1;
    ackCountByMessage[msg] = (ackCountByMessage[msg] || 0) + 1;
  });

  res.json({
    totalAcks: lines.length,
    ackCountByNode,
    ackCountByMessage
  });
});

app.listen(port, () => {
  console.log(`✅ Ronin ACK Stats Dashboard running at http://localhost:${port}`);
});

// ---
// ✅ Provides live JSON API for:
// - Total ACKs
// - ACKs by source node
// - ACKs per message ID
// ✅ Next optional step: Build queue cleanup trigger after confirmed deliveries
