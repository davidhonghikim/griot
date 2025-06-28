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
        defaultValue: 'gpt-3.5-turbo',
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
      },
      {
        key: 'frequency_penalty',
        label: 'Frequency Penalty',
        type: 'number',
        defaultValue: 0,
        range: [-2, 2],
        step: 0.1,
        description: 'Positive values penalize new tokens based on their existing frequency.'
      },
      {
        key: 'presence_penalty',
        label: 'Presence Penalty',
        type: 'number',
        defaultValue: 0,
        range: [-2, 2],
        step: 0.1,
        description: 'Positive values penalize new tokens based on whether they appear in the text so far.'
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

export const openaiCompatibleDefinition: ServiceDefinition = {
  type: 'openai-compatible',
  name: 'OpenAI Compatible API',
  category: 'ai-models',
  protocol: 'http',
  defaultPort: 8000,
  docs: {
    api: 'https://platform.openai.com/docs/api-reference',
    main: 'https://github.com/openai/openai-openapi'
  },
  authentication: {
    type: 'bearer_token',
    help: 'Provide the API key for your OpenAI-compatible service'
  },
  configuration: {
    help: {
      title: 'OpenAI Compatible API',
      instructions: [
        'This connector works with any service that implements the OpenAI API specification.',
        'Common examples: vLLM, LM Studio, Text Generation WebUI, LocalAI, etc.',
        'Configure the base URL to point to your service endpoint.',
        'Some services may not require authentication - leave the token empty if not needed.'
      ].join('\n')
    }
  },
  capabilities: [llmChatCapability, modelManagementCapability, healthCapability]
}; 