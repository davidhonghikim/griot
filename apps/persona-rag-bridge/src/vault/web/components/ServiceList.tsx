import React, { useState } from 'react';
import { ServiceForm, ServiceFormData } from './ServiceForm';

export interface Service {
  id: string;
  name: string;
  type: 'database' | 'ai_model' | 'storage' | 'network' | 'custom';
  url: string;
  port: number;
  enabled: boolean;
  credentials?: {
    type: 'none' | 'api_key' | 'jwt' | 'login';
    key?: string;
    value?: string;
  };
  status: 'online' | 'offline' | 'error' | 'checking';
  lastChecked?: Date;
  metadata?: Record<string, any>;
}

interface ServiceListProps {
  services: Service[];
  onAddService: (data: ServiceFormData) => void;
  onUpdateService: (id: string, data: ServiceFormData) => void;
  onDeleteService: (id: string) => void;
  onCheckStatus: (id: string) => void;
  config: {
    localIp: string;
    remoteIp: string;
    defaultPorts: Record<string, number>;
  };
}

const getStatusIcon = (status: Service['status']) => {
  switch (status) {
    case 'online':
      return (
        <div className="flex items-center text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Online
        </div>
      );
    case 'offline':
      return (
        <div className="flex items-center text-red-400">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
          Offline
        </div>
      );
    case 'error':
      return (
        <div className="flex items-center text-yellow-400">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
          Error
        </div>
      );
    case 'checking':
      return (
        <div className="flex items-center text-blue-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
          Checking
        </div>
      );
    default:
      return (
        <div className="flex items-center text-gray-400">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
          Unknown
        </div>
      );
  }
};

const getTypeIcon = (type: Service['type']) => {
  switch (type) {
    case 'database':
      return '🗄️';
    case 'ai_model':
      return '🤖';
    case 'storage':
      return '💾';
    case 'network':
      return '🌐';
    case 'custom':
      return '⚙️';
    default:
      return '🔧';
  }
};

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onCheckStatus,
  config
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleAddService = (data: ServiceFormData) => {
    onAddService(data);
    setShowAddForm(false);
  };

  const handleUpdateService = (data: ServiceFormData) => {
    if (editingService) {
      onUpdateService(editingService.id, data);
      setEditingService(null);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      onDeleteService(id);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100">Services</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Add Service
        </button>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-100">Add New Service</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <ServiceForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddService}
            config={config}
          />
        </div>
      )}

      {/* Edit Service Form */}
      {editingService && (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-100">Edit Service</h3>
            <button
              onClick={() => setEditingService(null)}
              className="text-slate-400 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <ServiceForm
            service={editingService}
            onClose={() => setEditingService(null)}
            onSubmit={handleUpdateService}
            config={config}
          />
        </div>
      )}

      {/* Services List */}
      <div className="space-y-2">
        {services.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No services configured</p>
            <p className="text-sm">Click "Add Service" to get started</p>
          </div>
        ) : (
          services.map(service => (
            <div key={service.id} className="bg-slate-800 rounded-lg border border-slate-700">
              {/* Service Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTypeIcon(service.type)}</span>
                  <div>
                    <h3 className="font-medium text-slate-100">{service.name}</h3>
                    <p className="text-sm text-slate-400">{service.url}</p>
                    <p className="text-xs text-slate-500 capitalize">
                      {service.type.replace('_', ' ')} • Port {service.port}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(service.status)}
                  
                  <button
                    onClick={() => onCheckStatus(service.id)}
                    disabled={service.status === 'checking'}
                    className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-50"
                  >
                    Check
                  </button>
                  
                  <button
                    onClick={() => toggleExpanded(service.id)}
                    className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600"
                  >
                    {expandedService === service.id ? 'Hide' : 'Details'}
                  </button>
                  
                  <button
                    onClick={() => setEditingService(service)}
                    className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-1 text-xs font-medium text-red-300 bg-red-900 border border-red-700 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedService === service.id && (
                <div className="border-t border-slate-700 p-4 bg-slate-900">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-slate-400">Status:</span> {service.status}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Enabled:</span> {service.enabled ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Authentication:</span> {service.credentials?.type || 'None'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Last Checked:</span> {
                        service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'
                      }
                    </div>
                    {service.credentials?.key && (
                      <div className="sm:col-span-2">
                        <span className="font-semibold text-slate-400">Credential Key:</span> {service.credentials.key}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 