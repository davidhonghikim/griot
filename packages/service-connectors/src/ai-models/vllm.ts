import type { ServiceDefinition, LlmChatCapability, ModelManagementCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/v1/models', method: 'GET' }
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
        type: 'select',
        defaultValue: '',
        description: 'The model to use for the chat.',
        optionsEndpoint: 'getModels',
        optionsPath: 'data',
        optionsValueKey: 'id',
        optionsLabelKey: 'id'
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
        step: 0.05,
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
    getModels: { path: '/v1/models', method: 'GET' }
  },
  parameters: {
    getModels: []
  }
};

export const vllmDefinition: ServiceDefinition = {
  type: 'vllm',
  name: 'vLLM',
  category: 'ai-models',
  protocol: 'http',
  defaultPort: 8000,
  docs: {
    api: 'https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server',
    main: 'https://vllm.ai'
  },
  authentication: {
    type: 'bearer_token',
    defaultValue: 'token-abc123'
  },
  configuration: {
    arguments: {
      host: {
        flag: '--host 0.0.0.0',
        description: 'Binds the server to all available network interfaces.',
        required: true
      },
      port: {
        flag: '--port 8000',
        description: 'Port to serve on.',
        required: false
      }
    },
    help: {
      title: 'vLLM Setup',
      instructions: [
        'Install vLLM: pip install vllm',
        'Start the server: python -m vllm.entrypoints.openai.api_server --model <model_name> --host 0.0.0.0 --port 8000',
        'Access the API at http://localhost:8000',
        'Compatible with OpenAI API format'
      ].join('\n'),
      links: [
        { label: 'vLLM Documentation', url: 'https://docs.vllm.ai' },
        { label: 'OpenAI Server Guide', url: 'https://docs.vllm.ai/en/latest/getting_started/quickstart.html#openai-compatible-server' },
        { label: 'GitHub Repository', url: 'https://github.com/vllm-project/vllm' }
      ]
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 