"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceInitializer = void 0;
const env_1 = require("../config/env");
/**
 * Browser-Safe Service Initializer
 *
 * Provides mock service status for browser context without creating actual services
 * that might use OpenAI API or other server-side dependencies.
 */
class ServiceInitializer {
    constructor() {
        console.log('Browser-safe ServiceInitializer created');
    }
    /**
     * Build service URL based on IP type and configuration
     */
    buildServiceUrl(serviceType, ipType, customUrl) {
        if (ipType === 'custom' || ipType === 'cloud') {
            return customUrl || '';
        }
        const ip = ipType === 'local' ? env_1.config.networking.localIp : env_1.config.networking.remoteIp;
        if (!ip)
            return '';
        // Mock port mapping
        const portMap = {
            'persona_rag': 5000,
            'openwebui': 3000,
            'vector_store': 8080
        };
        return `http://${ip}:${portMap[serviceType] || 3000}`;
    }
    /**
     * Check if a service is actually online (browser-safe)
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
     * Initialize services with browser-safe mock data
     */
    async initializeServices(setServicesState) {
        console.log('Browser-safe service initialization - using mock services');
        try {
            // Create services with real status checks but no service creation
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
            console.log('Browser-safe services initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize browser-safe services:', error);
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
     * Cleanup services (no-op for browser)
     */
    async cleanup() {
        console.log('Browser-safe cleanup - no services to cleanup');
    }
}
exports.ServiceInitializer = ServiceInitializer;
