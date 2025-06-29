// kOS Yachay Documentation System JSON Schemas and Node.js Scripts
// Node Class: Yachay (Memory Starseed) - The hippocampus of kOS, responsible for long-term memory consolidation and knowledge management.

// --- JSON Schemas ---

// 1. changelog-schema.json
export const changelogSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Changelog Schema",
  "type": "object",
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "author": { "type": "string" },
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "summary": { "type": "string" },
          "details": { "type": "string" },
          "files_modified": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["type", "summary", "details"]
      }
    }
  },
  "required": ["timestamp", "author", "entries"]
};

// 2. handoff-schema.json
export const handoffSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Handoff Schema",
  "type": "object",
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "from_agent": { "type": "string" },
    "directive": { "type": "string" },
    "next_steps": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["timestamp", "from_agent", "directive", "next_steps"]
};

// 3. performance-schema.json
export const performanceSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Performance Metrics Schema",
  "type": "object",
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "metrics": {
      "type": "object",
      "patternProperties": {
        ".*": { "type": "number" }
      }
    }
  },
  "required": ["timestamp", "metrics"]
};

// --- Node.js Scripts (Partial Skeletons) ---

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Ajv from 'ajv';
const ajv = new Ajv();

// validate-docs.js
export function validateDocs(directory) {
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(fullPath));
      let schema;
      if (file.includes('changelog')) schema = changelogSchema;
      else if (file.includes('performance')) schema = performanceSchema;
      else return;
      const validate = ajv.compile(schema);
      if (!validate(data)) console.error(`Validation error in ${file}`, validate.errors);
    }
    if (file.endsWith('.md')) {
      const md = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(md);
      if (!data.doc_type) console.warn(`Missing frontmatter doc_type in ${file}`);
    }
  });
}

// generate-manifest.js
export function generateManifest(rootDir, outputFile) {
  let manifest = [];
  const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) return walk(fullPath);
      manifest.push({
        path: fullPath.replace(rootDir, ''),
        size: stats.size,
        modified: stats.mtime
      });
    });
  };
  walk(rootDir);
  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
}

// prune-archives.js
export function pruneArchives(targetDir, retentionDays = 30) {
  const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(targetDir);
  files.forEach(file => {
    const fullPath = path.join(targetDir, file);
    const stats = fs.statSync(fullPath);
    if (stats.mtime.getTime() < cutoff) {
      console.log(`Pruning: ${file}`);
      fs.unlinkSync(fullPath);
    }
  });
}

// export-for-db.js
export function exportForDb(targetDir, outputFile) {
  let allData = [];
  const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (file.endsWith('.json') || file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        allData.push({ path: fullPath, content });
      }
    });
  };
  walk(targetDir);
  fs.writeFileSync(outputFile, allData.map(x => JSON.stringify(x)).join('\n'));
}

// Usage Examples (from command line or node script):
// validateDocs('./agents');
// generateManifest('./agents', './agents/system_manifest.json');
// pruneArchives('./agents/changelog/archive/2025/06/', 60);
// exportForDb('./agents', './db_exports/agents_export.jsonl');

// ---
// This starter file for Yachay (kOS Memory Starseed) provides partial implementations. Each function can be expanded with better error handling, logging, CLI args support, and future database integration for long-term knowledge management.
// Recommend using packages like yargs or commander for CLI arg parsing in production.
