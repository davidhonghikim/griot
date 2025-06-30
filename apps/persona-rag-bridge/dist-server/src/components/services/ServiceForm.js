"use strict";
/**
 * ServiceForm Component
 *
 * Ports kai-cd service form patterns for adding and editing services
 */
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
const jotai_1 = require("jotai");
const definitions_1 = require("../../services/definitions");
const serviceStore_1 = require("../../modules/state/serviceStore");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const ServiceForm = ({ service, onClose }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        name: service?.name || '',
        serviceDefinitionId: service?.serviceDefinitionId || '',
        ipType: service?.ipType || 'local',
        customUrl: service?.customUrl || '',
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [, addService] = (0, jotai_1.useAtom)(serviceStore_1.addServiceAtom);
    const [, updateService] = (0, jotai_1.useAtom)(serviceStore_1.updateServiceAtom);
    const isEditing = !!service;
    const validateForm = () => {
        const newErrors = {};
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
    const handleSubmit = (e) => {
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
            }
            else {
                addService(formData);
            }
            onClose();
        }
        catch (error) {
            console.error('Failed to save service:', error);
            setErrors({ submit: 'Failed to save service' });
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const handleAuthChange = (field, value) => {
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
    const selectedDefinition = definitions_1.allServiceDefinitions.find(def => def.type === formData.serviceDefinitionId);
    // Determine if API key is required
    const requiresApiKey = selectedDefinition && selectedDefinition.authentication.type === 'api_key';
    return (react_1.default.createElement("div", { className: "bg-slate-800 rounded-lg shadow-2xl p-6 max-w-md w-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between mb-6" },
            react_1.default.createElement("h3", { className: "text-xl font-semibold text-slate-100" }, isEditing ? 'Edit Service' : 'Add New Service'),
            react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: onClose, className: "text-slate-400 hover:text-slate-200" },
                react_1.default.createElement(lucide_react_1.X, { className: "h-4 w-4" }))),
        react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-slate-300 mb-1" }, "Service Name"),
                react_1.default.createElement("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: `w-full px-3 py-2 bg-slate-700 border rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-600'}`, placeholder: "Enter service name" }),
                errors.name && (react_1.default.createElement("p", { className: "text-red-400 text-xs mt-1" }, errors.name))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-slate-300 mb-1" }, "Service Type"),
                react_1.default.createElement("select", { value: formData.serviceDefinitionId, onChange: (e) => handleInputChange('serviceDefinitionId', e.target.value), className: `w-full px-3 py-2 bg-slate-700 border rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.serviceDefinitionId ? 'border-red-500' : 'border-slate-600'}` },
                    react_1.default.createElement("option", { value: "" }, "Select service type"),
                    definitions_1.allServiceDefinitions.map((def) => (react_1.default.createElement("option", { key: def.type, value: def.type },
                        def.name,
                        " - ",
                        def.category)))),
                errors.serviceDefinitionId && (react_1.default.createElement("p", { className: "text-red-400 text-xs mt-1" }, errors.serviceDefinitionId))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-slate-300 mb-1" }, "Connection Type"),
                react_1.default.createElement("select", { value: formData.ipType, onChange: (e) => handleInputChange('ipType', e.target.value), className: "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" },
                    react_1.default.createElement("option", { value: "local" }, "Local Network"),
                    react_1.default.createElement("option", { value: "remote" }, "Remote Network"),
                    react_1.default.createElement("option", { value: "cloud" }, "Cloud Service"),
                    react_1.default.createElement("option", { value: "custom" }, "Custom URL"))),
            (formData.ipType === 'custom' || formData.ipType === 'cloud') && (react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-slate-300 mb-1" }, formData.ipType === 'cloud' ? 'Cloud URL' : 'Custom URL'),
                react_1.default.createElement("input", { type: "url", value: formData.customUrl, onChange: (e) => handleInputChange('customUrl', e.target.value), className: `w-full px-3 py-2 bg-slate-700 border rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.customUrl ? 'border-red-500' : 'border-slate-600'}`, placeholder: formData.ipType === 'cloud' ? 'https://api.example.com' : 'http://192.168.1.100:3000' }),
                errors.customUrl && (react_1.default.createElement("p", { className: "text-red-400 text-xs mt-1" }, errors.customUrl)))),
            requiresApiKey && (react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-slate-300 mb-1" }, "API Key"),
                react_1.default.createElement("input", { type: "password", value: formData.authentication?.apiKey || '', onChange: (e) => handleAuthChange('apiKey', e.target.value), className: `w-full px-3 py-2 bg-slate-700 border rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.apiKey ? 'border-red-500' : 'border-slate-600'}`, placeholder: "Enter API key" }),
                errors.apiKey && (react_1.default.createElement("p", { className: "text-red-400 text-xs mt-1" }, errors.apiKey)))),
            selectedDefinition && (react_1.default.createElement("div", { className: "bg-slate-700 rounded-md p-3" },
                react_1.default.createElement("h4", { className: "text-sm font-medium text-slate-200 mb-2" }, selectedDefinition.name),
                react_1.default.createElement("p", { className: "text-xs text-slate-400 mb-2" }, selectedDefinition.configuration.help.instructions),
                react_1.default.createElement("div", { className: "text-xs text-slate-500" },
                    react_1.default.createElement("span", { className: "font-medium" }, "Category:"),
                    " ",
                    selectedDefinition.category,
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("span", { className: "font-medium" }, "Default Port:"),
                    " ",
                    selectedDefinition.defaultPort,
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("span", { className: "font-medium" }, "Authentication:"),
                    " ",
                    selectedDefinition.authentication.type))),
            errors.submit && (react_1.default.createElement("div", { className: "bg-red-900/20 border border-red-500 rounded-md p-3" },
                react_1.default.createElement("p", { className: "text-red-400 text-sm" }, errors.submit))),
            react_1.default.createElement("div", { className: "flex space-x-3 pt-4" },
                react_1.default.createElement(ui_1.Button, { type: "submit", variant: "primary", className: "flex-1" }, isEditing ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }),
                    "Save Changes")) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }),
                    "Add Service"))),
                react_1.default.createElement(ui_1.Button, { type: "button", variant: "secondary", onClick: onClose }, "Cancel")))));
};
exports.ServiceForm = ServiceForm;
