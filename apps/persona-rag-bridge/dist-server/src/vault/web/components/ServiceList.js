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
exports.ServiceList = void 0;
const react_1 = __importStar(require("react"));
const ServiceForm_1 = require("./ServiceForm");
const getStatusIcon = (status) => {
    switch (status) {
        case 'online':
            return (react_1.default.createElement("div", { className: "flex items-center text-green-400" },
                react_1.default.createElement("div", { className: "w-2 h-2 bg-green-400 rounded-full mr-2" }),
                "Online"));
        case 'offline':
            return (react_1.default.createElement("div", { className: "flex items-center text-red-400" },
                react_1.default.createElement("div", { className: "w-2 h-2 bg-red-400 rounded-full mr-2" }),
                "Offline"));
        case 'error':
            return (react_1.default.createElement("div", { className: "flex items-center text-yellow-400" },
                react_1.default.createElement("div", { className: "w-2 h-2 bg-yellow-400 rounded-full mr-2" }),
                "Error"));
        case 'checking':
            return (react_1.default.createElement("div", { className: "flex items-center text-blue-400" },
                react_1.default.createElement("div", { className: "w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" }),
                "Checking"));
        default:
            return (react_1.default.createElement("div", { className: "flex items-center text-gray-400" },
                react_1.default.createElement("div", { className: "w-2 h-2 bg-gray-400 rounded-full mr-2" }),
                "Unknown"));
    }
};
const getTypeIcon = (type) => {
    switch (type) {
        case 'database':
            return '🗄️';
        case 'ai_model':
            return '🤖';
        case 'storage':
            return '💾';
        case 'network':
            return '🌐';
        case 'custom':
            return '⚙️';
        default:
            return '🔧';
    }
};
const ServiceList = ({ services, onAddService, onUpdateService, onDeleteService, onCheckStatus, config }) => {
    const [showAddForm, setShowAddForm] = (0, react_1.useState)(false);
    const [editingService, setEditingService] = (0, react_1.useState)(null);
    const [expandedService, setExpandedService] = (0, react_1.useState)(null);
    const handleAddService = (data) => {
        onAddService(data);
        setShowAddForm(false);
    };
    const handleUpdateService = (data) => {
        if (editingService) {
            onUpdateService(editingService.id, data);
            setEditingService(null);
        }
    };
    const handleDeleteService = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            onDeleteService(id);
        }
    };
    const toggleExpanded = (id) => {
        setExpandedService(expandedService === id ? null : id);
    };
    return (react_1.default.createElement("div", { className: "space-y-4" },
        react_1.default.createElement("div", { className: "flex justify-between items-center" },
            react_1.default.createElement("h2", { className: "text-xl font-semibold text-slate-100" }, "Services"),
            react_1.default.createElement("button", { onClick: () => setShowAddForm(true), className: "px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" }, "Add Service")),
        showAddForm && (react_1.default.createElement("div", { className: "bg-slate-900 rounded-lg p-4 border border-slate-700" },
            react_1.default.createElement("div", { className: "flex justify-between items-center mb-4" },
                react_1.default.createElement("h3", { className: "text-lg font-medium text-slate-100" }, "Add New Service"),
                react_1.default.createElement("button", { onClick: () => setShowAddForm(false), className: "text-slate-400 hover:text-slate-300" }, "\u2715")),
            react_1.default.createElement(ServiceForm_1.ServiceForm, { onClose: () => setShowAddForm(false), onSubmit: handleAddService, config: config }))),
        editingService && (react_1.default.createElement("div", { className: "bg-slate-900 rounded-lg p-4 border border-slate-700" },
            react_1.default.createElement("div", { className: "flex justify-between items-center mb-4" },
                react_1.default.createElement("h3", { className: "text-lg font-medium text-slate-100" }, "Edit Service"),
                react_1.default.createElement("button", { onClick: () => setEditingService(null), className: "text-slate-400 hover:text-slate-300" }, "\u2715")),
            react_1.default.createElement(ServiceForm_1.ServiceForm, { service: editingService, onClose: () => setEditingService(null), onSubmit: handleUpdateService, config: config }))),
        react_1.default.createElement("div", { className: "space-y-2" }, services.length === 0 ? (react_1.default.createElement("div", { className: "text-center py-8 text-slate-400" },
            react_1.default.createElement("p", null, "No services configured"),
            react_1.default.createElement("p", { className: "text-sm" }, "Click \"Add Service\" to get started"))) : (services.map(service => (react_1.default.createElement("div", { key: service.id, className: "bg-slate-800 rounded-lg border border-slate-700" },
            react_1.default.createElement("div", { className: "flex items-center justify-between p-4" },
                react_1.default.createElement("div", { className: "flex items-center space-x-3" },
                    react_1.default.createElement("span", { className: "text-xl" }, getTypeIcon(service.type)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", { className: "font-medium text-slate-100" }, service.name),
                        react_1.default.createElement("p", { className: "text-sm text-slate-400" }, service.url),
                        react_1.default.createElement("p", { className: "text-xs text-slate-500 capitalize" },
                            service.type.replace('_', ' '),
                            " \u2022 Port ",
                            service.port))),
                react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                    getStatusIcon(service.status),
                    react_1.default.createElement("button", { onClick: () => onCheckStatus(service.id), disabled: service.status === 'checking', className: "px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-50" }, "Check"),
                    react_1.default.createElement("button", { onClick: () => toggleExpanded(service.id), className: "px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600" }, expandedService === service.id ? 'Hide' : 'Details'),
                    react_1.default.createElement("button", { onClick: () => setEditingService(service), className: "px-3 py-1 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600" }, "Edit"),
                    react_1.default.createElement("button", { onClick: () => handleDeleteService(service.id), className: "px-3 py-1 text-xs font-medium text-red-300 bg-red-900 border border-red-700 rounded hover:bg-red-800" }, "Delete"))),
            expandedService === service.id && (react_1.default.createElement("div", { className: "border-t border-slate-700 p-4 bg-slate-900" },
                react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Status:"),
                        " ",
                        service.status),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Enabled:"),
                        " ",
                        service.enabled ? 'Yes' : 'No'),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Authentication:"),
                        " ",
                        service.credentials?.type || 'None'),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Last Checked:"),
                        " ",
                        service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'),
                    service.credentials?.key && (react_1.default.createElement("div", { className: "sm:col-span-2" },
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Credential Key:"),
                        " ",
                        service.credentials.key))))))))))));
};
exports.ServiceList = ServiceList;
