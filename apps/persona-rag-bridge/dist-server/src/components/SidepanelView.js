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
const react_1 = __importStar(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const SidepanelView = () => {
    const [services] = (0, react_1.useState)([
        {
            id: 'reticulum',
            name: 'Reticulum',
            type: 'core',
            status: 'online',
            enabled: true,
            capabilities: ['llm_chat', 'image_generation']
        },
        {
            id: 'klf',
            name: 'KLF',
            type: 'protocol',
            status: 'online',
            enabled: true,
            capabilities: ['llm_chat']
        },
        {
            id: 'griot',
            name: 'Griot Node',
            type: 'node',
            status: 'offline',
            enabled: true,
            capabilities: ['llm_chat', 'image_generation']
        },
    ]);
    const [selectedServiceId, setSelectedServiceId] = (0, react_1.useState)(null);
    const [activeCapability, setActiveCapability] = (0, react_1.useState)('llm_chat');
    const selectedService = services.find(s => s.id === selectedServiceId);
    const getPrimaryCapability = (service) => {
        if (!service)
            return 'llm_chat';
        if (service.capabilities.includes('llm_chat'))
            return 'llm_chat';
        if (service.capabilities.includes('image_generation'))
            return 'image_generation';
        return 'llm_chat'; // Fallback
    };
    const openInNewTab = async () => {
        if (!selectedService)
            return;
        try {
            chrome.storage.local.set({
                initialView: selectedService.id,
                initialCapability: activeCapability
            }, () => {
                chrome.tabs.create({ url: chrome.runtime.getURL('tab.html') });
                window.close();
            });
        }
        catch (error) {
            console.error('Failed to open in new tab:', error);
        }
    };
    const closePanel = async () => {
        try {
            const currentTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
            if (currentTab?.id) {
                await chrome.sidePanel.setOptions({ tabId: currentTab.id, enabled: false });
                window.close();
            }
        }
        catch (error) {
            console.error('Failed to close side panel:', error);
            window.close();
        }
    };
    // Auto-select first available service
    (0, react_1.useEffect)(() => {
        if (!selectedServiceId && services.length > 0) {
            const firstEnabledService = services.find(s => s.enabled);
            if (firstEnabledService) {
                setSelectedServiceId(firstEnabledService.id);
                setActiveCapability(getPrimaryCapability(firstEnabledService));
            }
        }
    }, [services, selectedServiceId]);
    const renderCapabilityUI = () => {
        if (!selectedService)
            return null;
        switch (activeCapability) {
            case 'llm_chat':
                return (react_1.default.createElement("div", { className: "flex-1 flex flex-col p-4" },
                    react_1.default.createElement("div", { className: "flex-1 bg-background-secondary rounded-lg p-3 mb-3" },
                        react_1.default.createElement("div", { className: "text-sm text-text-secondary mb-2" }, "Chat History"),
                        react_1.default.createElement("div", { className: "text-xs text-text-tertiary" }, "No messages yet")),
                    react_1.default.createElement("div", { className: "flex gap-2" },
                        react_1.default.createElement("input", { type: "text", placeholder: "Type your message...", className: "flex-1 px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-placeholder focus:outline-none focus:border-accent-primary" }),
                        react_1.default.createElement("button", { className: "px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-state text-sm" }, "Send"))));
            case 'image_generation':
                return (react_1.default.createElement("div", { className: "flex-1 flex flex-col p-4" },
                    react_1.default.createElement("div", { className: "flex-1 bg-background-secondary rounded-lg p-3 mb-3" },
                        react_1.default.createElement("div", { className: "text-sm text-text-secondary mb-2" }, "Generated Images"),
                        react_1.default.createElement("div", { className: "text-xs text-text-tertiary" }, "No images generated yet")),
                    react_1.default.createElement("div", { className: "space-y-3" },
                        react_1.default.createElement("input", { type: "text", placeholder: "Describe the image you want...", className: "w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-placeholder focus:outline-none focus:border-accent-primary" }),
                        react_1.default.createElement("button", { className: "w-full px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-state text-sm" }, "Generate Image"))));
            default:
                return (react_1.default.createElement("div", { className: "flex-1 flex items-center justify-center text-text-secondary" },
                    react_1.default.createElement("div", { className: "text-center" },
                        react_1.default.createElement(outline_1.CubeTransparentIcon, { className: "w-8 h-8 mx-auto mb-2" }),
                        react_1.default.createElement("p", { className: "text-sm" }, "Unknown capability"))));
        }
    };
    return (react_1.default.createElement("div", { className: "h-screen w-full flex flex-col bg-background-primary text-text-primary" }, selectedService ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("header", { className: "flex-shrink-0 p-3 border-b border-border-primary flex items-center justify-between" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h1", { className: "text-lg font-semibold" }, selectedService.name),
                react_1.default.createElement("p", { className: "text-xs text-text-secondary capitalize" }, selectedService.type.replace(/_/g, ' '))),
            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                react_1.default.createElement("button", { onClick: openInNewTab, className: "p-1 text-text-secondary hover:text-text-primary", title: "Open in new tab" },
                    react_1.default.createElement(outline_1.ArrowTopRightOnSquareIcon, { className: "h-5 w-5" })),
                react_1.default.createElement("button", { onClick: closePanel, className: "p-1 text-text-secondary hover:text-text-primary", title: "Close Panel" },
                    react_1.default.createElement(outline_1.XMarkIcon, { className: "h-5 w-5" })))),
        react_1.default.createElement("div", { className: "p-2 border-b border-border-primary" },
            react_1.default.createElement("div", { className: "flex gap-1" }, services.map(service => (react_1.default.createElement("button", { key: service.id, onClick: () => {
                    setSelectedServiceId(service.id);
                    setActiveCapability(getPrimaryCapability(service));
                }, className: `px-3 py-1 text-xs rounded-md transition-colors ${selectedServiceId === service.id
                    ? 'bg-accent-primary text-white'
                    : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'}` }, service.name))))),
        selectedService.capabilities.length > 1 && (react_1.default.createElement("div", { className: "p-2 border-b border-border-primary" },
            react_1.default.createElement("div", { className: "flex gap-1" },
                selectedService.capabilities.includes('llm_chat') && (react_1.default.createElement("button", { onClick: () => setActiveCapability('llm_chat'), className: `px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${activeCapability === 'llm_chat'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'}` },
                    react_1.default.createElement(outline_1.ChatBubbleLeftRightIcon, { className: "h-3 w-3" }),
                    "Chat")),
                selectedService.capabilities.includes('image_generation') && (react_1.default.createElement("button", { onClick: () => setActiveCapability('image_generation'), className: `px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${activeCapability === 'image_generation'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'}` },
                    react_1.default.createElement(outline_1.PhotoIcon, { className: "h-3 w-3" }),
                    "Image"))))),
        react_1.default.createElement("main", { className: "flex-1 overflow-y-auto" }, renderCapabilityUI()))) : (react_1.default.createElement("div", { className: "flex flex-col items-center justify-center h-full text-text-secondary" },
        react_1.default.createElement(outline_1.CubeTransparentIcon, { className: "w-16 h-16 mb-4" }),
        react_1.default.createElement("h2", { className: "text-lg font-semibold" }, "No Service Selected"),
        react_1.default.createElement("p", { className: "text-sm" }, "Select a service from the popup to begin.")))));
};
exports.default = SidepanelView;
