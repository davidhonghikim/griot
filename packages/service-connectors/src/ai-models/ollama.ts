import type { ServiceDefinition, LlmChatCapability, ModelManagementCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/api/tags', method: 'GET' }
  }
};

const llmChatCapability: LlmChatCapability = {
  capability: 'llm_chat',
  endpoints: {
    chat: { path: '/api/chat', method: 'POST' },
    generate: { path: '/api/generate', method: 'POST' }
  },
  parameters: {
    chat: [
      {
        key: 'model',
        label: 'Model',
        type: 'select',
        defaultValue: 'llama3.2',
        description: 'The model to use for the chat.',
        optionsEndpoint: 'getModels',
        optionsPath: 'models',
        optionsValueKey: 'name',
        optionsLabelKey: 'name'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        defaultValue: 0.8,
        range: [0, 2],
        step: 0.1,
        description: 'Controls randomness: lowering results in less random completions.'
      },
      {
        key: 'top_p',
        label: 'Top P',
        type: 'number',
        defaultValue: 0.9,
        range: [0, 1],
        step: 0.1,
        description: 'The cumulative probability of tokens to consider for sampling.'
      },
      {
        key: 'top_k',
        label: 'Top K',
        type: 'number',
        defaultValue: 40,
        range: [1, 100],
        description: 'Reduces the probability of generating nonsense.'
      },
      {
        key: 'num_predict',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: 128,
        description: 'Maximum number of tokens to predict.'
      },
      {
        key: 'stream',
        label: 'Stream',
        type: 'boolean',
        defaultValue: false,
        description: 'Stream the response.'
      }
    ]
  }
};

const modelManagementCapability: ModelManagementCapability = {
  capability: 'model_management',
  endpoints: {
    getModels: { path: '/api/tags', method: 'GET' },
    pullModel: { path: '/api/pull', method: 'POST' },
    deleteModel: { path: '/api/delete', method: 'DELETE' },
    showModel: { path: '/api/show', method: 'POST' }
  },
  parameters: {
    getModels: [],
    pullModel: [
      {
        key: 'name',
        label: 'Model Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the model to pull (e.g., llama3.2, codellama)'
      }
    ],
    deleteModel: [
      {
        key: 'name',
        label: 'Model Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the model to delete'
      }
    ],
    showModel: [
      {
        key: 'name',
        label: 'Model Name',
        type: 'string',
        defaultValue: '',
        description: 'Name of the model to show details for'
      }
    ]
  }
};

export const ollamaDefinition: ServiceDefinition = {
  type: 'ollama',
  name: 'Ollama',
  category: 'ai-models',
  protocol: {
    primary: 'https',
    fallback: 'http'
  },
  defaultPort: 11434,
  docs: {
    api: 'https://github.com/ollama/ollama/blob/main/docs/api.md',
    main: 'https://ollama.ai'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    help: {
      title: 'Ollama Setup',
      instructions: [
        'Install Ollama from https://ollama.ai',
        'Pull a model: ollama pull llama3.2',
        'Start the server: ollama serve',
        'Access the API at http://localhost:11434',
        'For HTTPS: Set up nginx/caddy reverse proxy with SSL certificates',
        'The connector will automatically try HTTPS first, then fallback to HTTP'
      ].join('\n'),
      links: [
        { label: 'Download Ollama', url: 'https://ollama.ai' },
        { label: 'Model Library', url: 'https://ollama.ai/library' },
        { label: 'API Documentation', url: 'https://github.com/ollama/ollama/blob/main/docs/api.md' },
        { label: 'Nginx SSL Setup', url: 'https://nginx.org/en/docs/http/configuring_https_servers.html' },
        { label: 'Caddy Reverse Proxy', url: 'https://caddyserver.com/docs/quick-starts/reverse-proxy' }
      ]
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 