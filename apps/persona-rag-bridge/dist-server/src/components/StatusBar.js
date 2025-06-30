"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
const react_1 = __importDefault(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../modules/state/atoms");
const ui_1 = require("./ui");
const StatusBar = () => {
    const [reticulumState] = (0, jotai_1.useAtom)(atoms_1.reticulumStateAtom);
    const [klfState] = (0, jotai_1.useAtom)(atoms_1.klfStateAtom);
    const [servicesState] = (0, jotai_1.useAtom)(atoms_1.servicesStateAtom);
    const [activeServices] = (0, jotai_1.useAtom)(atoms_1.activeServicesAtom);
    const getStatusColor = (status) => {
        switch (status) {
            case 'connected':
            case 'online':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500';
            case 'disconnected':
            case 'offline':
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    return (react_1.default.createElement("div", { className: "border-t border-border p-2 bg-muted/50" },
        react_1.default.createElement("div", { className: "flex items-center justify-between text-xs" },
            react_1.default.createElement("div", { className: "flex items-center space-x-4" },
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement("div", { className: `w-2 h-2 rounded-full ${getStatusColor(reticulumState.status)}` }),
                    react_1.default.createElement("span", { className: "text-muted-foreground" }, "Reticulum"),
                    react_1.default.createElement("span", { className: "text-foreground font-medium" }, reticulumState.discoveredNodes.length)),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement("div", { className: `w-2 h-2 rounded-full ${getStatusColor(klfState.status)}` }),
                    react_1.default.createElement("span", { className: "text-muted-foreground" }, "KLF"),
                    react_1.default.createElement("span", { className: "text-foreground font-medium" }, klfState.discoveredServices.length)),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement("div", { className: `w-2 h-2 rounded-full ${getStatusColor(servicesState.status)}` }),
                    react_1.default.createElement("span", { className: "text-muted-foreground" }, "Services"),
                    react_1.default.createElement("span", { className: "text-foreground font-medium" }, activeServices))),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", className: "h-6 px-2 text-xs", onClick: () => {
                        // Open panel
                        chrome.runtime.sendMessage({ action: 'openPanel' });
                    } }, "Panel"),
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", className: "h-6 px-2 text-xs", onClick: () => {
                        // Open vault
                        chrome.runtime.sendMessage({ action: 'openVault' });
                    } }, "Vault")))));
};
exports.StatusBar = StatusBar;
