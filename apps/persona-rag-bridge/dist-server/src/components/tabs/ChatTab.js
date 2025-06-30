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
exports.ChatTab = void 0;
/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
const react_1 = __importStar(require("react"));
const jotai_1 = require("jotai");
const atoms_1 = require("../../modules/state/atoms");
const ui_1 = require("../ui");
const lucide_react_1 = require("lucide-react");
const ChatTab = () => {
    const [chatState] = (0, jotai_1.useAtom)(atoms_1.chatStateAtom);
    const [recentMessages] = (0, jotai_1.useAtom)(atoms_1.recentMessagesAtom);
    const [, addMessage] = (0, jotai_1.useAtom)(atoms_1.addMessageAtom);
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping)
            return;
        const userMessage = {
            id: crypto.randomUUID(),
            conversationId: chatState.currentConversation.id,
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
            modelId: chatState.currentConversation.modelId,
            personaId: chatState.currentConversation.personaId,
            metadata: {},
        };
        addMessage(userMessage);
        setInputValue('');
        setIsTyping(true);
        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: crypto.randomUUID(),
                conversationId: chatState.currentConversation.id,
                role: 'assistant',
                content: `This is a simulated response to: "${inputValue}"`,
                timestamp: new Date(),
                modelId: chatState.currentConversation.modelId,
                personaId: chatState.currentConversation.personaId,
                metadata: {},
            };
            addMessage(aiMessage);
            setIsTyping(false);
        }, 1000);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (react_1.default.createElement("div", { className: "flex flex-col h-full" },
        react_1.default.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement(lucide_react_1.MessageSquare, { className: "w-4 h-4" }),
                react_1.default.createElement("span", { className: "font-medium" }, "Chat")),
            react_1.default.createElement(ui_1.Button, { variant: "ghost", size: "sm" },
                react_1.default.createElement(lucide_react_1.Settings, { className: "w-4 h-4" }))),
        react_1.default.createElement("div", { className: "p-4 border-b border-border" },
            react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                react_1.default.createElement("span", { className: "text-sm text-muted-foreground" }, "Persona:"),
                react_1.default.createElement("select", { className: "flex-1 px-2 py-1 text-sm border border-border rounded bg-background", value: chatState.currentConversation.personaId, onChange: (_e) => {
                        // TODO: Handle input change
                    } },
                    react_1.default.createElement("option", { value: "" }, "Select Persona"),
                    chatState.personas.map(persona => (react_1.default.createElement("option", { key: persona.id, value: persona.id }, persona.name)))))),
        react_1.default.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-4" },
            recentMessages.length === 0 ? (react_1.default.createElement("div", { className: "text-center text-muted-foreground py-8" },
                react_1.default.createElement(lucide_react_1.MessageSquare, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
                react_1.default.createElement("p", null, "No messages yet. Start a conversation!"))) : (recentMessages.map((message) => (react_1.default.createElement("div", { key: message.id, className: `flex space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}` },
                react_1.default.createElement("div", { className: `max-w-[80%] rounded-lg px-3 py-2 ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'}` },
                    react_1.default.createElement("div", { className: "flex items-center space-x-2 mb-1" },
                        message.role === 'user' ? (react_1.default.createElement(lucide_react_1.User, { className: "w-3 h-3" })) : (react_1.default.createElement(lucide_react_1.Bot, { className: "w-3 h-3" })),
                        react_1.default.createElement("span", { className: "text-xs opacity-70" }, message.timestamp.toLocaleTimeString())),
                    react_1.default.createElement("p", { className: "text-sm" }, message.content)))))),
            isTyping && (react_1.default.createElement("div", { className: "flex justify-start" },
                react_1.default.createElement("div", { className: "bg-muted rounded-lg px-3 py-2" },
                    react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                        react_1.default.createElement(lucide_react_1.Bot, { className: "w-3 h-3" }),
                        react_1.default.createElement("span", { className: "text-sm text-muted-foreground" }, "Typing...")))))),
        react_1.default.createElement("div", { className: "p-4 border-t border-border" },
            react_1.default.createElement("div", { className: "flex space-x-2" },
                react_1.default.createElement(ui_1.Input, { value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type your message...", className: "flex-1", disabled: isTyping }),
                react_1.default.createElement(ui_1.Button, { onClick: handleSendMessage, disabled: !inputValue.trim() || isTyping, size: "sm" },
                    react_1.default.createElement(lucide_react_1.Send, { className: "w-4 h-4" }))))));
};
exports.ChatTab = ChatTab;
