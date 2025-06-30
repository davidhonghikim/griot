"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const jotai_1 = require("jotai");
const SidepanelView_1 = __importDefault(require("./components/SidepanelView"));
require("./styles/global.css");
// Initialize extension when sidepanel opens
const initializeSidepanel = async () => {
    try {
        console.log('Initializing OWU+ Sidepanel...');
        // TODO: Initialize services
        console.log('OWU+ Sidepanel initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize sidepanel:', error);
    }
};
// Initialize when sidepanel loads
initializeSidepanel();
// Render sidepanel
const container = document.getElementById('root');
if (container) {
    const root = (0, client_1.createRoot)(container);
    root.render(react_1.default.createElement(react_1.default.StrictMode, null,
        react_1.default.createElement(jotai_1.Provider, null,
            react_1.default.createElement(SidepanelView_1.default, null))));
}
