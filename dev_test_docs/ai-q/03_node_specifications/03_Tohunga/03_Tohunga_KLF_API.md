---
title: "Tohunga Node KLF API"
version: 2.0
---

# **Tohunga Node KLF API**

## **Purpose**

The Tohunga Node provides a **universal service integration framework** that enables dynamic connection to any AI service, local or remote, commercial or self-hosted. It uses modular, reusable patterns that allow any agent to connect to services without hardcoding specific implementations.

## **Core Design Principles**

### **1. Service Agnostic Architecture**
- **No Hardcoded Services**: Framework works with any service that follows the patterns
- **Dynamic Discovery**: Services are discovered and connected at runtime
- **Modular Connectors**: Each service type has a reusable connector pattern
- **Configuration Driven**: All connections defined in configuration, not code

### **2. Universal Connection Patterns**
- **Local Services**: Direct connection to localhost services
- **Remote Services**: Network connection to remote hosts (192.168.1.180, etc.)
- **Commercial APIs**: Cloud service integration with API keys
- **Hybrid Deployments**: Mix of local, remote, and cloud services

### **3. Reusable Service Types**
- **Language Models**: GPT, Claude, Ollama, local models
- **Image Generation**: Stable Diffusion, DALL-E, ComfyUI
- **Audio Processing**: ElevenLabs, Whisper, local audio tools
- **Vector Databases**: Chroma, Pinecone, Qdrant, Milvus
- **Search Services**: Elasticsearch, Tavily, custom search
- **Storage Services**: S3, IPFS, local filesystem, Dropbox

## **Universal Service Integration API**

### **1. Service Discovery and Registration**

#### **Register Service**
```typescript
// Universal service registration - works with any service type
interface RegisterServiceRequest {
  messageType: "TOHUNGA_REGISTER_SERVICE_REQUEST";
  payload: {
    serviceId: string;
    serviceType: ServiceType;
    connectionConfig: ServiceConnectionConfig;
    capabilities: ServiceCapabilities;
    authentication?: ServiceAuthentication;
    healthCheck?: HealthCheckConfig;
  };
}

enum ServiceType {
  // Language Models
  LANGUAGE_MODEL = "language_model",
  CHAT_MODEL = "chat_model",
  COMPLETION_MODEL = "completion_model",
  
  // Image Generation
  IMAGE_GENERATION = "image_generation",
  IMAGE_EDITING = "image_editing",
  IMAGE_ANALYSIS = "image_analysis",
  
  // Audio Processing
  TEXT_TO_SPEECH = "text_to_speech",
  SPEECH_TO_TEXT = "speech_to_text",
  AUDIO_PROCESSING = "audio_processing",
  
  // Vector Databases
  VECTOR_DATABASE = "vector_database",
  EMBEDDING_SERVICE = "embedding_service",
  
  // Search Services
  SEARCH_SERVICE = "search_service",
  WEB_SEARCH = "web_search",
  
  // Storage Services
  FILE_STORAGE = "file_storage",
  OBJECT_STORAGE = "object_storage",
  
  // Custom Services
  CUSTOM_SERVICE = "custom_service"
}

interface ServiceConnectionConfig {
  // Connection Type
  connectionType: "local" | "remote" | "cloud" | "hybrid";
  
  // Network Configuration
  network?: {
    host: string; // localhost, 192.168.1.180, api.openai.com
    port?: number; // 11434 for Ollama, 8000 for local services
    protocol: "http" | "https" | "ws" | "tcp";
    endpoint?: string; // /v1/chat/completions, /api/generate
  };
  
  // Local Service Configuration
  local?: {
    executable?: string; // Path to service executable
    workingDirectory?: string;
    environment?: Record<string, string>;
    startupCommand?: string;
    healthCheckUrl?: string;
  };
  
  // Remote Service Configuration
  remote?: {
    sshConfig?: {
      host: string;
      port: number;
      username: string;
      privateKeyPath?: string;
    };
    tunnelConfig?: {
      localPort: number;
      remotePort: number;
    };
  };
  
  // Cloud Service Configuration
  cloud?: {
    apiKey?: string;
    organization?: string;
    region?: string;
    version?: string;
  };
  
  // Connection Parameters
  connectionParams: {
    timeout: number; // milliseconds
    retries: number;
    rateLimit?: {
      requestsPerMinute: number;
      burstLimit: number;
    };
    circuitBreaker?: {
      failureThreshold: number;
      recoveryTimeout: number;
    };
  };
}

interface ServiceCapabilities {
  // Service-specific capabilities
  supportedModels?: string[];
  supportedFormats?: string[];
  supportedOperations?: string[];
  
  // Performance characteristics
  maxConcurrentRequests?: number;
  maxInputSize?: number;
  maxOutputSize?: number;
  
  // Cost information
  pricingModel?: "per_token" | "per_request" | "per_minute" | "free";
  costPerToken?: number;
  costPerRequest?: number;
  
  // Quality metrics
  responseTime?: number;
  accuracy?: number;
  reliability?: number;
}

interface ServiceAuthentication {
  type: "api_key" | "bearer_token" | "oauth" | "none";
  credentials: {
    apiKey?: string;
    bearerToken?: string;
    clientId?: string;
    clientSecret?: string;
  };
  headers?: Record<string, string>;
}
```

