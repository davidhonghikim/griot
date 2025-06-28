import type { ServiceDefinition, LlmChatCapability, HealthCapability } from '../types';

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
    completion: { path: '/completion', method: 'POST' }
  },
  parameters: {
    chat: [
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
        defaultValue: 0.95,
        range: [0, 1],
        step: 0.05,
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
        key: 'max_tokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: -1,
        description: 'The maximum number of tokens to generate. -1 for unlimited.'
      },
      {
        key: 'stream',
        label: 'Stream',
        type: 'boolean',
        defaultValue: false,
        description: 'Stream the response.'
      },
      {
        key: 'stop',
        label: 'Stop Sequences',
        type: 'string',
        defaultValue: '',
        description: 'Comma-separated list of sequences where the API will stop generating.'
      }
    ]
  }
};

export const llamaCppDefinition: ServiceDefinition = {
  type: 'llama-cpp',
  name: 'llama.cpp Server',
  category: 'ai-models',
  protocol: 'http',
  defaultPort: 8080,
  docs: {
    api: 'https://github.com/ggerganov/llama.cpp/tree/master/examples/server',
    main: 'https://github.com/ggerganov/llama.cpp'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    help: {
      title: 'llama.cpp Server Setup',
      instructions: [
        'Build llama.cpp with server support: make server',
        'Download a GGUF model file',
        'Start the server: ./server -m path/to/model.gguf --host 0.0.0.0 --port 8080',
        'Access the API at http://localhost:8080'
      ].join('\n'),
      links: [
        { label: 'llama.cpp Repository', url: 'https://github.com/ggerganov/llama.cpp' },
        { label: 'Server Documentation', url: 'https://github.com/ggerganov/llama.cpp/tree/master/examples/server' },
        { label: 'Model Downloads', url: 'https://huggingface.co/models?library=gguf' }
      ]
    }
  },
  capabilities: [llmChatCapability, healthCapability]
}; 