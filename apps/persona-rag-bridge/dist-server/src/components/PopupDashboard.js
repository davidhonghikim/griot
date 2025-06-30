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
exports.PopupDashboard = void 0;
const react_1 = __importStar(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../modules/state/atoms");
const ServicesTab_1 = require("./tabs/ServicesTab");
const ui_1 = require("./ui");
const lucide_react_1 = require("lucide-react");
const service_initializer_browser_1 = require("../services/service-initializer-browser");
const PopupDashboard = () => {
    const [servicesState, setServicesState] = (0, jotai_1.useAtom)(atoms_1.servicesStateAtom);
    const [activeServices] = (0, jotai_1.useAtom)(atoms_1.activeServicesAtom);
    const [, switchToTab] = (0, jotai_1.useAtom)(atoms_1.switchToTabAtom);
    // Initialize services on mount
    (0, react_1.useEffect)(() => {
        const serviceInitializer = new service_initializer_browser_1.ServiceInitializer();
        const initializeServices = async () => {
            await serviceInitializer.initializeServices((services) => {
                setServicesState({
                    ...servicesState,
                    services,
                    status: 'ready',
                    lastScan: new Date(),
                });
            });
        };
        initializeServices();
        // Cleanup on unmount
        return () => {
            serviceInitializer.cleanup();
        };
    }, []);
    const handleOpenInTab = () => {
        switchToTab({ serviceId: undefined, view: 'services' });
        window.close();
    };
    const handleOpenInPanel = () => {
        // For panel, we need a serviceId, so we'll use a default one or skip this for now
        // switchToPanel({ serviceId: 'default', view: 'services' });
        // For now, just open in tab since panel requires a specific service
        switchToTab({ serviceId: undefined, view: 'services' });
        window.close();
    };
    return (react_1.default.createElement("div", { className: "w-[640px] h-[600px] bg-background-primary text-text-primary flex flex-col" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border-primary bg-background-secondary" },
            react_1.default.createElement("div", { className: "flex items-center space-x-3" },
                react_1.default.createElement("div", { className: "w-8 h-8 bg-interactive-primary/20 rounded-lg flex items-center justify-center" },
                    react_1.default.createElement(lucide_react_1.Settings, { className: "w-4 h-4 text-interactive-primary" })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h1", { className: "text-lg font-semibold text-text-primary" }, "OWU+ Services"),
                    react_1.default.createElement("p", { className: "text-xs text-text-secondary" },
                        activeServices,
                        " active \u2022 ",
                        servicesState.status))),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", className: "text-text-secondary hover:text-text-primary", onClick: handleOpenInTab },
                    react_1.default.createElement(lucide_react_1.ExternalLink, { className: "w-4 h-4 mr-1" }),
                    "Tab"),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", className: "text-text-secondary hover:text-text-primary", onClick: handleOpenInPanel },
                    react_1.default.createElement(lucide_react_1.PanelLeftClose, { className: "w-4 h-4 mr-1" }),
                    "Panel"),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", className: "text-text-secondary hover:text-text-primary" },
                    react_1.default.createElement(lucide_react_1.HelpCircle, { className: "w-4 h-4" })))),
        react_1.default.createElement("div", { className: "flex-1 overflow-hidden" },
            react_1.default.createElement(ServicesTab_1.ServicesTab, null)),
        react_1.default.createElement("div", { className: "border-t border-border-primary p-3 bg-background-secondary" },
            react_1.default.createElement("div", { className: "flex justify-between items-center text-xs text-text-secondary" },
                react_1.default.createElement("div", { className: "flex items-center space-x-4" },
                    react_1.default.createElement("span", null,
                        "Status: ",
                        servicesState.status),
                    react_1.default.createElement("span", null,
                        "Services: ",
                        servicesState.services.length),
                    servicesState.errors.length > 0 && (react_1.default.createElement("span", { className: "text-status-error" },
                        servicesState.errors.length,
                        " errors"))),
                react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                    react_1.default.createElement("span", null, "v1.0.0"),
                    react_1.default.createElement("span", null, "\u2022"),
                    react_1.default.createElement("span", null, "OWU+ Bridge"))))));
};
exports.PopupDashboard = PopupDashboard;
