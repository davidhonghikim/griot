"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWebUIDefinition = void 0;
const chatParameters = [
    {
        key: 'model',
        label: 'Model',
        type: 'select',
        defaultValue: 'llama3.2:3b',
        description: 'The model to use for chat.',
        optionsEndpoint: 'getModels',
        optionsPath: 'models',
        optionsValueKey: 'name',
        optionsLabelKey: 'name'
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
        key: 'maxTokens',
        label: 'Max Tokens',
        type: 'number',
        defaultValue: 2048,
        range: [1, 8192],
        step: 1,
        description: 'The maximum number of tokens to generate.'
    }
];
const healthCapability = {
    capability: 'health',
    endpoints: {
        health: { path: '/api/v1/health', method: 'GET' }
    }
};
const llmChatCapability = {
    capability: 'llm_chat',
    endpoints: {
        getModels: { path: '/api/v1/models', method: 'GET' },
        chat: { path: '/api/v1/chat/completions', method: 'POST' }
    },
    parameters: {
        chat: chatParameters
    }
};
exports.openWebUIDefinition = {
    type: 'openwebui',
    name: 'OpenWebUI',
    category: 'ai',
    defaultPort: 3000,
    docs: {
        api: 'https://docs.openwebui.com/api/'
    },
    authentication: {
        type: 'api_key',
        headerName: 'Authorization',
        headerValue: 'Bearer {api_key}'
    },
    configuration: {
        help: {
            instructions: 'OpenWebUI provides a web interface for Ollama. Configure the API key in the service settings.'
        }
    },
    capabilities: [llmChatCapability, healthCapability]
};
