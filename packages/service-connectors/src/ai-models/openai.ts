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
        defaultValue: 'gpt-4',
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
        defaultValue: 0.7,
        range: [0, 2],
        step: 0.1,
        description: 'Controls randomness: lowering results in less random completions.'
      },
      {
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: 2048,
        description: 'The maximum number of tokens to generate.'
      },
      {
        key: 'top_p',
        label: 'Top P',
        type: 'number',
        defaultValue: 1,
        range: [0, 1],
        step: 0.1,
        description: 'The cumulative probability of tokens to consider for sampling.'
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

export const openaiDefinition: ServiceDefinition = {
  type: 'openai',
  name: 'OpenAI',
  category: 'ai-models',
  protocol: 'https',
  defaultPort: 443,
  baseUrl: 'api.openai.com',
  docs: {
    api: 'https://platform.openai.com/docs/api-reference',
    main: 'https://openai.com'
  },
  authentication: {
    type: 'bearer_token',
    help: 'Get your API key from https://platform.openai.com/api-keys'
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 