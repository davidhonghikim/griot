import type { ServiceDefinition, ImageGenerationCapability, HealthCapability, ParameterMapping } from '../types';

const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/system_stats', method: 'GET' }
  }
};

// ComfyUI workflow parameter mappings for common tasks
const txt2imgMapping: ParameterMapping = {
  sourceParam: 'prompt',
  targetPath: ['6', 'inputs', 'text'], // KSampler node
  description: 'Main prompt for image generation'
};

const negativePromptMapping: ParameterMapping = {
  sourceParam: 'negative_prompt',
  targetPath: ['7', 'inputs', 'text'], // Negative prompt node
  description: 'Negative prompt to exclude elements'
};

const seedMapping: ParameterMapping = {
  sourceParam: 'seed',
  targetPath: ['3', 'inputs', 'seed'], // KSampler node
  description: 'Random seed for reproducible generation'
};

const stepsMapping: ParameterMapping = {
  sourceParam: 'steps',
  targetPath: ['3', 'inputs', 'steps'], // KSampler node
  description: 'Number of sampling steps'
};

const cfgMapping: ParameterMapping = {
  sourceParam: 'cfg_scale',
  targetPath: ['3', 'inputs', 'cfg'], // KSampler node
  description: 'Classifier-free guidance scale'
};

const imageGenerationCapability: ImageGenerationCapability = {
  capability: 'image_generation',
  endpoints: {
    generate: { path: '/prompt', method: 'POST' },
    getQueue: { path: '/queue', method: 'GET' },
    getHistory: { path: '/history', method: 'GET' },
    getImage: { path: '/view', method: 'GET' }
  },
  parameters: {
    generate: [
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
        defaultValue: 'blurry, low quality',
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
        key: 'sampler_name',
        label: 'Sampler',
        type: 'select',
        defaultValue: 'euler',
        options: [
          { value: 'euler', label: 'Euler' },
          { value: 'euler_ancestral', label: 'Euler Ancestral' },
          { value: 'heun', label: 'Heun' },
          { value: 'dpm_2', label: 'DPM 2' },
          { value: 'dpm_2_ancestral', label: 'DPM 2 Ancestral' },
          { value: 'lms', label: 'LMS' },
          { value: 'dpm_fast', label: 'DPM Fast' },
          { value: 'dpm_adaptive', label: 'DPM Adaptive' },
          { value: 'dpmpp_2s_ancestral', label: 'DPM++ 2S Ancestral' },
          { value: 'dpmpp_sde', label: 'DPM++ SDE' },
          { value: 'dpmpp_2m', label: 'DPM++ 2M' }
        ],
        description: 'Sampling algorithm to use'
      },
      {
        key: 'scheduler',
        label: 'Scheduler',
        type: 'select',
        defaultValue: 'normal',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'karras', label: 'Karras' },
          { value: 'exponential', label: 'Exponential' },
          { value: 'polyexponential', label: 'Poly Exponential' },
          { value: 'sgm_uniform', label: 'SGM Uniform' }
        ],
        description: 'Noise schedule'
      }
    ]
  },
  parameterMappings: [
    txt2imgMapping,
    negativePromptMapping,
    seedMapping,
    stepsMapping,
    cfgMapping
  ]
};

export const comfyuiDefinition: ServiceDefinition = {
  type: 'comfyui',
  name: 'ComfyUI',
  category: 'image-generation',
  hasExternalUi: true,
  protocol: {
    primary: 'https',
    fallback: 'http'
  },
  defaultPort: 8188,
  docs: {
    api: 'https://github.com/comfyanonymous/ComfyUI/wiki/API-Reference',
    main: 'https://github.com/comfyanonymous/ComfyUI'
  },
  authentication: {
    type: 'none'
  },
  configuration: {
    help: {
      title: 'ComfyUI Setup',
      instructions: [
        'Clone ComfyUI: git clone https://github.com/comfyanonymous/ComfyUI.git',
        'Install dependencies: pip install -r requirements.txt',
        'Download models to models/checkpoints/',
        'Start the server: python main.py --listen',
        'Access the UI at http://localhost:8188',
        'For HTTPS: Set up nginx/caddy reverse proxy with SSL certificates',
        'The connector will automatically try HTTPS first, then fallback to HTTP'
      ].join('\n'),
      links: [
        { label: 'ComfyUI Repository', url: 'https://github.com/comfyanonymous/ComfyUI' },
        { label: 'API Reference', url: 'https://github.com/comfyanonymous/ComfyUI/wiki/API-Reference' },
        { label: 'Model Downloads', url: 'https://huggingface.co/models?library=diffusers' },
        { label: 'Custom Nodes', url: 'https://github.com/ltdrdata/ComfyUI-Manager' },
        { label: 'Nginx SSL Setup', url: 'https://nginx.org/en/docs/http/configuring_https_servers.html' },
        { label: 'Caddy Reverse Proxy', url: 'https://caddyserver.com/docs/quick-starts/reverse-proxy' }
      ]
    }
  },
  capabilities: [imageGenerationCapability, healthCapability]
}; 