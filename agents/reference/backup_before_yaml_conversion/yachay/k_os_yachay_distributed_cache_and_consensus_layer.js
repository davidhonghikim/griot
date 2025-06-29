// kOS Yachay Distributed Cache and Consensus Layer
// Node Class: Yachay (Memory Starseed)

export class YachayDistributedCache {
  constructor(adapter, nodes) {
    this.adapter = adapter;
    this.nodes = nodes;
    this.cacheStore = {};
  }

  async set(key, value) {
    this.cacheStore[key] = value;
    for (const node of this.nodes) {
      try {
        await this.adapter.send(node, '/api/yachay/cache/set', { key, value });
      } catch (err) {
        console.warn(`❌ Failed to propagate cache set to ${node}: ${err.message}`);
      }
    }
  }

  async get(key) {
    if (this.cacheStore[key] !== undefined) return this.cacheStore[key];
    for (const node of this.nodes) {
      try {
        const response = await this.adapter.send(node, '/api/yachay/cache/get', { key });
        if (response.value !== undefined) {
          this.cacheStore[key] = response.value;
          return response.value;
        }
      } catch (err) {
        console.warn(`❌ Failed cache get from ${node}: ${err.message}`);
      }
    }
    return null;
  }
}

export class YachayConsensusManager {
  constructor(adapter, nodes) {
    this.adapter = adapter;
    this.nodes = nodes;
  }

  async vote(topic, proposedValue) {
    const votes = [];
    for (const node of this.nodes) {
      try {
        const response = await this.adapter.send(node, '/api/yachay/consensus/vote', { topic, proposedValue });
        votes.push(response.vote);
      } catch (err) {
        console.warn(`❌ Vote request failed on ${node}: ${err.message}`);
      }
    }
    const yesVotes = votes.filter(v => v === 'yes').length;
    return yesVotes > this.nodes.length / 2 ? 'consensus-achieved' : 'consensus-failed';
  }
}

// Usage Example:
// const cache = new YachayDistributedCache(adapter, ['node1.local:3000', 'node2.local:3000']);
// await cache.set('active_plan', 'phase_3');
// const value = await cache.get('active_plan');

// const consensus = new YachayConsensusManager(adapter, ['node1.local:3000', 'node2.local:3000']);
// const result = await consensus.vote('deploy_update', 'version_1.2.3');

// ---
// ✅ Provides distributed key/value caching across Yachay mesh nodes
// ✅ Supports lightweight voting-based consensus for cluster-wide decisions
// ✅ Next Optional Step: Build load balancer and query auto-router for distributed load shaping
