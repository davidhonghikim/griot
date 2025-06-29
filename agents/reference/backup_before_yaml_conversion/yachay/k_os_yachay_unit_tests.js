// kOS Yachay Unit Tests (Jest Framework)
// Node Class: Yachay (Memory Starseed)

import fs from 'fs';
import path from 'path';
import { validateDocs } from './validate-docs.js';
import { generateManifest } from './generate-manifest.js';
import { pruneArchives } from './prune-archives.js';
import { exportForDb } from './export-for-db.js';

describe('Yachay - Validation System', () => {
  test('validateDocs runs without throwing', () => {
    expect(() => validateDocs('./agents')).not.toThrow();
  });
});

describe('Yachay - Manifest Generator', () => {
  const outputFile = './test_output_manifest.json';

  afterAll(() => {
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  });

  test('generateManifest creates a file', () => {
    generateManifest('./agents', outputFile);
    expect(fs.existsSync(outputFile)).toBe(true);
  });
});

describe('Yachay - Pruning System', () => {
  const tempDir = './test_temp_prune';
  const oldFile = path.join(tempDir, 'old.txt');

  beforeAll(() => {
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(oldFile, 'test');
    fs.utimesSync(oldFile, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
  });

  test('pruneArchives deletes old files', () => {
    pruneArchives(tempDir, 30);
    expect(fs.existsSync(oldFile)).toBe(false);
  });
});

describe('Yachay - Export System', () => {
  const outputFile = './test_export.jsonl';

  afterAll(() => {
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  });

  test('exportForDb creates export file', () => {
    exportForDb('./agents', outputFile);
    expect(fs.existsSync(outputFile)).toBe(true);
  });
});

// ---
// ✅ Covers: Validation, Manifest, Pruning, Export
// ✅ Uses Jest syntax (npm install jest --save-dev)
// ✅ Next optional step: API endpoint tests for Yachay REST server
