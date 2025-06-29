# OWU+ Browser Extension

A powerful browser extension that integrates Open-WebUI with Reticulum encrypted mesh networking and KLF (Kind Link Framework) service orchestration.

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
   npm run build:extension
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Production

1. **Build for production**
   ```bash
   npm run build:extension
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

### Key Technologies

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Jotai**: Atomic state management
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **WebRTC**: Peer-to-peer communication
- **WebSocket**: Real-time messaging

### Development Commands

```bash
# Development server
npm run dev

# Build extension
npm run build:extension

# Watch mode
npm run watch

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Features

1. **UI Components**: Add to `src/components/`
2. **State Management**: Add atoms to `src/modules/state/atoms.ts`
3. **Services**: Add connectors to `src/services/`
4. **Configuration**: Add to `src/config/environment.ts`

## Security

### Encryption
- All Reticulum messages are encrypted using AES-GCM
- Key exchange uses ECDH for perfect forward secrecy
- Credentials are encrypted at rest using AES-256

### Privacy
- No data is sent to external servers by default
- All communication is peer-to-peer
- Local storage for user preferences

### Permissions
- Minimal required permissions
- Granular permission requests
- Clear permission explanations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
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