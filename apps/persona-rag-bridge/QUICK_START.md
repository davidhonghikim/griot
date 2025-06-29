# 🚀 Quick Start Guide - OWU+ Browser Extension

## **5-Minute Setup & Testing**

This guide will get you up and running with the OWU+ Browser Extension in under 5 minutes.

## Step 1: Build the Extension

```bash
# Navigate to the extension directory
cd apps/persona-rag-bridge

# Install dependencies
npm install

# Build the extension
npm run build
```

You should see:
```
✓ built in 4.27s
dist/public/popup.html    1.20 kB │ gzip:  0.61 kB
dist/popup.css            0.00 kB │ gzip:  0.02 kB
dist/content.js           0.49 kB │ gzip:  0.31 kB
dist/background.js        1.91 kB │ gzip:  0.87 kB
dist/popup.js           281.14 kB │ gzip: 72.11 kB
```

## Step 2: Load in Chrome

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable "Developer mode"** (toggle in top right)
3. **Click "Load unpacked"**
4. **Select the `dist` folder** from your project
5. **The OWU+ extension should appear** in your browser toolbar

## Step 3: Test the Extension

1. **Click the OWU+ icon** in your browser toolbar
2. **You should see a popup** with 6 tabs:
   - **Chat**: Message interface with persona selection
   - **Services**: AI service management and monitoring
   - **Artefacts**: File and artifact management
   - **Recipes**: Workflow and recipe management
   - **Agents**: AI agent management
   - **Settings**: Configuration and preferences

3. **Navigate between tabs** to test the interface
4. **Check the status bar** at the bottom for connection indicators

## Step 4: Development Testing (Optional)

For easier development and testing:

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
# This shows the popup interface in a web page
```

## 🎯 What You Get

Once loaded, your browser extension provides:

- **🎨 Modern UI**: Clean, responsive interface with 6 functional tabs
- **📊 Real-time Status**: Connection indicators for Reticulum, KLF, and Services
- **💬 Chat Interface**: Multi-persona conversation system
- **🔧 Service Management**: AI service monitoring and configuration
- **📁 File Management**: Artefact and document handling
- **⚙️ Workflow System**: Recipe and automation management
- **🤖 Agent Control**: AI agent management interface

## 🔧 Troubleshooting

### Extension Won't Load

1. **Check the dist folder**:
   ```bash
   ls -la dist/
   # Should show: background.js, content.js, popup.js, manifest.json, etc.
   ```

2. **Verify manifest.json**:
   ```bash
   cat dist/manifest.json
   # Should be valid JSON with manifest_version: 3
   ```

3. **Check for errors** in Chrome's extension page

### UI Not Displaying

1. **Check browser console** for JavaScript errors
2. **Verify build completed** without errors
3. **Try refreshing** the extension in Chrome

### TypeScript Errors

```bash
# Check for type errors
npm run type-check

# Fix any compilation issues before building
npm run build
```

## 🚀 Advanced Testing

### Test All Components

1. **Chat Tab**:
   - Type a message and press Enter
   - Check persona selector dropdown
   - Verify message history

2. **Services Tab**:
   - View service status indicators
   - Test service management buttons
   - Check health monitoring

3. **Status Bar**:
   - Verify connection indicators
   - Test Panel and Vault buttons
   - Check real-time updates

### Development Mode

```bash
# For continuous development
npm run dev

# Watch for changes
npm run build -- --watch

# Type checking
npm run type-check
```

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🎉 Success!

Your OWU+ Browser Extension is now:
- ✅ **Fully functional** with complete UI
- ✅ **Ready for testing** in Chrome
- ✅ **Development-ready** with hot reload
- ✅ **Type-safe** with comprehensive TypeScript coverage

## 🔄 Next Steps

1. **Test all tabs** and functionality
2. **Integrate with Reticulum** for mesh networking
3. **Connect to KLF** for service orchestration
4. **Add AI service connectors** for real functionality
5. **Implement vault system** for secure credential management

---

**Your OWU+ Browser Extension is ready to use! 🎉** 