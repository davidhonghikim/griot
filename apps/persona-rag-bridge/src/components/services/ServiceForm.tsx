/**
 * ServiceForm Component
 * 
 * Ports kai-cd service form patterns for adding and editing services
 */

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import type { Service, NewService } from '../../types';
import { allServiceDefinitions } from '../../services/definitions';
import { addServiceAtom, updateServiceAtom } from '../../modules/state/serviceStore';
import { Button } from '../ui';
import { X, Save, Plus } from 'lucide-react';

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose }) => {
  const [formData, setFormData] = useState<Partial<NewService>>({
    name: service?.name || '',
    serviceDefinitionId: service?.serviceDefinitionId || '',
    ipType: service?.ipType || 'local',
    customUrl: service?.customUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, addService] = useAtom(addServiceAtom);
  const [, updateService] = useAtom(updateServiceAtom);

  const isEditing = !!service;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.serviceDefinitionId) {
      newErrors.serviceDefinitionId = 'Service type is required';
    }

    if (formData.ipType === 'custom' && !formData.customUrl?.trim()) {
      newErrors.customUrl = 'Custom URL is required';
    }

    if (formData.ipType === 'cloud' && !formData.customUrl?.trim()) {
      newErrors.customUrl = 'Cloud URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && service) {
        updateService({
          id: service.id,
          ...formData,
        });
      } else {
        addService(formData as NewService);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save service:', error);
      setErrors({ submit: 'Failed to save service' });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAuthChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      authentication: {
        ...prev.authentication,
        [field]: value,
        type: field === "type" ? value : (prev.authentication?.type || "none"),
      },
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  const selectedDefinition = allServiceDefinitions.find(
    def => def.type === formData.serviceDefinitionId
  );

  // Determine if API key is required
  const requiresApiKey = selectedDefinition && selectedDefinition.authentication.type === 'api_key';

  return (
    <div className="bg-background-surface rounded-lg shadow-2xl p-6 max-w-md w-full border border-border-primary">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Service Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 bg-background-tertiary border rounded-md text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus ${
              errors.name ? 'border-status-error' : 'border-border-primary'
            }`}
            placeholder="Enter service name"
          />
          {errors.name && (
            <p className="text-status-error text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Service Type
          </label>
          <select
            value={formData.serviceDefinitionId}
            onChange={(e) => handleInputChange('serviceDefinitionId', e.target.value)}
            className={`w-full px-3 py-2 bg-background-tertiary border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus ${
              errors.serviceDefinitionId ? 'border-status-error' : 'border-border-primary'
            }`}
          >
            <option value="">Select service type</option>
            {allServiceDefinitions.map((def) => (
              <option key={def.type} value={def.type}>
                {def.name} - {def.category}
              </option>
            ))}
          </select>
          {errors.serviceDefinitionId && (
            <p className="text-status-error text-xs mt-1">{errors.serviceDefinitionId}</p>
          )}
        </div>

        {/* IP Type */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Connection Type
          </label>
          <select
            value={formData.ipType}
            onChange={(e) => handleInputChange('ipType', e.target.value)}
            className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
          >
            <option value="local">Local Network</option>
            <option value="remote">Remote Network</option>
            <option value="cloud">Cloud Service</option>
            <option value="custom">Custom URL</option>
          </select>
        </div>

        {/* Custom URL */}
        {(formData.ipType === 'custom' || formData.ipType === 'cloud') && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {formData.ipType === 'cloud' ? 'Cloud URL' : 'Custom URL'}
            </label>
            <input
              type="url"
              value={formData.customUrl}
              onChange={(e) => handleInputChange('customUrl', e.target.value)}
              className={`w-full px-3 py-2 bg-background-tertiary border rounded-md text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus ${
                errors.customUrl ? 'border-status-error' : 'border-border-primary'
              }`}
              placeholder={formData.ipType === 'cloud' ? 'https://api.example.com' : 'http://192.168.1.100:3000'}
            />
            {errors.customUrl && (
              <p className="text-status-error text-xs mt-1">{errors.customUrl}</p>
            )}
          </div>
        )}

        {/* API Key (only if required) */}
        {requiresApiKey && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              API Key
            </label>
            <input
              type="password"
              value={formData.authentication?.apiKey || ''}
              onChange={(e) => handleAuthChange('apiKey', e.target.value)}
              className={`w-full px-3 py-2 bg-background-tertiary border rounded-md text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus ${
                errors.apiKey ? 'border-status-error' : 'border-border-primary'
              }`}
              placeholder="Enter API key"
            />
            {errors.apiKey && (
              <p className="text-status-error text-xs mt-1">{errors.apiKey}</p>
            )}
          </div>
        )}

        {/* Service Description */}
        {selectedDefinition && (
          <div className="bg-background-tertiary rounded-md p-3 border border-border-primary">
            <h4 className="text-sm font-medium text-text-primary mb-2">
              {selectedDefinition.name}
            </h4>
            <p className="text-xs text-text-tertiary mb-2">
              {selectedDefinition.configuration.help.instructions}
            </p>
            <div className="text-xs text-text-disabled">
              <span className="font-medium">Category:</span> {selectedDefinition.category}
              <br />
              <span className="font-medium">Default Port:</span> {selectedDefinition.defaultPort}
              <br />
              <span className="font-medium">Authentication:</span> {selectedDefinition.authentication.type}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-status-error/20 border border-status-error rounded-md p-3">
            <p className="text-status-error text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}; 