#### **Service Response**
```typescript
interface RegisterServiceResponse {
  messageType: "TOHUNGA_REGISTER_SERVICE_RESPONSE";
  payload: {
    serviceId: string;
    status: "registered" | "failed";
    healthStatus: "healthy" | "unhealthy" | "unknown";
    connectionInfo: {
      latency: number;
      throughput: number;
      errorRate: number;
    };
    capabilities: ServiceCapabilities;
    estimatedCosts?: CostEstimate;
  };
}
```

### **2. Universal Service Execution**

#### **Execute Service Request**
```typescript
// Universal service execution - works with any registered service
interface ExecuteServiceRequest {
  messageType: "TOHUNGA_EXECUTE_SERVICE_REQUEST";
  payload: {
    requestId: string;
    serviceId: string;
    operation: ServiceOperation;
    parameters: ServiceParameters;
    options?: ExecutionOptions;
  };
}

interface ServiceOperation {
  // Universal operation types
  type: OperationType;
  subType?: string; // Service-specific operation
  
  // Operation metadata
  description?: string;
  expectedInput?: string;
  expectedOutput?: string;
  estimatedDuration?: number;
}

enum OperationType {
  // Language Model Operations
  TEXT_GENERATION = "text_generation",
  CHAT_COMPLETION = "chat_completion",
  TEXT_ANALYSIS = "text_analysis",
  TRANSLATION = "translation",
  
  // Image Operations
  IMAGE_GENERATION = "image_generation",
  IMAGE_EDITING = "image_editing",
  IMAGE_ANALYSIS = "image_analysis",
  IMAGE_CONVERSION = "image_conversion",
  
  // Audio Operations
  SPEECH_SYNTHESIS = "speech_synthesis",
  SPEECH_RECOGNITION = "speech_recognition",
  AUDIO_PROCESSING = "audio_processing",
  AUDIO_CONVERSION = "audio_conversion",
  
  // Vector Operations
  EMBEDDING_GENERATION = "embedding_generation",
  VECTOR_SEARCH = "vector_search",
  VECTOR_STORAGE = "vector_storage",
  
  // Search Operations
  WEB_SEARCH = "web_search",
  DOCUMENT_SEARCH = "document_search",
  KNOWLEDGE_SEARCH = "knowledge_search",
  
  // Storage Operations
  FILE_UPLOAD = "file_upload",
  FILE_DOWNLOAD = "file_download",
  FILE_DELETE = "file_delete",
  FILE_SEARCH = "file_search",
  
  // Custom Operations
  CUSTOM_OPERATION = "custom_operation"
}

interface ServiceParameters {
  // Universal parameters that work across services
  input?: {
    text?: string;
    images?: string[]; // URLs or base64
    audio?: string; // URL or base64
    files?: string[]; // File paths or URLs
    data?: any; // Structured data
  };
  
  // Service-specific parameters
  serviceParams?: Record<string, any>;
  
  // Quality and performance parameters
  quality?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  
  // Output parameters
  output?: {
    format?: string;
    size?: string;
    quality?: string;
    options?: Record<string, any>;
  };
}

interface ExecutionOptions {
  // Execution preferences
  priority?: "low" | "normal" | "high" | "critical";
  timeout?: number;
  retries?: number;
  
  // Cost optimization
  costLimit?: number;
  preferCheaper?: boolean;
  
  // Quality preferences
  preferFaster?: boolean;
  preferHigherQuality?: boolean;
  
  // Fallback options
  fallbackServices?: string[];
  allowPartialResults?: boolean;
}
```

