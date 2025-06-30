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
exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = require("clsx");
const TabsContext = (0, react_1.createContext)(undefined);
const Tabs = ({ children, defaultValue, className }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)(defaultValue);
    return (react_1.default.createElement(TabsContext.Provider, { value: { activeTab, setActiveTab } },
        react_1.default.createElement("div", { className: (0, clsx_1.clsx)('w-full', className) }, children)));
};
exports.Tabs = Tabs;
const TabsList = ({ children, className }) => {
    return (react_1.default.createElement("div", { className: (0, clsx_1.clsx)('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className) }, children));
};
exports.TabsList = TabsList;
const TabsTrigger = ({ value, children, className, disabled = false }) => {
    const context = (0, react_1.useContext)(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within a Tabs component');
    }
    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;
    return (react_1.default.createElement("button", { className: (0, clsx_1.clsx)('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', isActive
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:bg-background/50 hover:text-foreground', className), onClick: () => setActiveTab(value), disabled: disabled }, children));
};
exports.TabsTrigger = TabsTrigger;
const TabsContent = ({ value, children, className }) => {
    const context = (0, react_1.useContext)(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within a Tabs component');
    }
    const { activeTab } = context;
    const isActive = activeTab === value;
    if (!isActive) {
        return null;
    }
    return (react_1.default.createElement("div", { className: (0, clsx_1.clsx)('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className) }, children));
};
exports.TabsContent = TabsContent;
