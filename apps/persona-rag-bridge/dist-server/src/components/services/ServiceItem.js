"use strict";
/**
 * ServiceItem Component
 *
 * Ports kai-cd service item patterns with expandable details and management actions
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
exports.ServiceItem = void 0;
const react_1 = __importStar(require("react"));
const jotai_1 = require("jotai");
const serviceStore_1 = require("../../modules/state/serviceStore");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const ServiceItem = ({ service, onEdit, isExpanded, onToggleDetails }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = (0, react_1.useState)(false);
    const [, checkServiceStatus] = (0, jotai_1.useAtom)(serviceStore_1.checkServiceStatusAtom);
    const [, toggleServiceArchive] = (0, jotai_1.useAtom)(serviceStore_1.toggleServiceArchiveAtom);
    const [, removeService] = (0, jotai_1.useAtom)(serviceStore_1.removeServiceAtom);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'online':
                return react_1.default.createElement(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-400 drop-shadow-lg" });
            case 'offline':
                return react_1.default.createElement(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-500 drop-shadow-lg" });
            case 'error':
                return react_1.default.createElement(lucide_react_1.AlertCircle, { className: "h-5 w-5 text-red-600 drop-shadow-lg" });
            case 'checking':
                return react_1.default.createElement(lucide_react_1.Clock, { className: "h-5 w-5 text-yellow-400 animate-spin drop-shadow-lg" });
            default:
                return react_1.default.createElement(lucide_react_1.WifiOff, { className: "h-5 w-5 text-slate-500" });
        }
    };
    const handleCheckStatus = async () => {
        await checkServiceStatus(service);
    };
    const handleToggleArchive = () => {
        toggleServiceArchive(service.id);
    };
    const handleDelete = () => {
        removeService(service.id);
        setShowDeleteConfirm(false);
    };
    const handleOpenInTab = () => {
        // TODO: Implement logic to open service in a new browser tab
        window.open(service.url, '_blank');
    };
    const handleOpenInPanel = () => {
        // TODO: Implement logic to open service in the extension's side panel
        // This may require messaging the background script
        if (window.chrome?.runtime?.sendMessage) {
            window.chrome.runtime.sendMessage({
                action: 'openInPanel',
                url: service.url,
                serviceId: service.id,
            });
        }
    };
    return (react_1.default.createElement("div", { className: "bg-slate-800 rounded-lg shadow-md transition-all hover:shadow-lg" },
        react_1.default.createElement("div", { className: "flex items-center p-4" },
            react_1.default.createElement("div", { className: "flex-grow" },
                react_1.default.createElement("div", { className: "flex items-center space-x-3" },
                    getStatusIcon(service.status),
                    react_1.default.createElement("p", { className: "font-bold text-lg text-slate-100" }, service.name),
                    service.archived && (react_1.default.createElement("span", { className: "px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded" }, "Archived"))),
                react_1.default.createElement("p", { className: "text-sm text-slate-400" }, service.url),
                react_1.default.createElement("p", { className: "text-xs text-slate-500 capitalize" },
                    service.type.replace(/_/g, ' '),
                    " \u2022 ",
                    service.category)),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: handleCheckStatus, disabled: service.status === 'checking', className: "text-slate-400 hover:text-slate-200", title: "Check Service Status" },
                    react_1.default.createElement(lucide_react_1.RefreshCw, { className: "h-4 w-4" })),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: () => onEdit(service), className: "text-slate-400 hover:text-slate-200", title: "Edit Service" },
                    react_1.default.createElement(lucide_react_1.Edit, { className: "h-4 w-4" })),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: handleOpenInTab, className: "text-slate-400 hover:text-slate-200", title: "Open in Tab" },
                    react_1.default.createElement("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" },
                        react_1.default.createElement("path", { d: "M14 3h7v7m0-7L10 14" }))),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: handleOpenInPanel, className: "text-slate-400 hover:text-slate-200", title: "Open in Panel" },
                    react_1.default.createElement("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" },
                        react_1.default.createElement("path", { d: "M3 9V5a2 2 0 012-2h4m0 0v4m0-4L4 14" }))),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: () => onToggleDetails(service.id), className: `text-slate-400 hover:text-slate-200 transition-transform ${isExpanded ? 'rotate-180' : ''}`, title: isExpanded ? 'Hide Details' : 'Show Details' }, isExpanded ? react_1.default.createElement(lucide_react_1.ChevronUp, { className: "h-4 w-4" }) : react_1.default.createElement(lucide_react_1.ChevronDown, { className: "h-4 w-4" })),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: handleToggleArchive, className: "text-slate-400 hover:text-slate-200", title: service.archived ? 'Restore Service' : 'Archive Service' }, service.archived ? react_1.default.createElement(lucide_react_1.Eye, { className: "h-4 w-4" }) : react_1.default.createElement(lucide_react_1.Archive, { className: "h-4 w-4" })))),
        isExpanded && (react_1.default.createElement("div", { className: "border-t border-slate-700 p-4" },
            react_1.default.createElement("div", { className: "mb-4" },
                react_1.default.createElement("h4", { className: "text-lg font-semibold text-slate-200 mb-2" }, "Service Details"),
                react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Category:"),
                        " ",
                        service.category),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Enabled:"),
                        " ",
                        service.enabled ? 'Yes' : 'No'),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Type:"),
                        react_1.default.createElement("span", { className: "capitalize" },
                            " ",
                            service.type.replace(/_/g, ' '))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-semibold text-slate-400" }, "Last Checked:"),
                        service.lastChecked ? new Date(service.lastChecked).toLocaleString() : 'Never'))),
            react_1.default.createElement("div", { className: "border-t border-slate-600 pt-4" },
                react_1.default.createElement("h5", { className: "text-sm font-semibold text-red-400 mb-2" }, "Danger Zone"),
                !showDeleteConfirm ? (react_1.default.createElement(ui_1.Button, { onClick: () => setShowDeleteConfirm(true), variant: "destructive", size: "sm", className: "text-sm" },
                    react_1.default.createElement(lucide_react_1.Trash2, { className: "h-3 w-3 mr-1" }),
                    "Delete Service")) : (react_1.default.createElement("div", { className: "space-y-2" },
                    react_1.default.createElement("p", { className: "text-sm text-slate-300" }, "Are you sure? This action cannot be undone."),
                    react_1.default.createElement("div", { className: "flex space-x-2" },
                        react_1.default.createElement(ui_1.Button, { onClick: handleDelete, variant: "destructive", size: "sm", className: "text-sm" }, "Yes, Delete"),
                        react_1.default.createElement(ui_1.Button, { onClick: () => setShowDeleteConfirm(false), variant: "secondary", size: "sm", className: "text-sm" }, "Cancel")))))))));
};
exports.ServiceItem = ServiceItem;
