#!/usr/bin/env node
/**
 * collect-metrics.js
 * Collect session metrics and update performance database
 * 
 * Usage:
 *   node scripts/performance/collect-metrics.js <AGENT_NAME> <SESSION_ID> <TASK_CATEGORY> <START_TIME> <END_TIME> <SUCCESS_STATUS> <QUALITY_SCORE>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to calculate duration in minutes
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / (1000 * 60)); // Convert to minutes
}

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

// Helper function to save JSON file
function saveJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving JSON file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Main function to collect metrics
function collectMetrics(args) {
  const [agentName, sessionId, taskCategory, startTime, endTime, successStatus, qualityScore] = args;
  
  // Validate required arguments
  if (!agentName || !sessionId || !taskCategory || !startTime || !endTime || !successStatus || !qualityScore) {
    console.error('Usage: node collect-metrics.js <AGENT_NAME> <SESSION_ID> <TASK_CATEGORY> <START_TIME> <END_TIME> <SUCCESS_STATUS> <QUALITY_SCORE>');
    process.exit(1);
  }

  // Calculate duration
  const durationMinutes = calculateDuration(startTime, endTime);
  
  // Load current performance data
  const performancePath = path.join(__dirname, '../../agents/performance/metrics/current/agent_performance.json');
  const performanceData = loadJsonFile(performancePath);
  
  // Create new session entry
  const sessionEntry = {
    agent_id: agentName,
    session_id: sessionId,
    task_category: taskCategory,
    start_time: startTime,
    end_time: endTime,
    duration_minutes: durationMinutes,
    success_status: successStatus,
    quality_score: parseFloat(qualityScore),
    timestamp: new Date().toISOString()
  };
  
  // Add session to performance data
  performanceData.sessions.push(sessionEntry);
  performanceData.metadata.total_sessions = performanceData.sessions.length;
  performanceData.metadata.last_updated = new Date().toISOString();
  
  // Update agent statistics
  if (!performanceData.agents[agentName]) {
    performanceData.agents[agentName] = {
      total_sessions: 0,
      success_rate: 0.0,
      average_quality: 0.0,
      average_duration: 0.0,
      task_categories: {}
    };
  }
  
  const agent = performanceData.agents[agentName];
  agent.total_sessions++;
  
  // Calculate agent success rate
  const agentSessions = performanceData.sessions.filter(s => s.agent_id === agentName);
  const successfulSessions = agentSessions.filter(s => s.success_status === 'completed');
  agent.success_rate = successfulSessions.length / agentSessions.length;
  
  // Calculate agent average quality
  const totalQuality = agentSessions.reduce((sum, s) => sum + s.quality_score, 0);
  agent.average_quality = totalQuality / agentSessions.length;
  
  // Calculate agent average duration
  const totalDuration = agentSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  agent.average_duration = totalDuration / agentSessions.length;
  
  // Update task category statistics
  if (!performanceData.task_categories[taskCategory]) {
    performanceData.task_categories[taskCategory] = {
      total_sessions: 0,
      success_rate: 0.0,
      average_quality: 0.0,
      average_duration: 0.0
    };
  }
  
  const category = performanceData.task_categories[taskCategory];
  category.total_sessions++;
  
  // Calculate category success rate
  const categorySessions = performanceData.sessions.filter(s => s.task_category === taskCategory);
  const successfulCategorySessions = categorySessions.filter(s => s.success_status === 'completed');
  category.success_rate = successfulCategorySessions.length / categorySessions.length;
  
  // Calculate category average quality
  const totalCategoryQuality = categorySessions.reduce((sum, s) => sum + s.quality_score, 0);
  category.average_quality = totalCategoryQuality / categorySessions.length;
  
  // Calculate category average duration
  const totalCategoryDuration = categorySessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  category.average_duration = totalCategoryDuration / categorySessions.length;
  
  // Save updated performance data
  saveJsonFile(performancePath, performanceData);
  
  console.log(`Metrics collected for ${agentName} session ${sessionId}`);
  console.log(`Duration: ${durationMinutes} minutes, Quality: ${qualityScore}, Status: ${successStatus}`);
}

// Run the script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  collectMetrics(args);
}

export { collectMetrics }; 