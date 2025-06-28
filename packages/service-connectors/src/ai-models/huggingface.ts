import type { ServiceDefinition, LlmChatCapability, ModelManagementCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/', method: 'GET' }
  }
};

const llmChatCapability: LlmChatCapability = {
  capability: 'llm_chat',
  endpoints: {
    chat: { path: '/v1/chat/completions', method: 'POST' },
    generate: { path: '/generate', method: 'POST' }
  },
  parameters: {
    chat: [
      {
        key: 'model',
        label: 'Model',
        type: 'string',
        defaultValue: 'microsoft/DialoGPT-medium',
        description: 'The Hugging Face model to use for chat.'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        defaultValue: 0.9,
        range: [0, 2],
        step: 0.1,
        description: 'Controls randomness: lowering results in less random completions.'
      },
      {
        key: 'max_new_tokens',
        label: 'Max New Tokens',
        type: 'number',
        defaultValue: 512,
        description: 'The maximum number of new tokens to generate.'
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
        key: 'repetition_penalty',
        label: 'Repetition Penalty',
        type: 'number',
        defaultValue: 1.1,
        range: [1, 2],
        step: 0.1,
        description: 'The penalty for repeating tokens.'
      },
      {
        key: 'do_sample',
        label: 'Do Sample',
        type: 'boolean',
        defaultValue: true,
        description: 'Whether to use sampling for generation.'
      }
    ]
  }
};

const modelManagementCapability: ModelManagementCapability = {
  capability: 'model_management',
  endpoints: {
    searchModels: { path: '/api/models', method: 'GET' },
    getModelInfo: { path: '/api/models/{model_id}', method: 'GET' }
  },
  parameters: {
    searchModels: [
      {
        key: 'search',
        label: 'Search Query',
        type: 'string',
        defaultValue: '',
        description: 'Search for models by name or description.'
      },
      {
        key: 'filter',
        label: 'Filter',
        type: 'select',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Models' },
          { value: 'text-generation', label: 'Text Generation' },
          { value: 'text2text-generation', label: 'Text-to-Text' },
          { value: 'conversational', label: 'Conversational' },
          { value: 'text-classification', label: 'Text Classification' },
          { value: 'image-classification', label: 'Image Classification' },
          { value: 'image-to-text', label: 'Image to Text' },
          { value: 'text-to-image', label: 'Text to Image' }
        ],
        description: 'Filter models by task type.'
      }
    ],
    getModelInfo: [
      {
        key: 'model_id',
        label: 'Model ID',
        type: 'string',
        defaultValue: '',
        description: 'The Hugging Face model ID (e.g., microsoft/DialoGPT-medium).'
      }
    ]
  }
};

export const huggingfaceDefinition: ServiceDefinition = {
  type: 'huggingface',
  name: 'Hugging Face',
  category: 'ai-models',
  protocol: 'https',
  defaultPort: 443,
  baseUrl: 'api-inference.huggingface.co',
  docs: {
    api: 'https://huggingface.co/docs/api-inference',
    main: 'https://huggingface.co',
    models: 'https://huggingface.co/models'
  },
  authentication: {
    type: 'bearer_token',
    help: 'Get your API token from https://huggingface.co/settings/tokens'
  },
  configuration: {
    help: {
      title: 'Hugging Face Setup',
      instructions: [
        'Create an account at https://huggingface.co',
        'Generate an API token at https://huggingface.co/settings/tokens',
        'Browse models at https://huggingface.co/models',
        'Use the Inference API for quick testing or deploy your own models'
      ].join('\n'),
      links: [
        { label: 'Hugging Face Hub', url: 'https://huggingface.co' },
        { label: 'Model Hub', url: 'https://huggingface.co/models' },
        { label: 'API Documentation', url: 'https://huggingface.co/docs/api-inference' },
        { label: 'Spaces (Apps)', url: 'https://huggingface.co/spaces' }
      ]
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 