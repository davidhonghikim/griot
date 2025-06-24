import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

interface Service {
  id: string;
  name: string;
  type: string;
  url: string;
  capabilities: string[];
  apiKey?: string;
  status?: 'active' | 'inactive' | 'error';
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultEndpoint: string;
  capabilities: string[];
  setupInstructions: string[];
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    type: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Advanced language model for chat, completion, and embeddings',
    icon: '🤖',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    defaultEndpoint: 'https://api.openai.com/v1',
    capabilities: ['Text Generation', 'Chat Completion', 'Embeddings', 'Code Generation'],
    setupInstructions: [
      'Get your API key from OpenAI Platform',
      'Ensure you have sufficient credits/quota',
      'Test with a simple completion request'
    ]
  },
  {
    type: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Safe and helpful AI assistant for complex reasoning tasks',
    icon: '🧠',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    capabilities: ['Safe AI Chat', 'Reasoning', 'Code Analysis', 'Long Context'],
    setupInstructions: [
      'Get your API key from Anthropic Console',
      'Verify your usage limits',
      'Test with a simple message'
    ]
  },
  {
    type: 'ollama',
    name: 'Local Ollama',
    description: 'Run large language models locally for privacy and control',
    icon: '🏠',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultEndpoint: 'http://localhost:11434',
    capabilities: ['Local Processing', 'Privacy', 'Custom Models', 'No API Costs'],
    setupInstructions: [
      'Install Ollama on your machine',
      'Download a model (e.g., llama2, mistral)',
      'Ensure Ollama is running on port 11434'
    ]
  },
  {
    type: 'automatic1111',
    name: 'AUTOMATIC1111',
    description: 'Stable Diffusion web UI for image generation and manipulation',
    icon: '🎨',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    defaultEndpoint: 'http://localhost:7860',
    capabilities: ['Image Generation', 'Img2Img', 'Inpainting', 'Style Transfer'],
    setupInstructions: [
      'Install AUTOMATIC1111 WebUI',
      'Download Stable Diffusion models',
      'Start with --api flag enabled'
    ]
  },
  {
    type: 'comfyui',
    name: 'ComfyUI',
    description: 'Node-based interface for advanced image generation workflows',
    icon: '🎭',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    defaultEndpoint: 'http://localhost:8188',
    capabilities: ['Workflow Design', 'Node-based UI', 'Advanced Control', 'Custom Pipelines'],
    setupInstructions: [
      'Install ComfyUI',
      'Set up your workflow nodes',
      'Enable API server mode'
    ]
  }
];

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    url: '',
    capabilities: [] as string[],
    apiKey: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.services.list();
      const servicesData = Array.isArray(response) ? response : response.data || [];
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: ServiceTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      url: template.defaultEndpoint,
      capabilities: template.capabilities,
      apiKey: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.services.create(formData);
      setShowForm(false);
      setSelectedTemplate(null);
      setFormData({ name: '', type: '', url: '', capabilities: [], apiKey: '' });
      loadServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.services.delete(id);
        loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Active</span>;
      case 'inactive':
        return <span className="badge badge-warning">Inactive</span>;
      case 'error':
        return <span className="badge badge-error">Error</span>;
      default:
        return <span className="badge badge-secondary">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="skeleton h-8 w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-12 w-12 rounded-full mb-4"></div>
                  <div className="skeleton h-6 w-32 mb-2"></div>
                  <div className="skeleton h-4 w-full mb-4"></div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Services</h1>
              <p className="text-lg text-gray-600">Connect and manage your AI service providers</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Custom Service
            </button>
          </div>

          {/* Service Templates */}
          {!showForm && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Setup Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICE_TEMPLATES.map((template) => (
                  <div
                    key={template.type}
                    className={`card-interactive p-6 ${template.bgColor} ${template.borderColor}`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{template.icon}</div>
                      <div className={`w-3 h-3 rounded-full bg-green-400 animate-pulse-slow`}></div>
                    </div>
                    
                    <h3 className={`text-xl font-bold ${template.color} mb-2`}>{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Capabilities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.capabilities.slice(0, 3).map((capability, index) => (
                          <span key={index} className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium text-gray-700">
                            {capability}
                          </span>
                        ))}
                        {template.capabilities.length > 3 && (
                          <span className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium text-gray-500">
                            +{template.capabilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button className={`w-full btn-outline hover:bg-white hover:bg-opacity-50 text-sm`}>
                      Quick Setup →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Service Form */}
          {showForm && (
            <div className="card p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTemplate ? `Setup ${selectedTemplate.name}` : 'Add Custom Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedTemplate(null);
                    setFormData({ name: '', type: '', url: '', capabilities: [], apiKey: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedTemplate && (
                <div className={`p-4 rounded-lg ${selectedTemplate.bgColor} ${selectedTemplate.borderColor} border mb-6`}>
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{selectedTemplate.icon}</span>
                    <div>
                      <h3 className={`font-bold ${selectedTemplate.color}`}>{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Setup Instructions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedTemplate.setupInstructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                    <input
                      type="text"
                      className="input-modern"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., My OpenAI Service"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                    <input
                      type="text"
                      className="input-modern"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., openai, anthropic, ollama"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">API Endpoint</label>
                  <input
                    type="url"
                    className="input-modern"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://api.example.com/v1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    className="input-modern"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your API key will be stored securely and never exposed in responses
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Add Service
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedTemplate(null);
                      setFormData({ name: '', type: '', url: '', capabilities: [], apiKey: '' });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Connected Services */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Services</h2>
            
            {services.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Connected</h3>
                <p className="text-gray-600 mb-6">Start by connecting your first AI service using one of the templates above</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Add Your First Service
                </button>
              </div>
            ) : (
              <div className="table-modern">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Type</th>
                    <th>Endpoint</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {service.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">ID: {service.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{service.type}</span>
                      </td>
                      <td>
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {service.url || 'Not specified'}
                        </code>
                      </td>
                      <td>{getStatusBadge(service.status || '')}</td>
                      <td className="text-sm text-gray-500">
                        {new Date(service.createdAt || '').toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete service"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 