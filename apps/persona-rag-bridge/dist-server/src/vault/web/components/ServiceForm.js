"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceForm = void 0;
const react_1 = __importStar(require("react"));
const SERVICE_TYPES = [
    { value: 'database', label: 'Database', ports: ['weaviate', 'postgresql', 'mongodb', 'redis', 'neo4j'] },
    { value: 'ai_model', label: 'AI Model', ports: ['openwebui', 'chromadb', 'qdrant'] },
    { value: 'storage', label: 'Storage', ports: ['dropbox', 's3'] },
    { value: 'network', label: 'Network', ports: ['custom'] },
    { value: 'custom', label: 'Custom', ports: ['custom'] }
];
const CREDENTIAL_TYPES = [
    { value: 'none', label: 'No Authentication' },
    { value: 'api_key', label: 'API Key' },
    { value: 'jwt', label: 'JWT Token' },
    { value: 'login', label: 'Username/Password' }
];
const ServiceForm = ({ service, onClose, onSubmit, config }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        name: service?.name || '',
        type: service?.type || 'database',
        url: service?.url || '',
        port: service?.port || 8080,
        enabled: service?.enabled ?? true,
        credentials: service?.credentials || { type: 'none' }
    });
    const [ipType, setIpType] = (0, react_1.useState)('local');
    // Update URL when IP type or port changes
    (0, react_1.useEffect)(() => {
        if (ipType === 'local') {
            setFormData(prev => ({
                ...prev,
                url: `http://${config.localIp}:${prev.port}`
            }));
        }
        else if (ipType === 'remote') {
            setFormData(prev => ({
                ...prev,
                url: `http://${config.remoteIp}:${prev.port}`
            }));
        }
    }, [ipType, config.localIp, config.remoteIp]);
    // Update port when service type changes
    (0, react_1.useEffect)(() => {
        const serviceType = SERVICE_TYPES.find(t => t.value === formData.type);
        if (serviceType && serviceType.ports.length > 0) {
            const defaultPort = config.defaultPorts[serviceType.ports[0]] || 8080;
            setFormData(prev => ({
                ...prev,
                port: defaultPort
            }));
        }
    }, [formData.type, config.defaultPorts]);
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleCredentialChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            credentials: {
                type: 'none',
                ...prev.credentials,
                [field]: value
            }
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.url) {
            alert('Service name and URL are required');
            return;
        }
        onSubmit(formData);
    };
    const isUrlDisabled = ipType === 'local' || ipType === 'remote';
    return (react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-4 p-4 bg-slate-800 rounded-lg" },
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { htmlFor: "name", className: "block text-sm font-medium text-slate-300" }, "Service Name"),
            react_1.default.createElement("input", { type: "text", id: "name", value: formData.name, onChange: (e) => handleChange('name', e.target.value), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white", required: true })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { htmlFor: "type", className: "block text-sm font-medium text-slate-300" }, "Service Type"),
            react_1.default.createElement("select", { id: "type", value: formData.type, onChange: (e) => handleChange('type', e.target.value), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white" }, SERVICE_TYPES.map(type => (react_1.default.createElement("option", { key: type.value, value: type.value }, type.label))))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { htmlFor: "url", className: "block text-sm font-medium text-slate-300" }, "Service URL"),
            react_1.default.createElement("div", { className: "mt-1 flex flex-col sm:flex-row gap-2" },
                react_1.default.createElement("select", { value: ipType, onChange: (e) => setIpType(e.target.value), className: "sm:flex-none block bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white" },
                    react_1.default.createElement("option", { value: "local" },
                        "Local (",
                        config.localIp,
                        ")"),
                    react_1.default.createElement("option", { value: "remote" },
                        "Remote (",
                        config.remoteIp,
                        ")"),
                    react_1.default.createElement("option", { value: "custom" }, "Custom")),
                react_1.default.createElement("input", { type: "text", id: "url", value: formData.url, onChange: (e) => handleChange('url', e.target.value), disabled: isUrlDisabled, className: "flex-grow block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white", placeholder: "http://...", required: true }))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { htmlFor: "port", className: "block text-sm font-medium text-slate-300" }, "Port"),
            react_1.default.createElement("input", { type: "number", id: "port", value: formData.port, onChange: (e) => handleChange('port', parseInt(e.target.value)), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white", min: "1", max: "65535", required: true })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", { htmlFor: "credentialType", className: "block text-sm font-medium text-slate-300" }, "Authentication"),
            react_1.default.createElement("select", { id: "credentialType", value: formData.credentials?.type || 'none', onChange: (e) => handleCredentialChange('type', e.target.value), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white" }, CREDENTIAL_TYPES.map(type => (react_1.default.createElement("option", { key: type.value, value: type.value }, type.label))))),
        formData.credentials?.type !== 'none' && (react_1.default.createElement("div", { className: "space-y-2" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { htmlFor: "credentialKey", className: "block text-sm font-medium text-slate-300" }, "Credential Key"),
                react_1.default.createElement("input", { type: "text", id: "credentialKey", value: formData.credentials?.key || '', onChange: (e) => handleCredentialChange('key', e.target.value), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white", placeholder: "API_KEY, username, etc." })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { htmlFor: "credentialValue", className: "block text-sm font-medium text-slate-300" }, "Credential Value"),
                react_1.default.createElement("input", { type: "password", id: "credentialValue", value: formData.credentials?.value || '', onChange: (e) => handleCredentialChange('value', e.target.value), className: "mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white", placeholder: "Enter credential value" })))),
        react_1.default.createElement("div", { className: "flex items-center" },
            react_1.default.createElement("input", { id: "enabled", type: "checkbox", checked: formData.enabled, onChange: (e) => handleChange('enabled', e.target.checked), className: "h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-600 focus:ring-cyan-500" }),
            react_1.default.createElement("label", { htmlFor: "enabled", className: "ml-2 block text-sm text-slate-300" }, "Enabled")),
        react_1.default.createElement("div", { className: "flex justify-end space-x-2 pt-4" },
            react_1.default.createElement("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" }, "Cancel"),
            react_1.default.createElement("button", { type: "submit", className: "px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" }, service ? 'Update Service' : 'Add Service'))));
};
exports.ServiceForm = ServiceForm;
