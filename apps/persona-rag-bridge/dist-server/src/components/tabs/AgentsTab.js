"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsTab = void 0;
const react_1 = __importDefault(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../../modules/state/atoms");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const AgentsTab = () => {
    const [agentsState] = (0, jotai_1.useAtom)(atoms_1.agentsStateAtom);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return react_1.default.createElement(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'inactive':
                return react_1.default.createElement(lucide_react_1.XCircle, { className: "w-4 h-4 text-gray-500" });
            case 'running':
                return react_1.default.createElement(lucide_react_1.Clock, { className: "w-4 h-4 text-blue-500" });
            default:
                return react_1.default.createElement(lucide_react_1.XCircle, { className: "w-4 h-4 text-red-500" });
        }
    };
    return (react_1.default.createElement("div", { className: "flex flex-col h-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(lucide_react_1.Bot, { className: "w-4 h-4" }),
                react_1.default.createElement("span", { className: "font-medium" }, "Agents")),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                    react_1.default.createElement(lucide_react_1.Plus, { className: "w-4 h-4" })))),
        react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4" }, agentsState.agents.length === 0 ? (react_1.default.createElement("div", { className: "text-center text-muted-foreground py-8" },
            react_1.default.createElement(lucide_react_1.Bot, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
            react_1.default.createElement("p", null, "No agents configured"),
            react_1.default.createElement("p", { className: "text-xs" }, "Create AI agents for automation"))) : (react_1.default.createElement("div", { className: "space-y-3" }, agentsState.agents.map((agent) => (react_1.default.createElement("div", { key: agent.id, className: "border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors" },
            react_1.default.createElement("div", { className: "flex items-center justify-between mb-2" },
                react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.Bot, { className: "w-4 h-4 text-primary" }),
                    react_1.default.createElement("span", { className: "font-medium text-sm" }, agent.name),
                    getStatusIcon(agent.status)),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Play, { className: "w-3 h-3" })),
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Settings, { className: "w-3 h-3" })))),
            react_1.default.createElement("p", { className: "text-xs text-muted-foreground mb-2" }, agent.description),
            react_1.default.createElement("div", { className: "flex flex-wrap gap-1 mb-2" },
                agent.capabilities.slice(0, 3).map((capability) => (react_1.default.createElement("span", { key: capability, className: "px-2 py-1 bg-primary/10 text-primary text-xs rounded" }, capability))),
                agent.capabilities.length > 3 && (react_1.default.createElement("span", { className: "px-2 py-1 bg-muted text-muted-foreground text-xs rounded" },
                    "+",
                    agent.capabilities.length - 3))),
            react_1.default.createElement("div", { className: "flex items-center justify-between text-xs text-muted-foreground" },
                react_1.default.createElement("span", null, agent.status),
                react_1.default.createElement("span", null, agent.createdAt.toLocaleDateString())))))))),
        react_1.default.createElement("div", { className: "p-4 border-t border-border" },
            react_1.default.createElement("div", { className: "grid grid-cols-2 gap-2" },
                react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "text-xs" },
                    react_1.default.createElement(lucide_react_1.Plus, { className: "w-3 h-3 mr-1" }),
                    "New Agent"),
                react_1.default.createElement(ui_1.Button, { variant: "outline", size: "sm", className: "text-xs" },
                    react_1.default.createElement(lucide_react_1.Zap, { className: "w-3 h-3 mr-1" }),
                    "Templates")))));
};
exports.AgentsTab = AgentsTab;
