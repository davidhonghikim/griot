// PersonaRAG Quick Test - JavaScript
const API_BASE = 'http://localhost:3000/api';
const VAULT_BASE = 'http://localhost:3001/api/vault';

// Service URLs
const SERVICES = {
    bridge: 'http://localhost:3000',
    vault: 'http://localhost:3001',
    vaultWeb: 'http://localhost:3001'
};

// Global state
let isServicesRunning = false;

// Utility functions
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('setupStatus');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

function updateServiceStatus(service, status, color = 'white') {
    const el = document.getElementById(`${service}Status`);
    if (el) {
        el.textContent = status;
        el.style.color = color;
    }
}

function addChatMessage(message, isUser = false) {
    const container = document.getElementById('chatContainer');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isUser ? 'user' : 'bot'}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showStatus('Command copied to clipboard!', 'success');
        setTimeout(() => showStatus('Ready to start! Click "Launch Services" to begin.', 'info'), 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showStatus('Failed to copy command', 'error');
    });
}

// Service management
async function launchServices() {
    showStatus('🚀 Launching services...', 'info');
    
    try {
        // Try to launch services via fetch (if CORS allows)
        const launchPromises = [
            fetch(`${SERVICES.bridge}/health`).catch(() => null),
            fetch(`${SERVICES.vault}/health`).catch(() => null)
        ];
        
        const results = await Promise.all(launchPromises);
        const bridgeRunning = results[0]?.ok;
        const vaultRunning = results[1]?.ok;
        
        if (bridgeRunning && vaultRunning) {
            isServicesRunning = true;
            showStatus('✅ Services are running!', 'success');
            updateServiceStatus('bridge', 'Running', '#10b981');
            updateServiceStatus('vault', 'Running', '#10b981');
        } else {
            showStatus('⚠️ Services not running. Use manual commands below.', 'error');
            updateServiceStatus('bridge', 'Not Running', '#ef4444');
            updateServiceStatus('vault', 'Not Running', '#ef4444');
        }
    } catch (error) {
        showStatus('❌ Could not check services. Use manual commands below.', 'error');
        console.error('Launch error:', error);
    }
}

async function checkServices() {
    showStatus('🔍 Checking service status...', 'info');
    
    try {
        const checks = [
            { name: 'bridge', url: `${SERVICES.bridge}/health` },
            { name: 'vault', url: `${SERVICES.vault}/health` }
        ];
        
        for (const check of checks) {
            try {
                const response = await fetch(check.url);
                if (response.ok) {
                    updateServiceStatus(check.name, 'Running', '#10b981');
                } else {
                    updateServiceStatus(check.name, 'Error', '#ef4444');
                }
            } catch (error) {
                updateServiceStatus(check.name, 'Not Running', '#ef4444');
            }
        }
        
        showStatus('✅ Status check complete!', 'success');
    } catch (error) {
        showStatus('❌ Status check failed', 'error');
        console.error('Check error:', error);
    }
}

async function stopServices() {
    showStatus('🛑 Stopping services...', 'info');
    isServicesRunning = false;
    updateServiceStatus('bridge', 'Stopped', '#f59e0b');
    updateServiceStatus('vault', 'Stopped', '#f59e0b');
    showStatus('🛑 Services stopped. Use manual commands to restart.', 'info');
}

// Vault management
async function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!apiKey) {
        showStatus('❌ Please enter an API key', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${VAULT_BASE}/secrets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'OPENWEBUI_API_KEY',
                value: apiKey,
                encrypted: true
            })
        });
        
        if (response.ok) {
            showStatus('✅ API key saved to vault!', 'success');
        } else {
            showStatus('❌ Failed to save API key', 'error');
        }
    } catch (error) {
        showStatus('❌ Vault not accessible. Start services first.', 'error');
        console.error('Save API key error:', error);
    }
}

async function saveUrl() {
    const url = document.getElementById('openwebuiUrl').value.trim();
    if (!url) {
        showStatus('❌ Please enter a URL', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${VAULT_BASE}/secrets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'OPENWEBUI_URL',
                value: url,
                encrypted: false
            })
        });
        
        if (response.ok) {
            showStatus('✅ URL saved to vault!', 'success');
        } else {
            showStatus('❌ Failed to save URL', 'error');
        }
    } catch (error) {
        showStatus('❌ Vault not accessible. Start services first.', 'error');
        console.error('Save URL error:', error);
    }
}

async function testConnection() {
    const url = document.getElementById('openwebuiUrl').value.trim();
    if (!url) {
        showStatus('❌ Please enter a URL first', 'error');
        return;
    }
    
    showStatus('🔗 Testing OpenWebUI connection...', 'info');
    
    try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
            updateServiceStatus('openwebui', 'Connected', '#10b981');
            showStatus('✅ OpenWebUI connection successful!', 'success');
        } else {
            updateServiceStatus('openwebui', 'Error', '#ef4444');
            showStatus('❌ OpenWebUI connection failed', 'error');
        }
    } catch (error) {
        updateServiceStatus('openwebui', 'Not Connected', '#ef4444');
        showStatus('❌ OpenWebUI not accessible', 'error');
        console.error('Connection test error:', error);
    }
}

// Chat functionality
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, true);
    input.value = '';
    
    // Check if services are running
    if (!isServicesRunning) {
        addChatMessage('❌ Services not running. Please start them first.', false);
        return;
    }
    
    try {
        // Send to PersonaRAG Bridge
        const response = await fetch(`${API_BASE}/chat/enhanced`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                personaId: 'griot_001' // Default persona
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            addChatMessage(data.response || 'No response received', false);
        } else {
            addChatMessage('❌ Failed to get response from bridge', false);
        }
    } catch (error) {
        addChatMessage('❌ Bridge not accessible. Check if services are running.', false);
        console.error('Chat error:', error);
    }
}

function clearChat() {
    const container = document.getElementById('chatContainer');
    container.innerHTML = '<div class="message bot">👋 Hello! I\'m ready to help you test the PersonaRAG Bridge. Ask me anything!</div>';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Auto-check services on page load
window.addEventListener('load', () => {
    showStatus('🔍 Checking services on startup...', 'info');
    setTimeout(checkServices, 1000);
});

// Export functions for HTML onclick handlers
window.launchServices = launchServices;
window.checkServices = checkServices;
window.stopServices = stopServices;
window.saveApiKey = saveApiKey;
window.saveUrl = saveUrl;
window.testConnection = testConnection;
window.sendMessage = sendMessage;
window.clearChat = clearChat;
window.handleKeyPress = handleKeyPress;
window.copyToClipboard = copyToClipboard; 