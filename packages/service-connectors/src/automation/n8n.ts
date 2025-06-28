import type { ServiceDefinition, AutomationCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/healthz', method: 'GET' }
  }
};

const automationCapability: AutomationCapability = {
  capability: 'automation',
  endpoints: {
    listWorkflows: { path: '/api/v1/workflows', method: 'GET' },
    getWorkflow: { path: '/api/v1/workflows/{id}', method: 'GET' },
    createWorkflow: { path: '/api/v1/workflows', method: 'POST' },
    updateWorkflow: { path: '/api/v1/workflows/{id}', method: 'PUT' },
    deleteWorkflow: { path: '/api/v1/workflows/{id}', method: 'DELETE' },
    activateWorkflow: { path: '/api/v1/workflows/{id}/activate', method: 'POST' },
    deactivateWorkflow: { path: '/api/v1/workflows/{id}/deactivate', method: 'POST' },
    executeWorkflow: { path: '/api/v1/workflows/{workflowId}/executions', method: 'POST' },
    getExecutions: { path: '/api/v1/executions', method: 'GET' },
    getExecution: { path: '/api/v1/executions/{id}', method: 'GET' },
    stopExecution: { path: '/api/v1/executions/{id}/stop', method: 'POST' }
  },
  parameters: {
    executeWorkflow: [
      {
        key: 'workflowId',
        label: 'Workflow',
        type: 'select',
        defaultValue: '',
        description: 'The workflow to execute.',
        optionsEndpoint: 'listWorkflows',
        optionsPath: 'data',
        optionsValueKey: 'id',
        optionsLabelKey: 'name'
      },
      {
        key: 'data',
        label: 'Input Data',
        type: 'string',
        defaultValue: '{}',
        description: 'JSON data to pass to the workflow'
      }
    ],
    getWorkflow: [
      {
        key: 'id',
        label: 'Workflow ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the workflow.'
      }
    ],
    deleteWorkflow: [
      {
        key: 'id',
        label: 'Workflow ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the workflow to delete.'
      }
    ],
    activateWorkflow: [
      {
        key: 'id',
        label: 'Workflow ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the workflow to activate.'
      }
    ],
    deactivateWorkflow: [
      {
        key: 'id',
        label: 'Workflow ID',
        type: 'string',
        defaultValue: '',
        description: 'The ID of the workflow to deactivate.'
      }
    ],
    createWorkflow: [
      {
        key: 'name',
        label: 'Workflow Name',
        type: 'string',
        defaultValue: 'New Workflow',
        description: 'Name of the workflow'
      },
      {
        key: 'nodes',
        label: 'Workflow Nodes',
        type: 'string',
        defaultValue: '[]',
        description: 'JSON array of workflow nodes'
      },
      {
        key: 'connections',
        label: 'Node Connections',
        type: 'string',
        defaultValue: '{}',
        description: 'JSON object defining node connections'
      },
      {
        key: 'active',
        label: 'Active',
        type: 'boolean',
        defaultValue: false,
        description: 'Whether the workflow should be active'
      }
    ],
    getExecutions: [
      {
        key: 'filter',
        label: 'Filter',
        type: 'string',
        defaultValue: '{}',
        description: 'JSON filter for executions'
      },
      {
        key: 'limit',
        label: 'Limit',
        type: 'number',
        defaultValue: 20,
        range: [1, 100],
        description: 'Number of executions to return'
      },
      {
        key: 'includeData',
        label: 'Include Data',
        type: 'boolean',
        defaultValue: false,
        description: 'Include execution data in response'
      }
    ]
  }
};

export const n8nDefinition: ServiceDefinition = {
  type: 'n8n',
  name: 'n8n',
  category: 'automation',
  protocol: 'http',
  defaultPort: 5678,
  docs: {
    api: 'https://docs.n8n.io/api-reference/introduction/',
    main: 'https://n8n.io'
  },
  authentication: {
    type: 'api_key',
    keyName: 'X-N8N-API-KEY',
    help: 'You can find your n8n API key in your instance under Settings > API.'
  },
  configuration: {
    help: {
      title: 'n8n Setup',
      instructions: [
        'Install n8n: npm install -g n8n',
        'Or use Docker: docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n',
        'Start n8n: n8n start',
        'Access the UI at http://localhost:5678',
        'Enable API access in Settings > API',
        'Generate an API key for external access'
      ].join('\n'),
      links: [
        { label: 'n8n Website', url: 'https://n8n.io' },
        { label: 'Documentation', url: 'https://docs.n8n.io' },
        { label: 'API Reference', url: 'https://docs.n8n.io/api-reference/introduction/' },
        { label: 'Community', url: 'https://community.n8n.io' }
      ]
    }
  },
  capabilities: [automationCapability, healthCapability]
}; 