// kOS Yachay - Reticulum and Meshtastic Interfaces
// Node Class: Yachay (Memory Starseed)

import { exec } from 'child_process';
import mqtt from 'mqtt';

export class ReticulumInterface {
  constructor() {
    this.pythonScriptPath = './scripts/reticulum_send.py'; // Example bridge script
  }

  async send(destination, message) {
    return new Promise((resolve, reject) => {
      exec(`python3 ${this.pythonScriptPath} ${destination} '${JSON.stringify(message)}'`, (error, stdout, stderr) => {
        if (error) return reject(stderr);
        resolve(stdout.trim());
      });
    });
  }
}

export class MeshtasticMQTTInterface {
  constructor(brokerUrl = 'mqtt://localhost:1883') {
    this.client = mqtt.connect(brokerUrl);
    this.client.on('connect', () => console.log('✅ Meshtastic MQTT connected'));
  }

  publish(topic, message) {
    this.client.publish(topic, JSON.stringify(message), {}, (err) => {
      if (err) console.error('❌ MQTT publish error:', err);
    });
  }

  subscribe(topic, callback) {
    this.client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`✅ Subscribed to ${topic}`);
        this.client.on('message', (receivedTopic, msg) => {
          if (receivedTopic === topic) callback(JSON.parse(msg.toString()));
        });
      } else {
        console.error('❌ MQTT subscription error:', err);
      }
    });
  }
}

// Usage Example (Reticulum):
// const reticulum = new ReticulumInterface();
// await reticulum.send('destination_node', { action: 'validate', payload: {} });

// Usage Example (Meshtastic):
// const mesh = new MeshtasticMQTTInterface('mqtt://broker.local');
// mesh.publish('yachay/command', { action: 'validate', payload: {} });

// ---
// ✅ Full Reticulum (via Python exec bridge) + Meshtastic (via MQTT) interfaces
// ✅ Next Optional Step: Build auto-detection and fallback transport selector
