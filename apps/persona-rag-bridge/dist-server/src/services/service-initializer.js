"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceInitializer = void 0;
const service_factory_1 = require("./service-factory");
const definitions_1 = require("./definitions");
const env_1 = require("../config/env");
/**
 * Service Initializer
 *
 * Initializes and populates the servicesStateAtom with the actual services
 * from the existing service infrastructure, checking real service status.
 */
class ServiceInitializer {
    constructor() {
        Object.defineProperty(this, "serviceFactory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.serviceFactory = new service_factory_1.ServiceFactory({
            enablePersonaRAG: true,
            enableOpenWebUI: true,
            enableVectorStore: true,
        });
    }
    /**
     * Build service URL based on IP type and configuration
     */
    buildServiceUrl(serviceType, ipType, customUrl) {
        const definition = definitions_1.allServiceDefinitions.find(def => def.type === serviceType);
        if (!definition)
            return '';
        if (ipType === 'custom' || ipType === 'cloud') {
            return customUrl || '';
        }
        const ip = ipType === 'local' ? env_1.config.networking.localIp : env_1.config.networking.remoteIp;
        if (!ip)
            return '';
        return `http://${ip}:${definition.defaultPort}`;
    }
    /**
     * Check if a service is actually online
     */
    async checkServiceStatus(url, healthEndpoint) {
        try {
            const response = await fetch(`${url}${healthEndpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(env_1.config.networking.defaultTimeoutMs),
            });
            if (response.ok) {
                return 'online';
            }
            else {
                return 'error';
            }
        }
        catch (error) {
            console.warn(`Service health check failed for ${url}:`, error);
            return 'offline';
        }
    }
    /**
     * Initialize services and populate the servicesStateAtom
     */
    async initializeServices(setServicesState) {
        try {
            // Create the actual service instances (we create them to ensure they're available)
            this.serviceFactory.createPersonaRAGService();
            this.serviceFactory.createOpenWebUIBridgeService(this.serviceFactory.createPersonaRAGService());
            this.serviceFactory.createVectorStoreService();
            // Create services with real status checks
            const services = [];
            // PersonaRAG Service
            const personaRAGUrl = this.buildServiceUrl('persona_rag', 'local');
            const personaRAGStatus = await this.checkServiceStatus(personaRAGUrl, '/health');
            services.push({
                id: 'persona-rag',
                name: 'Persona RAG',
                type: 'ollama',
                url: personaRAGUrl,
                status: personaRAGStatus,
                lastCheck: new Date(),
                config: {
                    model: env_1.config.services.defaultPersonaRAGModel,
                    temperature: 0.7,
                    maxTokens: 2048,
                },
            });
            // OpenWebUI Service
            const openWebUIUrl = this.buildServiceUrl('openwebui', 'remote');
            const openWebUIStatus = await this.checkServiceStatus(openWebUIUrl, '/api/v1/health');
            services.push({
                id: 'openwebui',
                name: 'OpenWebUI',
                type: 'ollama',
                url: openWebUIUrl,
                status: openWebUIStatus,
                lastCheck: new Date(),
                config: {
                    model: env_1.config.services.defaultOpenWebUIModel,
                    temperature: 0.7,
                    maxTokens: 2048,
                },
            });
            // Vector Store Service
            const vectorStoreUrl = this.buildServiceUrl('vector_store', 'local');
            const vectorStoreStatus = await this.checkServiceStatus(vectorStoreUrl, '/health');
            services.push({
                id: 'vector-store',
                name: 'Vector Store',
                type: 'huggingface',
                url: vectorStoreUrl,
                status: vectorStoreStatus,
                lastCheck: new Date(),
                config: {
                    model: env_1.config.services.defaultVectorStoreModel,
                    dimension: 384,
                },
            });
            // Update the services state
            setServicesState(services);
            console.log('Services initialized successfully with real status checks');
        }
        catch (error) {
            console.error('Failed to initialize services:', error);
            // Set services as offline if initialization fails
            const offlineServices = [
                {
                    id: 'persona-rag',
                    name: 'Persona RAG',
                    type: 'ollama',
                    url: this.buildServiceUrl('persona_rag', 'local'),
                    status: 'offline',
                    lastCheck: new Date(),
                    config: {},
                },
                {
                    id: 'openwebui',
                    name: 'OpenWebUI',
                    type: 'ollama',
                    url: this.buildServiceUrl('openwebui', 'remote'),
                    status: 'offline',
                    lastCheck: new Date(),
                    config: {},
                },
                {
                    id: 'vector-store',
                    name: 'Vector Store',
                    type: 'huggingface',
                    url: this.buildServiceUrl('vector_store', 'local'),
                    status: 'offline',
                    lastCheck: new Date(),
                    config: {},
                },
            ];
            setServicesState(offlineServices);
        }
    }
    /**
     * Cleanup services
     */
    async cleanup() {
        try {
            await this.serviceFactory.cleanup();
        }
        catch (error) {
            console.error('Failed to cleanup services:', error);
        }
    }
}
exports.ServiceInitializer = ServiceInitializer;
