#!/usr/bin/env node
/**
 * kos-log.js
 * CLI helper for writing a new entry to the kOS changelog.
 *
 * Usage:
 *   node scripts/kos-log.js <EVENT_TYPE> "<message>" ["<mission>"]
 *
 * EVENT_TYPE must be one of CHANGE, FIX, ERROR, DECISION, SPEC_UPDATE
 */

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------
// Helper: very small YAML "parser" (key: value pairs only)
// ------------------------------------------------------------
function loadYaml(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const obj = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    obj[key] = value;
  }
  return obj;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function utcTimestamp() {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`
  );
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
const ALLOWED = ['CHANGE', 'FIX', 'ERROR', 'DECISION', 'SPEC_UPDATE'];

function fatal(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const [, , eventTypeRaw, message, missionRaw] = process.argv;
if (!eventTypeRaw || !message) {
  fatal('Usage: kos-log.js <EVENT_TYPE> "<message>" ["<mission>"]');
}

const eventType = eventTypeRaw.toUpperCase();
if (!ALLOWED.includes(eventType)) {
  fatal(`Invalid EVENT_TYPE \"${eventType}\". Must be one of ${ALLOWED.join(', ')}`);
}

// Resolve repository root (scripts/ is always in repoRoot/scripts)
const repoRoot = path.resolve(__dirname, '..');
const configPath = path.join(repoRoot, 'agents', 'config.yml');
const cfg = loadYaml(configPath);

// Determine agent identifier
const agent = process.env.AGENT_NAME || cfg.default_agent || 'Unknown-Agent';

// Determine changelog path
let changelogPath = cfg.default_changelog || 'agents/01_AGENT_CHANGELOG_LATEST.md';
if (!path.isAbsolute(changelogPath)) {
  changelogPath = path.join(repoRoot, changelogPath);
}

const timestamp = utcTimestamp();
const mission = missionRaw || process.env.MISSION || '';

// Build entry from template
const header = `## ${timestamp} – ${agent}${mission ? ' (MISSION: ' + mission + ')' : ''}`;
const bullet = `* ${eventType}: ${message}`;
const entry = `${header}\n${bullet}\n\n`;

// Ensure changelog exists
if (!fs.existsSync(changelogPath)) {
  fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
  fs.writeFileSync(
    changelogPath,
    '# kOS Agent Changelog – Current Quarter\n\n',
    'utf8'
  );
}

// Prepend entry
const existing = fs.readFileSync(changelogPath, 'utf8');
fs.writeFileSync(changelogPath, entry + existing, 'utf8');

console.log(`Logged to ${path.relative(repoRoot, changelogPath)} → ${eventType}: ${message}`);
