"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = require("clsx");
exports.Input = react_1.default.forwardRef(({ className, label, error, icon, iconPosition = 'left', ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const classes = (0, clsx_1.clsx)(baseClasses, icon && iconPosition === 'left' && 'pl-10', icon && iconPosition === 'right' && 'pr-10', error && 'border-destructive', className);
    return (react_1.default.createElement("div", { className: "w-full" },
        label && (react_1.default.createElement("label", { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block" }, label)),
        react_1.default.createElement("div", { className: "relative" },
            icon && iconPosition === 'left' && (react_1.default.createElement("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" }, icon)),
            react_1.default.createElement("input", { className: classes, ref: ref, ...props }),
            icon && iconPosition === 'right' && (react_1.default.createElement("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" }, icon))),
        error && (react_1.default.createElement("p", { className: "text-sm text-destructive mt-1" }, error))));
});
exports.Input.displayName = 'Input';
