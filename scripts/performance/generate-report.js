#!/usr/bin/env node
/**
 * generate-report.js
 * Generate performance reports from collected metrics
 * 
 * Usage:
 *   node scripts/performance/generate-report.js <REPORT_TYPE> [DATE_RANGE]
 * 
 * Report types: weekly, monthly, quarterly, agent, category
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to load JSON file
function loadJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error parsing JSON file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Helper function to save markdown file
function saveMarkdownFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error saving markdown file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Generate agent performance summary
function generateAgentReport(performanceData) {
  const agents = Object.keys(performanceData.agents);
  
  let report = `# Agent Performance Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Total Sessions**: ${performanceData.metadata.total_sessions}\n\n`;
  
  report += `## Agent Rankings\n\n`;
  report += `| Rank | Agent | Sessions | Success Rate | Avg Quality | Avg Duration |\n`;
  report += `|------|-------|----------|--------------|-------------|--------------|\n`;
  
  // Sort agents by success rate
  const sortedAgents = agents
    .map(agent => ({
      name: agent,
      ...performanceData.agents[agent]
    }))
    .sort((a, b) => b.success_rate - a.success_rate);
  
  sortedAgents.forEach((agent, index) => {
    report += `| ${index + 1} | ${agent.name} | ${agent.total_sessions} | ${(agent.success_rate * 100).toFixed(1)}% | ${agent.average_quality.toFixed(1)} | ${agent.average_duration.toFixed(0)}m |\n`;
  });
  
  report += `\n## Task Category Performance\n\n`;
  report += `| Category | Sessions | Success Rate | Avg Quality | Avg Duration |\n`;
  report += `|----------|----------|--------------|-------------|--------------|\n`;
  
  Object.entries(performanceData.task_categories).forEach(([category, stats]) => {
    report += `| ${category} | ${stats.total_sessions} | ${(stats.success_rate * 100).toFixed(1)}% | ${stats.average_quality.toFixed(1)} | ${stats.average_duration.toFixed(0)}m |\n`;
  });
  
  return report;
}

// Generate task category analysis
function generateCategoryReport(performanceData) {
  let report = `# Task Category Analysis Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n\n`;
  
  Object.entries(performanceData.task_categories).forEach(([category, stats]) => {
    report += `## ${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}\n\n`;
    report += `- **Total Sessions**: ${stats.total_sessions}\n`;
    report += `- **Success Rate**: ${(stats.success_rate * 100).toFixed(1)}%\n`;
    report += `- **Average Quality**: ${stats.average_quality.toFixed(1)}/10\n`;
    report += `- **Average Duration**: ${stats.average_duration.toFixed(0)} minutes\n\n`;
    
    // Find best agent for this category
    const categorySessions = performanceData.sessions.filter(s => s.task_category === category);
    if (categorySessions.length > 0) {
      const agentStats = {};
      categorySessions.forEach(session => {
        if (!agentStats[session.agent_id]) {
          agentStats[session.agent_id] = { sessions: 0, quality: 0, success: 0 };
        }
        agentStats[session.agent_id].sessions++;
        agentStats[session.agent_id].quality += session.quality_score;
        if (session.success_status === 'completed') {
          agentStats[session.agent_id].success++;
        }
      });
      
      const bestAgent = Object.entries(agentStats)
        .map(([agent, stats]) => ({
          agent,
          successRate: stats.success / stats.sessions,
          avgQuality: stats.quality / stats.sessions
        }))
        .sort((a, b) => b.successRate - a.successRate)[0];
      
      report += `**Best Agent**: ${bestAgent.agent} (${(bestAgent.successRate * 100).toFixed(1)}% success, ${bestAgent.avgQuality.toFixed(1)} avg quality)\n\n`;
    }
  });
  
  return report;
}

// Generate weekly report
function generateWeeklyReport(performanceData) {
  const now = new Date();
  const weekStart = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  const weeklySessions = performanceData.sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= weekStart;
  });
  
  let report = `# Weekly Performance Report\n\n`;
  report += `**Week**: ${weekStart.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}\n`;
  report += `**Generated**: ${now.toISOString()}\n\n`;
  
  report += `## Weekly Summary\n\n`;
  report += `- **Total Sessions**: ${weeklySessions.length}\n`;
  report += `- **Active Agents**: ${new Set(weeklySessions.map(s => s.agent_id)).size}\n`;
  report += `- **Task Categories**: ${new Set(weeklySessions.map(s => s.task_category)).size}\n\n`;
  
  // Agent performance for the week
  const agentStats = {};
  weeklySessions.forEach(session => {
    if (!agentStats[session.agent_id]) {
      agentStats[session.agent_id] = { sessions: 0, quality: 0, success: 0 };
    }
    agentStats[session.agent_id].sessions++;
    agentStats[session.agent_id].quality += session.quality_score;
    if (session.success_status === 'completed') {
      agentStats[session.agent_id].success++;
    }
  });
  
  report += `## Weekly Agent Performance\n\n`;
  report += `| Agent | Sessions | Success Rate | Avg Quality |\n`;
  report += `|-------|----------|--------------|-------------|\n`;
  
  Object.entries(agentStats)
    .sort((a, b) => b[1].success / b[1].sessions - a[1].success / a[1].sessions)
    .forEach(([agent, stats]) => {
      const successRate = stats.success / stats.sessions;
      const avgQuality = stats.quality / stats.sessions;
      report += `| ${agent} | ${stats.sessions} | ${(successRate * 100).toFixed(1)}% | ${avgQuality.toFixed(1)} |\n`;
    });
  
  return report;
}

// Main function to generate reports
function generateReport(reportType, dateRange) {
  const performancePath = path.join(__dirname, '../../agents/performance/metrics/current/agent_performance.json');
  const performanceData = loadJsonFile(performancePath);
  
  let report;
  let filename;
  
  switch (reportType) {
    case 'agent':
      report = generateAgentReport(performanceData);
      filename = `agent_performance_${new Date().toISOString().split('T')[0]}.md`;
      break;
    case 'category':
      report = generateCategoryReport(performanceData);
      filename = `category_analysis_${new Date().toISOString().split('T')[0]}.md`;
      break;
    case 'weekly':
      report = generateWeeklyReport(performanceData);
      filename = `weekly_report_${new Date().toISOString().split('T')[0]}.md`;
      break;
    default:
      console.error('Invalid report type. Use: agent, category, or weekly');
      process.exit(1);
  }
  
  const reportPath = path.join(__dirname, '../../agents/performance/reports', filename);
  saveMarkdownFile(reportPath, report);
  
  console.log(`Report generated: ${filename}`);
}

// Run the script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const reportType = args[0];
  const dateRange = args[1];
  
  if (!reportType) {
    console.error('Usage: node generate-report.js <REPORT_TYPE> [DATE_RANGE]');
    console.error('Report types: agent, category, weekly');
    process.exit(1);
  }
  
  generateReport(reportType, dateRange);
}

export { generateReport }; 