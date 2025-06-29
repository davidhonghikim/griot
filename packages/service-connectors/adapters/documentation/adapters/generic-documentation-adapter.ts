/**
 * Generic Documentation Adapter
 * 
 * Main coordinator for documentation operations across all node classes.
 */

import { 
  DocumentEntry, 
  DocType, 
  ValidationResult, 
  SearchResult,
  DocumentationConfig,
  CreateDocumentRequest,
  SearchRequest,
  DocumentationResponse,
  SearchResponse,
  YachayDocumentationResponse,
  DocumentPriority,
  DocumentStatus
} from '../types';

import { DocumentationRegistry } from '../documentation-registry';
import { DocumentSearch } from '../document-search';
import { DocumentTemplateEngine } from '../document-template-engine';
import { DocumentValidator } from '../document-validator';

import { GenericDocumentationConfig } from './config';
import { CulturalValidationAdapter } from './cultural-validation-adapter';
import { DocumentCreationAdapter } from './document-creation-adapter';
import { DocumentSearchAdapter } from './document-search-adapter';
import { NodeSpecificAdapter } from './node-specific-adapter';

export interface GenericDocumentationAdapter {
  // Core document operations
  createDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse>;
  searchDocuments(request: SearchRequest): Promise<SearchResponse>;
  findRelatedDocuments(documentId: string, relationshipType: string, limit?: number): Promise<SearchResponse>;
  archiveDocument(documentId: string, reason: string): Promise<YachayDocumentationResponse>;
  
  // Validation and utilities
  validatePath(path: string, documentType: DocType): Promise<ValidationResult>;
  getDocumentStats(): Promise<any>;
  getCulturalPrinciples(): string[];
  
  // Node-specific operations
  searchNodeHistory(agent: string, documentType?: DocType, limit?: number): Promise<SearchResponse>;
  createNodeSpecificDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse>;
}

export class GenericDocumentationAdapter implements GenericDocumentationAdapter {
  private config: GenericDocumentationConfig;
  private registry: DocumentationRegistry;
  private templateEngine: DocumentTemplateEngine;
  private validator: DocumentValidator;
  private search: DocumentSearch;
  
  // Modular adapters
  private culturalValidator: CulturalValidationAdapter;
  private documentCreation: DocumentCreationAdapter;
  private documentSearch: DocumentSearchAdapter;
  private nodeSpecific: NodeSpecificAdapter;

  constructor(config: GenericDocumentationConfig) {
    this.config = config;
    this.initializeComponents();
  }

  /**
   * Initialize the documentation system components
   */
  private initializeComponents() {
    // Initialize core components
    this.registry = new DocumentationRegistry({
      ...this.config,
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin
    });

    this.templateEngine = new DocumentTemplateEngine({
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin,
      customTemplates: this.config.customTemplates
    });

    this.validator = new DocumentValidator({
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin,
      customValidationRules: this.config.customValidationRules
    });

    this.search = new DocumentSearch({
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin
    });

    // Initialize modular adapters
    this.culturalValidator = new CulturalValidationAdapter({
      culturalOrigin: this.config.culturalOrigin,
      culturalPrinciples: this.config.culturalPrinciples,
      validationRules: this.config.customValidationRules || []
    });

    this.documentCreation = new DocumentCreationAdapter(
      {
        nodeClass: this.config.nodeClass,
        culturalOrigin: this.config.culturalOrigin,
        customTemplates: this.config.customTemplates
      },
      this.culturalValidator,
      this.validator,
      this.templateEngine,
      this.registry
    );

    this.documentSearch = new DocumentSearchAdapter(
      {
        nodeClass: this.config.nodeClass,
        culturalOrigin: this.config.culturalOrigin,
        searchIndex: `${this.config.nodeClass}_docs`
      },
      this.search
    );

    this.nodeSpecific = new NodeSpecificAdapter(
      {
        nodeClass: this.config.nodeClass,
        culturalOrigin: this.config.culturalOrigin,
        allowedDocumentTypes: this.config.allowedDocumentTypes,
        customValidationRules: this.config.customValidationRules,
        customTemplates: this.config.customTemplates
      },
      this.documentCreation,
      this.documentSearch
    );
  }

  /**
   * Create a new document with full validation and proper formatting
   */
  async createDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse> {
    return this.documentCreation.createDocument(request);
  }

  /**
   * Search for documents using semantic and metadata queries
   */
  async searchDocuments(request: SearchRequest): Promise<SearchResponse> {
    return this.documentSearch.searchDocuments(request);
  }

  /**
   * Find documents related to a specific document
   */
  async findRelatedDocuments(documentId: string, relationshipType: string, limit: number = 5): Promise<SearchResponse> {
    return this.documentSearch.findRelatedDocuments(documentId, relationshipType, limit);
  }

  /**
   * Search for documents created by a specific agent
   */
  async searchNodeHistory(agent: string, documentType?: DocType, limit: number = 20): Promise<SearchResponse> {
    return this.documentSearch.searchNodeHistory(agent, documentType, limit);
  }

  /**
   * Create a node-specific document with custom validation and formatting
   */
  async createNodeSpecificDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse> {
    return this.nodeSpecific.createNodeSpecificDocument(request);
  }

  /**
   * Archive a document
   */
  async archiveDocument(documentId: string, reason: string): Promise<YachayDocumentationResponse> {
    try {
      const result = await this.registry.archiveDocument(documentId, reason);
      
      return {
        success: true,
        documentId,
        message: `Document archived successfully by ${this.config.nodeClass} node`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Document archiving failed',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Validate document path
   */
  async validatePath(path: string, documentType: DocType): Promise<ValidationResult> {
    return this.validator.validatePath(path, documentType);
  }

  /**
   * Get comprehensive document statistics
   */
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    documentsByType: Record<DocType, number>;
    documentsByAgent: Record<string, number>;
    documentsByPriority: Record<string, number>;
    documentsByStatus: Record<string, number>;
    nodeClassStats: Record<string, number>;
  }> {
    const registryStats = await this.registry.getStats();
    const searchStats = await this.documentSearch.getSearchStats();
    
    return {
      ...registryStats,
      ...searchStats,
      nodeClassStats: {
        [this.config.nodeClass]: registryStats.totalDocuments
      }
    };
  }

  /**
   * Get cultural principles for this node
   */
  getCulturalPrinciples(): string[] {
    return this.config.culturalPrinciples;
  }

  /**
   * Get node class information
   */
  getNodeClassInfo(): {
    nodeClass: string;
    culturalOrigin: string;
    allowedDocumentTypes: DocType[];
    culturalPrinciples: string[];
  } {
    return this.nodeSpecific.getNodeClassInfo();
  }
}

/**
 * Factory function to create a node documentation adapter
 */
export function createNodeDocumentationAdapter(
  nodeClass: string,
  culturalOrigin: string,
  culturalPrinciples: string[],
  allowedDocumentTypes: DocType[],
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  const config: GenericDocumentationConfig = {
    ...baseConfig,
    nodeClass,
    culturalOrigin,
    culturalPrinciples,
    allowedDocumentTypes
  };

  return new GenericDocumentationAdapter(config);
} 