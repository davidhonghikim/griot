"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const jotai_1 = require("jotai");
const SidepanelView_1 = require("./SidepanelView");
require("../styles/global.css");
// Render sidepanel app
const container = document.getElementById('root');
if (container) {
    const root = (0, client_1.createRoot)(container);
    root.render(react_1.default.createElement(react_1.default.StrictMode, null,
        react_1.default.createElement(jotai_1.Provider, null,
            react_1.default.createElement(SidepanelView_1.SidepanelView, null))));
}
