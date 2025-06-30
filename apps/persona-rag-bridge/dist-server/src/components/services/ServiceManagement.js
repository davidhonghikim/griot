"use strict";
/**
 * ServiceManagement Component
 *
 * Main service management interface that ports kai-cd patterns
 * Provides comprehensive service listing, filtering, sorting, and management
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
exports.ServiceManagement = void 0;
const react_1 = __importStar(require("react"));
const jotai_1 = require("jotai");
const serviceStore_1 = require("../../modules/state/serviceStore");
const ServiceItem_1 = require("./ServiceItem");
const ServiceForm_1 = require("./ServiceForm");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const ServiceManagement = () => {
    const [services] = (0, jotai_1.useAtom)(serviceStore_1.servicesAtom);
    const [, sortServices] = (0, jotai_1.useAtom)(serviceStore_1.sortServicesAtom);
    const [, initializeDefaultServices] = (0, jotai_1.useAtom)(serviceStore_1.initializeDefaultServicesAtom);
    const [, setHydrated] = (0, jotai_1.useAtom)(serviceStore_1.setHydratedAtom);
    const [isAddingService, setIsAddingService] = (0, react_1.useState)(false);
    const [editingService, setEditingService] = (0, react_1.useState)(null);
    const [expandedServiceId, setExpandedServiceId] = (0, react_1.useState)(null);
    const [showArchived, setShowArchived] = (0, react_1.useState)(false);
    const [sortBy, setSortBy] = (0, react_1.useState)('name');
    // Initialize services on mount
    (0, react_1.useEffect)(() => {
        initializeDefaultServices();
        setHydrated(true);
    }, [initializeDefaultServices, setHydrated]);
    // Apply sorting when sortBy changes
    (0, react_1.useEffect)(() => {
        sortServices(sortBy);
    }, [sortBy, sortServices]);
    const handleAddClick = () => {
        setIsAddingService(true);
        setEditingService(null);
        setExpandedServiceId(null);
    };
    const handleEditClick = (service) => {
        setEditingService(service);
        setExpandedServiceId(null);
        setIsAddingService(false);
    };
    const handleCloseForms = () => {
        setIsAddingService(false);
        setEditingService(null);
    };
    const toggleDetails = (serviceId) => {
        setExpandedServiceId(prevId => (prevId === serviceId ? null : serviceId));
        setEditingService(null);
        setIsAddingService(false);
    };
    const handleSort = (newSortBy) => {
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
    return (react_1.default.createElement("div", { className: "p-4 md:p-6 h-full flex flex-col bg-slate-900" },
        (isAddingService || editingService) && (react_1.default.createElement("div", { className: "mb-4 flex justify-center" },
            react_1.default.createElement(ServiceForm_1.ServiceForm, { service: editingService || undefined, onClose: handleCloseForms }))),
        react_1.default.createElement("div", { className: "flex-grow overflow-y-auto" },
            react_1.default.createElement("div", { className: "space-y-4" },
                react_1.default.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4" },
                    react_1.default.createElement("div", { className: "flex items-center space-x-4" },
                        react_1.default.createElement("h2", { className: "text-2xl font-bold text-slate-100" },
                            showArchived ? 'Archived Services' : 'Active Services',
                            react_1.default.createElement("span", { className: "ml-2 text-sm text-slate-400" },
                                "(",
                                displayServices.length,
                                ")")),
                        react_1.default.createElement(ui_1.Button, { onClick: () => setShowArchived(!showArchived), variant: "secondary", size: "sm", className: "text-sm" }, showArchived ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(lucide_react_1.Eye, { className: "h-4 w-4 mr-1" }),
                            "Show Active (",
                            activeServices.length,
                            ")")) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(lucide_react_1.EyeOff, { className: "h-4 w-4 mr-1" }),
                            "Show Archived (",
                            archivedServices.length,
                            ")")))),
                    react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                        react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                            react_1.default.createElement("select", { value: sortBy, onChange: (e) => handleSort(e.target.value), className: "bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200" },
                                react_1.default.createElement("option", { value: "name" }, "Sort by Name"),
                                react_1.default.createElement("option", { value: "status" }, "Sort by Status"),
                                react_1.default.createElement("option", { value: "type" }, "Sort by Type"),
                                react_1.default.createElement("option", { value: "lastChecked" }, "Sort by Last Checked"))),
                        !showArchived && (react_1.default.createElement(ui_1.Button, { onClick: handleAddClick, variant: "primary", size: "sm", title: "Add a new service" },
                            react_1.default.createElement(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }),
                            "Add New Service")))),
                displayServices.length === 0 ? (react_1.default.createElement("div", { className: "text-center py-12 text-slate-400" },
                    react_1.default.createElement(lucide_react_1.Cloud, { className: "h-16 w-16 mx-auto mb-4 text-slate-600" }),
                    react_1.default.createElement("p", { className: "text-lg mb-2" }, showArchived ? 'No archived services' : 'No active services'),
                    react_1.default.createElement("p", { className: "text-sm" }, showArchived
                        ? 'Services you archive will appear here'
                        : 'Add your first AI service to get started'))) : (react_1.default.createElement("div", { className: "space-y-3" }, displayServices.map((service) => (react_1.default.createElement(ServiceItem_1.ServiceItem, { key: service.id, service: service, onEdit: handleEditClick, isExpanded: expandedServiceId === service.id, onToggleDetails: toggleDetails })))))))));
};
exports.ServiceManagement = ServiceManagement;
