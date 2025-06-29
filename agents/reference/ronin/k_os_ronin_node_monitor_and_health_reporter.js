// kOS Ronin Node Monitoring and Mesh Health Reporter
// Node Class: Ronin (Nomadic Starseed)

import axios from 'axios';

class RoninNodeMonitor {
  constructor(nodes, checkInterval = 300000) { // Default: every 5 minutes
    this.nodes = nodes;
    this.checkInterval = checkInterval;
  }

  async checkNode(node) {
    try {
      const res = await axios.post(`http://${node}/api/ronin/metrics`, { metrics: {} });
      console.log(`✅ Node ${node} online. Metrics response:`, res.data);
    } catch (err) {
      console.warn(`❌ Node ${node} unreachable:`, err.message);
    }
  }

  async runHealthCheck() {
    console.log('🔎 Running Ronin Mesh Health Check...');
    await Promise.all(this.nodes.map((node) => this.checkNode(node)));
    console.log('✅ Health check cycle complete.\n');
  }

  startMonitoring() {
    console.log(`📡 Starting Node Health Monitoring every ${this.checkInterval / 1000} seconds`);
    this.runHealthCheck();
    setInterval(() => this.runHealthCheck(), this.checkInterval);
  }
}

// --- Usage Example ---
const monitoredNodes = ['localhost:4000', 'node2.local:4000'];
const monitor = new RoninNodeMonitor(monitoredNodes, 120000);  // Every 2 minutes
monitor.startMonitoring();

// ---
// ✅ This runs periodic health checks against all known nodes
// ✅ Uses the Ronin /metrics API for lightweight liveness pings
// ✅ Next optional step: Build mesh-wide event logger and historical trend grapher
