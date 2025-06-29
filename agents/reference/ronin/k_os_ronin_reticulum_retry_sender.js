// kOS Ronin - Reticulum Message Retry Sender Integration
// Node Class: Ronin (Nomadic Starseed)

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = './queue/reticulum_outbox_priority.jsonl';

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return fs.readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(l => l).map(l => JSON.parse(l));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, queue.map(q => JSON.stringify(q)).join('\n') + '\n');
}

function retryMessage(message) {
  return new Promise((resolve, reject) => {
    exec(`python3 ./scripts/reticulum_bridge.py ${message.target} '${JSON.stringify(message.payload)}'`, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout.trim());
    });
  });
}

export async function retryMessageById(msgId) {
  const queue = loadQueue();
  const index = queue.findIndex(entry => entry.message_id === msgId);
  if (index === -1) {
    console.log(`❌ Message ID ${msgId} not found.`);
    return;
  }

  const message = queue[index];
  try {
    const result = await retryMessage(message);
    console.log(`✅ Retry Success for ${msgId}:`, result);
    queue.splice(index, 1);
    saveQueue(queue);
  } catch (err) {
    console.error(`❌ Retry failed for ${msgId}:`, err);
  }
}

// --- Usage Example ---
// await retryMessageById('msg_12345');

// ---
// ✅ Runs real Reticulum send via Python bridge for each retry
// ✅ Removes message from queue on success
// ✅ Next step: Build full styled frontend queue dashboard with status feedback
