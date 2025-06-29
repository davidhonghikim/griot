// kOS Yachay CI/CD Validation + Pruning Workflow
// Node Class: Yachay (Memory Starseed)

import { validateDocs } from './validate-docs.js';
import { generateManifest } from './generate-manifest.js';
import { pruneArchives } from './prune-archives.js';
import { exportForDb } from './export-for-db.js';
import path from 'path';

function runValidationWorkflow() {
  console.log('✅ Running Yachay Validation Workflow...');
  validateDocs('./agents');
  generateManifest('./agents', './agents/system_manifest.json');
  console.log('✅ Validation and Manifest Generation Complete.');
}

function runPruningWorkflow() {
  console.log('🧹 Running Yachay Pruning Workflow...');
  const pruneTargets = [
    './agents/changelog/archive/',
    './agents/performance/metrics/',
    './agents/handoff/archive/',
    './agents/implementation-plans/archive/'
  ];
  pruneTargets.forEach(dir => {
    pruneArchives(dir, 60); // Prune older than 60 days
  });
  console.log('🧹 Pruning Complete.');
}

function runExportWorkflow() {
  console.log('📦 Running Yachay Export Workflow for DB Migration...');
  exportForDb('./agents', './db_exports/agents_export.jsonl');
  console.log('📦 Export Complete.');
}

// Main CI/CD Entry Point
function main() {
  runValidationWorkflow();
  runPruningWorkflow();
  runExportWorkflow();
  console.log('✅✅✅ Yachay CI/CD Workflow Complete ✅✅✅');
}

main();

// ---
// This file acts as a single CI/CD pipeline runner for Yachay (kOS Memory Starseed)
// Can be triggered manually, via cron, or by Git pre-commit/pre-push hooks.
// Next step: Optional - create a Git hook installer script or add npm scripts for automation.
