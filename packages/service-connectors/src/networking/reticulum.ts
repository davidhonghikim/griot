import type { ServiceDefinition, HealthCapability, MeshNetworkingCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/status', method: 'GET' }
  }
};

// Reticulum mesh networking capability
const meshNetworkingCapability: MeshNetworkingCapability = {
  capability: 'mesh_networking',
  endpoints: {
    getNodes: { path: '/nodes', method: 'GET' },
    sendMessage: { path: '/message', method: 'POST' },
    getMessages: { path: '/messages', method: 'GET' },
    announce: { path: '/announce', method: 'POST' },
    getDestinations: { path: '/destinations', method: 'GET' }
  },
  parameters: {
    network: [
      {
        key: 'interface',
        label: 'Interface',
        type: 'string',
        defaultValue: 'eth0',
        description: 'Network interface to use for mesh networking'
      },
      {
        key: 'port',
        label: 'Port',
        type: 'number',
        defaultValue: 37428,
        range: [1024, 65535],
        description: 'Port for mesh networking communication'
      },
      {
        key: 'encryption',
        label: 'Encryption',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable encryption for mesh network messages'
      }
    ]
  }
};

export const reticulumDefinition: ServiceDefinition = {
  type: 'reticulum',
  name: 'Reticulum Network',
  category: 'networking',
  protocol: 'http',
  defaultPort: 37428,
  docs: {
    main: 'https://reticulum.network/',
    api: 'https://markqvist.github.io/Reticulum/manual/',
    gui: 'https://unsigned.io/website/sideband/',
    meshchat: 'https://github.com/liamcottle/reticulum-meshchat'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    help: {
      title: 'Reticulum Setup',
      instructions: [
        'Reticulum is a cryptography-based networking stack for building unstoppable networks.',
        'Install Reticulum: pip install rns',
        'Configure interfaces in ~/.reticulum/config',
        'Use Sideband GUI: https://unsigned.io/website/sideband/',
        'For mesh chat: https://github.com/liamcottle/reticulum-meshchat',
        'Join testnet via TCP: amsterdam.connect.reticulum.network:4965'
      ].join('\n'),
      links: [
        { label: 'Official Website', url: 'https://reticulum.network/' },
        { label: 'Documentation', url: 'https://markqvist.github.io/Reticulum/manual/' },
        { label: 'GitHub Repository', url: 'https://github.com/markqvist/reticulum' },
        { label: 'Sideband GUI', url: 'https://unsigned.io/website/sideband/' },
        { label: 'MeshChat GUI', url: 'https://github.com/liamcottle/reticulum-meshchat' }
      ]
    },
    warnings: [
      'Reticulum is experimental software. Use caution in production environments.',
      'Radio interfaces require appropriate hardware and licensing.',
      'Testnet may contain experimental features and unstable behavior.',
      'This connector assumes a REST API wrapper around Reticulum.'
    ]
  },
  capabilities: [meshNetworkingCapability, healthCapability]
}; 