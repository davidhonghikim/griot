import React from 'react';
import { useAtom } from 'jotai';
import { 
  extensionStateAtom, 
  vaultStateAtom,
  notificationsStateAtom 
} from '../../modules/state/atoms';
import { Button, Input } from '../ui';
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
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background"
                value={extensionState.theme}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Language</label>
              <select 
                className="w-full px-3 py-2 text-sm border border-border rounded bg-background"
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