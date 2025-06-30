/**
 * ServiceManagement Component
 * 
 * Main service management interface that ports kai-cd patterns
 * Provides comprehensive service listing, filtering, sorting, and management
 */

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import type { Service } from '../../types';
import { 
  servicesAtom, 
  sortServicesAtom, 
  initializeDefaultServicesAtom,
  setHydratedAtom 
} from '../../modules/state/serviceStore';
import { ServiceItem } from './ServiceItem';
import { ServiceForm } from './ServiceForm';
import { Button } from '../ui';
import { 
//  Server, 
  Plus, 
  Eye, 
  EyeOff, 
//  Funnel, 
  Cloud,
//  RefreshCw
} from 'lucide-react';

export const ServiceManagement: React.FC = () => {
  const [services] = useAtom(servicesAtom);
  const [, sortServices] = useAtom(sortServicesAtom);
  const [, initializeDefaultServices] = useAtom(initializeDefaultServicesAtom);
  const [, setHydrated] = useAtom(setHydratedAtom);

  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'type' | 'lastChecked'>('name');

  // Initialize services on mount
  useEffect(() => {
    initializeDefaultServices();
    setHydrated(true);
  }, [initializeDefaultServices, setHydrated]);

  // Apply sorting when sortBy changes
  useEffect(() => {
    sortServices(sortBy);
  }, [sortBy, sortServices]);

  const handleAddClick = () => {
    setIsAddingService(true);
    setEditingService(null);
    setExpandedServiceId(null);
  };

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setExpandedServiceId(null);
    setIsAddingService(false);
  };
  
  const handleCloseForms = () => {
    setIsAddingService(false);
    setEditingService(null);
  };

  const toggleDetails = (serviceId: string) => {
    setExpandedServiceId(prevId => (prevId === serviceId ? null : serviceId));
    setEditingService(null);
    setIsAddingService(false);
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
  };
    
  // Apply sorting to filtered services
  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        const statusOrder = { 'online': 0, 'checking': 1, 'offline': 2, 'error': 3, 'unknown': 4 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'type':
        return a.type.localeCompare(b.type);
      case 'lastChecked':
        return b.lastChecked - a.lastChecked;
      default:
        return 0;
    }
  });
  
  const activeServices = sortedServices.filter(s => !s.archived);
  const archivedServices = sortedServices.filter(s => s.archived);
  const displayServices = showArchived ? archivedServices : activeServices;

  return (
    <div className="p-4 md:p-6 h-full flex flex-col bg-slate-900">
      {/* Add/Edit Service Form */}
      {(isAddingService || editingService) && (
        <div className="mb-4 flex justify-center">
          <ServiceForm 
            service={editingService || undefined}
            onClose={handleCloseForms} 
          />
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-slate-100">
                {showArchived ? 'Archived Services' : 'Active Services'}
                <span className="ml-2 text-sm text-slate-400">
                  ({displayServices.length})
                </span>
              </h2>
              <Button 
                onClick={() => setShowArchived(!showArchived)}
                variant="secondary"
                size="sm"
                className="text-sm"
              >
                {showArchived ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Active ({activeServices.length})
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Show Archived ({archivedServices.length})
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Sort controls */}
              <div className="flex items-center space-x-2">
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                  className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200"
                >
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                  <option value="type">Sort by Type</option>
                  <option value="lastChecked">Sort by Last Checked</option>
                </select>
              </div>
              
              {!showArchived && (
                <Button 
                  onClick={handleAddClick} 
                  variant="primary" 
                  size="sm"
                  title="Add a new service"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Service
                </Button>
              )}
            </div>
          </div>

          {/* Services list */}
          {displayServices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Cloud className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <p className="text-lg mb-2">
                {showArchived ? 'No archived services' : 'No active services'}
              </p>
              <p className="text-sm">
                {showArchived 
                  ? 'Services you archive will appear here' 
                  : 'Add your first AI service to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayServices.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  onEdit={handleEditClick}
                  isExpanded={expandedServiceId === service.id}
                  onToggleDetails={toggleDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 