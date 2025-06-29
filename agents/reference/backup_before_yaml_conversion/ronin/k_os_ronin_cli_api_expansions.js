// kOS Ronin CLI API Expansions for BBS and Sync
// Node Class: Ronin (Nomadic Starseed)

import axios from 'axios';

async function postToBBS(message, topic = 'general') {
  try {
    const res = await axios.post('http://localhost:4000/api/ronin/bbs/post', { topic, message });
    console.log('✅ BBS Post Success:', res.data);
  } catch (err) {
    console.error('❌ BBS Post Failed:', err.message);
  }
}

async function triggerSyncBackup(targetDir = '/default/backup/path') {
  try {
    const res = await axios.post('http://localhost:4000/api/ronin/sync/backup', { targetDir });
    console.log('✅ Backup Trigger Success:', res.data);
  } catch (err) {
    console.error('❌ Backup Trigger Failed:', err.message);
  }
}

// --- CLI Extension ---
import readline from 'readline';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('\n🌌 Ronin Extended CLI - Available Commands:');
console.log('1. Post to BBS');
console.log('2. Trigger Sync Backup');
console.log('3. Exit');

rl.on('line', async (cmd) => {
  switch (cmd.trim()) {
    case '1':
      rl.question('Enter BBS message: ', async (msg) => {
        await postToBBS(msg);
        rl.prompt();
      });
      break;
    case '2':
      rl.question('Enter Backup Target Directory: ', async (dir) => {
        await triggerSyncBackup(dir);
        rl.prompt();
      });
      break;
    case '3':
      rl.close();
      break;
    default:
      console.log('❌ Unknown Command');
  }
});

rl.prompt();

// ---
// ✅ Replaces previous CLI mocks with live HTTP API calls to Ronin server
// ✅ Fully working CLI flow for BBS post and Backup Sync trigger
// ✅ Next step: Automate node monitoring + mesh-wide health reporting
