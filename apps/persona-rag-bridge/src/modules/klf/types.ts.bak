/**
 * KLF (Kind Link Framework) Types
 * 
 * Type definitions for service orchestration, workflow management,
 * and distributed AI service coordination.
 */

// Core Service Types
export interface KLFService {
  id: string;
  name: string;
  description: string;
  version: string;
  type: string;
  capabilities: string[];
  endpoints: KLFServiceEndpoint[];
  metadata: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  health: KLFServiceHealth;
  registeredAt: Date;
  lastSeen: Date;
}

export interface KLFServiceEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters: KLFParameter[];
  returns: KLFParameter;
  authentication?: KLFAuthentication;
}

export interface KLFParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface KLFAuthentication {
  type: 'api_key' | 'bearer' | 'oauth2' | 'none';
  credentials: Record<string, any>;
}

export interface KLFServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  errors: KLFError[];
}

// Workflow Types
export interface KLFWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  steps: KLFWorkflowStep[];
  inputs: KLFParameter[];
  outputs: KLFParameter[];
  metadata: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface KLFWorkflowStep {
  id: string;
  name: string;
  type: 'service' | 'condition' | 'loop' | 'parallel';
  serviceId?: string;
  endpoint?: string;
  parameters: Record<string, any>;
  conditions?: KLFCondition[];
  dependsOn: string[];
  timeout: number;
  retries: number;
}

export interface KLFCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'regex';
  value: any;
}

// Message Types
export interface KLFMessage {
  id: string;
  type: 'request' | 'response' | 'event' | 'error';
  source: string;
  destination: string;
  payload: any;
  metadata: Record<string, any>;
  timestamp: Date;
  correlationId?: string;
}

// Orchestration Types
export interface KLFOrchestrationRequest {
  id: string;
  workflowId: string;
  input: Record<string, any>;
  metadata: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timeout: number;
  timestamp: Date;
}

export interface KLFOrchestrationResponse {
  id: string;
  workflowId: string;
  output: Record<string, any>;
  status: 'completed' | 'failed' | 'cancelled' | 'running';
  executionTime: number;
  steps: KLFExecutionStep[];
  errors: KLFError[];
  timestamp: Date;
}

export interface KLFExecutionStep {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  output?: any;
  error?: KLFError;
}

// Discovery Types
export interface KLFDiscoveryRequest {
  nodeId: string;
  capabilities: string[];
  filters?: KLFDiscoveryFilter[];
  timestamp: Date;
}

export interface KLFDiscoveryResponse {
  services: KLFService[];
  total: number;
  timestamp: Date;
}

export interface KLFDiscoveryFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'regex';
  value: any;
}

// Security Types
export interface KLFSecurityContext {
  nodeId: string;
  permissions: string[];
  roles: string[];
  token: string;
  expiresAt: Date;
}

export interface KLFAccessControl {
  serviceId: string;
  allowedNodes: string[];
  allowedRoles: string[];
  allowedPermissions: string[];
  restrictions: KLFRestriction[];
}

export interface KLFRestriction {
  type: 'rate_limit' | 'time_window' | 'resource_limit' | 'custom';
  parameters: Record<string, any>;
}

// Error Types
export interface KLFError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface KLFErrorResponse {
  error: KLFError;
  requestId: string;
  timestamp: Date;
}

// API Types
export interface KLFAPI {
  // Service Management
  registerService(service: Omit<KLFService, 'id' | 'registeredAt'>): Promise<string>;
  unregisterService(serviceId: string): Promise<void>;
  getService(serviceId: string): Promise<KLFService>;
  listServices(filters?: KLFDiscoveryFilter[]): Promise<KLFService[]>;
  updateService(serviceId: string, updates: Partial<KLFService>): Promise<void>;
  
  // Workflow Management
  createWorkflow(workflow: Omit<KLFWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  getWorkflow(workflowId: string): Promise<KLFWorkflow>;
  listWorkflows(filters?: Record<string, any>): Promise<KLFWorkflow[]>;
  updateWorkflow(workflowId: string, updates: Partial<KLFWorkflow>): Promise<void>;
  deleteWorkflow(workflowId: string): Promise<void>;
  
  // Orchestration
  executeWorkflow(workflowId: string, input: Record<string, any>): Promise<KLFOrchestrationResponse>;
  getExecution(executionId: string): Promise<KLFOrchestrationResponse>;
  listExecutions(filters?: Record<string, any>): Promise<KLFOrchestrationResponse[]>;
  cancelExecution(executionId: string): Promise<void>;
  
  // Discovery
  discoverServices(request: KLFDiscoveryRequest): Promise<KLFDiscoveryResponse>;
  announceService(service: KLFService): Promise<void>;
  
  // Messaging
  sendMessage(message: Omit<KLFMessage, 'id' | 'timestamp'>): Promise<string>;
  receiveMessage(messageId: string): Promise<KLFMessage>;
  
  // Security
  authenticate(credentials: Record<string, any>): Promise<KLFSecurityContext>;
  authorize(context: KLFSecurityContext, resource: string, action: string): Promise<boolean>;
  
  // Health & Monitoring
  getHealth(): Promise<KLFHealthStatus>;
  getMetrics(): Promise<KLFMetrics>;
}

// Health & Monitoring Types
export interface KLFHealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  services: number;
  workflows: number;
  executions: number;
  errors: KLFError[];
  timestamp: Date;
}

export interface KLFMetrics {
  requests: number;
  responses: number;
  errors: number;
  averageResponseTime: number;
  throughput: number;
  uptime: number;
  timestamp: Date;
}

// Configuration Types
export interface KLFConfig {
  nodeId: string;
  orchestratorUrl: string;
  discoveryInterval: number;
  heartbeatInterval: number;
  timeout: number;
  retries: number;
  capabilities: string[];
  security: KLFSecurityConfig;
  logging: KLFLoggingConfig;
}

export interface KLFSecurityConfig {
  enabled: boolean;
  authentication: 'none' | 'api_key' | 'jwt' | 'oauth2';
  encryption: 'none' | 'tls' | 'end_to_end';
  accessControl: boolean;
  auditLogging: boolean;
}

export interface KLFLoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  destination: 'console' | 'file' | 'remote';
  filePath?: string;
  maxSize?: number;
  maxFiles?: number;
}
