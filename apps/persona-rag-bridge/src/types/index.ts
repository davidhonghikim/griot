// Service Types
export interface ServiceDefinition {
  type: string;
  name: string;
  category: string;
  defaultPort: number;
  docs: {
    api: string;
  };
  authentication: {
    type: 'none' | 'api_key' | 'jwt' | 'login';
    headerName?: string;
    headerValue?: string;
  };
  configuration: {
    help: {
      instructions: string;
    };
  };
  capabilities: (LlmChatCapability | HealthCapability | VectorSearchCapability)[];
}

export interface Service {
  id: string;
  name: string;
  type: string;
  category: string;
  url: string;
  status: 'online' | 'offline' | 'error' | 'checking' | 'unknown';
  enabled: boolean;
  archived: boolean;
  lastChecked: number;
  createdAt: number;
  updatedAt: number;
  history: ChatMessage[];
  capabilities: (LlmChatCapability | HealthCapability | VectorSearchCapability)[];
  config: Record<string, any>;
  serviceDefinitionId: string;
  ipType: 'local' | 'remote' | 'cloud' | 'custom';
  customUrl?: string;
  defaultPort: number;
  authentication: {
    type: 'none' | 'api_key' | 'jwt' | 'login';
    apiKey?: string;
    jwtToken?: string;
    username?: string;
    password?: string;
    headerName?: string;
    headerValue?: string;
  };
  configuration: {
    help: {
      instructions: string;
    };
  };
}

export interface NewService {
  authentication?: {
    type: 'none' | 'api_key' | 'jwt' | 'login';
    apiKey?: string;
    jwtToken?: string;
    username?: string;
    password?: string;
  };
  name: string;
  serviceDefinitionId: string;
  ipType: 'local' | 'remote' | 'cloud' | 'custom';
  customUrl?: string;
}

// Capability Types
export interface LlmChatCapability {
  capability: 'llm_chat';
  endpoints: {
    getModels: Endpoint;
    chat: Endpoint;
    getPersonas?: Endpoint;
  };
  parameters: {
    chat: ParameterDefinition[];
  };
}

export interface HealthCapability {
  capability: 'health';
  endpoints: {
    health: Endpoint;
  };
}

export interface VectorSearchCapability {
  capability: 'vector_search';
  endpoints: {
    search: Endpoint;
    getModels: Endpoint;
    addDocument: Endpoint;
    deleteDocument: Endpoint;
  };
  parameters: {
    search: ParameterDefinition[];
  };
}

export interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'select' | 'boolean';
  defaultValue: any;
  description: string;
  range?: [number, number];
  step?: number;
  optionsEndpoint?: string;
  optionsPath?: string;
  optionsValueKey?: string;
  optionsLabelKey?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelId?: string;
  personaId?: string;
  metadata?: Record<string, any>;
}

// Service State Types
export interface ServiceState {
  services: Service[];
  selectedServiceId: string | null;
  customUrls: string[];
  addService: (serviceData: NewService) => void;
  updateService: (service: Partial<Service> & { id: string }) => void;
  removeService: (serviceId: string) => void;
  setSelectedServiceId: (serviceId: string | null) => void;
  setServices: (services: Service[]) => void;
  getServiceById: (serviceId: string) => Service | undefined;
  addCustomUrl: (url: string) => void;
  updateCustomUrl: (oldUrl: string, newUrl: string) => void;
  removeCustomUrl: (url: string) => void;
  addMessageToHistory: (serviceId: string, message: ChatMessage) => void;
  _hasHydrated: boolean;
  updateServiceLastUsedModel: (serviceId: string, modelId: string) => void;
  checkServiceStatus: (service: Service) => Promise<void>;
  startPeriodicStatusCheck: () => number;
  stopPeriodicStatusCheck: (intervalId: number) => void;
  sortServices: (sortBy: 'name' | 'status' | 'type' | 'lastChecked') => void;
  toggleServiceArchive: (serviceId: string) => void;
} 
