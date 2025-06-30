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
exports.SettingsTab = void 0;
/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
const react_1 = __importStar(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../../modules/state/atoms");
const themeAtoms_1 = require("../../modules/state/themeAtoms");
const ConfigManager_1 = require("../../modules/config/ConfigManager");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const SettingsTab = () => {
    const [extensionState] = (0, jotai_1.useAtom)(atoms_1.extensionStateAtom);
    const [vaultState] = (0, jotai_1.useAtom)(atoms_1.vaultStateAtom);
    const [notificationsState] = (0, jotai_1.useAtom)(atoms_1.notificationsStateAtom);
    const [currentTheme, setTheme] = (0, jotai_1.useAtom)(themeAtoms_1.themeManagerAtom);
    // Connection configuration state
    const [connectionConfig, setConnectionConfig] = (0, react_1.useState)(ConfigManager_1.configManager.getConnectionConfig());
    const [configSource, setConfigSource] = (0, react_1.useState)('default');
    // Load configuration on mount
    (0, react_1.useEffect)(() => {
        const unsubscribe = ConfigManager_1.configManager.subscribe('connection.openwebuiUrl', () => {
            setConnectionConfig(ConfigManager_1.configManager.getConnectionConfig());
        });
        // Check configuration source
        const source = ConfigManager_1.configManager.getConfigSource('connection.openwebuiUrl');
        setConfigSource(source?.source || 'default');
        return unsubscribe;
    }, []);
    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        setTheme(newTheme);
    };
    const handleConnectionChange = (key, value) => {
        ConfigManager_1.configManager.set(`connection.${key}`, value);
        setConnectionConfig(ConfigManager_1.configManager.getConnectionConfig());
    };
    const handleLoadNetworkConfig = async () => {
        try {
            await ConfigManager_1.configManager.loadFromNetworkRAG();
            setConnectionConfig(ConfigManager_1.configManager.getConnectionConfig());
            const source = ConfigManager_1.configManager.getConfigSource('connection.openwebuiUrl');
            setConfigSource(source?.source || 'default');
        }
        catch (error) {
            console.error('Failed to load network configuration:', error);
        }
    };
    return (react_1.default.createElement("div", { className: "flex flex-col h-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(lucide_react_1.Settings, { className: "w-4 h-4" }),
                react_1.default.createElement("span", { className: "font-medium" }, "Settings"))),
        react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-6" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "text-sm font-medium mb-3 flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.Palette, { className: "w-4 h-4" }),
                    react_1.default.createElement("span", null, "Appearance")),
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-xs text-muted-foreground mb-1 block" }, "Theme"),
                        react_1.default.createElement("select", { className: "w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground", value: currentTheme, onChange: handleThemeChange },
                            react_1.default.createElement("option", { value: "light" }, "Light"),
                            react_1.default.createElement("option", { value: "dark" }, "Dark"),
                            react_1.default.createElement("option", { value: "system" }, "System"))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-xs text-muted-foreground mb-1 block" }, "Language"),
                        react_1.default.createElement("select", { className: "w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground", value: extensionState.language },
                            react_1.default.createElement("option", { value: "en" }, "English"),
                            react_1.default.createElement("option", { value: "es" }, "Espa\u00F1ol"),
                            react_1.default.createElement("option", { value: "fr" }, "Fran\u00E7ais"),
                            react_1.default.createElement("option", { value: "de" }, "Deutsch"))))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "text-sm font-medium mb-3 flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.Shield, { className: "w-4 h-4" }),
                    react_1.default.createElement("span", null, "Security")),
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement("div", { className: "flex items-center justify-between p-3 border border-border rounded" },
                        react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                            vaultState.isUnlocked ? (react_1.default.createElement(lucide_react_1.Unlock, { className: "w-4 h-4 text-green-500" })) : (react_1.default.createElement(lucide_react_1.Lock, { className: "w-4 h-4 text-red-500" })),
                            react_1.default.createElement("span", { className: "text-sm" }, "Vault")),
                        react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm" }, vaultState.isUnlocked ? 'Lock' : 'Unlock')),
                    react_1.default.createElement("div", { className: "flex items-center justify-between p-3 border border-border rounded" },
                        react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                            react_1.default.createElement(lucide_react_1.Globe, { className: "w-4 h-4" }),
                            react_1.default.createElement("span", { className: "text-sm" }, "Network Security")),
                        react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm" }, "Configure")))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "text-sm font-medium mb-3 flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.Bell, { className: "w-4 h-4" }),
                    react_1.default.createElement("span", null, "Notifications")),
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("span", { className: "text-sm" }, "Enable Notifications"),
                        react_1.default.createElement("input", { type: "checkbox", checked: notificationsState.enabled, className: "rounded" })),
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("span", { className: "text-sm" }, "Sound"),
                        react_1.default.createElement("input", { type: "checkbox", checked: notificationsState.settings.sound, className: "rounded" })),
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("span", { className: "text-sm" }, "Desktop Notifications"),
                        react_1.default.createElement("input", { type: "checkbox", checked: notificationsState.settings.desktop, className: "rounded" })))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "text-sm font-medium mb-3 flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.Globe, { className: "w-4 h-4" }),
                    react_1.default.createElement("span", null, "Connection")),
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement("div", { className: "text-xs text-muted-foreground mb-2" },
                        "Config Source: ",
                        react_1.default.createElement("span", { className: "font-medium" }, configSource)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-xs text-muted-foreground mb-1 block" }, "OpenWebUI Server"),
                        react_1.default.createElement("input", { type: "text", className: "w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground", value: connectionConfig.openwebuiUrl, onChange: (e) => handleConnectionChange('openwebuiUrl', e.target.value), placeholder: "http://192.168.1.180:3000" })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-xs text-muted-foreground mb-1 block" }, "RAG Service"),
                        react_1.default.createElement("input", { type: "text", className: "w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground", value: connectionConfig.ragServiceUrl, onChange: (e) => handleConnectionChange('ragServiceUrl', e.target.value), placeholder: "http://localhost:3001" })),
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("span", { className: "text-sm" }, "Use Local RAG"),
                        react_1.default.createElement("input", { type: "checkbox", checked: connectionConfig.useLocalRAG, onChange: (e) => handleConnectionChange('useLocalRAG', e.target.checked), className: "rounded" })),
                    react_1.default.createElement("div", { className: "flex space-x-2" },
                        react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", onClick: handleLoadNetworkConfig, className: "flex-1" }, "Load from Network"),
                        react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "flex-1" }, "Test Connection")))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "text-sm font-medium mb-3" }, "Advanced"),
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start" }, "Export Settings"),
                    react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start" }, "Import Settings"),
                    react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "w-full justify-start" }, "Reset to Defaults"))))));
};
exports.SettingsTab = SettingsTab;
