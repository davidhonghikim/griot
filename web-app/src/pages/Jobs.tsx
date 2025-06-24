import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

interface Job {
  jobId?: string;
  id?: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  parameters: Record<string, any>;
  metadata: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
}

interface JobTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  parameters: {
    [key: string]: {
      type: 'text' | 'textarea' | 'select' | 'number';
      label: string;
      placeholder?: string;
      options?: string[];
      required?: boolean;
      defaultValue?: any;
    };
  };
  compatibleServices: string[];
}

const JOB_TEMPLATES: JobTemplate[] = [
  {
    type: 'text_summarization',
    name: 'Text Summarization',
    description: 'Summarize long text content into key points',
    icon: '📝',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    parameters: {
      text: {
        type: 'textarea',
        label: 'Text to Summarize',
        placeholder: 'Enter the text you want to summarize...',
        required: true
      },
      maxLength: {
        type: 'number',
        label: 'Max Summary Length',
        defaultValue: 150,
        required: false
      }
    },
    compatibleServices: ['openai', 'anthropic', 'ollama']
  },
  {
    type: 'image_generation',
    name: 'Image Generation',
    description: 'Generate images from text descriptions',
    icon: '🎨',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    parameters: {
      prompt: {
        type: 'textarea',
        label: 'Image Description',
        placeholder: 'A beautiful sunset over mountains...',
        required: true
      },
      style: {
        type: 'select',
        label: 'Art Style',
        options: ['realistic', 'artistic', 'cartoon', 'abstract'],
        defaultValue: 'realistic'
      }
    },
    compatibleServices: ['automatic1111', 'comfyui']
  },
  {
    type: 'ai_chat_response',
    name: 'AI Chat Response',
    description: 'Get AI responses to questions or prompts',
    icon: '💬',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    parameters: {
      message: {
        type: 'textarea',
        label: 'Your Message',
        placeholder: 'Ask me anything...',
        required: true
      },
      temperature: {
        type: 'number',
        label: 'Creativity Level (0-1)',
        defaultValue: 0.7,
        required: false
      }
    },
    compatibleServices: ['openai', 'anthropic', 'ollama']
  },
  {
    type: 'data_analysis',
    name: 'Data Analysis',
    description: 'Analyze data and generate insights',
    icon: '📊',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    parameters: {
      data: {
        type: 'textarea',
        label: 'Data to Analyze',
        placeholder: 'Paste your data here (CSV, JSON, etc.)...',
        required: true
      },
      analysisType: {
        type: 'select',
        label: 'Analysis Type',
        options: ['summary', 'trends', 'insights', 'recommendations'],
        defaultValue: 'summary'
      }
    },
    compatibleServices: ['openai', 'anthropic']
  }
];

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<JobTemplate | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    parameters: {} as Record<string, any>,
    metadata: {} as Record<string, any>,
    serviceId: ''
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadJobs(), loadServices()]);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await api.jobs.list();
      const jobsData = Array.isArray(response) ? response : response.data || [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.services.list();
      const servicesData = Array.isArray(response) ? response : response.data || [];
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleTemplateSelect = (template: JobTemplate) => {
    setSelectedTemplate(template);
    const defaultParams: Record<string, any> = {};
    Object.entries(template.parameters).forEach(([key, param]) => {
      if (param.defaultValue !== undefined) {
        defaultParams[key] = param.defaultValue;
      }
    });
    
    setFormData({
      type: template.type,
      parameters: defaultParams,
      metadata: { template: template.name },
      serviceId: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.jobs.create(formData);
      setShowForm(false);
      setSelectedTemplate(null);
      setFormData({ type: '', parameters: {}, metadata: {}, serviceId: '' });
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.jobs.delete(id);
        loadJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'running':
        return <span className="badge badge-primary">Running</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'failed':
        return <span className="badge badge-error">Failed</span>;
      default:
        return <span className="badge badge-secondary">Unknown</span>;
    }
  };

  const getCompatibleServices = (template: JobTemplate) => {
    return services.filter(service => 
      template.compatibleServices.includes(service.type)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="skeleton h-8 w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Jobs</h1>
              <p className="text-lg text-gray-600">Create and monitor AI processing tasks</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Custom Job
            </button>
          </div>

          {/* Job Templates */}
          {!showForm && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Job Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {JOB_TEMPLATES.map((template) => {
                  const compatibleServices = getCompatibleServices(template);
                  return (
                    <div
                      key={template.type}
                      className={`card-interactive p-6 ${template.bgColor} ${template.borderColor}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{template.icon}</div>
                        <div className={`w-3 h-3 rounded-full ${compatibleServices.length > 0 ? 'bg-green-400 animate-pulse-slow' : 'bg-gray-300'}`}></div>
                      </div>
                      
                      <h3 className={`text-xl font-bold ${template.color} mb-2`}>{template.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Compatible Services:</h4>
                        {compatibleServices.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {compatibleServices.slice(0, 2).map((service) => (
                              <span key={service.id} className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium text-gray-700">
                                {service.name}
                              </span>
                            ))}
                            {compatibleServices.length > 2 && (
                              <span className="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium text-gray-500">
                                +{compatibleServices.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No compatible services</span>
                        )}
                      </div>
                      
                      <button 
                        className={`w-full btn-outline hover:bg-white hover:bg-opacity-50 text-sm ${compatibleServices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={compatibleServices.length === 0}
                      >
                        Create Job →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Create Job Form */}
          {showForm && (
            <div className="card p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTemplate ? `Create ${selectedTemplate.name} Job` : 'Create Custom Job'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedTemplate(null);
                    setFormData({ type: '', parameters: {}, metadata: {}, serviceId: '' });
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
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedTemplate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Service</label>
                    <select
                      className="select-modern"
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      required
                    >
                      <option value="">Choose a compatible service...</option>
                      {getCompatibleServices(selectedTemplate).map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} ({service.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedTemplate && Object.entries(selectedTemplate.parameters).map(([key, param]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {param.label} {param.required && <span className="text-red-500">*</span>}
                    </label>
                    {param.type === 'textarea' ? (
                      <textarea
                        className="input-modern min-h-24"
                        value={formData.parameters[key] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          parameters: { ...formData.parameters, [key]: e.target.value }
                        })}
                        placeholder={param.placeholder}
                        required={param.required}
                      />
                    ) : param.type === 'select' ? (
                      <select
                        className="select-modern"
                        value={formData.parameters[key] || param.defaultValue || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          parameters: { ...formData.parameters, [key]: e.target.value }
                        })}
                        required={param.required}
                      >
                        {param.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : param.type === 'number' ? (
                      <input
                        type="number"
                        step="0.1"
                        className="input-modern"
                        value={formData.parameters[key] || param.defaultValue || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          parameters: { ...formData.parameters, [key]: parseFloat(e.target.value) }
                        })}
                        placeholder={param.placeholder}
                        required={param.required}
                      />
                    ) : (
                      <input
                        type="text"
                        className="input-modern"
                        value={formData.parameters[key] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          parameters: { ...formData.parameters, [key]: e.target.value }
                        })}
                        placeholder={param.placeholder}
                        required={param.required}
                      />
                    )}
                  </div>
                ))}

                {!selectedTemplate && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                      <input
                        type="text"
                        className="input-modern"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="e.g., custom_task"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Parameters (JSON)</label>
                      <textarea
                        className="input-modern min-h-24"
                        value={JSON.stringify(formData.parameters, null, 2)}
                        onChange={(e) => {
                          try {
                            setFormData({ ...formData, parameters: JSON.parse(e.target.value) });
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Create Job
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedTemplate(null);
                      setFormData({ type: '', parameters: {}, metadata: {}, serviceId: '' });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Jobs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Jobs</h2>
            
            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Created Yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first AI job using one of the templates above</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Create Your First Job
                </button>
              </div>
            ) : (
              <div className="table-modern">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Parameters</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const jobId = job.jobId || job.id || 'unknown';
                    return (
                      <tr key={jobId}>
                        <td>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-sm">
                                {job.type.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {job.metadata?.template || job.type}
                              </div>
                              <div className="text-sm text-gray-500">ID: {jobId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-secondary">{job.type}</span>
                        </td>
                        <td>{getStatusBadge(job.status)}</td>
                        <td className="text-sm text-gray-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'Unknown'}
                        </td>
                        <td>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View Parameters
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-xs">
                              {JSON.stringify(job.parameters, null, 2)}
                            </pre>
                          </details>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(jobId)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors duration-200"
                            title="Delete job"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 