#### **Service Execution Response**
```typescript
interface ExecuteServiceResponse {
  messageType: "TOHUNGA_EXECUTE_SERVICE_RESPONSE";
  payload: {
    requestId: string;
    serviceId: string;
    status: "completed" | "failed" | "partial";
    
    // Results
    results: ServiceResults;
    
    // Performance metrics
    performance: {
      executionTime: number;
      tokensUsed?: number;
      cost?: number;
      quality?: number;
    };
    
    // Service information
    serviceInfo: {
      model?: string;
      version?: string;
      capabilities?: string[];
    };
  };
}

interface ServiceResults {
  // Universal result types
  text?: string;
  images?: string[]; // URLs to generated images
  audio?: string; // URL to generated audio
  files?: string[]; // URLs to generated files
  data?: any; // Structured results
  
  // Metadata
  metadata?: {
    confidence?: number;
    alternatives?: any[];
    warnings?: string[];
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
  };
}
```

### **3. Service Management Operations**

#### **List Available Services**
```typescript
interface ListServicesRequest {
  messageType: "TOHUNGA_LIST_SERVICES_REQUEST";
  payload: {
    filters?: {
      serviceType?: ServiceType;
      connectionType?: "local" | "remote" | "cloud";
      status?: "healthy" | "unhealthy" | "all";
      capabilities?: string[];
    };
    includeMetrics?: boolean;
  };
}

interface ListServicesResponse {
  messageType: "TOHUNGA_LIST_SERVICES_RESPONSE";
  payload: {
    services: ServiceInfo[];
    summary: {
      total: number;
      healthy: number;
      local: number;
      remote: number;
      cloud: number;
    };
  };
}

interface ServiceInfo {
  serviceId: string;
  serviceType: ServiceType;
  connectionType: "local" | "remote" | "cloud";
  status: "healthy" | "unhealthy" | "unknown";
  capabilities: ServiceCapabilities;
  metrics?: {
    latency: number;
    throughput: number;
    errorRate: number;
    costPerRequest: number;
  };
  lastUsed?: number;
}
```

#### **Service Health Check**
```typescript
interface HealthCheckRequest {
  messageType: "TOHUNGA_HEALTH_CHECK_REQUEST";
  payload: {
    serviceId?: string; // If not provided, checks all services
    detailed?: boolean;
  };
}

interface HealthCheckResponse {
  messageType: "TOHUNGA_HEALTH_CHECK_RESPONSE";
  payload: {
    services: {
      [serviceId: string]: {
        status: "healthy" | "unhealthy" | "unknown";
        latency: number;
        errorRate: number;
        lastCheck: number;
        details?: {
          connectionStatus: string;
          serviceStatus: string;
          errors?: string[];
        };
      };
    };
    summary: {
      total: number;
      healthy: number;
      unhealthy: number;
      averageLatency: number;
    };
  };
}
```

## **Configuration Management**

### **Environment Configuration**
```typescript
// Environment variables for service configuration
interface EnvironmentConfig {
  // Network Configuration
  KOS_NETWORK_HOST?: string; // Default: localhost
  KOS_NETWORK_PORT?: number; // Default: 8080
  KOS_REMOTE_HOST?: string; // Default: 192.168.1.180
  
  // Service Discovery
  KOS_SERVICE_DISCOVERY_ENABLED?: boolean; // Default: true
  KOS_SERVICE_REGISTRY_URL?: string;
  
  // Authentication
  KOS_API_KEY?: string;
  KOS_ORGANIZATION_ID?: string;
  
  // Service-specific configurations
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  ELEVENLABS_API_KEY?: string;
  STABILITY_API_KEY?: string;
  
  // Local service paths
  OLLAMA_PATH?: string; // Default: /usr/local/bin/ollama
  COMFYUI_PATH?: string; // Default: /opt/comfyui
  STABLE_DIFFUSION_PATH?: string; // Default: /opt/stable-diffusion
  
  // Performance settings
  KOS_MAX_CONCURRENT_REQUESTS?: number; // Default: 50
  KOS_REQUEST_TIMEOUT?: number; // Default: 30000ms
  KOS_RETRY_ATTEMPTS?: number; // Default: 3
  
  // Cost management
  KOS_COST_LIMIT_PER_DAY?: number;
  KOS_COST_ALERT_THRESHOLD?: number;
  
  // Logging and monitoring
  KOS_LOG_LEVEL?: "debug" | "info" | "warn" | "error";
  KOS_METRICS_ENABLED?: boolean; // Default: true
}
```

