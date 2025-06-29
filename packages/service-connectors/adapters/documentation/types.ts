/**
 * TypeScript types for the Yachay Documentation System
 * 
 * This file defines all the interfaces, types, and enums used throughout
 * the documentation management system.
 */

export enum DocType {
  ANALYSIS = 'analysis',
  HANDOFF = 'handoff',
  CHANGELOG = 'changelog',
  IMPLEMENTATION_PLAN = 'implementation_plan',
  SPECIFICATION = 'specification',
  OVERVIEW = 'overview'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum DocumentPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ValidationLevel {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface DocumentEntry {
  id: string;
  title: string;
  content: string;
  path: string;
  documentType: DocType;
  agent: string;
  metadata: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface DocumentMetadata {
  priority: DocumentPriority;
  status: DocumentStatus;
  tags: string[];
  analysisType?: string;
  keyFindings?: string[];
  recommendations?: string[];
  nextSteps?: string[];
  directive?: string;
  accomplishments?: string[];
  objectives?: string[];
  steps?: ImplementationStep[];
  successCriteria?: string[];
  risks?: Risk[];
  version?: string;
  architecture?: string;
  apiSpecification?: string;
  dataModels?: string;
  culturalConsiderations?: string;
  [key: string]: any;
}

export interface ImplementationStep {
  title: string;
  description: string;
  timeline: string;
  dependencies: string[];
}

export interface Risk {
  risk: string;
  mitigation: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  level?: ValidationLevel;
}

export interface SearchResult {
  documentId: string;
  title: string;
  path: string;
  similarityScore: number;
  excerpt: string;
  metadata: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  documentType?: DocType;
  agent?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  tags?: string[];
  priority?: DocumentPriority;
  status?: DocumentStatus;
  relationshipType?: string;
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  similarityThreshold?: number;
}

export interface SearchResponse {
  documents: SearchResult[];
  totalCount: number;
  searchTime: number;
  query: string;
  filters?: SearchFilters;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarity: number;
  existingDocument?: DocumentEntry;
  threshold: number;
}

export interface DocumentStats {
  totalDocuments: number;
  documentsByType: Record<DocType, number>;
  documentsByAgent: Record<string, number>;
  documentsByPriority: Record<DocumentPriority, number>;
  documentsByStatus: Record<DocumentStatus, number>;
  documentsByDate: Record<string, number>;
}

export interface TemplateData {
  title: string;
  agent: string;
  content: string;
  timestamp: string;
  analysisType?: string;
  keyFindings?: string[];
  recommendations?: string[];
  nextSteps?: string[];
  directive?: string;
  accomplishments?: string[];
  currentStatus?: string;
  overview?: string;
  objectives?: string[];
  steps?: ImplementationStep[];
  successCriteria?: string[];
  risks?: Risk[];
  version?: string;
  status?: DocumentStatus;
  priority?: DocumentPriority;
  architecture?: string;
  apiSpecification?: string;
  dataModels?: string;
  culturalConsiderations?: string;
}

export interface DocumentTemplate {
  frontmatter: Record<string, any>;
  content: string;
}

export interface CulturalValidationContext {
  culturalOrigin: string;
  principles: string[];
  validationRules: CulturalValidationRule[];
}

export interface CulturalValidationRule {
  principle: string;
  description: string;
  validation: string;
  pattern?: string;
}

export interface QuechuaPrinciples {
  yachay: string;
  ayni: string;
  pachamama: string;
  sumakKawsay: string;
}

export interface VectorEmbedding {
  id: string;
  vector: number[];
  metadata: {
    documentId: string;
    chunkIndex: number;
    content: string;
  };
}

export interface IndexingResult {
  success: boolean;
  documentId: string;
  indexedChunks: number;
  error?: string;
}

export interface SearchIndex {
  documentIndex: DocumentIndexField[];
  vectorIndex: VectorIndexConfig;
}

export interface DocumentIndexField {
  name: string;
  type: 'string' | 'text' | 'array' | 'date' | 'number';
  indexed: boolean;
  analyzed?: boolean;
  vectorized?: boolean;
}

export interface VectorIndexConfig {
  type: 'hnsw' | 'ivf' | 'flat';
  dimensions: number;
  metric: 'cosine' | 'euclidean' | 'dot';
  efConstruction?: number;
  efSearch?: number;
}

export interface RankingWeights {
  semanticScore: number;
  metadataScore: number;
  recencyScore: number;
  relevanceScore: number;
  qualityScore: number;
  popularityScore: number;
}

export interface BoostFactors {
  field: string;
  values: Record<string, number>;
}

export interface SearchAnalytics {
  queryVolume: number;
  resultClickRate: number;
  searchSatisfaction: number;
  zeroResultRate: number;
  averageResultCount: number;
}

export interface PerformanceConfig {
  searchTimeout: number;
  maxResultsPerQuery: number;
  cacheSize: number;
  cacheTtl: number;
  batchSize: number;
}

export interface IntegrationConfig {
  name: string;
  description: string;
  permissions: string[];
  config?: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  code?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Configuration interfaces
export interface DocumentationConfig {
  basePath: string;
  allowedDirectories: string[];
  maxDocumentSize: number;
  enableCulturalValidation: boolean;
  searchTimeout: number;
  cacheSize: number;
  vectorDimensions: number;
  similarityThreshold: number;
  archiveRetentionDays: number;
}

export interface ValidationConfig {
  enablePathValidation: boolean;
  enableNamingValidation: boolean;
  enableFrontmatterValidation: boolean;
  enableContentValidation: boolean;
  enableCulturalValidation: boolean;
  enableDuplicateDetection: boolean;
}

export interface SearchConfig {
  enableSemanticSearch: boolean;
  enableMetadataSearch: boolean;
  enableHybridSearch: boolean;
  embeddingModel: string;
  vectorDimensions: number;
  similarityMetric: 'cosine' | 'euclidean' | 'dot';
  maxResults: number;
  cacheResults: boolean;
  cacheTtl: number;
}

export interface TemplateConfig {
  enableTemplates: boolean;
  templateCacheSize: number;
  maxTemplateComplexity: number;
  templateGenerationTimeout: number;
}

// Event interfaces
export interface DocumentEvent {
  type: 'created' | 'updated' | 'archived' | 'deleted';
  documentId: string;
  timestamp: string;
  agent: string;
  metadata?: any;
}

export interface SearchEvent {
  type: 'search_performed' | 'result_clicked' | 'no_results';
  query: string;
  filters?: SearchFilters;
  resultsCount: number;
  searchTime: number;
  timestamp: string;
  agent?: string;
}

export interface ValidationEvent {
  type: 'validation_passed' | 'validation_failed' | 'validation_warning';
  documentId?: string;
  validationType: string;
  errors?: string[];
  warnings?: string[];
  timestamp: string;
  agent: string;
}

// Utility types
export type DocumentTypeMap = {
  [DocType.ANALYSIS]: {
    analysisType: string;
    keyFindings: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  [DocType.HANDOFF]: {
    directive: string;
    accomplishments: string[];
    nextSteps: string[];
    currentStatus: string;
    keyFindings: string[];
  };
  [DocType.IMPLEMENTATION_PLAN]: {
    overview: string;
    objectives: string[];
    steps: ImplementationStep[];
    successCriteria: string[];
    risks: Risk[];
  };
  [DocType.SPECIFICATION]: {
    version: string;
    architecture: string;
    apiSpecification: string;
    dataModels: string;
    culturalConsiderations: string;
  };
  [DocType.CHANGELOG]: Record<string, any>;
  [DocType.OVERVIEW]: Record<string, any>;
};

export type CreateDocumentRequest<T extends DocType = DocType> = {
  agent: string;
  documentType: T;
  title: string;
  content: string;
  path: string;
  metadata?: DocumentMetadata;
} & DocumentTypeMap[T];

export interface DocumentationResponse {
  success: boolean;
  documentId?: string;
  path?: string;
  message?: string;
  error?: string;
  details?: any;
}

export interface YachayDocumentationResponse extends DocumentationResponse {
  // Yachay-specific response fields can be added here if needed
} 