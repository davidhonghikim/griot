# PersonaRAG Bridge Extension

A Chrome extension that bridges OpenWebUI with PersonaRAG capabilities, providing enhanced AI interactions through secure vault storage and intelligent document retrieval.

## Features

- **Dark Theme UI** with 6 functional tabs (Chat, Services, Artifacts, Recipes, Agents, Settings)
- **Flexible Configuration System** supporting multiple sources
- **Secure Vault Storage** with AES-256-CBC encryption
- **Vector Store Integration** (Weaviate + PostgreSQL)
- **PersonaRAG Service** for intelligent document retrieval
- **Chrome Extension** with background script and content integration

## Quick Start

### Testing Configuration (Default)
The extension comes pre-configured for testing with:
- OpenWebUI: `http://192.168.1.180:3000`
- RAG Service: `http://localhost:3001`

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Extension
```bash
npm run build
```

### 3. Load in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/` folder
4. The extension icon should appear in the Chrome toolbar

### 4. Test Extension
- Click the extension icon to open the popup
- Navigate through the 6 tabs to test functionality
- Check the Settings tab for connection configuration

## Configuration System

The extension supports multiple configuration sources with priority:

1. **Default** (Testing): Hard-coded defaults for quick testing
2. **User File**: JSON configuration file for deployment
3. **Network RAG**: Dynamic configuration from RAG database
4. **Runtime**: UI changes that override other sources

### Configuration Sources (Priority Order)

#### 1. Default Configuration (Testing)
```typescript
// Built-in testing defaults
openwebuiUrl: 'http://192.168.1.180:3000'
ragServiceUrl: 'http://localhost:3001'
useLocalRAG: true
```

#### 2. User Config File
Copy `config/user-config.example.json` to `config/user-config.json` and customize:

```json
{
  "connection": {
    "openwebuiUrl": "http://YOUR_SERVER_IP:3000",
    "openwebuiApiKey": "sk-your-api-key-here",
    "ragServiceUrl": "http://YOUR_RAG_SERVER:3001",
    "useLocalRAG": true
  },
  "network": {
    "autoDiscovery": true,
    "preferredNetworks": ["192.168.1.*", "10.0.0.*"],
    "fallbackUrls": ["http://localhost:3000"]
  }
}
```

#### 3. Network RAG Configuration
The extension can fetch configuration from your RAG service:
```bash
GET http://YOUR_RAG_SERVER:3001/api/config
```

#### 4. Runtime Configuration
Users can update settings through the extension's Settings tab.

## Deployment

### For Production Networks
1. **Create user config file**: Copy and customize `config/user-config.example.json`
2. **Update IP addresses**: Replace `192.168.1.180` with your actual server IPs
3. **Set API keys**: Add your OpenWebUI and service API keys
4. **Configure network discovery**: Set preferred networks and fallback URLs
5. **Build and distribute**: Run `npm run build` and distribute the `dist/` folder

### Network RAG Integration
The extension can automatically discover and configure services through your RAG database:

```typescript
// Example RAG configuration endpoint
{
  "connection.openwebuiUrl": "http://discovered-server:3000",
  "connection.ragServiceUrl": "http://rag-service:3001",
  "network.preferredNetworks": ["10.0.0.*", "192.168.1.*"]
}
```

## Development

### Development Server
```bash
npm run dev
# Open http://localhost:3000 for UI testing
```

### File Structure
```
src/
├── components/          # React UI components
│   ├── tabs/           # Tab components (Chat, Services, etc.)
│   └── ui/             # Reusable UI components
├── modules/
│   ├── config/         # Configuration management
│   ├── state/          # Jotai state atoms
│   ├── reticulum/      # Network protocol
│   └── klf/            # KLF orchestration
├── services/           # Service integrations
├── vault/              # Secure storage
└── styles/             # CSS and themes
```

### Configuration Management
```typescript
import { configManager } from './modules/config/ConfigManager';

// Get current configuration
const config = configManager.getConnectionConfig();

// Update configuration
configManager.set('connection.openwebuiUrl', 'http://new-server:3000');

// Load from network RAG
await configManager.loadFromNetworkRAG();
```

## Architecture

- **Extension Popup**: React-based UI with 6 tabs
- **Background Script**: Extension lifecycle and service management
- **Content Script**: Web page integration
- **Configuration Manager**: Multi-source configuration with priority
- **Vault System**: Secure storage with AES-256-CBC encryption
- **RAG Integration**: PersonaRAG service for intelligent retrieval

## Troubleshooting

### Common Issues

1. **Extension won't load**: Check that all icon files are present and valid
2. **Connection failures**: Verify IP addresses and port availability
3. **Build errors**: Ensure all dependencies are installed with `npm install`
4. **Configuration not updating**: Check configuration source priority in Settings

### Debug Mode
Enable debug logging by setting:
```typescript
localStorage.setItem('owu-debug', 'true');
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] All 6 tabs are functional
- [ ] Settings can be updated
- [ ] Network configuration loads
- [ ] Vault operations work
- [ ] Theme switching works
- [ ] Connection to OpenWebUI successful

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the kOS (Kindai Operating System) framework. 