### **Service Configuration File**
```yaml
# config/services.yaml
services:
  # Local Services
  local_ollama:
    type: language_model
    connection:
      type: local
      network:
        host: localhost
        port: 11434
        protocol: http
        endpoint: /api/generate
      local:
        executable: /usr/local/bin/ollama
        healthCheckUrl: http://localhost:11434/api/tags
    capabilities:
      supportedModels: ["llama3:8b", "mistral:7b", "codellama:7b"]
      maxConcurrentRequests: 10
      pricingModel: free
    authentication:
      type: none

  local_comfyui:
    type: image_generation
    connection:
      type: local
      network:
        host: localhost
        port: 8188
        protocol: http
        endpoint: /prompt
      local:
        executable: /opt/comfyui/main.py
        workingDirectory: /opt/comfyui
    capabilities:
      supportedModels: ["stable-diffusion", "sdxl", "kandinsky"]
      supportedFormats: ["png", "jpg", "webp"]
      pricingModel: free

  # Remote Services
  remote_ollama:
    type: language_model
    connection:
      type: remote
      network:
        host: 192.168.1.180
        port: 11434
        protocol: http
        endpoint: /api/generate
      remote:
        sshConfig:
          host: 192.168.1.180
          port: 22
          username: kos
          privateKeyPath: ~/.ssh/kos_rsa
    capabilities:
      supportedModels: ["llama3:70b", "mixtral:8x7b"]
      maxConcurrentRequests: 5
      pricingModel: free

  # Cloud Services
  openai_gpt4:
    type: language_model
    connection:
      type: cloud
      network:
        host: api.openai.com
        port: 443
        protocol: https
        endpoint: /v1/chat/completions
      cloud:
        apiKey: ${OPENAI_API_KEY}
        organization: ${KOS_ORGANIZATION_ID}
    capabilities:
      supportedModels: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]
      maxConcurrentRequests: 20
      pricingModel: per_token
      costPerToken: 0.00003
    authentication:
      type: api_key
      credentials:
        apiKey: ${OPENAI_API_KEY}

  anthropic_claude:
    type: language_model
    connection:
      type: cloud
      network:
        host: api.anthropic.com
        port: 443
        protocol: https
        endpoint: /v1/messages
      cloud:
        apiKey: ${ANTHROPIC_API_KEY}
    capabilities:
      supportedModels: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
      maxConcurrentRequests: 15
      pricingModel: per_token
      costPerToken: 0.000015

  elevenlabs_tts:
    type: text_to_speech
    connection:
      type: cloud
      network:
        host: api.elevenlabs.io
        port: 443
        protocol: https
        endpoint: /v1/text-to-speech
      cloud:
        apiKey: ${ELEVENLABS_API_KEY}
    capabilities:
      supportedModels: ["eleven_monolingual_v1", "eleven_multilingual_v1"]
      supportedFormats: ["mp3", "wav", "flac"]
      maxConcurrentRequests: 10
      pricingModel: per_request
      costPerRequest: 0.0001

# Service Groups for Load Balancing
service_groups:
  language_models:
    - local_ollama
    - remote_ollama
    - openai_gpt4
    - anthropic_claude
    loadBalancing: round_robin
    fallback: true

  image_generation:
    - local_comfyui
    - stability_ai
    loadBalancing: least_loaded
    fallback: true

# Performance Settings
performance:
  maxConcurrentRequests: 50
  requestTimeout: 30000
  retryAttempts: 3
  circuitBreaker:
    failureThreshold: 5
    recoveryTimeout: 60000

# Cost Management
cost_management:
  dailyLimit: 100.00
  alertThreshold: 80.00
  optimization:
    preferCheaper: true
    costLimit: 0.10
```

## **Real-World Usage Examples**

### **Example 1: Dynamic Language Model Selection**
```typescript
// Request text generation - Tohunga automatically selects best service
const request: ExecuteServiceRequest = {
  messageType: "TOHUNGA_EXECUTE_SERVICE_REQUEST",
  payload: {
    requestId: "req_123",
    serviceId: "language_models", // Service group
    operation: {
      type: OperationType.TEXT_GENERATION,
      subType: "chat_completion"
    },
    parameters: {
      input: { text: "Explain quantum computing in simple terms" },
      quality: {
        model: "auto", // Let Tohunga choose best model
        temperature: 0.7,
        maxTokens: 500
      }
    },
    options: {
      preferCheaper: true,
      costLimit: 0.05,
      timeout: 30000
    }
  }
};

// Tohunga automatically:
// 1. Checks available services (local_ollama, openai_gpt4, anthropic_claude)
// 2. Calculates costs and performance for each
// 3. Selects local_ollama (free, fast, available)
// 4. Executes the request
// 5. Returns results with cost and performance metrics
```

