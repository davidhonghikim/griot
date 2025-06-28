export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Endpoint {
  path: string;
  method: HttpMethod;
}

export interface ServiceEndpointGroup {
  [endpointKey: string]: Endpoint;
}

export interface ServiceEndpoints {
  [serviceKey: string]: ServiceEndpointGroup;
}

// --- Parameter & Capability Definitions ---

export interface SelectOption {
  value: string;
  label: string;
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'file';
  multiple?: boolean;
  defaultValue: any;
  description: string;
  options?: (string | SelectOption)[];
  range?: [number, number];
  step?: number;
  optionsEndpoint?: string;
  optionsPath?: string;
  optionsValueKey?: string;
  optionsLabelKey?: string;
  dependsOn?: { [key: string]: any }; // For conditional parameters
}

export interface ParameterMapping {
  nodeId?: string;
  inputKey?: string;
  parameterDefinition?: ParameterDefinition;
  sourceParam?: string; // For ComfyUI parameter mapping
  targetPath?: string[]; // For ComfyUI graph-based parameter mapping
  description?: string; // For parameter mapping documentation
}

export interface LlmChatCapability {
  capability: 'llm_chat';
  endpoints: {
    chat: Endpoint;
    getModels?: Endpoint;
    generate?: Endpoint;
    completion?: Endpoint;
    [key: string]: Endpoint | undefined;
  };
  parameters: {
    chat: ParameterDefinition[];
    [key: string]: ParameterDefinition[];
  };
  models?: string[];
}

export interface ImageGenerationCapability {
  capability: 'image_generation';
  endpoints: {
    [endpointKey: string]: Endpoint;
  };
  parameters: {
    [parameterKey: string]: ParameterDefinition[];
  };
  parameterMappings?: ParameterMapping[]; // For ComfyUI-style parameter mapping
}

export interface ModelManagementCapability {
  capability: 'model_management';
  endpoints: {
    getModels?: Endpoint;
    [key: string]: Endpoint | undefined;
  };
  parameters: {
    [key: string]: ParameterDefinition[];
  };
  responseMapping?: {
    [key: string]: {
      path: string;
      valueKey: string;
      labelKey: string;
    };
  };
}

export interface AutomationCapability {
  capability: 'automation';
  endpoints: {
    [endpointKey: string]: Endpoint;
  };
  parameters: {
    [parameterKey: string]: ParameterDefinition[];
  };
}

export interface LangChainCapability {
  capability: 'langchain';
  roles: ('llm' | 'tool' | 'vectorstore' | 'memory')[];
}

export interface StorageCapability {
  capability: 'storage';
  endpoints: {
    [endpointKey: string]: Endpoint; // e.g., listFiles, uploadFile, downloadFile
  };
  parameters: {
    [parameterKey: string]: ParameterDefinition[]; // e.g., list, upload
  };
}

export interface VectorDatabaseCapability {
  capability: 'vector_database';
  endpoints: {
    listCollections: Endpoint;
    query: Endpoint;
    upsert: Endpoint;
    delete: Endpoint;
    createCollection?: Endpoint;
    [key: string]: Endpoint | undefined;
  };
  parameters: {
    [key: string]: ParameterDefinition[];
  };
}

export interface DocumentStorageCapability {
  capability: 'document_storage';
  endpoints: {
    [endpointKey: string]: Endpoint;
  };
  parameters: {
    [parameterKey: string]: ParameterDefinition[];
  };
}

export interface GraphExecutionCapability {
  capability: 'graph_execution';
  baseWorkflow: ComfyWorkflow;
  endpoints: {
    prompt: Endpoint;
    view: Endpoint;
    history: Endpoint;
    websocket: Endpoint;
  };
  parameterMapping: {
    [paramKey: string]: ParameterMapping;
  };
}

export interface HealthCapability {
  capability: 'health';
  endpoints: {
    health: Endpoint;
  };
}

export interface MeshNetworkingCapability {
  capability: 'mesh_networking';
  endpoints: {
    getNodes: Endpoint;
    sendMessage: Endpoint;
    getMessages: Endpoint;
    announce: Endpoint;
    getDestinations: Endpoint;
  };
  parameters: {
    network: ParameterDefinition[];
  };
}

export type CapabilityType =
  | 'llm_chat'
  | 'image_generation'
  | 'model_management'
  | 'automation'
  | 'langchain'
  | 'storage'
  | 'vector_database'
  | 'document_storage'
  | 'graph_execution'
  | 'mesh_networking'
  | 'health';

export type ServiceCapability =
  | LlmChatCapability
  | ImageGenerationCapability
  | ModelManagementCapability
  | AutomationCapability
  | LangChainCapability
  | StorageCapability
  | VectorDatabaseCapability
  | DocumentStorageCapability
  | GraphExecutionCapability
  | MeshNetworkingCapability
  | HealthCapability;

export type AuthType = 'none' | 'api_key' | 'bearer_token' | 'basic';

export interface Credential {
  id: string;
  name: string;
  type: AuthType;
  value: string; // This is the actual key/token, will be encrypted in the vault
}

export type AuthDefinition = {
  type: AuthType;
  help?: string;
  keyName?: string; // For api_key type
  headers?: { [key: string]: string }; // For custom headers
  defaultValue?: string; // For default auth values
};

export interface ServiceArgument {
  flag: string;
  description: string;
  required?: boolean;
}

export interface ServiceDefinition {
  type: string;
  name: string;
  category: string;
  protocol: 'http' | 'https' | {
    primary: 'https' | 'http';
    fallback?: 'https' | 'http';
    autoDetect?: boolean;
  };
  defaultPort: number;
  baseUrl?: string;
  hasExternalUi?: boolean;
  docs?: { [key: string]: any };
  authentication: AuthDefinition;
  capabilities: ServiceCapability[];
  configuration?: {
    arguments?: { [key: string]: ServiceArgument };
    help?: { [key: string]: any };
    warnings?: string[];
  };
}

export interface ComfyNode {
  inputs: { [key: string]: any };
  class_type: string;
}

export interface ComfyWorkflow {
  [nodeId: string]: ComfyNode;
}