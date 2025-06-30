"use strict";
/**
 * Configuration Manager for OWU+ Extension
 *
 * Supports multiple configuration sources:
 * - Environment defaults (for testing)
 * - User config files
 * - Network database/RAG retrieval
 * - Runtime updates via UI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.configManager = exports.ConfigManager = void 0;
class ConfigManager {
    constructor() {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Default testing configuration
        Object.defineProperty(this, "defaults", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                connection: {
                    openwebuiUrl: 'http://192.168.1.180:3000',
                    ragServiceUrl: 'http://localhost:3001',
                    useLocalRAG: true,
                    timeout: 5000,
                    retries: 3
                },
                network: {
                    autoDiscovery: true,
                    discoveryTimeout: 10000,
                    preferredNetworks: ['192.168.1.*', 'localhost'],
                    fallbackUrls: ['http://localhost:3000', 'http://127.0.0.1:3000']
                },
                theme: 'dark',
                language: 'en',
                notifications: true,
                version: '1.0.0',
                lastUpdated: new Date()
            }
        });
        this.initializeDefaults();
    }
    /**
     * Initialize with default testing configuration
     */
    initializeDefaults() {
        this.setConfigValue('connection.openwebuiUrl', this.defaults.connection.openwebuiUrl, 'default');
        this.setConfigValue('connection.ragServiceUrl', this.defaults.connection.ragServiceUrl, 'default');
        this.setConfigValue('connection.useLocalRAG', this.defaults.connection.useLocalRAG, 'default');
        this.setConfigValue('connection.timeout', this.defaults.connection.timeout, 'default');
        this.setConfigValue('connection.retries', this.defaults.connection.retries, 'default');
        this.setConfigValue('network.autoDiscovery', this.defaults.network.autoDiscovery, 'default');
        this.setConfigValue('network.discoveryTimeout', this.defaults.network.discoveryTimeout, 'default');
        this.setConfigValue('network.preferredNetworks', this.defaults.network.preferredNetworks, 'default');
        this.setConfigValue('network.fallbackUrls', this.defaults.network.fallbackUrls, 'default');
        this.setConfigValue('theme', this.defaults.theme, 'default');
        this.setConfigValue('language', this.defaults.language, 'default');
        this.setConfigValue('notifications', this.defaults.notifications, 'default');
    }
    /**
     * Set a configuration value with source tracking
     */
    setConfigValue(key, value, source) {
        const priority = this.getSourcePriority(source);
        const existing = this.config.get(key);
        // Only update if new source has higher priority
        if (!existing || priority >= existing.priority) {
            this.config.set(key, {
                value,
                source,
                timestamp: new Date(),
                priority
            });
            // Notify listeners
            this.notifyListeners(key, value);
        }
    }
    /**
     * Get source priority (higher = more important)
     */
    getSourcePriority(source) {
        switch (source) {
            case 'default': return 1;
            case 'userFile': return 2;
            case 'networkRAG': return 3;
            case 'runtime': return 4;
            default: return 0;
        }
    }
    /**
     * Get configuration value
     */
    get(key) {
        const entry = this.config.get(key);
        return entry?.value;
    }
    /**
     * Get configuration value with fallback
     */
    getWithFallback(key, fallback) {
        return this.get(key) ?? fallback;
    }
    /**
     * Set configuration value from runtime (UI)
     */
    set(key, value) {
        this.setConfigValue(key, value, 'runtime');
    }
    /**
     * Load configuration from user config file
     */
    async loadFromUserFile(configData) {
        try {
            if (configData.connection) {
                Object.entries(configData.connection).forEach(([key, value]) => {
                    this.setConfigValue(`connection.${key}`, value, 'userFile');
                });
            }
            if (configData.network) {
                Object.entries(configData.network).forEach(([key, value]) => {
                    this.setConfigValue(`network.${key}`, value, 'userFile');
                });
            }
            ['theme', 'language', 'notifications'].forEach(key => {
                if (configData[key] !== undefined) {
                    this.setConfigValue(key, configData[key], 'userFile');
                }
            });
            console.log('Configuration loaded from user file');
        }
        catch (error) {
            console.error('Failed to load user config file:', error);
        }
    }
    /**
     * Load configuration from network database/RAG
     */
    async loadFromNetworkRAG() {
        try {
            // TODO: Implement network database/RAG configuration retrieval
            // This would connect to the RAG service and fetch configuration
            const networkConfig = await this.fetchNetworkConfiguration();
            if (networkConfig) {
                Object.entries(networkConfig).forEach(([key, value]) => {
                    this.setConfigValue(key, value, 'networkRAG');
                });
                console.log('Configuration loaded from network RAG');
            }
        }
        catch (error) {
            console.error('Failed to load network RAG configuration:', error);
        }
    }
    /**
     * Fetch configuration from network RAG service
     */
    async fetchNetworkConfiguration() {
        try {
            const response = await fetch(`${this.get('connection.ragServiceUrl')}/api/config`);
            if (response.ok) {
                return await response.json();
            }
        }
        catch (error) {
            console.warn('Network RAG configuration not available:', error);
        }
        return null;
    }
    /**
     * Get current connection configuration
     */
    getConnectionConfig() {
        return {
            openwebuiUrl: this.getWithFallback('connection.openwebuiUrl', this.defaults.connection.openwebuiUrl),
            openwebuiApiKey: this.get('connection.openwebuiApiKey'),
            ragServiceUrl: this.getWithFallback('connection.ragServiceUrl', this.defaults.connection.ragServiceUrl),
            useLocalRAG: this.getWithFallback('connection.useLocalRAG', this.defaults.connection.useLocalRAG),
            timeout: this.getWithFallback('connection.timeout', this.defaults.connection.timeout),
            retries: this.getWithFallback('connection.retries', this.defaults.connection.retries)
        };
    }
    /**
     * Get network configuration
     */
    getNetworkConfig() {
        return {
            autoDiscovery: this.getWithFallback('network.autoDiscovery', this.defaults.network.autoDiscovery),
            discoveryTimeout: this.getWithFallback('network.discoveryTimeout', this.defaults.network.discoveryTimeout),
            preferredNetworks: this.getWithFallback('network.preferredNetworks', this.defaults.network.preferredNetworks),
            fallbackUrls: this.getWithFallback('network.fallbackUrls', this.defaults.network.fallbackUrls)
        };
    }
    /**
     * Subscribe to configuration changes
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(key);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        };
    }
    /**
     * Notify listeners of configuration changes
     */
    notifyListeners(key, value) {
        const listeners = this.listeners.get(key);
        if (listeners) {
            listeners.forEach(callback => callback(value));
        }
    }
    /**
     * Export current configuration
     */
    exportConfig() {
        return {
            connection: this.getConnectionConfig(),
            network: this.getNetworkConfig(),
            theme: this.getWithFallback('theme', this.defaults.theme),
            language: this.getWithFallback('language', this.defaults.language),
            notifications: this.getWithFallback('notifications', this.defaults.notifications),
            version: this.defaults.version,
            lastUpdated: new Date()
        };
    }
    /**
     * Get configuration source information
     */
    getConfigSource(key) {
        return this.config.get(key);
    }
}
exports.ConfigManager = ConfigManager;
// Singleton instance
exports.configManager = new ConfigManager();
