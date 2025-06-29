import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple test popup component
const SimplePopup: React.FC = () => {
  return (
    <div style={{
      width: '400px',
      height: '600px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid #334155',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#22c55e',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontWeight: '600' }}>OWU+ Extension</span>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Ready</span>
      </div>

      {/* Test Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '24px'
      }}>
        {['Chat', 'Services', 'Artifacts', 'Recipes', 'Agents', 'Settings'].map((tab) => (
          <button
            key={tab}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#38bdf8' }}>Extension Loaded Successfully!</h2>
        <div style={{ textAlign: 'center', lineHeight: '1.6' }}>
          <p style={{ margin: '8px 0', color: '#cbd5e1' }}>✅ Icons: Working</p>
          <p style={{ margin: '8px 0', color: '#cbd5e1' }}>✅ Manifest: Valid</p>
          <p style={{ margin: '8px 0', color: '#cbd5e1' }}>✅ React: Rendering</p>
          <p style={{ margin: '8px 0', color: '#cbd5e1' }}>✅ Theme: Dark Mode</p>
          
          <div style={{ 
            marginTop: '24px', 
            padding: '12px',
            backgroundColor: '#0f172a',
            borderRadius: '6px',
            border: '1px solid #334155'
          }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#fbbf24' }}>
              🚀 Ready for Advanced Features
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              OpenWebUI: 192.168.1.180:3000<br/>
              RAG Service: localhost:3001
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <span>PersonaRAG Bridge v1.0.0</span>
        <span>🟢 Connected</span>
      </div>
    </div>
  );
};

// Simple initialization
console.log('🚀 OWU+ Extension: Starting simple popup...');

// Render
const container = document.getElementById('root');
if (container) {
  console.log('📦 Creating React root...');
  const root = createRoot(container);
  root.render(<SimplePopup />);
  console.log('✅ Simple popup rendered successfully!');
} else {
  console.error('❌ Root container not found!');
} 