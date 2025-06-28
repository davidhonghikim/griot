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
        defaultValue: 0.7,
        range: [0, 2],
        step: 0.1,
        description: 'Controls randomness. Higher values make the output more random.'
      },
      {
        key: 'top_p',
        label: 'Top P',
        type: 'number',
        defaultValue: 0.95,
        range: [0, 1],
        step: 0.05,
        description: 'Nucleus sampling. The model considers the results of the tokens with top_p probability mass.'
      },
      {
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: -1,
        description: 'The maximum number of tokens to generate. -1 for unlimited.'
      },
      {
        key: 'seed',
        label: 'Seed',
        type: 'number',
        defaultValue: -1,
        description: 'Seed for random number generation. -1 for random.'
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

export const llmStudioDefinition: ServiceDefinition = {
  type: 'llm-studio',
  name: 'LM Studio',
  category: 'ai-models',
  protocol: 'http',
  defaultPort: 1234,
  docs: {
    api: 'https://lmstudio.ai/docs/local-server',
    main: 'https://lmstudio.ai'
  },
  authentication: {
    type: 'bearer_token',
    defaultValue: 'lm-studio'
  },
  configuration: {
    help: {
      title: 'LM Studio Setup',
      instructions: [
        'Download and install LM Studio from https://lmstudio.ai',
        'Download a model from the Discover tab',
        'Go to the Local Server tab',
        'Load a model and start the server',
        'The server will be available at http://localhost:1234'
      ].join('\n'),
      links: [
        { label: 'LM Studio Website', url: 'https://lmstudio.ai' },
        { label: 'Documentation', url: 'https://lmstudio.ai/docs' },
        { label: 'Local Server Guide', url: 'https://lmstudio.ai/docs/local-server' }
      ]
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 