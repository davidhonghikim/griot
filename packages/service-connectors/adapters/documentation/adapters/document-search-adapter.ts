/**
 * Document Search Adapter
 * 
 * Handles document search operations with semantic and metadata queries.
 */

import { SearchRequest, SearchResponse, DocType, SearchFilters } from '../types';
import { DocumentSearchConfig } from './config';
import { DocumentSearch } from '../document-search';

export interface DocumentSearchAdapter {
  searchDocuments(request: SearchRequest): Promise<SearchResponse>;
  findRelatedDocuments(documentId: string, relationshipType: string, limit?: number): Promise<SearchResponse>;
  searchNodeHistory(agent: string, documentType?: DocType, limit?: number): Promise<SearchResponse>;
  searchByMetadata(metadata: Record<string, any>, limit?: number): Promise<SearchResponse>;
}

export class DocumentSearchAdapter implements DocumentSearchAdapter {
  private config: DocumentSearchConfig;
  private search: DocumentSearch;

  constructor(config: DocumentSearchConfig, search: DocumentSearch) {
    this.config = config;
    this.search = search;
  }

  /**
   * Search for documents using semantic and metadata queries
   */
  async searchDocuments(request: SearchRequest): Promise<SearchResponse> {
    try {
      const results = await this.search.semanticSearch(request, this.config.nodeClass);
      
      return {
        documents: results.documents,
        totalCount: results.totalCount,
        query: request.query,
        filters: request.filters,
        searchTime: Date.now()
      };
    } catch (error) {
      return {
        documents: [],
        totalCount: 0,
        query: request.query,
        filters: request.filters,
        searchTime: Date.now()
      };
    }
  }

  /**
   * Find documents related to a specific document
   */
  async findRelatedDocuments(
    documentId: string, 
    relationshipType: string, 
    limit: number = 5
  ): Promise<SearchResponse> {
    try {
      const filters: SearchFilters = { relationshipType };
      const results = await this.search.findRelatedDocuments(
        documentId,
        relationshipType,
        limit
      );

      return {
        documents: results.documents,
        totalCount: results.totalCount,
        query: `Related to ${documentId} (${relationshipType})`,
        filters,
        searchTime: Date.now()
      };
    } catch (error) {
      return {
        documents: [],
        totalCount: 0,
        query: `Related to ${documentId} (${relationshipType})`,
        filters: { relationshipType },
        searchTime: Date.now()
      };
    }
  }

  /**
   * Search for documents created by a specific agent
   */
  async searchNodeHistory(
    agent: string, 
    documentType?: DocType, 
    limit: number = 20
  ): Promise<SearchResponse> {
    try {
      const filters: SearchFilters = { agent };
      if (documentType) {
        filters.documentType = documentType;
      }

      const results = await this.search.semanticSearch({
        query: `agent:${agent}`,
        filters,
        limit
      }, this.config.nodeClass);

      return {
        documents: results.documents,
        totalCount: results.totalCount,
        query: `History for agent: ${agent}`,
        filters,
        searchTime: Date.now()
      };
    } catch (error) {
      return {
        documents: [],
        totalCount: 0,
        query: `History for agent: ${agent}`,
        filters: { agent, documentType },
        searchTime: Date.now()
      };
    }
  }

  /**
   * Search documents by metadata
   */
  async searchByMetadata(
    metadata: Record<string, any>, 
    limit: number = 20
  ): Promise<SearchResponse> {
    try {
      const filters: SearchFilters = metadata;
      const results = await this.search.semanticSearch({
        query: 'metadata search',
        filters,
        limit
      }, this.config.nodeClass);

      return {
        documents: results.documents,
        totalCount: results.totalCount,
        query: 'Metadata search',
        filters,
        searchTime: Date.now()
      };
    } catch (error) {
      return {
        documents: [],
        totalCount: 0,
        query: 'Metadata search',
        filters: metadata,
        searchTime: Date.now()
      };
    }
  }
}

export default DocumentSearchAdapter; 