/**
 * ServiceItem Component
 * 
 * Ports kai-cd service item patterns with expandable details and management actions
 */

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import type { Service } from '../../types';
import { 
  checkServiceStatusAtom, 
  toggleServiceArchiveAtom, 
  removeServiceAtom 
} from '../../modules/state/serviceStore';
import { Button } from '../ui';
import { 
//  Server, 
//  Wifi, 
  WifiOff, 
//  Settings, 
//  Plus, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Archive,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

interface ServiceItemProps {
  service: Service;
  onEdit: (service: Service) => void;
  isExpanded: boolean;
  onToggleDetails: (serviceId: string) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  onEdit,
  isExpanded,
  onToggleDetails
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, checkServiceStatus] = useAtom(checkServiceStatusAtom);
  const [, toggleServiceArchive] = useAtom(toggleServiceArchiveAtom);
  const [, removeService] = useAtom(removeServiceAtom);

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-status-success drop-shadow-lg" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-status-error drop-shadow-lg" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-status-error drop-shadow-lg" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-status-warning animate-spin drop-shadow-lg" />;
      default:
        return <WifiOff className="h-5 w-5 text-text-disabled" />;
    }
  };

  const handleCheckStatus = async () => {
    await checkServiceStatus(service);
  };

  const handleToggleArchive = () => {
    toggleServiceArchive(service.id);
  };

  const handleDelete = () => {
    removeService(service.id);
    setShowDeleteConfirm(false);
  };

  const handleOpenInTab = () => {
    // TODO: Implement logic to open service in a new browser tab
    window.open(service.url, '_blank');
  };

  const handleOpenInPanel = () => {
    // TODO: Implement logic to open service in the extension's side panel
    // This may require messaging the background script
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage({
        action: 'openInPanel',
        url: service.url,
        serviceId: service.id,
      });
    }
  };

  return (
    <div className="bg-background-surface rounded-lg shadow-md transition-all hover:shadow-lg border border-border-primary">
      <div className="flex items-center p-4">
        <div className="flex-grow">
          <div className="flex items-center space-x-3">
            {getStatusIcon(service.status)}
            <p className="font-bold text-lg text-text-primary">{service.name}</p>
            {service.archived && (
              <span className="px-2 py-1 text-xs bg-background-tertiary text-text-secondary rounded border border-border-primary">
                Archived
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">{service.url}</p>
          <p className="text-xs text-text-disabled capitalize">
            {service.type.replace(/_/g, ' ')} • {service.category}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCheckStatus}
            disabled={service.status === 'checking'}
            className="text-text-secondary hover:text-text-primary"
            title="Check Service Status"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(service)}
            className="text-text-secondary hover:text-text-primary"
            title="Edit Service"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInTab}
            className="text-text-secondary hover:text-text-primary"
            title="Open in Tab"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14" /></svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInPanel}
            className="text-text-secondary hover:text-text-primary"
            title="Open in Panel"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9V5a2 2 0 012-2h4m0 0v4m0-4L4 14" /></svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleDetails(service.id)}
            className={`text-text-secondary hover:text-text-primary transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            title={isExpanded ? 'Hide Details' : 'Show Details'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleArchive}
            className="text-text-secondary hover:text-text-primary"
            title={service.archived ? 'Restore Service' : 'Archive Service'}
          >
            {service.archived ? <Eye className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-border-primary p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-text-primary mb-2">Service Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold text-text-secondary">Category:</span> {service.category}
              </div>
              <div>
                <span className="font-semibold text-text-secondary">Enabled:</span> {service.enabled ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold text-text-secondary">Type:</span> 
                <span className="capitalize"> {service.type.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="font-semibold text-text-secondary">Last Checked:</span> 
                {service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
          
          {/* Delete section */}
          <div className="border-t border-border-primary pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-text-primary mb-1">Danger Zone</h5>
                <p className="text-xs text-text-tertiary">
                  Permanently delete this service. This action cannot be undone.
                </p>
              </div>
              {!showDeleteConfirm ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-status-error hover:text-status-error/80"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-status-error hover:text-status-error/80"
                  >
                    Confirm Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 