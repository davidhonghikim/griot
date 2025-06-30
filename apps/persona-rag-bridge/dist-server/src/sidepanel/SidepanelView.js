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
exports.SidepanelView = void 0;
const react_1 = __importStar(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const SidepanelView = () => {
    const [currentView, setCurrentView] = (0, react_1.useState)('chat');
    return (react_1.default.createElement("div", { className: "h-full bg-background-primary text-text-primary flex flex-col" },
        react_1.default.createElement("header", { className: "bg-background-secondary p-3 border-b border-border-primary" },
            react_1.default.createElement("h2", { className: "text-lg font-semibold" }, "OWU+ Panel")),
        react_1.default.createElement("nav", { className: "bg-background-secondary p-2 border-b border-border-primary" },
            react_1.default.createElement("div", { className: "flex space-x-2" },
                react_1.default.createElement("button", { onClick: () => setCurrentView('chat'), className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${currentView === 'chat'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-tertiary text-text-primary hover:bg-border-primary'}` },
                    react_1.default.createElement(outline_1.ChatBubbleLeftRightIcon, { className: "h-4 w-4" }),
                    "Chat"),
                react_1.default.createElement("button", { onClick: () => setCurrentView('artefacts'), className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${currentView === 'artefacts'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-tertiary text-text-primary hover:bg-border-primary'}` },
                    react_1.default.createElement(outline_1.ArchiveBoxIcon, { className: "h-4 w-4" }),
                    "Artefacts"),
                react_1.default.createElement("button", { onClick: () => setCurrentView('agents'), className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${currentView === 'agents'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-tertiary text-text-primary hover:bg-border-primary'}` },
                    react_1.default.createElement(outline_1.UserGroupIcon, { className: "h-4 w-4" }),
                    "Agents"))),
        react_1.default.createElement("main", { className: "flex-1 overflow-y-auto p-4" },
            currentView === 'chat' && (react_1.default.createElement("div", { className: "space-y-4" },
                react_1.default.createElement("h3", { className: "text-lg font-medium" }, "Quick Chat"),
                react_1.default.createElement("div", { className: "bg-background-secondary rounded-lg p-4" },
                    react_1.default.createElement("p", { className: "text-text-secondary" }, "Chat interface will be implemented here.")))),
            currentView === 'artefacts' && (react_1.default.createElement("div", { className: "space-y-4" },
                react_1.default.createElement("h3", { className: "text-lg font-medium" }, "Artefacts"),
                react_1.default.createElement("div", { className: "bg-background-secondary rounded-lg p-4" },
                    react_1.default.createElement("p", { className: "text-text-secondary" }, "Artefacts interface will be implemented here.")))),
            currentView === 'agents' && (react_1.default.createElement("div", { className: "space-y-4" },
                react_1.default.createElement("h3", { className: "text-lg font-medium" }, "Agents"),
                react_1.default.createElement("div", { className: "bg-background-secondary rounded-lg p-4" },
                    react_1.default.createElement("p", { className: "text-text-secondary" }, "Agents interface will be implemented here.")))))));
};
exports.SidepanelView = SidepanelView;
