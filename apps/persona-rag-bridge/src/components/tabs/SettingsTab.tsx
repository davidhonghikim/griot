/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  extensionStateAtom, 
  vaultStateAtom,
  notificationsStateAtom 
} from '../../modules/state/atoms';
import { themeManagerAtom } from '../../modules/state/themeAtoms';
import { configManager, OWUConnectionConfig } from '../../modules/config/ConfigManager';
import { Button } from '../ui';
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Lock,
  Unlock
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [extensionState] = useAtom(extensionStateAtom);
  const [vaultState] = useAtom(vaultStateAtom);
  const [notificationsState] = useAtom(notificationsStateAtom);
  const [currentTheme, setTheme] = useAtom(themeManagerAtom);
  
  // Connection configuration state
  const [connectionConfig, setConnectionConfig] = useState<OWUConnectionConfig>(
    configManager.getConnectionConfig()
  );
  const [configSource, setConfigSource] = useState<string>('default');

  // Load configuration on mount
  useEffect(() => {
    const unsubscribe = configManager.subscribe('connection.openwebuiUrl', () => {
      setConnectionConfig(configManager.getConnectionConfig());
    });
    
    // Check configuration source
    const source = configManager.getConfigSource('connection.openwebuiUrl');
    setConfigSource(source?.source || 'default');
    
    return unsubscribe;
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as 'light' | 'dark' | 'system';
    setTheme(newTheme);
  };

  const handleConnectionChange = (key: keyof OWUConnectionConfig, value: string | boolean) => {
    configManager.set(`connection.${key}`, value);
    setConnectionConfig(configManager.getConnectionConfig());
  };

  const handleLoadNetworkConfig = async () => {
    try {
      await configManager.loadFromNetworkRAG();
      setConnectionConfig(configManager.getConnectionConfig());
      const source = configManager.getConfigSource('connection.openwebuiUrl');
      setConfigSource(source?.source || 'default');
    } catch (error) {
      console.error('Failed to load network configuration:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Settings</span>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Appearance */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Theme</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
                value={currentTheme}
                onChange={handleThemeChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Language</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
                value={extensionState.language}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <div className="flex items-center space-x-2">
                {vaultState.isUnlocked ? (
                  <Unlock className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm">Vault</span>
              </div>
              <Button variant="outline" size="sm">
                {vaultState.isUnlocked ? 'Lock' : 'Unlock'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Network Security</span>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Notifications</span>
              <input 
                type="checkbox" 
                checked={notificationsState.enabled}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound</span>
              <input 
                type="checkbox" 
                checked={notificationsState.settings.sound}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Desktop Notifications</span>
              <input 
                type="checkbox" 
                checked={notificationsState.settings.desktop}
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Connection Settings */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Connection</span>
          </h3>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Config Source: <span className="font-medium">{configSource}</span>
            </div>
            
            {/* OpenWebUI Server Selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">OpenWebUI Server</label>
              <div className="flex space-x-2 mb-2">
                <Button 
                  variant={connectionConfig.openwebuiUrl.includes('localhost') || connectionConfig.openwebuiUrl.includes('127.0.0.1') ? "primary" : "outline"}
                  size="sm" 
                  onClick={() => handleConnectionChange('openwebuiUrl', 'http://localhost:3000')}
                  className="flex-1"
                >
                  Local (localhost:3000)
                </Button>
                <Button 
                  variant={connectionConfig.openwebuiUrl.includes('192.168.1.180') ? "primary" : "outline"}
                  size="sm" 
                  onClick={() => handleConnectionChange('openwebuiUrl', 'http://192.168.1.180:3000')}
                  className="flex-1"
                >
                  Remote (.180)
                </Button>
              </div>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
                value={connectionConfig.openwebuiUrl}
                onChange={(e) => handleConnectionChange('openwebuiUrl', e.target.value)}
                placeholder="http://localhost:3000"
              />
            </div>

            {/* RAG Service Selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">RAG Service</label>
              <div className="flex space-x-2 mb-2">
                <Button 
                  variant={connectionConfig.ragServiceUrl.includes('localhost') || connectionConfig.ragServiceUrl.includes('127.0.0.1') ? "primary" : "outline"}
                  size="sm" 
                  onClick={() => handleConnectionChange('ragServiceUrl', 'http://localhost:30436')}
                  className="flex-1"
                >
                  Local (localhost:30436)
                </Button>
                <Button 
                  variant={connectionConfig.ragServiceUrl.includes('192.168.1.180') ? "primary" : "outline"}
                  size="sm" 
                  onClick={() => handleConnectionChange('ragServiceUrl', 'http://192.168.1.180:30436')}
                  className="flex-1"
                >
                  Remote (.180)
                </Button>
              </div>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
                value={connectionConfig.ragServiceUrl}
                onChange={(e) => handleConnectionChange('ragServiceUrl', e.target.value)}
                placeholder="http://localhost:30436"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Use Local RAG</span>
              <input 
                type="checkbox" 
                checked={connectionConfig.useLocalRAG}
                onChange={(e) => handleConnectionChange('useLocalRAG', e.target.checked)}
                className="rounded"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoadNetworkConfig}
                className="flex-1"
              >
                Load from Network
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div>
          <h3 className="text-sm font-medium mb-3">Advanced</h3>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Export Settings
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Import Settings
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 