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
        return <CheckCircle className="h-5 w-5 text-green-400 drop-shadow-lg" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500 drop-shadow-lg" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600 drop-shadow-lg" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin drop-shadow-lg" />;
      default:
        return <WifiOff className="h-5 w-5 text-slate-500" />;
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
    <div className="bg-slate-800 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="flex items-center p-4">
        <div className="flex-grow">
          <div className="flex items-center space-x-3">
            {getStatusIcon(service.status)}
            <p className="font-bold text-lg text-slate-100">{service.name}</p>
            {service.archived && (
              <span className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded">
                Archived
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{service.url}</p>
          <p className="text-xs text-slate-500 capitalize">
            {service.type.replace(/_/g, ' ')} • {service.category}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCheckStatus}
            disabled={service.status === 'checking'}
            className="text-slate-400 hover:text-slate-200"
            title="Check Service Status"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(service)}
            className="text-slate-400 hover:text-slate-200"
            title="Edit Service"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInTab}
            className="text-slate-400 hover:text-slate-200"
            title="Open in Tab"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14" /></svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInPanel}
            className="text-slate-400 hover:text-slate-200"
            title="Open in Panel"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9V5a2 2 0 012-2h4m0 0v4m0-4L4 14" /></svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleDetails(service.id)}
            className={`text-slate-400 hover:text-slate-200 transition-transform ${
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
            className="text-slate-400 hover:text-slate-200"
            title={service.archived ? 'Restore Service' : 'Archive Service'}
          >
            {service.archived ? <Eye className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-slate-700 p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-slate-200 mb-2">Service Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold text-slate-400">Category:</span> {service.category}
              </div>
              <div>
                <span className="font-semibold text-slate-400">Enabled:</span> {service.enabled ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold text-slate-400">Type:</span> 
                <span className="capitalize"> {service.type.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Last Checked:</span> 
                {service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
          
          {/* Delete section */}
          <div className="border-t border-slate-600 pt-4">
            <h5 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h5>
            {!showDeleteConfirm ? (
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                size="sm"
                className="text-sm"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Service
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                    className="text-sm"
                  >
                    Yes, Delete
                  </Button>
                  <Button 
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="secondary"
                    size="sm"
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 