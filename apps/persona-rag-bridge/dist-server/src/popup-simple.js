"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
// Simple test popup component
const SimplePopup = () => {
    return (react_1.default.createElement("div", { style: {
            width: '400px',
            height: '600px',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
        } },
        react_1.default.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #334155',
                marginBottom: '16px'
            } },
            react_1.default.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                react_1.default.createElement("div", { style: {
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#22c55e',
                        borderRadius: '50%'
                    } }),
                react_1.default.createElement("span", { style: { fontWeight: '600' } }, "OWU+ Extension")),
            react_1.default.createElement("span", { style: { fontSize: '12px', color: '#94a3b8' } }, "Ready")),
        react_1.default.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '24px'
            } }, ['Chat', 'Services', 'Artifacts', 'Recipes', 'Agents', 'Settings'].map((tab) => (react_1.default.createElement("button", { key: tab, style: {
                padding: '8px 12px',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = '#334155', onMouseOut: (e) => e.currentTarget.style.backgroundColor = '#1e293b' }, tab)))),
        react_1.default.createElement("div", { style: {
                flex: 1,
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            } },
            react_1.default.createElement("h2", { style: { margin: '0 0 16px 0', color: '#38bdf8' } }, "Extension Loaded Successfully!"),
            react_1.default.createElement("div", { style: { textAlign: 'center', lineHeight: '1.6' } },
                react_1.default.createElement("p", { style: { margin: '8px 0', color: '#cbd5e1' } }, "\u2705 Icons: Working"),
                react_1.default.createElement("p", { style: { margin: '8px 0', color: '#cbd5e1' } }, "\u2705 Manifest: Valid"),
                react_1.default.createElement("p", { style: { margin: '8px 0', color: '#cbd5e1' } }, "\u2705 React: Rendering"),
                react_1.default.createElement("p", { style: { margin: '8px 0', color: '#cbd5e1' } }, "\u2705 Theme: Dark Mode"),
                react_1.default.createElement("div", { style: {
                        marginTop: '24px',
                        padding: '12px',
                        backgroundColor: '#0f172a',
                        borderRadius: '6px',
                        border: '1px solid #334155'
                    } },
                    react_1.default.createElement("p", { style: { margin: '0', fontSize: '14px', color: '#fbbf24' } }, "\uD83D\uDE80 Ready for Advanced Features"),
                    react_1.default.createElement("p", { style: { margin: '8px 0 0 0', fontSize: '12px', color: '#94a3b8' } },
                        "OpenWebUI: 192.168.1.180:3000",
                        react_1.default.createElement("br", null),
                        "RAG Service: localhost:3001")))),
        react_1.default.createElement("div", { style: {
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#94a3b8'
            } },
            react_1.default.createElement("span", null, "PersonaRAG Bridge v1.0.0"),
            react_1.default.createElement("span", null, "\uD83D\uDFE2 Connected"))));
};
// Simple initialization
console.log('🚀 OWU+ Extension: Starting simple popup...');
// Render
const container = document.getElementById('root');
if (container) {
    console.log('📦 Creating React root...');
    const root = (0, client_1.createRoot)(container);
    root.render(react_1.default.createElement(SimplePopup, null));
    console.log('✅ Simple popup rendered successfully!');
}
else {
    console.error('❌ Root container not found!');
}
