"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabView = void 0;
const react_1 = __importDefault(require("react"));
const ui_1 = require("../components/ui");
const ChatTab_1 = require("../components/tabs/ChatTab");
const ServicesTab_1 = require("../components/tabs/ServicesTab");
const ArtefactsTab_1 = require("../components/tabs/ArtefactsTab");
const RecipesTab_1 = require("../components/tabs/RecipesTab");
const AgentsTab_1 = require("../components/tabs/AgentsTab");
const SettingsTab_1 = require("../components/tabs/SettingsTab");
const TabView = ({ initialView }) => {
    return (react_1.default.createElement("div", { className: "min-h-screen bg-background-primary text-text-primary" },
        react_1.default.createElement("div", { className: "container mx-auto p-6" },
            react_1.default.createElement("header", { className: "mb-6" },
                react_1.default.createElement("h1", { className: "text-2xl font-bold text-text-primary" }, "OWU+ Extension"),
                react_1.default.createElement("p", { className: "text-text-secondary" }, "AI-Powered Knowledge Management")),
            react_1.default.createElement(ui_1.Tabs, { defaultValue: initialView, className: "w-full" },
                react_1.default.createElement(ui_1.TabsList, { className: "grid w-full grid-cols-6 mb-6" },
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "chat" }, "Chat"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "services" }, "Services"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "artefacts" }, "Artefacts"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "recipes" }, "Recipes"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "agents" }, "Agents"),
                    react_1.default.createElement(ui_1.TabsTrigger, { value: "settings" }, "Settings")),
                react_1.default.createElement(ui_1.TabsContent, { value: "chat", className: "space-y-4" },
                    react_1.default.createElement(ChatTab_1.ChatTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "services", className: "space-y-4" },
                    react_1.default.createElement(ServicesTab_1.ServicesTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "artefacts", className: "space-y-4" },
                    react_1.default.createElement(ArtefactsTab_1.ArtefactsTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "recipes", className: "space-y-4" },
                    react_1.default.createElement(RecipesTab_1.RecipesTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "agents", className: "space-y-4" },
                    react_1.default.createElement(AgentsTab_1.AgentsTab, null)),
                react_1.default.createElement(ui_1.TabsContent, { value: "settings", className: "space-y-4" },
                    react_1.default.createElement(SettingsTab_1.SettingsTab, null))))));
};
exports.TabView = TabView;
