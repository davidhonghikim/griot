# OWU+ Browser Extension

A powerful browser extension that integrates Open-WebUI with Reticulum encrypted mesh networking and KLF (Kind Link Framework) service orchestration.

## 🚀 **QUICK START - TESTING & DEVELOPMENT**

### **Immediate Testing (5 minutes)**

1. **Build the Extension**
   ```bash
   cd apps/persona-rag-bridge
   npm install
   npm run build
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `dist` folder from the project
   - The OWU+ extension should appear in your toolbar

3. **Test the UI**
   - Click the OWU+ icon in your browser toolbar
   - You should see a popup with 6 tabs: Chat, Services, Artefacts, Recipes, Agents, Settings
   - Navigate between tabs to test the interface
   - Check the status bar at the bottom for connection indicators

### **Development Server (for UI testing)**

```bash
npm run dev
# Open http://localhost:3000 in your browser
# This shows the popup interface in a web page for easier development
```

## ✅ **CURRENT STATUS**

### **Fully Operational Components**
- ✅ **UI Interface**: Complete React-based popup with 6 functional tabs
- ✅ **State Management**: Jotai atoms for all application state
- ✅ **Build System**: Zero TypeScript errors, successful builds
- ✅ **Extension Infrastructure**: Background script, content script, manifest
- ✅ **Component Library**: Button, Input, Tabs, StatusBar components
- ✅ **Tab System**: Chat, Services, Artefacts, Recipes, Agents, Settings

### **Ready for Integration**
- 🔄 **Reticulum Network**: Infrastructure ready, needs service implementation
- 🔄 **KLF Orchestration**: Framework ready, needs service connectors
- 🔄 **AI Services**: UI ready, needs API integration
- 🔄 **Vault System**: UI ready, needs encryption implementation

## Features

### 🔐 **Reticulum Integration**
- Encrypted peer-to-peer mesh networking
- Secure node discovery and communication
- End-to-end encryption for all messages
- WebRTC and WebSocket transport support

### 🎯 **KLF Orchestration**
- Service discovery and registration
- Workflow creation and execution
- Dynamic service composition
- Distributed AI service management

### 🤖 **AI Service Management**
- Connect to multiple AI services (Ollama, OpenAI, etc.)
- Service health monitoring
- Automatic failover and load balancing
- Service configuration management

### 💬 **Enhanced Chat**
- Multi-persona conversations
- Context-aware responses
- Message history and persistence
- Real-time collaboration

### 🎨 **Modern UI**
- Clean, responsive interface
- Dark/light theme support
- Tabbed navigation
- Real-time status indicators

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Reticulum     │    │   KLF           │
│   Extension     │◄──►│   Mesh Network  │◄──►│   Orchestrator  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Encryption    │    │   Service       │
│   (React)       │    │   Layer         │    │   Registry      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   State         │    │   Network       │    │   Workflow      │
│   Management    │    │   Protocol      │    │   Engine        │
│   (Jotai)       │    │   (WebRTC/WS)   │    │   (KLF)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Installation

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd griot-node/apps/persona-rag-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Production

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Package the extension**
   - The built extension is in the `dist` folder
   - Zip the contents for distribution

## Configuration

The extension uses environment-based configuration through the `config/environment.ts` file. Key configuration sections:

### Extension UI
```typescript
extension: {
  theme: 'auto' | 'light' | 'dark',
  language: 'en' | 'es' | 'fr' | 'de',
  // ... more options
}
```

### Reticulum Network
```typescript
reticulum: {
  nodeId: 'unique-node-id',
  enableWebRTC: true,
  enableWebSocket: true,
  discoveryInterval: 30000,
  // ... more options
}
```

### KLF Orchestration
```typescript
klf: {
  nodeId: 'unique-node-id',
  orchestratorUrl: 'ws://localhost:8080',
  discoveryInterval: 60000,
  // ... more options
}
```

### AI Services
```typescript
aiServices: {
  ollama: {
    baseUrl: 'http://localhost:11434',
    defaultModel: 'llama2',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
  },
  // ... more services
}
```

## Usage

### Basic Usage

1. **Open the Extension**
   - Click the OWU+ icon in your browser toolbar
   - The popup will show the main interface

2. **Connect to Services**
   - Go to the "Services" tab
   - Add your AI service connections
   - Monitor service health

3. **Start Chatting**
   - Go to the "Chat" tab
   - Select a persona
   - Start a conversation

4. **Manage Workflows**
   - Go to the "Recipes" tab
   - Create or import workflows
   - Execute automated tasks

### Advanced Features

#### Reticulum Mesh Networking
- **Node Discovery**: Automatically discover other nodes on the network
- **Secure Communication**: All messages are end-to-end encrypted
- **Peer-to-Peer**: Direct communication without central servers

#### KLF Service Orchestration
- **Service Registration**: Register your AI services with the network
- **Workflow Creation**: Create complex multi-service workflows
- **Dynamic Composition**: Automatically compose services for tasks

#### Vault Security
- **Credential Management**: Securely store API keys and credentials
- **Encryption**: All sensitive data is encrypted at rest
- **Access Control**: Fine-grained permission management

## Development

### Project Structure

```
src/
├── components/          # React UI components
│   ├── ui/             # Reusable UI components
│   ├── tabs/           # Tab-specific components
│   └── ...
├── modules/            # Core modules
│   ├── reticulum/      # Reticulum networking
│   ├── klf/           # KLF orchestration
│   └── state/         # State management
├── services/           # Service connectors
├── config/            # Configuration
└── styles/            # Global styles
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Testing the UI

1. **Development Mode**
   ```bash
   npm run dev
   # Open http://localhost:3000
   # This shows the popup interface in a web page
   ```

2. **Extension Mode**
   ```bash
   npm run build
   # Load dist/ folder in Chrome extensions
   # Click the extension icon to test popup
   ```

3. **Component Testing**
   - All components are in `src/components/`
   - State management in `src/modules/state/atoms.ts`
   - UI components in `src/components/ui/`

### Key Files

- **Main Popup**: `src/popup.tsx`
- **Extension Popup**: `src/components/ExtensionPopup.tsx`
- **Tab Components**: `src/components/tabs/`
- **State Management**: `src/modules/state/atoms.ts`
- **Background Script**: `src/background.ts`
- **Content Script**: `src/content.ts`
- **Configuration**: `config/environment.ts`

## Troubleshooting

### Common Issues

1. **Extension won't load**
   - Ensure you're in the `dist` folder, not the root
   - Check that all files are present in `dist/`
   - Verify manifest.json is valid

2. **UI not displaying**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Verify build completed successfully

3. **TypeScript errors**
   - Run `npm run type-check` to see all errors
   - Fix any compilation issues before building

### Debug Mode

Enable debug logging by setting:
```typescript
// In config/environment.ts
debug: {
  enabled: true,
  level: 'debug'
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## Roadmap

### v1.1.0
- [ ] Advanced workflow editor
- [ ] Service marketplace
- [ ] Mobile companion app

### v1.2.0
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Advanced analytics

### v2.0.0
- [ ] Decentralized identity
- [ ] Token economics
- [ ] Cross-platform sync 