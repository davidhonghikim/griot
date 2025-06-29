// kOS Ronin - Per-Message Queue Control CLI
// Node Class: Ronin (Nomadic Starseed)

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const QUEUE_FILE = './queue/reticulum_outbox_priority.jsonl';

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return fs.readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(l => l).map(l => JSON.parse(l));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, queue.map(q => JSON.stringify(q)).join('\n') + '\n');
}

function listQueueDetailed() {
  const queue = loadQueue();
  console.log(`\n📋 Current Queue (${queue.length} messages):`);
  queue.forEach((entry, idx) => {
    console.log(`${idx + 1}. MsgID: ${entry.message_id} | Target: ${entry.target} | Priority: ${entry.priority}`);
  });
}

function deleteMessageById(msgId) {
  let queue = loadQueue();
  const before = queue.length;
  queue = queue.filter(entry => entry.message_id !== msgId);
  saveQueue(queue);
  console.log(`🧹 Deleted ${before - queue.length} message(s) with ID: ${msgId}`);
}

function retryMessageById(msgId) {
  const queue = loadQueue();
  const message = queue.find(entry => entry.message_id === msgId);
  if (message) {
    console.log(`🚀 Retrying message ID ${msgId}...`);
    // TODO: Call existing Ronin Reticulum send logic here
  } else {
    console.log(`❌ Message ID ${msgId} not found.`);
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\n🌌 Ronin Per-Message Queue CLI - Commands:');
console.log('1. List Queue');
console.log('2. Delete by Message ID');
console.log('3. Retry by Message ID');
console.log('4. Exit');

rl.on('line', (cmd) => {
  switch (cmd.trim()) {
    case '1':
      listQueueDetailed();
      break;
    case '2':
      rl.question('Enter Message ID to delete: ', id => { deleteMessageById(id); rl.prompt(); });
      return;
    case '3':
      rl.question('Enter Message ID to retry: ', id => { retryMessageById(id); rl.prompt(); });
      return;
    case '4':
      rl.close();
      return;
    default:
      console.log('❌ Unknown command.');
  }
  console.log('\nNext Command:');
});

rl.prompt();

// ---
// ✅ Allows per-message deletion and manual retry trigger
// ✅ Next step: Implement live Reticulum send logic inside retry handler
