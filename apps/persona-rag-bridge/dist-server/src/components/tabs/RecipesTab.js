"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesTab = void 0;
const react_1 = __importDefault(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../../modules/state/atoms");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const RecipesTab = () => {
    const [recipesState] = (0, jotai_1.useAtom)(atoms_1.recipesStateAtom);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return react_1.default.createElement(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'failed':
                return react_1.default.createElement(lucide_react_1.XCircle, { className: "w-4 h-4 text-red-500" });
            case 'running':
                return react_1.default.createElement(lucide_react_1.Clock, { className: "w-4 h-4 text-blue-500" });
            default:
                return react_1.default.createElement(lucide_react_1.AlertCircle, { className: "w-4 h-4 text-gray-500" });
        }
    };
    return (react_1.default.createElement("div", { className: "flex flex-col h-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(lucide_react_1.BookOpen, { className: "w-4 h-4" }),
                react_1.default.createElement("span", { className: "font-medium" }, "Recipes")),
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                    react_1.default.createElement(lucide_react_1.Plus, { className: "w-4 h-4" })))),
        react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4" }, recipesState.recipes.length === 0 ? (react_1.default.createElement("div", { className: "text-center text-muted-foreground py-8" },
            react_1.default.createElement(lucide_react_1.BookOpen, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
            react_1.default.createElement("p", null, "No recipes yet"),
            react_1.default.createElement("p", { className: "text-xs" }, "Create reusable workflows"))) : (react_1.default.createElement("div", { className: "space-y-3" }, recipesState.recipes.map((recipe) => (react_1.default.createElement("div", { key: recipe.id, className: "border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors" },
            react_1.default.createElement("div", { className: "flex items-center justify-between mb-2" },
                react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                    react_1.default.createElement(lucide_react_1.BookOpen, { className: "w-4 h-4 text-primary" }),
                    react_1.default.createElement("span", { className: "font-medium text-sm" }, recipe.name)),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Play, { className: "w-3 h-3" })),
                    react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                        react_1.default.createElement(lucide_react_1.Settings, { className: "w-3 h-3" })))),
            react_1.default.createElement("p", { className: "text-xs text-muted-foreground mb-2" }, recipe.description),
            react_1.default.createElement("div", { className: "flex items-center justify-between text-xs text-muted-foreground" },
                react_1.default.createElement("span", null,
                    "v",
                    recipe.version),
                react_1.default.createElement("span", null, recipe.author),
                react_1.default.createElement("span", null, recipe.status)))))))),
        recipesState.executions.length > 0 && (react_1.default.createElement("div", { className: "border-t border-border p-4" },
            react_1.default.createElement("h3", { className: "text-sm font-medium mb-2" }, "Recent Executions"),
            react_1.default.createElement("div", { className: "space-y-2" }, recipesState.executions.slice(0, 3).map((execution) => (react_1.default.createElement("div", { key: execution.id, className: "flex items-center justify-between text-xs" },
                react_1.default.createElement("span", { className: "truncate" }, execution.recipeId),
                react_1.default.createElement("div", { className: "flex items-center space-x-1" },
                    getStatusIcon(execution.status),
                    react_1.default.createElement("span", null, execution.status))))))))));
};
exports.RecipesTab = RecipesTab;
