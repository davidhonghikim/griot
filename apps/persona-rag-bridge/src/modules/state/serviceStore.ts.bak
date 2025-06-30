/**
 * Service Store - Jotai-based service management
 * 
 * Ports kai-cd service management patterns to Jotai atoms
 * Provides comprehensive service CRUD operations, status checking, and management
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';
import type { Service, NewService } from '../../types';
import { allServiceDefinitions } from '../../services/definitions';

// =============================================================================
// SERVICE STORE STATE
// =============================================================================

export interface ServiceStoreState {
  services: Service[];
  selectedServiceId: string | null;
  customUrls: string[];
  _hasHydrated: boolean;
}

// =============================================================================
// BASE ATOMS
// =============================================================================

export const servicesAtom = atomWithStorage<Service[]>('owu-services', []);
export const selectedServiceIdAtom = atomWithStorage<string | null>('owu-selected-service-id', null);
export const customUrlsAtom = atomWithStorage<string[]>('owu-custom-urls', []);
export const hasHydratedAtom = atom<boolean>(false);

// =============================================================================
// DERIVED ATOMS
// =============================================================================

export const selectedServiceAtom = atom(
  (get) => {
    const services = get(servicesAtom);
    const selectedId = get(selectedServiceIdAtom);
    return selectedId ? services.find(s => s.id === selectedId) : null;
  }
);

export const activeServicesAtom = atom(
  (get) => get(servicesAtom).filter(s => !s.archived)
);

export const archivedServicesAtom = atom(
  (get) => get(servicesAtom).filter(s => s.archived)
);

// =============================================================================
// SERVICE UTILITIES
// =============================================================================

const buildServiceUrl = (data: { ipType: 'local' | 'remote' | 'cloud' | 'custom', customUrl?: string, port: number }): string => {
  if (data.ipType === 'custom' || data.ipType === 'cloud') {
    return data.customUrl || '';
  }
  
  // Use 192.168.1.180 as default for dev, but allow network config to override
  const defaultIp = '192.168.1.180';
  const ip = data.ipType === 'local' ? defaultIp : defaultIp; // TODO: Get from network config
  
  if (!ip) return '';
  return `http://${ip}:${data.port}`;
};

const createService = (serviceData: NewService): Service => {
  const definition = allServiceDefinitions.find(def => def.type === serviceData.serviceDefinitionId);
  if (!definition) throw new Error(`Service definition not found for type: ${serviceData.serviceDefinitionId}`);
  
  const url = buildServiceUrl({ ...serviceData, port: definition.defaultPort });
  
  return {
    ...definition,
    ...serviceData,
    id: uuidv4(),
    name: serviceData.name,
    url,
    enabled: true,
    status: 'unknown',
    lastChecked: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    history: [],
    archived: false,
    config: {},
  };
};

// =============================================================================
// SERVICE ACTIONS
// =============================================================================

export const addServiceAtom = atom(
  null,
  (get, set, serviceData: NewService) => {
    try {
      const newService = createService(serviceData);
      const services = get(servicesAtom);
      set(servicesAtom, [...services, newService]);
      
      if (newService.ipType === 'custom' && newService.url) {
        const customUrls = get(customUrlsAtom);
        if (!customUrls.includes(newService.url)) {
          set(customUrlsAtom, [...customUrls, newService.url]);
        }
      }
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  }
);

export const updateServiceAtom = atom(
  null,
  (get, set, updatedService: Partial<Service> & { id: string }) => {
    const services = get(servicesAtom);
    const updatedServices = services.map((service) => {
      if (service.id === updatedService.id) {
        const mergedServiceData = { ...service, ...updatedService };

        // Re-fetch definition to get the correct port if type changed
        const definition = allServiceDefinitions.find(d => d.type === mergedServiceData.type);
        const port = definition?.defaultPort || service.defaultPort;

        // Re-build the URL based on the updated data
        const url = buildServiceUrl({ ...mergedServiceData, port });

        if (updatedService.ipType === 'custom' && url) {
          const customUrls = get(customUrlsAtom);
          if (!customUrls.includes(url)) {
            set(customUrlsAtom, [...customUrls, url]);
          }
        }

        return { ...mergedServiceData, url, updatedAt: Date.now() };
      }
      return service;
    });
    set(servicesAtom, updatedServices);
  }
);

export const removeServiceAtom = atom(
  null,
  (get, set, serviceId: string) => {
    const services = get(servicesAtom);
    const selectedId = get(selectedServiceIdAtom);
    
    set(servicesAtom, services.filter(s => s.id !== serviceId));
    
    if (selectedId === serviceId) {
      set(selectedServiceIdAtom, null);
    }
  }
);

export const setSelectedServiceIdAtom = atom(
  null,
  (_get, set, serviceId: string | null) => {
    set(selectedServiceIdAtom, serviceId);
  }
);

export const toggleServiceArchiveAtom = atom(
  null,
  (get, set, serviceId: string) => {
    const services = get(servicesAtom);
    const updatedServices = services.map((service) => {
      if (service.id === serviceId) {
        return { ...service, archived: !service.archived, updatedAt: Date.now() };
      }
      return service;
    });
    set(servicesAtom, updatedServices);
  }
);

export const checkServiceStatusAtom = atom(
  null,
  async (_get, set, serviceToCheck: Service) => {
    // Update status to checking
    set(updateServiceAtom, { 
      id: serviceToCheck.id, 
      status: 'checking', 
      lastChecked: Date.now() 
    });
    
    const healthCapability = serviceToCheck.capabilities.find(c => c.capability === 'health');
    
    try {
      if (healthCapability) {
        // Use health endpoint if available
        const response = await fetch(`${serviceToCheck.url}${healthCapability.endpoints.health.path}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          set(updateServiceAtom, { 
            id: serviceToCheck.id, 
            status: 'online', 
            lastChecked: Date.now() 
          });
        } else {
          set(updateServiceAtom, { 
            id: serviceToCheck.id, 
            status: 'offline', 
            lastChecked: Date.now() 
          });
        }
      } else {
        // Basic connectivity test
        await fetch(serviceToCheck.url, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(5000) 
        });
        set(updateServiceAtom, { 
          id: serviceToCheck.id, 
          status: 'online', 
          lastChecked: Date.now() 
        });
      }
    } catch (error) {
      set(updateServiceAtom, { 
        id: serviceToCheck.id, 
        status: 'offline', 
        lastChecked: Date.now() 
      });
    }
  }
);

export const sortServicesAtom = atom(
  null,
  (get, set, sortBy: 'name' | 'status' | 'type' | 'lastChecked') => {
    const services = get(servicesAtom);
    const sorted = [...services].sort((a, b) => {
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
    set(servicesAtom, sorted);
  }
);

// =============================================================================
// CUSTOM URL MANAGEMENT
// =============================================================================

export const addCustomUrlAtom = atom(
  null,
  (get, set, url: string) => {
    const customUrls = get(customUrlsAtom);
    if (!customUrls.includes(url)) {
      set(customUrlsAtom, [...customUrls, url]);
    }
  }
);

export const removeCustomUrlAtom = atom(
  null,
  (get, set, urlToRemove: string) => {
    const customUrls = get(customUrlsAtom);
    set(customUrlsAtom, customUrls.filter(u => u !== urlToRemove));
  }
);

export const updateCustomUrlAtom = atom(
  null,
  (get, set, oldUrl: string, newUrl: string) => {
    const customUrls = get(customUrlsAtom);
    if (customUrls.includes(newUrl)) {
      // Just remove the old one
      set(customUrlsAtom, customUrls.filter(u => u !== oldUrl));
      
    } else {
      // Replace the old with the new
      set(customUrlsAtom, customUrls.map(u => u === oldUrl ? newUrl : u));
    }
  }
);

// =============================================================================
// INITIALIZATION
// =============================================================================

export const initializeDefaultServicesAtom = atom(
  null,
  (get, set) => {
    const services = get(servicesAtom);
    if (services.length === 0) {
      const defaultServices = allServiceDefinitions.map(def => createService({
        name: `${def.name} (Default)`,
        serviceDefinitionId: def.type,
        ipType: 'local',
      }));
      set(servicesAtom, defaultServices);
    }
  }
);

// =============================================================================
// HYDRATION
// =============================================================================

export const setHydratedAtom = atom(
  null,
  (_get, set, hydrated: boolean) => {
    set(hasHydratedAtom, hydrated);
  }
);