### **Example 2: Multi-Service Pipeline**
```typescript
// Create a complete video production pipeline
const pipeline = {
  steps: [
    {
      serviceId: "language_models",
      operation: {
        type: OperationType.TEXT_GENERATION,
        subType: "script_writing"
      },
      parameters: {
        input: { text: "Write a 30-second script about AI innovation" },
        quality: { model: "auto", temperature: 0.8 }
      }
    },
    {
      serviceId: "elevenlabs_tts",
      operation: {
        type: OperationType.SPEECH_SYNTHESIS
      },
      parameters: {
        input: { text: "[script from step 1]" },
        output: { format: "mp3", quality: "high" }
      }
    },
    {
      serviceId: "local_comfyui",
      operation: {
        type: OperationType.IMAGE_GENERATION
      },
      parameters: {
        input: { text: "Professional presentation background" },
        output: { format: "png", size: "1920x1080" }
      }
    }
  ]
};

// Tohunga orchestrates the entire pipeline:
// 1. Executes each step in sequence
// 2. Passes outputs between steps
// 3. Handles failures and retries
// 4. Tracks costs and performance
// 5. Returns complete package
```

### **Example 3: Service Discovery and Registration**
```typescript
// Register a new local service discovered on the network
const registerRequest: RegisterServiceRequest = {
  messageType: "TOHUNGA_REGISTER_SERVICE_REQUEST",
  payload: {
    serviceId: "discovered_ollama",
    serviceType: ServiceType.LANGUAGE_MODEL,
    connectionConfig: {
      connectionType: "remote",
      network: {
        host: "192.168.1.180",
        port: 11434,
        protocol: "http",
        endpoint: "/api/generate"
      },
      connectionParams: {
        timeout: 30000,
        retries: 3,
        rateLimit: { requestsPerMinute: 60, burstLimit: 10 }
      }
    },
    capabilities: {
      supportedModels: ["llama3:70b", "mixtral:8x7b"],
      maxConcurrentRequests: 5,
      pricingModel: "free"
    },
    healthCheck: {
      url: "http://192.168.1.180:11434/api/tags",
      interval: 30000
    }
  }
};

// Tohunga automatically:
// 1. Tests the connection
// 2. Discovers available models
// 3. Measures performance
// 4. Registers the service
// 5. Makes it available for use
```

## **Deployment Examples**

### **Raspberry Pi Node**
```bash
# Install on Raspberry Pi
sudo apt update
sudo apt install -y python3 python3-pip nodejs npm

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Install kOS Tohunga Node
git clone https://github.com/your-org/kos-tohunga-node.git
cd kos-tohunga-node
npm install

# Configure for local services
cat > config/services.yaml << EOF
services:
  local_ollama:
    type: language_model
    connection:
      type: local
      network:
        host: localhost
        port: 11434
        protocol: http
    capabilities:
      supportedModels: ["llama3:8b", "mistral:7b"]
      pricingModel: free
EOF

# Start the node
npm start
```

### **Windows Server Node**
```powershell
# Install on Windows Server
# Download and install Node.js from https://nodejs.org/

# Install Ollama
winget install Ollama.Ollama

# Clone and configure kOS node
git clone https://github.com/your-org/kos-tohunga-node.git
cd kos-tohunga-node
npm install

# Configure for remote connections
# Edit config/services.yaml to include remote hosts

# Start as Windows service
nssm install KOSTohungaNode "C:\Program Files\nodejs\node.exe" "C:\kos-tohunga-node\index.js"
nssm start KOSTohungaNode
```

### **Mac Development Node**
```bash
# Install on Mac
brew install node
brew install ollama

# Install kOS node
git clone https://github.com/your-org/kos-tohunga-node.git
cd kos-tohunga-node
npm install

# Configure for development
cat > .env << EOF
KOS_NETWORK_HOST=localhost
KOS_NETWORK_PORT=8080
KOS_LOG_LEVEL=debug
KOS_METRICS_ENABLED=true
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
EOF

# Start development server
npm run dev
```

## **Success Criteria**

A successful Tohunga implementation should enable:
- ✅ Dynamic connection to any AI service (local, remote, cloud)
- ✅ Automatic service discovery and registration
- ✅ Intelligent service selection based on cost, performance, and availability
- ✅ Seamless fallback between services
- ✅ Complete audit trail and cost tracking
- ✅ Scalable deployment across any platform (RPi, Windows, Mac, Linux)
- ✅ Configuration-driven setup with environment variable overrides

---

**Version**: 2.0  
**Focus**: Modular, reusable service integration framework 