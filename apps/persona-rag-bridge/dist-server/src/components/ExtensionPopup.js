"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionPopup = void 0;
/// <reference path="../types/chrome.d.ts" />
const react_1 = __importDefault(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../modules/state/atoms");
const ui_1 = require("./ui");
const ChatTab_1 = require("./tabs/ChatTab");
const ServicesTab_1 = require("./tabs/ServicesTab");
const ArtefactsTab_1 = require("./tabs/ArtefactsTab");
const RecipesTab_1 = require("./tabs/RecipesTab");
const AgentsTab_1 = require("./tabs/AgentsTab");
const SettingsTab_1 = require("./tabs/SettingsTab");
const StatusBar_1 = require("./StatusBar");
const ExtensionPopup = () => {
    const [extensionState] = (0, jotai_1.useAtom)(atoms_1.extensionStateAtom);
    const [status] = (0, jotai_1.useAtom)(atoms_1.extensionStatusAtom);
    return (react_1.default.createElement("div", { className: "w-96 h-96 bg-background text-foreground flex flex-col" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
                react_1.default.createElement("span", { className: "font-medium" }, "OWU+ Extension")),
            react_1.default.createElement("div", { className: "text-xs text-muted-foreground" }, status.reticulumConnected ? 'Connected' : 'Disconnected')),
        react_1.default.createElement(ui_1.Tabs, { defaultValue: extensionState.currentTab, className: "flex-1 flex flex-col" },
            react_1.default.createElement("div", { className: "px-4 pt-4" },
                react_1.default.createElement(ui_1.TabsList, { className: "w-full" },
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "chat", className: "flex-1" }, "Chat"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "services", className: "flex-1" }, "Services"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "artefacts", className: "flex-1" }, "Artefacts"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "recipes", className: "flex-1" }, "Recipes"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "agents", className: "flex-1" }, "Agents"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "settings", className: "flex-1" }, "Settings"))),
            react_1.default.createElement("div", { className: "flex-1 overflow-hidden" },
                react_1.default.createElement(ui_1.TabsContent, { value: "chat", className: "h-full" },
                    react_1.default.createElement(ChatTab_1.ChatTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "services", className: "h-full" },
                    react_1.default.createElement(ServicesTab_1.ServicesTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "artefacts", className: "h-full" },
                    react_1.default.createElement(ArtefactsTab_1.ArtefactsTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "recipes", className: "h-full" },
                    react_1.default.createElement(RecipesTab_1.RecipesTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "agents", className: "h-full" },
                    react_1.default.createElement(AgentsTab_1.AgentsTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "settings", className: "h-full" },
                    react_1.default.createElement(SettingsTab_1.SettingsTab, null)))),
        react_1.default.createElement(StatusBar_1.StatusBar, null)));
};
exports.ExtensionPopup = ExtensionPopup;
