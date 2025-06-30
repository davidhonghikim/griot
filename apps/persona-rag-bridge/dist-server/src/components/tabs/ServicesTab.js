"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesTab = void 0;
const react_1 = __importDefault(require("react"));
const ServiceManagement_1 = require("../services/ServiceManagement");
const ServicesTab = () => {
    return react_1.default.createElement(ServiceManagement_1.ServiceManagement, null);
};
exports.ServicesTab = ServicesTab;
