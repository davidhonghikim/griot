/**
 * Documentation Adapters Package
 * 
 * Provides modular documentation adapter functionality for different node classes.
 */

export { default as GenericDocumentationAdapter } from './generic-documentation-adapter';
export { default as NodeSpecificAdapter } from './node-specific-adapter';
export { default as CulturalValidationAdapter } from './cultural-validation-adapter';
export { default as DocumentCreationAdapter } from './document-creation-adapter';
export { default as DocumentSearchAdapter } from './document-search-adapter';
export { createNodeDocumentationAdapter } from './factory'; 