// kOS Ronin Mesh Alerting and Health Report Scheduler
// Node Class: Ronin (Nomadic Starseed)

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { generateTrendGraph } from './K Os Ronin Mesh Event Logger And Trend Grapher.js';

const LOG_FILE = path.join('./logs', 'mesh_health.log');
const ALERT_THRESHOLD = 3;  // Max allowed consecutive offline checks

class MeshAlertManager {
  constructor(nodes, emailConfig) {
    this.nodes = nodes;
    this.emailConfig = emailConfig;
    this.offlineCounts = {};
    nodes.forEach(node => { this.offlineCounts[node] = 0; });
  }

  async checkForAlerts() {
    const logContent = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(l => l);
    this.nodes.forEach(node => {
      const nodeLogs = logContent.filter(l => l.includes(`Node: ${node}`)).slice(-ALERT_THRESHOLD);
      const offlineCount = nodeLogs.filter(l => l.includes('Status: offline')).length;
      if (offlineCount >= ALERT_THRESHOLD) {
        this.sendAlert(node, offlineCount);
      }
    });
  }

  async sendAlert(node, count) {
    const transporter = nodemailer.createTransport(this.emailConfig);
    const message = {
      from: this.emailConfig.auth.user,
      to: this.emailConfig.alertRecipient,
      subject: `⚠️ Ronin Mesh Alert: Node ${node} Offline`,
      text: `Node ${node} has been offline for ${count} consecutive checks.`
    };
    await transporter.sendMail(message);
    console.log(`🚨 Alert email sent for node ${node}`);
  }
}

async function scheduledTrendReport(outputFile) {
  await generateTrendGraph(outputFile);
  console.log('📈 Mesh Health Trend Report Generated:', outputFile);
}

// --- Usage Example ---
(async () => {
  const nodes = ['localhost:4000', 'node2.local:4000'];
  const emailConfig = {
    service: 'gmail',
    auth: { user: 'your_email@gmail.com', pass: 'your_app_password' },
    alertRecipient: 'admin@example.com'
  };

  const alertManager = new MeshAlertManager(nodes, emailConfig);
  await alertManager.checkForAlerts();
  await scheduledTrendReport('./logs/mesh_health_report.png');
})();

// ---
// ✅ Monitors log for downtime threshold breaches
// ✅ Sends email alerts when nodes stay offline
// ✅ Generates scheduled health trend graphs for mesh health reporting
// ✅ Next optional step: Full Ronin monitoring dashboard or web UI
