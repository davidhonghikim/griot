import type { ServiceDefinition, ModelManagementCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/api/v1/models', method: 'GET' }
  }
};

const modelManagementCapability: ModelManagementCapability = {
  capability: 'model_management',
  endpoints: {
    searchModels: { path: '/api/v1/models', method: 'GET' },
    getModel: { path: '/api/v1/models/{id}', method: 'GET' },
    getModelVersions: { path: '/api/v1/models/{id}/versions', method: 'GET' },
    downloadModel: { path: '/api/download/models/{versionId}', method: 'GET' },
    getImages: { path: '/api/v1/images', method: 'GET' },
    getTags: { path: '/api/v1/tags', method: 'GET' }
  },
  parameters: {
    searchModels: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 20,
        range: [1, 100],
        description: 'Number of models to return'
      },
      {
        key: 'page',
        label: 'Page',
        type: 'number',
        defaultValue: 1,
        description: 'Page number for pagination'
      },
      {
        key: 'query',
        label: 'Search Query',
        type: 'string',
        defaultValue: '',
        description: 'Search term for models'
      },
      {
        key: 'tag',
        label: 'Tag',
        type: 'string',
        defaultValue: '',
        description: 'Filter by tag'
      },
      {
        key: 'username',
        label: 'Username',
        type: 'string',
        defaultValue: '',
        description: 'Filter by creator username'
      },
      {
        key: 'types',
        label: 'Model Types',
        type: 'select',
        defaultValue: 'Checkpoint',
        options: [
          { value: 'Checkpoint', label: 'Checkpoint' },
          { value: 'TextualInversion', label: 'Textual Inversion' },
          { value: 'Hypernetwork', label: 'Hypernetwork' },
          { value: 'AestheticGradient', label: 'Aesthetic Gradient' },
          { value: 'LORA', label: 'LoRA' },
          { value: 'Controlnet', label: 'ControlNet' },
          { value: 'Poses', label: 'Poses' }
        ],
        description: 'Type of model to search for'
      },
      {
        key: 'sort',
        label: 'Sort By',
        type: 'select',
        defaultValue: 'Highest Rated',
        options: [
          { value: 'Highest Rated', label: 'Highest Rated' },
          { value: 'Most Downloaded', label: 'Most Downloaded' },
          { value: 'Newest', label: 'Newest' },
          { value: 'Most Liked', label: 'Most Liked' },
          { value: 'Most Discussed', label: 'Most Discussed' }
        ],
        description: 'How to sort the results'
      },
      {
        key: 'period',
        label: 'Time Period',
        type: 'select',
        defaultValue: 'AllTime',
        options: [
          { value: 'AllTime', label: 'All Time' },
          { value: 'Year', label: 'Past Year' },
          { value: 'Month', label: 'Past Month' },
          { value: 'Week', label: 'Past Week' },
          { value: 'Day', label: 'Past Day' }
        ],
        description: 'Time period for sorting'
      }
    ],
    getModel: [
      {
        key: 'id',
        label: 'Model ID',
        type: 'number',
        defaultValue: 0,
        description: 'The ID of the model to retrieve'
      }
    ],
    getModelVersions: [
      {
        key: 'id',
        label: 'Model ID',
        type: 'number',
        defaultValue: 0,
        description: 'The ID of the model to get versions for'
      }
    ],
    downloadModel: [
      {
        key: 'versionId',
        label: 'Version ID',
        type: 'number',
        defaultValue: 0,
        description: 'The ID of the model version to download'
      }
    ],
    getImages: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 20,
        range: [1, 200],
        description: 'Number of images to return'
      },
      {
        key: 'postId',
        label: 'Post ID',
        type: 'number',
        defaultValue: null,
        description: 'Filter by post ID'
      },
      {
        key: 'modelId',
        label: 'Model ID',
        type: 'number',
        defaultValue: null,
        description: 'Filter by model ID'
      },
      {
        key: 'username',
        label: 'Username',
        type: 'string',
        defaultValue: '',
        description: 'Filter by creator username'
      }
    ],
    getTags: [
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 20,
        range: [1, 100],
        description: 'Number of tags to return'
      },
      {
        key: 'page',
        label: 'Page',
        type: 'number',
        defaultValue: 1,
        description: 'Page number for pagination'
      },
      {
        key: 'query',
        label: 'Search Query',
        type: 'string',
        defaultValue: '',
        description: 'Search term for tags'
      }
    ]
  }
};

export const civitaiDefinition: ServiceDefinition = {
  type: 'civitai',
  name: 'Civitai',
  category: 'ai-models',
  protocol: 'https',
  defaultPort: 443,
  baseUrl: 'civitai.com',
  docs: {
    api: 'https://github.com/civitai/civitai/wiki/REST-API-Reference',
    main: 'https://civitai.com'
  },
  authentication: {
    type: 'api_key',
    keyName: 'Authorization',
    help: 'Get your API key from https://civitai.com/user/account (optional for most endpoints)'
  },
  configuration: {
    help: {
      title: 'Civitai Setup',
      instructions: [
        'Civitai is a platform for sharing AI art models.',
        'Most endpoints work without authentication.',
        'For downloads and uploads, create an account and get an API key.',
        'Browse models at https://civitai.com/models',
        'Use the API to search, download, and manage models programmatically.'
      ].join('\n'),
      links: [
        { label: 'Civitai Website', url: 'https://civitai.com' },
        { label: 'Model Browser', url: 'https://civitai.com/models' },
        { label: 'API Documentation', url: 'https://github.com/civitai/civitai/wiki/REST-API-Reference' },
        { label: 'Account Settings', url: 'https://civitai.com/user/account' }
      ]
    }
  },
  capabilities: [modelManagementCapability, healthCapability]
}; 