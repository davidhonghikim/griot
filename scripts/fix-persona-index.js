#!/usr/bin/env node

/**
 * Fix Persona Index Script
 * 
 * Updates the index.json file to match the actual YAML filenames
 * by extracting the correct UUIDs from the filenames.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

async function fixPersonaIndex() {
  try {
    console.log('🔧 Fixing persona index...');
    
    const personasPath = path.join(process.cwd(), 'packages/data/personas/base');
    const indexPath = path.join(personasPath, 'index.json');
    
    // Read current index
    const indexData = await fs.readFile(indexPath, 'utf-8');
    const personas = JSON.parse(indexData);
    
    // Get all YAML files
    const files = await fs.readdir(personasPath);
    const yamlFiles = files.filter(file => file.endsWith('.yml'));
    
    console.log(`📁 Found ${yamlFiles.length} YAML files`);
    
    // Create a map of base names to filenames
    const fileMap = new Map();
    for (const file of yamlFiles) {
      const baseName = file.replace('.yml', '');
      const parts = baseName.split('-');
      if (parts.length >= 4) {
        const base = parts[0];
        fileMap.set(base, file);
      }
    }
    
    // Update personas with correct IDs
    const updatedPersonas = personas.map(persona => {
      const base = persona.base;
      const filename = fileMap.get(base);
      
      if (filename) {
        const newId = filename.replace('.yml', '');
        console.log(`🔄 Updating ${base}: ${persona.id} → ${newId}`);
        
        // Extract UUID from filename
        const uuidMatch = newId.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
        const newUuid = uuidMatch ? uuidMatch[0] : persona.uuid;
        
        return {
          ...persona,
          id: newId,
          uuid: newUuid
        };
      } else {
        console.warn(`⚠️ No file found for base: ${base}`);
        return persona;
      }
    });
    
    // Write updated index
    await fs.writeFile(indexPath, JSON.stringify(updatedPersonas, null, 2), 'utf-8');
    
    console.log(`✅ Updated index.json with ${updatedPersonas.length} personas`);
    
  } catch (error) {
    console.error('❌ Failed to fix persona index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === process.argv[1]) {
  fixPersonaIndex();
} 