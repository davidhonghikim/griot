// kOS Yachay Mesh-Wide Query Broadcaster and Reply Aggregator
// Node Class: Yachay (Memory Starseed)

export class YachayMeshBroadcaster {
  constructor(transportAdapter, targets) {
    this.adapter = transportAdapter;
    this.targets = targets; // List of node endpoints (host:port or Reticulum/Meshtastic node IDs)
  }

  async broadcast(apiPath, payload) {
    const responses = [];
    for (const target of this.targets) {
      try {
        const response = await this.adapter.send(target, apiPath, payload);
        responses.push({ target, status: 'success', data: response });
      } catch (err) {
        console.warn(`❌ Failed broadcast to ${target}: ${err.message}`);
        responses.push({ target, status: 'error', error: err.message });
      }
    }
    return responses;
  }

  async aggregateResults(responses, mode = 'first-success') {
    switch (mode) {
      case 'first-success':
        return responses.find(r => r.status === 'success') || { status: 'no-success' };
      case 'all-successes':
        return responses.filter(r => r.status === 'success');
      case 'majority-success':
        const successCount = responses.filter(r => r.status === 'success').length;
        return successCount > responses.length / 2 ? { status: 'majority-success' } : { status: 'majority-failure' };
      default:
        return responses;
    }
  }
}

// Usage Example:
// const broadcaster = new YachayMeshBroadcaster(adapter, ['node1.local:3000', 'node2.local:3000']);
// const responses = await broadcaster.broadcast('/api/yachay/validate', {});
// const result = await broadcaster.aggregateResults(responses, 'first-success');

// ---
// ✅ Supports broadcast to multiple Yachay nodes over any transport
// ✅ Aggregates replies by mode: first-success, all-successes, or majority-success
// ✅ Next Optional Step: Build mesh health monitor and transport link quality scorer
