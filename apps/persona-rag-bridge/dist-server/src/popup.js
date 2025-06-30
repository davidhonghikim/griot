"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const jotai_1 = require("jotai");
const PopupDashboard_1 = require("./components/PopupDashboard");
require("./styles/global.css");
// Initialize extension when popup opens
const initializeExtension = async () => {
    try {
        console.log('Initializing OWU+ Extension...');
        // TODO: Initialize services
        console.log('OWU+ Extension initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize extension:', error);
    }
};
// Initialize when popup loads
initializeExtension();
// Render popup
const container = document.getElementById('root');
if (container) {
    const root = (0, client_1.createRoot)(container);
    root.render(react_1.default.createElement(react_1.default.StrictMode, null,
        react_1.default.createElement(jotai_1.Provider, null,
            react_1.default.createElement(PopupDashboard_1.PopupDashboard, null))));
}
