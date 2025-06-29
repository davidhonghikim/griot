import type { ServiceDefinition, LlmChatCapability, ModelManagementCapability, HealthCapability, StorageCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/health', method: 'GET' }
  }
};

const llmChatCapability: LlmChatCapability = {
  capability: 'llm_chat',
  endpoints: {
    chat: { path: '/v1/chat/completions', method: 'POST' },
  },
  parameters: {
    chat: [
      {
        key: 'model',
        label: 'Model',
        type: 'string',
        defaultValue: 'gemma3b',
        description: 'The ID of the model to use for this request.',
        optionsEndpoint: 'getModels',
        optionsPath: 'data',
        optionsValueKey: 'id',
        optionsLabelKey: 'id'
      },
      {
        key: 'system_prompt',
        label: 'System Prompt',
        type: 'string',
        defaultValue: 'You are a helpful assistant.',
        description: 'The system prompt to guide the model\'s behavior.'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        defaultValue: 0.7,
        range: [0, 2],
        step: 0.1,
        description: 'Controls randomness. Lowering results in less random completions.'
      },
      {
        key: 'top_p',
        label: 'Top P',
        type: 'number',
        defaultValue: 1,
        range: [0, 1],
        step: 0.1,
        description: 'The cumulative probability of tokens to consider for sampling.'
      },
      {
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: 2048,
        description: 'The maximum number of tokens to generate.'
      },
      {
        key: 'seed',
        label: 'Seed',
        type: 'number',
        defaultValue: null,
        description: 'A seed for deterministic sampling.'
      }
    ]
  }
};

const modelManagementCapability: ModelManagementCapability = {
  capability: 'model_management',
  endpoints: {
    getModels: { path: '/v1/models', method: 'GET' }
  },
  parameters: {
    getModels: []
  }
};

const storageCapability: StorageCapability = {
  capability: 'storage',
  endpoints: {
    uploadFile: { path: '/api/v1/files/', method: 'POST' },
    getFiles: { path: '/api/v1/files/', method: 'GET' },
    deleteFile: { path: '/api/v1/files/{file_id}', method: 'DELETE' }
  },
  parameters: {
    uploadFile: [
      {
        key: 'file',
        label: 'File',
        type: 'file',
        defaultValue: null,
        description: 'The file to upload for RAG processing.'
      }
    ],
    deleteFile: [
      {
        key: 'file_id',
        label: 'File ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the file to delete.'
      }
    ]
  }
};

export const openWebUIDefinition: ServiceDefinition = {
  type: 'open-webui',
  name: 'Open WebUI',
  category: 'ai-models',
  hasExternalUi: true,
  protocol: 'http',
  defaultPort: 3000,
  docs: {
    api: 'https://docs.openwebui.com/api/openai',
    main: 'https://openwebui.com',
    github: 'https://github.com/open-webui/open-webui'
  },
  authentication: {
    type: 'bearer_token',
    help: 'Get the JWT token from your browser after logging into Open WebUI (see Developer Tools > Network > Authorization header)'
  },
  configuration: {
    help: {
      title: 'Open WebUI Setup',
      instructions: [
        'Install Open WebUI: pip install open-webui',
        'Or run with Docker: docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main',
        'Access the UI at http://localhost:3000',
        'Connect to Ollama or other OpenAI-compatible services',
        'Upload documents for RAG functionality'
      ].join('\n'),
      links: [
        { label: 'Open WebUI Website', url: 'https://openwebui.com' },
        { label: 'Documentation', url: 'https://docs.openwebui.com' },
        { label: 'GitHub Repository', url: 'https://github.com/open-webui/open-webui' },
        { label: 'Docker Hub', url: 'https://hub.docker.com/r/ghcr.io/open-webui/open-webui' }
      ]
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, storageCapability, healthCapability]
}; 