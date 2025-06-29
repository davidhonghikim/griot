/**
 * Documentation Adapter Factory
 * 
 * Factory functions for creating documentation adapters.
 */

import { DocType, DocumentationConfig } from '../types';
import { GenericDocumentationAdapter } from './generic-documentation-adapter';
import { GenericDocumentationConfig } from './config';

/**
 * Create a node documentation adapter with standard configuration
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

/**
 * Create a Griot documentation adapter
 */
export function createGriotDocumentationAdapter(
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  return createNodeDocumentationAdapter(
    'Griot',
    'HIEROS',
    [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ],
    ['specification', 'architecture', 'implementation', 'documentation'],
    baseConfig
  );
}

/**
 * Create a Tohunga documentation adapter
 */
export function createTohungaDocumentationAdapter(
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  return createNodeDocumentationAdapter(
    'Tohunga',
    'HIEROS',
    [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ],
    ['data', 'validation', 'transformation', 'documentation'],
    baseConfig
  );
}

/**
 * Create a Ronin documentation adapter
 */
export function createRoninDocumentationAdapter(
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  return createNodeDocumentationAdapter(
    'Ronin',
    'HIEROS',
    [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ],
    ['security', 'authentication', 'authorization', 'documentation'],
    baseConfig
  );
}

/**
 * Create a Musa documentation adapter
 */
export function createMusaDocumentationAdapter(
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  return createNodeDocumentationAdapter(
    'Musa',
    'HIEROS',
    [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ],
    ['communication', 'messaging', 'protocol', 'documentation'],
    baseConfig
  );
}

/**
 * Create a Hakim documentation adapter
 */
export function createHakimDocumentationAdapter(
  baseConfig: Partial<DocumentationConfig> = {}
): GenericDocumentationAdapter {
  return createNodeDocumentationAdapter(
    'Hakim',
    'HIEROS',
    [
      'Honor All Beings',
      'Interoperability Over Control',
      'Equity of Voice',
      'Respect Temporal Flow',
      'Openness With Boundaries',
      'Stewardship Not Extraction',
      'Guided Evolution'
    ],
    ['health', 'monitoring', 'diagnostics', 'documentation'],
    baseConfig
  );
} 