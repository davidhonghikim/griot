// kOS Ronin Mesh Event Database (MongoDB-based)
// Node Class: Ronin (Nomadic Starseed)

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const mongoUri = 'mongodb://localhost:27017';
const dbName = 'ronin_mesh';
const collectionName = 'mesh_events';

async function importLogToDatabase() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const logFile = path.join('./logs', 'mesh_health.log');
  const rawLog = fs.readFileSync(logFile, 'utf8').split('\n').filter(l => l);

  const entries = rawLog.map(line => {
    const [timestampPart, nodePart, statusPart, latencyPart] = line.split('|').map(s => s.trim());
    return {
      timestamp: new Date(timestampPart),
      node: nodePart.replace('Node: ', ''),
      status: statusPart.replace('Status: ', ''),
      latencyMs: latencyPart ? parseInt(latencyPart.replace('Latency: ', '').replace('ms', '')) : null
    };
  });

  await collection.insertMany(entries);
  console.log(`✅ Imported ${entries.length} mesh events into MongoDB.`);
  await client.close();
}

async function queryHistoricalEvents(node, status) {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const results = await collection.find({ node, status }).toArray();
  console.log(`📊 Historical Events for node '${node}' with status '${status}':`, results);
  await client.close();
}

// --- Usage Example ---
(async () => {
  await importLogToDatabase();
  await queryHistoricalEvents('localhost:4000', 'offline');
})();

// ---
// ✅ Imports existing log file into MongoDB
// ✅ Supports historical event querying
// ✅ Next optional step: Build frontend timeline + filter UI for querying MongoDB
