/**
 * Document Creation Adapter
 * 
 * Handles document creation with validation and formatting.
 */

import { 
  CreateDocumentRequest, 
  YachayDocumentationResponse, 
  ValidationResult,
  DocType 
} from '../types';
import { DocumentCreationConfig } from './config';
import { CulturalValidationAdapter } from './cultural-validation-adapter';
import { DocumentValidator } from '../document-validator';
import { DocumentTemplateEngine } from '../document-template-engine';
import { DocumentationRegistry } from '../documentation-registry';

export interface DocumentCreationAdapter {
  createDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse>;
  validateCreateRequest(request: CreateDocumentRequest): Promise<ValidationResult>;
  formatDocument(request: CreateDocumentRequest): Promise<string>;
}

export class DocumentCreationAdapter implements DocumentCreationAdapter {
  private config: DocumentCreationConfig;
  private culturalValidator: CulturalValidationAdapter;
  private validator: DocumentValidator;
  private templateEngine: DocumentTemplateEngine;
  private registry: DocumentationRegistry;

  constructor(
    config: DocumentCreationConfig,
    culturalValidator: CulturalValidationAdapter,
    validator: DocumentValidator,
    templateEngine: DocumentTemplateEngine,
    registry: DocumentationRegistry
  ) {
    this.config = config;
    this.culturalValidator = culturalValidator;
    this.validator = validator;
    this.templateEngine = templateEngine;
    this.registry = registry;
  }

  /**
   * Create a new document with full validation and proper formatting
   */
  async createDocument(request: CreateDocumentRequest): Promise<YachayDocumentationResponse> {
    try {
      // Step 1: Validate the request
      const validationResult = await this.validateCreateRequest(request);
      if (!validationResult.valid) {
        return {
          success: false,
          error: 'Validation failed',
          details: validationResult.errors
        };
      }

      // Step 2: Check for duplicates
      const duplicateCheck = await this.validator.checkForDuplicates(request.content);
      if (duplicateCheck.isDuplicate) {
        return {
          success: false,
          error: 'Duplicate content detected',
          details: {
            similarity: duplicateCheck.similarity
          }
        };
      }

      // Step 3: Generate properly formatted document
      const formattedDocument = await this.formatDocument(request);

      // Step 4: Validate the formatted document
      const documentValidation = await this.validator.validateDocument(formattedDocument, request.documentType);
      if (!documentValidation.valid) {
        return {
          success: false,
          error: 'Document validation failed',
          details: documentValidation.errors
        };
      }

      // Step 5: Apply cultural validation
      const culturalValidation = await this.culturalValidator.validateContent(formattedDocument);
      if (!culturalValidation.valid) {
        return {
          success: false,
          error: 'Cultural validation failed',
          details: culturalValidation.errors
        };
      }

      // Step 6: Create document in registry
      const documentResult = await this.registry.createDocument({
        agent: request.agent,
        documentType: request.documentType,
        title: request.title,
        content: formattedDocument,
        nodeClass: this.config.nodeClass,
        culturalOrigin: this.config.culturalOrigin,
        metadata: {
          priority: request.metadata?.priority || 'medium',
          status: request.metadata?.status || 'active',
          tags: request.metadata?.tags || [],
          nodeClass: this.config.nodeClass,
          ...request.metadata
        }
      });

      return {
        success: true,
        documentId: documentResult.id,
        path: request.path,
        message: `Document created successfully by ${this.config.nodeClass} node`
      };

    } catch (error) {
      return {
        success: false,
        error: 'Document creation failed',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Validate document creation request
   */
  async validateCreateRequest(request: CreateDocumentRequest): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!request.title || request.title.trim().length === 0) {
      errors.push('Document title is required');
    }

    if (!request.content || request.content.trim().length === 0) {
      errors.push('Document content is required');
    }

    if (!request.documentType) {
      errors.push('Document type is required');
    }

    if (!request.agent) {
      errors.push('Agent identifier is required');
    }

    // Check document type permissions
    if (request.documentType && !this.isDocumentTypeAllowed(request.documentType)) {
      errors.push(`Document type '${request.documentType}' is not allowed for this node class`);
    }

    // Check content length
    if (request.content && request.content.length > 100000) {
      warnings.push('Document content is very long (>100KB)');
    }

    // Check title length
    if (request.title && request.title.length > 200) {
      warnings.push('Document title is very long (>200 characters)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Format document with templates and cultural context
   */
  async formatDocument(request: CreateDocumentRequest): Promise<string> {
    // Generate document with templates
    const formattedDocument = await this.templateEngine.generateDocument(request, this.config.nodeClass);

    // Apply cultural context
    const documentWithContext = await this.culturalValidator.applyCulturalContext(
      formattedDocument,
      this.config.culturalOrigin
    );

    return documentWithContext;
  }

  /**
   * Check if document type is allowed for this node class
   */
  private isDocumentTypeAllowed(documentType: DocType): boolean {
    // This would check against allowed document types for the node class
    // For now, return true as a placeholder
    return true;
  }
} 