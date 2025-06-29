// kOS Yachay Mesh Health Monitor and Link Quality Scorer
// Node Class: Yachay (Memory Starseed)

import { performance } from 'perf_hooks';

export class YachayMeshHealthMonitor {
  constructor(transportAdapter, nodes) {
    this.adapter = transportAdapter;
    this.nodes = nodes;
    this.healthStats = {};
  }

  async pingNode(node) {
    const start = performance.now();
    try {
      await this.adapter.send(node, '/api/yachay/healthcheck', {});
      const duration = performance.now() - start;
      this.healthStats[node] = { status: 'online', latencyMs: duration };
    } catch (err) {
      this.healthStats[node] = { status: 'offline', error: err.message };
    }
  }

  async checkAllNodes() {
    await Promise.all(this.nodes.map(node => this.pingNode(node)));
    console.log('✅ Mesh Health Snapshot:', this.healthStats);
    return this.healthStats;
  }

  getLinkScore(node) {
    const stat = this.healthStats[node];
    if (!stat) return 0;
    if (stat.status === 'offline') return 0;
    if (stat.latencyMs < 100) return 10;
    if (stat.latencyMs < 300) return 7;
    if (stat.latencyMs < 1000) return 4;
    return 1;
  }
}

// Usage Example:
// const monitor = new YachayMeshHealthMonitor(adapter, ['node1.local:3000', 'node2.local:3000']);
// await monitor.checkAllNodes();
// const score = monitor.getLinkScore('node1.local:3000');

// ---
// ✅ Monitors mesh node health
// ✅ Measures latency and link quality
// ✅ Outputs link scores for intelligent query routing
// ✅ Next Optional Step: Build distributed caching / consensus layer for Yachay
