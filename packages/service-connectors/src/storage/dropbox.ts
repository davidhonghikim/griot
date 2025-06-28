import type { ServiceDefinition, StorageCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/check/user', method: 'POST' }
  }
};

const storageCapability: StorageCapability = {
  capability: 'storage',
  endpoints: {
    // File operations
    uploadFile: { path: '/files/upload', method: 'POST' },
    downloadFile: { path: '/files/download', method: 'POST' },
    deleteFile: { path: '/files/delete_v2', method: 'POST' },
    copyFile: { path: '/files/copy_v2', method: 'POST' },
    moveFile: { path: '/files/move_v2', method: 'POST' },
    
    // Folder operations
    listFolder: { path: '/files/list_folder', method: 'POST' },
    createFolder: { path: '/files/create_folder_v2', method: 'POST' },
    deleteFolder: { path: '/files/delete_v2', method: 'POST' },
    
    // Metadata operations
    getMetadata: { path: '/files/get_metadata', method: 'POST' },
    searchFiles: { path: '/files/search_v2', method: 'POST' },
    
    // Sharing
    createSharedLink: { path: '/sharing/create_shared_link_with_settings', method: 'POST' },
    getSharedLinks: { path: '/sharing/list_shared_links', method: 'POST' }
  },
  parameters: {
    uploadFile: [
      {
        key: 'path',
        label: 'File Path',
        type: 'string',
        defaultValue: '/uploaded_file.txt',
        description: 'Path where the file will be saved in Dropbox'
      },
      {
        key: 'mode',
        label: 'Write Mode',
        type: 'select',
        defaultValue: 'add',
        options: [
          { value: 'add', label: 'Add (fail if exists)' },
          { value: 'overwrite', label: 'Overwrite' },
          { value: 'update', label: 'Update (with revision)' }
        ],
        description: 'How to handle file conflicts'
      },
      {
        key: 'autorename',
        label: 'Auto Rename',
        type: 'boolean',
        defaultValue: false,
        description: 'Automatically rename if file exists'
      }
    ],
    downloadFile: [
      {
        key: 'path',
        label: 'File Path',
        type: 'string',
        defaultValue: '',
        description: 'Path of the file to download'
      }
    ],
    deleteFile: [
      {
        key: 'path',
        label: 'File Path',
        type: 'string',
        defaultValue: '',
        description: 'Path of the file to delete'
      }
    ],
    listFolder: [
      {
        key: 'path',
        label: 'Folder Path',
        type: 'string',
        defaultValue: '',
        description: 'Path of the folder to list (empty for root)'
      },
      {
        key: 'recursive',
        label: 'Recursive',
        type: 'boolean',
        defaultValue: false,
        description: 'List all files recursively'
      },
      {
        key: 'include_media_info',
        label: 'Include Media Info',
        type: 'boolean',
        defaultValue: false,
        description: 'Include media metadata for photos and videos'
      },
      {
        key: 'include_deleted',
        label: 'Include Deleted',
        type: 'boolean',
        defaultValue: false,
        description: 'Include deleted files'
      }
    ],
    createFolder: [
      {
        key: 'path',
        label: 'Folder Path',
        type: 'string',
        defaultValue: '/New Folder',
        description: 'Path of the folder to create'
      },
      {
        key: 'autorename',
        label: 'Auto Rename',
        type: 'boolean',
        defaultValue: false,
        description: 'Automatically rename if folder exists'
      }
    ],
    searchFiles: [
      {
        key: 'query',
        label: 'Search Query',
        type: 'string',
        defaultValue: '',
        description: 'Text to search for in file names and content'
      },
      {
        key: 'path',
        label: 'Search Path',
        type: 'string',
        defaultValue: '',
        description: 'Folder to search in (empty for entire Dropbox)'
      },
      {
        key: 'max_results',
        label: 'Max Results',
        type: 'number',
        defaultValue: 100,
        range: [1, 1000],
        description: 'Maximum number of results to return'
      },
      {
        key: 'file_extensions',
        label: 'File Extensions',
        type: 'string',
        defaultValue: '',
        description: 'Comma-separated list of file extensions to search for'
      }
    ],
    createSharedLink: [
      {
        key: 'path',
        label: 'File/Folder Path',
        type: 'string',
        defaultValue: '',
        description: 'Path of the file or folder to share'
      },
      {
        key: 'short_link',
        label: 'Short Link',
        type: 'boolean',
        defaultValue: false,
        description: 'Create a short URL'
      },
      {
        key: 'pending_upload',
        label: 'Pending Upload',
        type: 'boolean',
        defaultValue: false,
        description: 'Allow link creation for files being uploaded'
      }
    ]
  }
};

export const dropboxDefinition: ServiceDefinition = {
  type: 'dropbox',
  name: 'Dropbox',
  category: 'storage',
  protocol: 'https',
  defaultPort: 443,
  baseUrl: 'api.dropboxapi.com/2',
  docs: {
    api: 'https://www.dropbox.com/developers/documentation/http/documentation',
    main: 'https://www.dropbox.com/developers'
  },
  authentication: {
    type: 'bearer_token',
    help: 'Get your access token from https://www.dropbox.com/developers/apps'
  },
  configuration: {
    help: {
      title: 'Dropbox Setup',
      instructions: [
        'Create a Dropbox app at https://www.dropbox.com/developers/apps',
        'Choose app type and permissions',
        'Generate an access token',
        'Use the token for API authentication',
        'Note: Some endpoints require different base URLs (content.dropboxapi.com for uploads/downloads)'
      ].join('\n'),
      links: [
        { label: 'Dropbox Developers', url: 'https://www.dropbox.com/developers' },
        { label: 'API Documentation', url: 'https://www.dropbox.com/developers/documentation/http/documentation' },
        { label: 'Create App', url: 'https://www.dropbox.com/developers/apps' },
        { label: 'API Explorer', url: 'https://dropbox.github.io/dropbox-api-v2-explorer/' }
      ]
    }
  },
  capabilities: [storageCapability, healthCapability]
}; 