import type { ServiceDefinition, ImageGenerationCapability, ModelManagementCapability, HealthCapability } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/sdapi/v1/memory', method: 'GET' }
  }
};

const imageGenerationCapability: ImageGenerationCapability = {
  capability: 'image_generation',
  endpoints: {
    txt2img: { path: '/sdapi/v1/txt2img', method: 'POST' },
    img2img: { path: '/sdapi/v1/img2img', method: 'POST' },
    getProgress: { path: '/sdapi/v1/progress', method: 'GET' },
    interrupt: { path: '/sdapi/v1/interrupt', method: 'POST' }
  },
  parameters: {
    txt2img: [
      {
        key: 'prompt',
        label: 'Prompt',
        type: 'string',
        defaultValue: 'A beautiful landscape',
        description: 'Text description of the image to generate'
      },
      {
        key: 'negative_prompt',
        label: 'Negative Prompt',
        type: 'string',
        defaultValue: 'blurry, low quality, bad anatomy',
        description: 'Text describing what to avoid in the image'
      },
      {
        key: 'width',
        label: 'Width',
        type: 'number',
        defaultValue: 512,
        range: [64, 2048],
        step: 64,
        description: 'Image width in pixels'
      },
      {
        key: 'height',
        label: 'Height',
        type: 'number',
        defaultValue: 512,
        range: [64, 2048],
        step: 64,
        description: 'Image height in pixels'
      },
      {
        key: 'steps',
        label: 'Steps',
        type: 'number',
        defaultValue: 20,
        range: [1, 150],
        description: 'Number of sampling steps'
      },
      {
        key: 'cfg_scale',
        label: 'CFG Scale',
        type: 'number',
        defaultValue: 7,
        range: [1, 30],
        step: 0.5,
        description: 'How closely to follow the prompt'
      },
      {
        key: 'seed',
        label: 'Seed',
        type: 'number',
        defaultValue: -1,
        description: 'Random seed (-1 for random)'
      },
      {
        key: 'sampler_index',
        label: 'Sampler',
        type: 'select',
        defaultValue: 'Euler',
        options: [
          { value: 'Euler', label: 'Euler' },
          { value: 'Euler a', label: 'Euler Ancestral' },
          { value: 'Heun', label: 'Heun' },
          { value: 'DPM2', label: 'DPM 2' },
          { value: 'DPM2 a', label: 'DPM 2 Ancestral' },
          { value: 'DPM++ 2S a', label: 'DPM++ 2S Ancestral' },
          { value: 'DPM++ 2M', label: 'DPM++ 2M' },
          { value: 'DPM++ SDE', label: 'DPM++ SDE' },
          { value: 'LMS', label: 'LMS' },
          { value: 'DDIM', label: 'DDIM' },
          { value: 'PLMS', label: 'PLMS' }
        ],
        description: 'Sampling algorithm to use'
      },
      {
        key: 'batch_size',
        label: 'Batch Size',
        type: 'number',
        defaultValue: 1,
        range: [1, 8],
        description: 'Number of images to generate in one batch'
      },
      {
        key: 'n_iter',
        label: 'Batch Count',
        type: 'number',
        defaultValue: 1,
        range: [1, 100],
        description: 'Number of batches to generate'
      },
      {
        key: 'restore_faces',
        label: 'Restore Faces',
        type: 'boolean',
        defaultValue: false,
        description: 'Use face restoration model'
      },
      {
        key: 'tiling',
        label: 'Tiling',
        type: 'boolean',
        defaultValue: false,
        description: 'Generate tileable images'
      },
      {
        key: 'enable_hr',
        label: 'Hires Fix',
        type: 'boolean',
        defaultValue: false,
        description: 'Enable high-resolution fix'
      },
      {
        key: 'hr_scale',
        label: 'Hires Scale',
        type: 'number',
        defaultValue: 2,
        range: [1, 4],
        step: 0.1,
        description: 'High-resolution upscale factor',
        dependsOn: { enable_hr: true }
      },
      {
        key: 'denoising_strength',
        label: 'Denoising Strength',
        type: 'number',
        defaultValue: 0.7,
        range: [0, 1],
        step: 0.01,
        description: 'How much to change the image (for img2img)'
      }
    ]
  }
};

const modelManagementCapability: ModelManagementCapability = {
  capability: 'model_management',
  endpoints: {
    getModels: { path: '/sdapi/v1/sd-models', method: 'GET' },
    setModel: { path: '/sdapi/v1/options', method: 'POST' },
    getSamplers: { path: '/sdapi/v1/samplers', method: 'GET' },
    getVaes: { path: '/sdapi/v1/sd-vae', method: 'GET' },
    getLoras: { path: '/sdapi/v1/loras', method: 'GET' },
    getEmbeddings: { path: '/sdapi/v1/embeddings', method: 'GET' }
  },
  parameters: {
    getModels: [],
    getSamplers: [],
    getVaes: [],
    getLoras: [],
    getEmbeddings: [],
    setModel: [
      {
        key: 'sd_model_checkpoint',
        label: 'Model Checkpoint',
        type: 'select',
        defaultValue: '',
        description: 'The checkpoint model to use',
        optionsEndpoint: 'getModels',
        optionsPath: '',
        optionsValueKey: 'model_name',
        optionsLabelKey: 'model_name'
      }
    ]
  }
};

export const a1111Definition: ServiceDefinition = {
  type: 'a1111',
  name: 'Automatic1111 WebUI',
  category: 'image-generation',
  hasExternalUi: true,
  protocol: 'http',
  defaultPort: 7860,
  docs: {
    api: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API',
    main: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    arguments: {
      api: {
        flag: '--api',
        description: 'Enable API access',
        required: true
      },
      listen: {
        flag: '--listen',
        description: 'Listen on all network interfaces',
        required: false
      },
      port: {
        flag: '--port 7860',
        description: 'Port to run on',
        required: false
      }
    },
    help: {
      title: 'Automatic1111 WebUI Setup',
      instructions: [
        'Clone the repository: git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git',
        'Install dependencies: Follow the installation guide for your OS',
        'Download models to models/Stable-diffusion/',
        'Start with API: ./webui.sh --api --listen',
        'Access the UI at http://localhost:7860'
      ].join('\n'),
      links: [
        { label: 'Automatic1111 Repository', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui' },
        { label: 'Installation Guide', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui#installation-and-running' },
        { label: 'API Documentation', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API' },
        { label: 'Model Downloads', url: 'https://huggingface.co/models?library=diffusers&sort=downloads' }
      ]
    }
  },
  capabilities: [imageGenerationCapability, modelManagementCapability, healthCapability]
}; 