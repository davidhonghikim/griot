// kOS Ronin - Global Delivery Confirmation API
// Node Class: Ronin (Nomadic Starseed)

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 6001;
app.use(express.json());

const TRACKER_FILE = './logs/delivery_tracker.jsonl';

app.get('/api/ronin/delivery/status/:messageId', (req, res) => {
  const messageId = req.params.messageId;
  const lines = fs.existsSync(TRACKER_FILE) ? fs.readFileSync(TRACKER_FILE, 'utf8').split('\n').filter(l => l) : [];
  const deliveries = lines
    .map(l => JSON.parse(l))
    .filter(entry => entry.message_id === messageId);

  if (deliveries.length > 0) {
    res.json({ status: 'delivered', details: deliveries });
  } else {
    res.json({ status: 'pending', messageId });
  }
});

app.post('/api/ronin/delivery/confirm', (req, res) => {
  const { messageId, confirmingNode } = req.body;
  const confirmation = {
    message_id: messageId,
    confirming_node: confirmingNode,
    confirmed_at: new Date().toISOString()
  };
  fs.appendFileSync(TRACKER_FILE, JSON.stringify(confirmation) + '\n');
  res.json({ status: 'confirmation recorded', confirmation });
});

app.listen(port, () => {
  console.log(`✅ Ronin Global Delivery Confirmation API running at http://localhost:${port}`);
});

// ---
// ✅ Provides GET API for checking delivery status by message ID
// ✅ Provides POST API for remote nodes to confirm delivery
// ✅ Next optional step: Integrate automatic ACK feedback into relay and queue processors
