// kOS Ronin - Manual Queue Control CLI
// Node Class: Ronin (Nomadic Starseed)

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const QUEUE_FILE = './queue/reticulum_outbox_priority.jsonl';
const ACK_FILE = './logs/delivery_tracker.jsonl';

function listQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return console.log('❌ No queue file found.');
  const lines = fs.readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(l => l);
  console.log(`\n📋 Queue Contents (${lines.length} messages):`);
  lines.forEach((line, idx) => {
    const entry = JSON.parse(line);
    console.log(`${idx + 1}. Target: ${entry.target} | MsgID: ${entry.message_id} | Priority: ${entry.priority}`);
  });
}

function purgeQueue() {
  if (fs.existsSync(QUEUE_FILE)) {
    fs.unlinkSync(QUEUE_FILE);
    console.log('🧹 Queue purged.');
  } else {
    console.log('❌ No queue file to purge.');
  }
}

function showAckSummary() {
  if (!fs.existsSync(ACK_FILE)) return console.log('❌ No ACK log found.');
  const lines = fs.readFileSync(ACK_FILE, 'utf8').split('\n').filter(l => l);
  const uniqueMsgs = new Set(lines.map(l => JSON.parse(l).message_id));
  console.log(`\n✅ Total ACKs: ${lines.length}`);
  console.log(`✅ Unique Messages Confirmed: ${uniqueMsgs.size}`);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\n🌌 Ronin Queue Control CLI - Commands:');
console.log('1. List Queue');
console.log('2. Purge Queue');
console.log('3. Show ACK Summary');
console.log('4. Exit');

rl.on('line', (cmd) => {
  switch (cmd.trim()) {
    case '1':
      listQueue();
      break;
    case '2':
      purgeQueue();
      break;
    case '3':
      showAckSummary();
      break;
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
// ✅ Allows manual queue inspection, purge, and ACK stats viewing
// ✅ Next step: Web-based control UI for queue management
