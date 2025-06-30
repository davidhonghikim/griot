"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtefactsTab = void 0;
const react_1 = __importDefault(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../../modules/state/atoms");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const ArtefactsTab = () => {
    const [artefactsState] = (0, jotai_1.useAtom)(atoms_1.artefactsStateAtom);
    const getTypeIcon = (type) => {
        switch (type) {
            case 'image':
                return react_1.default.createElement(lucide_react_1.Image, { className: "w-4 h-4" });
            case 'video':
                return react_1.default.createElement(lucide_react_1.Video, { className: "w-4 h-4" });
            case 'document':
                return react_1.default.createElement(lucide_react_1.FileText, { className: "w-4 h-4" });
            case 'model':
                return react_1.default.createElement(lucide_react_1.Database, { className: "w-4 h-4" });
            default:
                return react_1.default.createElement(lucide_react_1.FileText, { className: "w-4 h-4" });
        }
    };
    return (react_1.default.createElement("div", { className: "flex flex-col h-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(lucide_react_1.Image, { className: "w-4 h-4" }),
                react_1.default.createElement("span", { className: "font-medium" }, "Artefacts")),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm", onClick: () => {
                        // Toggle view
                    } }, artefactsState.view === 'grid' ? react_1.default.createElement(lucide_react_1.List, { className: "w-4 h-4" }) : react_1.default.createElement(lucide_react_1.Grid, { className: "w-4 h-4" })))),
        react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4" }, artefactsState.artefacts.length === 0 ? (react_1.default.createElement("div", { className: "text-center text-muted-foreground py-8" },
            react_1.default.createElement(lucide_react_1.Image, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
            react_1.default.createElement("p", null, "No artefacts yet"),
            react_1.default.createElement("p", { className: "text-xs" }, "Generated content will appear here"))) : (react_1.default.createElement("div", { className: artefactsState.view === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2' }, artefactsState.artefacts.map((artefact) => (react_1.default.createElement("div", { key: artefact.id, className: "border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2 mb-2" },
                getTypeIcon(artefact.type),
                react_1.default.createElement("span", { className: "font-medium text-sm truncate" }, artefact.name)),
            react_1.default.createElement("div", { className: "text-xs text-muted-foreground mb-2" },
                artefact.type,
                " \u2022 ",
                (artefact.size / 1024).toFixed(1),
                " KB"),
            react_1.default.createElement("div", { className: "flex items-center justify-between" },
                react_1.default.createElement("span", { className: "text-xs text-muted-foreground" }, artefact.createdAt.toLocaleDateString()),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Download, { className: "w-3 h-3" })),
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Share, { className: "w-3 h-3" })),
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Trash2, { className: "w-3 h-3" }))))))))))));
};
exports.ArtefactsTab = ArtefactsTab;
