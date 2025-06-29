// kOS Yachay Transport Auto-Detection and Fallback Layer
// Node Class: Yachay (Memory Starseed)

import net from 'net';
import { exec } from 'child_process';

export class YachayTransportAutoSelector {
  constructor() {
    this.availableTransports = [];
  }

  async detectTransports() {
    await Promise.all([
      this.checkHttpAvailability(),
      this.checkReticulumAvailability(),
      this.checkMeshtasticAvailability()
    ]);
    console.log(`✅ Available Transports: ${this.availableTransports.join(', ')}`);
  }

  async checkHttpAvailability() {
    return new Promise((resolve) => {
      const socket = net.createConnection(3000, 'localhost');
      socket.on('connect', () => {
        this.availableTransports.push('http');
        socket.end();
        resolve();
      });
      socket.on('error', resolve);
    });
  }

  async checkReticulumAvailability() {
    return new Promise((resolve) => {
      exec('pgrep reticulum', (error, stdout) => {
        if (stdout.trim()) this.availableTransports.push('reticulum');
        resolve();
      });
    });
  }

  async checkMeshtasticAvailability() {
    return new Promise((resolve) => {
      exec('pgrep mosquitto', (error, stdout) => {
        if (stdout.trim()) this.availableTransports.push('meshtastic');
        resolve();
      });
    });
  }

  getBestTransport(preferredOrder = ['http', 'reticulum', 'meshtastic']) {
    for (const transport of preferredOrder) {
      if (this.availableTransports.includes(transport)) return transport;
    }
    throw new Error('❌ No available transport found');
  }
}

// Usage Example:
// const selector = new YachayTransportAutoSelector();
// await selector.detectTransports();
// const best = selector.getBestTransport();
// console.log(`Using: ${best}`);

// ---
// ✅ This module auto-detects available transport layers (HTTP, Reticulum, Meshtastic)
// ✅ Selects best transport based on preferred priority order
// ✅ Next Optional Step: Build mesh-wide query broadcaster with reply aggregation
