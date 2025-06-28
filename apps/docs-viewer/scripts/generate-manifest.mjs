import fs from 'fs';
import path from 'path';

const docsPath = path.resolve(process.cwd(), '../ai-q');
const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');

function extractTitleFromMarkdown(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for frontmatter
    if (content.startsWith('---')) {
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd !== -1) {
        const frontmatter = content.slice(3, frontmatterEnd);
        const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)["']?/m);
        if (titleMatch) {
          return titleMatch[1].trim();
        }
      }
    }
    
    // Fallback to first H1 header
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      let title = h1Match[1].trim();
      
      // Clean up titles that start with numbers and colons
      // "08: System Dynamics & The Great Game" -> "System Dynamics & The Great Game"
      title = title.replace(/^\d+:\s*/, '');
      
      return title;
    }
    
    // Final fallback to filename
    const filename = path.basename(filePath, '.md');
    return filename.replace(/_/g, ' ').replace(/^\d+_/, '');
  } catch (error) {
    const filename = path.basename(filePath, '.md');
    return filename.replace(/_/g, ' ').replace(/^\d+_/, '');
  }
}

function formatSectionName(dirName) {
  // Map directory names to nice section names
  const sectionMap = {
    '01_foundation': 'Foundation',
    '02_protocols': 'Protocols', 
    '03_node_specifications': 'Node Specifications',
    '04_architecture': 'Architecture',
    '05_handoff': 'Agent Handoff',
    '06_quality': 'Quality Standards',
    '07_development': 'Development'
  };
  
  return sectionMap[dirName] || dirName.replace(/_/g, ' ').replace(/^\d+_/, '');
}

function getNodeOrder(title) {
  // Extract the filename number from the title or path
  // Files are named like 01_Griot, 03_Tohunga, 04_Ronin, etc.
  const nodeNumbers = {
    'Griot': 1,
    'Tohunga': 3,
    'Ronin': 4,
    'Musa': 5,
    'Hakim': 6,
    'Skald': 7,
    'Oracle': 8,
    'Junzi': 9,
    'Yachay': 10,
    'Sachem': 11,
    'Archon': 12,
    'Amauta': 13,
    'Mzee': 14
  };
  
  for (const [nodeType, number] of Object.entries(nodeNumbers)) {
    if (title.includes(nodeType)) {
      return number;
    }
  }
  return 999; // Default for non-node items
}

function generateManifest(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const items = {};

  dirents.forEach(dirent => {
    if (dirent.name.startsWith('.')) return;
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      const sectionName = formatSectionName(dirent.name);
      items[sectionName] = generateManifest(fullPath);
    } else if (dirent.name.endsWith('.md')) {
      const title = extractTitleFromMarkdown(fullPath);
      const relativePath = path.relative(path.resolve(process.cwd(), '..'), fullPath);
      items[title] = relativePath;
    }
  });

  return items;
}

function sortManifest(manifest) {
  const sorted = {};
  
  // First add the main AI-Q index if it exists
  Object.entries(manifest).forEach(([key, value]) => {
    if (typeof value === 'string' && key.includes('AI-Q') && key.includes('Knowledge Library')) {
      sorted[key] = value;
    }
  });
  
  // Sort main sections in logical order
  const sectionOrder = ['Foundation', 'Protocols', 'Node Specifications', 'Architecture', 'Agent Handoff', 'Quality Standards', 'Development'];
  
  // Then add sections in order
  sectionOrder.forEach(sectionName => {
    if (manifest[sectionName]) {
      if (typeof manifest[sectionName] === 'object') {
        // For Node Specifications, sort by node order
        if (sectionName === 'Node Specifications') {
          const sortedNodes = {};
          Object.entries(manifest[sectionName])
            .sort(([titleA], [titleB]) => {
              const orderA = getNodeOrder(titleA);
              const orderB = getNodeOrder(titleB);
              if (orderA !== orderB) return orderA - orderB;
              return titleA.localeCompare(titleB);
            })
            .forEach(([key, value]) => {
              sortedNodes[key] = value;
            });
          sorted[sectionName] = sortedNodes;
        } else {
          // For other sections, sort alphabetically
          const sortedSection = {};
          Object.entries(manifest[sectionName])
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .forEach(([key, value]) => {
              sortedSection[key] = value;
            });
          sorted[sectionName] = sortedSection;
        }
      } else {
        sorted[sectionName] = manifest[sectionName];
      }
    }
  });
  
  // Add any remaining items (except the main index which we already added)
  Object.entries(manifest).forEach(([key, value]) => {
    if (!sorted[key]) {
      sorted[key] = value;
    }
  });
  
  return sorted;
}

const manifest = generateManifest(docsPath);
const sortedManifest = sortManifest(manifest);
fs.writeFileSync(manifestPath, JSON.stringify(sortedManifest, null, 2));

console.log('✅ Manifest generated at public/manifest.json'); 