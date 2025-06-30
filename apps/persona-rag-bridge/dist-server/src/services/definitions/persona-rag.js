"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personaRAGDefinition = void 0;
const chatParameters = [
    {
        key: 'model',
        label: 'Model',
        type: 'select',
        defaultValue: 'llama3.2:3b',
        description: 'The model to use for persona-based chat.',
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
    },
    {
        key: 'personaId',
        label: 'Persona ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the persona to use for this conversation.'
    }
];
const healthCapability = {
    capability: 'health',
    endpoints: {
        health: { path: '/health', method: 'GET' }
    }
};
const llmChatCapability = {
    capability: 'llm_chat',
    endpoints: {
        getModels: { path: '/api/models', method: 'GET' },
        chat: { path: '/api/chat', method: 'POST' },
        getPersonas: { path: '/api/personas', method: 'GET' }
    },
    parameters: {
        chat: chatParameters
    }
};
exports.personaRAGDefinition = {
    type: 'persona_rag',
    name: 'Persona RAG',
    category: 'ai',
    defaultPort: 11434,
    docs: {
        api: 'https://github.com/griot-node/persona-rag'
    },
    authentication: {
        type: 'none'
    },
    configuration: {
        help: {
            instructions: 'PersonaRAG service provides persona-based chat with RAG capabilities. It should be running on the specified host and port.'
        }
    },
    capabilities: [llmChatCapability, healthCapability]
};
