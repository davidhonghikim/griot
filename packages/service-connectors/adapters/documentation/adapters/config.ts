/**
 * Documentation Adapter Configuration
 * 
 * Provides configuration management for documentation adapters.
 */

import { DocumentationConfig, DocType } from '../types';

export interface GenericDocumentationConfig extends DocumentationConfig {
  nodeClass: string;
  culturalOrigin: string;
  culturalPrinciples: string[];
  allowedDocumentTypes: DocType[];
  customValidationRules?: any[];
  customTemplates?: Record<string, any>;
}

export interface NodeSpecificConfig {
  nodeClass: string;
  culturalOrigin: string;
  allowedDocumentTypes: DocType[];
  customValidationRules?: any[];
  customTemplates?: Record<string, any>;
}

export interface CulturalValidationConfig {
  culturalOrigin: string;
  culturalPrinciples: string[];
  validationRules: any[];
}

export interface DocumentCreationConfig {
  nodeClass: string;
  culturalOrigin: string;
  customTemplates?: Record<string, any>;
}

export interface DocumentSearchConfig {
  nodeClass: string;
  culturalOrigin: string;
  searchIndex: string;
} 