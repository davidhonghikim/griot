/**
 * Node-Specific Adapter
 * 
 * Provides node-specific documentation operations and customizations.
 */

import { 
  CreateDocumentRequest, 
  YachayDocumentationResponse, 
  DocType 
} from '../types';
import { NodeSpecificConfig } from './config';
import { DocumentCreationAdapter } from './document-creation-adapter';
import { DocumentSearchAdapter } from './document-search-adapter';

export interface NodeSpecificAdapter {
  createNodeSpecificDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse>;
  getNodeClassInfo(): {
    nodeClass: string;
    culturalOrigin: string;
    allowedDocumentTypes: DocType[];
    culturalPrinciples: string[];
  };
  validateNodeSpecificRequest(request: CreateDocumentRequest): Promise<boolean>;
}

export class NodeSpecificAdapter implements NodeSpecificAdapter {
  private config: NodeSpecificConfig;
  private documentCreation: DocumentCreationAdapter;
  private documentSearch: DocumentSearchAdapter;

  constructor(
    config: NodeSpecificConfig,
    documentCreation: DocumentCreationAdapter,
    documentSearch: DocumentSearchAdapter
  ) {
    this.config = config;
    this.documentCreation = documentCreation;
    this.documentSearch = documentSearch;
  }

  /**
   * Create a node-specific document with custom validation and formatting
   */
  async createNodeSpecificDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse> {
    try {
      // Validate node-specific requirements
      const isValid = await this.validateNodeSpecificRequest(request);
      if (!isValid) {
        return {
          success: false,
          error: 'Node-specific validation failed',
          details: 'Request does not meet node-specific requirements'
        };
      }

      // Apply node-specific customizations
      const customizedRequest = await this.applyNodeSpecificCustomizations(request);

      // Create document using the standard creation adapter
      const result = await this.documentCreation.createDocument(customizedRequest);

      // Add node-specific metadata to response
      if (result.success) {
        result.nodeClass = this.config.nodeClass;
        result.culturalOrigin = this.config.culturalOrigin;
      }

      return result;

    } catch (error) {
      return {
        success: false,
        error: 'Node-specific document creation failed',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get information about this node class
   */
  getNodeClassInfo(): {
    nodeClass: string;
    culturalOrigin: string;
    allowedDocumentTypes: DocType[];
    culturalPrinciples: string[];
  } {
    return {
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin,
      allowedDocumentTypes: this.config.allowedDocumentTypes,
      culturalPrinciples: this.getCulturalPrinciples()
    };
  }

  /**
   * Validate node-specific request requirements
   */
  async validateNodeSpecificRequest(request: CreateDocumentRequest): Promise<boolean> {
    // Check if document type is allowed for this node
    if (!this.config.allowedDocumentTypes.includes(request.documentType)) {
      return false;
    }

    // Check for node-specific content requirements
    const hasRequiredContent = await this.checkNodeSpecificContent(request.content);
    if (!hasRequiredContent) {
      return false;
    }

    // Check for node-specific metadata requirements
    const hasRequiredMetadata = this.checkNodeSpecificMetadata(request.metadata);
    if (!hasRequiredMetadata) {
      return false;
    }

    return true;
  }

  /**
   * Apply node-specific customizations to request
   */
  private async applyNodeSpecificCustomizations(request: CreateDocumentRequest): Promise<CreateDocumentRequest> {
    const customizedRequest = { ...request };

    // Apply node-specific templates if available
    if (this.config.customTemplates && this.config.customTemplates[request.documentType]) {
      customizedRequest.content = await this.applyCustomTemplate(
        request.content,
        this.config.customTemplates[request.documentType]
      );
    }

    // Apply node-specific validation rules
    if (this.config.customValidationRules) {
      customizedRequest.metadata = {
        ...customizedRequest.metadata,
        customValidationRules: this.config.customValidationRules
      };
    }

    // Add node-specific metadata
    customizedRequest.metadata = {
      ...customizedRequest.metadata,
      nodeClass: this.config.nodeClass,
      culturalOrigin: this.config.culturalOrigin,
      createdBy: this.config.nodeClass
    };

    return customizedRequest;
  }

  /**
   * Check for node-specific content requirements
   */
  private async checkNodeSpecificContent(content: string): Promise<boolean> {
    // This would implement node-specific content validation
    // For now, return true as a placeholder
    return true;
  }

  /**
   * Check for node-specific metadata requirements
   */
  private checkNodeSpecificMetadata(metadata?: Record<string, any>): boolean {
    // This would implement node-specific metadata validation
    // For now, return true as a placeholder
    return true;
  }

  /**
   * Apply custom template to content
   */
  private async applyCustomTemplate(content: string, template: any): Promise<string> {
    // This would apply node-specific templates
    // For now, return content as-is
    return content;
  }

  /**
   * Get cultural principles for this node
   */
  private getCulturalPrinciples(): string[] {
    // This would return node-specific cultural principles
    // For now, return default principles
    return [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ];
  }
} 