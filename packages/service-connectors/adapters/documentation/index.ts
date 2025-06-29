/**
 * Documentation Adapters Index
 * 
 * Exports all documentation-related adapters with proper tagging and metadata
 * for easy discovery and integration.
 */

// Core types and interfaces
export * from './types';

// Individual adapters
export * from './documentation-registry';
export * from './document-search';
export * from './document-template-engine';
export * from './document-validator';

// Generic adapter for node classes
export * from './generic-documentation-adapter';

// Adapter metadata and tags
export const DOCUMENTATION_ADAPTERS = {
  // Core types
  types: {
    file: './types',
    description: 'Documentation system type definitions',
    tags: ['types', 'interfaces', 'documentation'],
    dependencies: []
  },
  // Core documentation components
  registry: {
    file: './DocumentationRegistry',
    description: 'Document registry for managing document lifecycle',
    tags: ['registry', 'documents', 'management', 'lifecycle'],
    dependencies: ['./types']
  },
  search: {
    file: './DocumentSearch',
    description: 'Semantic document search and indexing',
    tags: ['search', 'semantic', 'indexing', 'documents'],
    dependencies: ['./types']
  },
  templateEngine: {
    file: './DocumentTemplateEngine',
    description: 'Document template generation and processing',
    tags: ['templates', 'generation', 'documents', 'processing'],
    dependencies: ['./types']
  },
  validator: {
    file: './DocumentValidator',
    description: 'Document validation and duplicate detection',
    tags: ['validation', 'duplicates', 'documents', 'quality'],
    dependencies: ['./types']
  },
  genericAdapter: {
    file: './GenericDocumentationAdapter',
    description: 'Generic documentation adapter for node classes',
    tags: ['adapter', 'generic', 'node', 'orchestration', 'documents'],
    dependencies: ['./types', './DocumentationRegistry', './DocumentSearch', './DocumentTemplateEngine', './DocumentValidator']
  }
} as const;

// Quick access functions
export const getDocumentationAdapter = (name: string) => {
  return Object.entries(DOCUMENTATION_ADAPTERS).find(([key]) => key === name)?.[1];
};

export const getDocumentationAdaptersByTag = (tag: string) => {
  return Object.entries(DOCUMENTATION_ADAPTERS)
    .filter(([, adapter]) => adapter.tags.includes(tag))
    .map(([key, adapter]) => ({ key, ...adapter }));
};

export const getAllDocumentationTags = () => {
  const allTags = Object.values(DOCUMENTATION_ADAPTERS).flatMap(adapter => adapter.tags);
  return [...new Set(allTags)];
};

// Usage examples
export const DOCUMENTATION_USAGE_EXAMPLES = {
  registry: `
// Initialize document registry
const registry = new DocumentationRegistry({
  storagePath: './documents',
  enableVersioning: true
});

// Create a new document
const docId = await registry.createDocument({
  title: 'API Documentation',
  content: 'Documentation content...',
  type: 'api_doc',
  tags: ['api', 'documentation']
});
  `,
  
  search: `
// Initialize document search
const search = new DocumentSearch({
  indexPath: './search_index',
  enableSemanticSearch: true
});

// Index a document
await search.indexDocument('doc1', 'Document content...', {
  title: 'API Documentation',
  tags: ['api', 'documentation']
});

// Search for documents
const results = await search.semanticSearch({
  query: 'API authentication',
  limit: 10
}, 'Griot');
  `,
  
  templateEngine: `
// Initialize template engine
const templateEngine = new DocumentTemplateEngine({
  templatePath: './templates',
  enableCustomization: true
});

// Generate document from template
const document = await templateEngine.generateDocument({
  template: 'api_doc_template',
  data: {
    title: 'User API',
    endpoints: [...],
    examples: [...]
  }
}, 'Griot');
  `,
  
  validator: `
// Initialize document validator
const validator = new DocumentValidator({
  validationRules: './rules',
  enableDuplicateCheck: true
});

// Validate a document
const validation = await validator.validateDocument({
  content: 'Document content...',
  type: 'api_doc'
}, 'api_documentation');

// Check for duplicates
const duplicateCheck = await validator.checkForDuplicates('Document content...');
  `,
  
  genericAdapter: `
// Create a generic documentation adapter for a node class
const documentationAdapter = createNodeDocumentationAdapter(
  'Griot',
  'West African',
  ['storytelling', 'wisdom', 'tradition'],
  ['story', 'proverb', 'lesson', 'history'],
  {
    storagePath: './documents/griot',
    enableVersioning: true
  }
);

// Use the adapter to create documents
const result = await documentationAdapter.createDocument({
  agent: 'griot-agent-1',
  documentType: 'story',
  title: 'The Wise Turtle',
  content: 'Once upon a time...',
  path: 'stories/wisdom/turtle.md',
  metadata: {
    priority: 'high',
    tags: ['wisdom', 'animals', 'patience']
  }
});
  `
} as const; 