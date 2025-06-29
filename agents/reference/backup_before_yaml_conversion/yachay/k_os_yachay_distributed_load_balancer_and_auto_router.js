// kOS Yachay Distributed Load Balancer and Query Auto-Router
// Node Class: Yachay (Memory Starseed)

export class YachayLoadBalancer {
  constructor(adapter, healthMonitor, nodes) {
    this.adapter = adapter;
    this.healthMonitor = healthMonitor;
    this.nodes = nodes;
    this.roundRobinIndex = 0;
  }

  selectNode(strategy = 'round-robin') {
    const healthyNodes = this.nodes.filter(node => this.healthMonitor.getLinkScore(node) > 0);
    if (healthyNodes.length === 0) throw new Error('❌ No healthy nodes available for routing');

    switch (strategy) {
      case 'round-robin':
        const node = healthyNodes[this.roundRobinIndex % healthyNodes.length];
        this.roundRobinIndex++;
        return node;
      case 'lowest-latency':
        return healthyNodes.sort((a, b) => this.healthMonitor.healthStats[a].latencyMs - this.healthMonitor.healthStats[b].latencyMs)[0];
      case 'random':
        return healthyNodes[Math.floor(Math.random() * healthyNodes.length)];
      default:
        return healthyNodes[0];
    }
  }

  async routeQuery(apiPath, payload, strategy = 'round-robin') {
    const targetNode = this.selectNode(strategy);
    return await this.adapter.send(targetNode, apiPath, payload);
  }
}

// Usage Example:
// const lb = new YachayLoadBalancer(adapter, healthMonitor, ['node1.local:3000', 'node2.local:3000']);
// const response = await lb.routeQuery('/api/yachay/validate', {}, 'lowest-latency');

// ---
// ✅ Supports round-robin, lowest-latency, and random load balancing
// ✅ Integrates with Mesh Health Monitor for live node scoring
// ✅ Next Optional Step: Build mesh-wide orchestration layer for rolling updates and leader election
