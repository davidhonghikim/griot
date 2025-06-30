"use strict";
/**
 * Service Store - Jotai-based service management
 *
 * Ports kai-cd service management patterns to Jotai atoms
 * Provides comprehensive service CRUD operations, status checking, and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHydratedAtom = exports.initializeDefaultServicesAtom = exports.updateCustomUrlAtom = exports.removeCustomUrlAtom = exports.addCustomUrlAtom = exports.sortServicesAtom = exports.checkServiceStatusAtom = exports.toggleServiceArchiveAtom = exports.setSelectedServiceIdAtom = exports.removeServiceAtom = exports.updateServiceAtom = exports.addServiceAtom = exports.archivedServicesAtom = exports.activeServicesAtom = exports.selectedServiceAtom = exports.hasHydratedAtom = exports.customUrlsAtom = exports.selectedServiceIdAtom = exports.servicesAtom = void 0;
const jotai_1 = require("jotai");
const utils_1 = require("jotai/utils");
const uuid_1 = require("uuid");
const definitions_1 = require("../../services/definitions");
// =============================================================================
// BASE ATOMS
// =============================================================================
exports.servicesAtom = (0, utils_1.atomWithStorage)('owu-services', []);
exports.selectedServiceIdAtom = (0, utils_1.atomWithStorage)('owu-selected-service-id', null);
exports.customUrlsAtom = (0, utils_1.atomWithStorage)('owu-custom-urls', []);
exports.hasHydratedAtom = (0, jotai_1.atom)(false);
// =============================================================================
// DERIVED ATOMS
// =============================================================================
exports.selectedServiceAtom = (0, jotai_1.atom)((get) => {
    const services = get(exports.servicesAtom);
    const selectedId = get(exports.selectedServiceIdAtom);
    return selectedId ? services.find(s => s.id === selectedId) : null;
});
exports.activeServicesAtom = (0, jotai_1.atom)((get) => get(exports.servicesAtom).filter(s => !s.archived));
exports.archivedServicesAtom = (0, jotai_1.atom)((get) => get(exports.servicesAtom).filter(s => s.archived));
// =============================================================================
// SERVICE UTILITIES
// =============================================================================
const buildServiceUrl = (data) => {
    if (data.ipType === 'custom' || data.ipType === 'cloud') {
        return data.customUrl || '';
    }
    // Use 192.168.1.180 as default for dev, but allow network config to override
    const defaultIp = '192.168.1.180';
    const ip = data.ipType === 'local' ? defaultIp : defaultIp; // TODO: Get from network config
    if (!ip)
        return '';
    return `http://${ip}:${data.port}`;
};
const createService = (serviceData) => {
    const definition = definitions_1.allServiceDefinitions.find(def => def.type === serviceData.serviceDefinitionId);
    if (!definition)
        throw new Error(`Service definition not found for type: ${serviceData.serviceDefinitionId}`);
    const url = buildServiceUrl({ ...serviceData, port: definition.defaultPort });
    return {
        ...definition,
        ...serviceData,
        id: (0, uuid_1.v4)(),
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
exports.addServiceAtom = (0, jotai_1.atom)(null, (get, set, serviceData) => {
    try {
        const newService = createService(serviceData);
        const services = get(exports.servicesAtom);
        set(exports.servicesAtom, [...services, newService]);
        if (newService.ipType === 'custom' && newService.url) {
            const customUrls = get(exports.customUrlsAtom);
            if (!customUrls.includes(newService.url)) {
                set(exports.customUrlsAtom, [...customUrls, newService.url]);
            }
        }
    }
    catch (error) {
        console.error("Failed to add service:", error);
    }
});
exports.updateServiceAtom = (0, jotai_1.atom)(null, (get, set, updatedService) => {
    const services = get(exports.servicesAtom);
    const updatedServices = services.map((service) => {
        if (service.id === updatedService.id) {
            const mergedServiceData = { ...service, ...updatedService };
            // Re-fetch definition to get the correct port if type changed
            const definition = definitions_1.allServiceDefinitions.find(d => d.type === mergedServiceData.type);
            const port = definition?.defaultPort || service.defaultPort;
            // Re-build the URL based on the updated data
            const url = buildServiceUrl({ ...mergedServiceData, port });
            if (updatedService.ipType === 'custom' && url) {
                const customUrls = get(exports.customUrlsAtom);
                if (!customUrls.includes(url)) {
                    set(exports.customUrlsAtom, [...customUrls, url]);
                }
            }
            return { ...mergedServiceData, url, updatedAt: Date.now() };
        }
        return service;
    });
    set(exports.servicesAtom, updatedServices);
});
exports.removeServiceAtom = (0, jotai_1.atom)(null, (get, set, serviceId) => {
    const services = get(exports.servicesAtom);
    const selectedId = get(exports.selectedServiceIdAtom);
    set(exports.servicesAtom, services.filter(s => s.id !== serviceId));
    if (selectedId === serviceId) {
        set(exports.selectedServiceIdAtom, null);
    }
});
exports.setSelectedServiceIdAtom = (0, jotai_1.atom)(null, (_get, set, serviceId) => {
    set(exports.selectedServiceIdAtom, serviceId);
});
exports.toggleServiceArchiveAtom = (0, jotai_1.atom)(null, (get, set, serviceId) => {
    const services = get(exports.servicesAtom);
    const updatedServices = services.map((service) => {
        if (service.id === serviceId) {
            return { ...service, archived: !service.archived, updatedAt: Date.now() };
        }
        return service;
    });
    set(exports.servicesAtom, updatedServices);
});
exports.checkServiceStatusAtom = (0, jotai_1.atom)(null, async (_get, set, serviceToCheck) => {
    // Update status to checking
    set(exports.updateServiceAtom, {
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
                set(exports.updateServiceAtom, {
                    id: serviceToCheck.id,
                    status: 'online',
                    lastChecked: Date.now()
                });
            }
            else {
                set(exports.updateServiceAtom, {
                    id: serviceToCheck.id,
                    status: 'offline',
                    lastChecked: Date.now()
                });
            }
        }
        else {
            // Basic connectivity test
            await fetch(serviceToCheck.url, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: AbortSignal.timeout(5000)
            });
            set(exports.updateServiceAtom, {
                id: serviceToCheck.id,
                status: 'online',
                lastChecked: Date.now()
            });
        }
    }
    catch (error) {
        set(exports.updateServiceAtom, {
            id: serviceToCheck.id,
            status: 'offline',
            lastChecked: Date.now()
        });
    }
});
exports.sortServicesAtom = (0, jotai_1.atom)(null, (get, set, sortBy) => {
    const services = get(exports.servicesAtom);
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
    set(exports.servicesAtom, sorted);
});
// =============================================================================
// CUSTOM URL MANAGEMENT
// =============================================================================
exports.addCustomUrlAtom = (0, jotai_1.atom)(null, (get, set, url) => {
    const customUrls = get(exports.customUrlsAtom);
    if (!customUrls.includes(url)) {
        set(exports.customUrlsAtom, [...customUrls, url]);
    }
});
exports.removeCustomUrlAtom = (0, jotai_1.atom)(null, (get, set, urlToRemove) => {
    const customUrls = get(exports.customUrlsAtom);
    set(exports.customUrlsAtom, customUrls.filter(u => u !== urlToRemove));
});
exports.updateCustomUrlAtom = (0, jotai_1.atom)(null, (get, set, oldUrl, newUrl) => {
    const customUrls = get(exports.customUrlsAtom);
    if (customUrls.includes(newUrl)) {
        // Just remove the old one
        set(exports.customUrlsAtom, customUrls.filter(u => u !== oldUrl));
    }
    else {
        // Replace the old with the new
        set(exports.customUrlsAtom, customUrls.map(u => u === oldUrl ? newUrl : u));
    }
});
// =============================================================================
// INITIALIZATION
// =============================================================================
exports.initializeDefaultServicesAtom = (0, jotai_1.atom)(null, (get, set) => {
    const services = get(exports.servicesAtom);
    if (services.length === 0) {
        const defaultServices = definitions_1.allServiceDefinitions.map(def => createService({
            name: `${def.name} (Default)`,
            serviceDefinitionId: def.type,
            ipType: 'local',
        }));
        set(exports.servicesAtom, defaultServices);
    }
});
// =============================================================================
// HYDRATION
// =============================================================================
exports.setHydratedAtom = (0, jotai_1.atom)(null, (_get, set, hydrated) => {
    set(exports.hasHydratedAtom, hydrated);
});
