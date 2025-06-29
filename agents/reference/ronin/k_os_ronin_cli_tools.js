// kOS Ronin CLI Tools
// Node Class: Ronin (Nomadic Starseed)

import { runNodeDiscovery, runRoutingTrace } from './K Os Ronin Reticulum Api Server And Tools.js';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function showMenu() {
  console.log('\n🌌 Ronin Mesh CLI - Available Commands:');
  console.log('1. Node Discovery');
  console.log('2. Routing Trace');
  console.log('3. Post to BBS (Mock)');
  console.log('4. Trigger Sync Backup (Mock)');
  console.log('5. Exit');
}

async function handleCommand(cmd) {
  switch (cmd.trim()) {
    case '1':
      await runNodeDiscovery();
      break;
    case '2':
      rl.question('Enter target Node ID for trace: ', async (nodeId) => {
        await runRoutingTrace(nodeId);
        showMenu();
      });
      return;
    case '3':
      console.log('📝 Mock BBS Post - Replace with API Call');
      break;
    case '4':
      console.log('💾 Mock Sync Backup Trigger - Replace with API Call');
      break;
    case '5':
      rl.close();
      return;
    default:
      console.log('❌ Unknown Command');
  }
  showMenu();
}

rl.on('line', handleCommand);

console.log('✅ Ronin CLI Tools Loaded');
showMenu();

// ---
// ✅ Provides interactive CLI for Node Discovery, Routing Trace, and Mock BBS/Sync actions
// ✅ Easily expandable to support full Ronin API command set
// ✅ Next step: Replace mocks with real API calls to Ronin server
