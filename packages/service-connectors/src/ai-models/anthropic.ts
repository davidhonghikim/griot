import type { ServiceDefinition, LlmChatCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/v1/messages', method: 'POST' }
  }
};

const llmChatCapability: LlmChatCapability = {
  capability: 'llm_chat',
  endpoints: {
    chat: { path: '/v1/messages', method: 'POST' },
  },
  parameters: {
    chat: [
      {
        key: 'model',
        label: 'Model',
        type: 'select',
        defaultValue: 'claude-3-5-sonnet-20241022',
        options: [
          { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
          { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
          { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
        ],
        description: 'The Claude model to use for the chat.'
      },
      {
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: 4096,
        range: [1, 8192],
        description: 'The maximum number of tokens to generate.'
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        defaultValue: 0.7,
        range: [0, 1],
        step: 0.1,
        description: 'Controls randomness: lowering results in less random completions.'
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
        key: 'system',
        label: 'System Message',
        type: 'string',
        defaultValue: 'You are a helpful assistant.',
        description: 'The system message to guide the model\'s behavior.'
      }
    ]
  }
};

export const anthropicDefinition: ServiceDefinition = {
  type: 'anthropic',
  name: 'Anthropic Claude',
  category: 'ai-models',
  protocol: 'https',
  defaultPort: 443,
  baseUrl: 'api.anthropic.com',
  docs: {
    api: 'https://docs.anthropic.com/claude/reference',
    main: 'https://anthropic.com'
  },
  authentication: {
    type: 'api_key',
    keyName: 'x-api-key',
    headers: {
      'anthropic-version': '2023-06-01'
    },
    help: 'Get your API key from https://console.anthropic.com/'
  },
  capabilities: [llmChatCapability, healthCapability]
}; 