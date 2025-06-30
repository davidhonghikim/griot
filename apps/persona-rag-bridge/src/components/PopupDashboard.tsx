import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  servicesStateAtom, 
  switchToTabAtom
} from '../modules/state/atoms';
import { ServicesTab } from './tabs/ServicesTab';
import { Button } from './ui';
import { 
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Server,
  Wrench,
  FileText
} from 'lucide-react';
import { ServiceInitializer } from '../services/service-initializer-browser';

export const PopupDashboard: React.FC = () => {
  const [servicesState, setServicesState] = useAtom(servicesStateAtom);
  const [, switchToTab] = useAtom(switchToTabAtom);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Initialize services on mount
  useEffect(() => {
    const serviceInitializer = new ServiceInitializer();
    
    const initializeServices = async () => {
      await serviceInitializer.initializeServices((services) => {
        setServicesState({
          ...servicesState,
          services,
          status: 'ready',
          lastScan: new Date(),
        });
      });
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      serviceInitializer.cleanup();
    };
  }, []);

  const handleOpenInTab = (view: 'services' | 'settings' | 'chat' | 'artefacts' | 'recipes' | 'agents' | 'vault' = 'services') => {
    switchToTab({ serviceId: undefined, view });
    window.close();
  };

  const togglePanel = async () => {
    try {
      const currentTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
      if (currentTab?.id) {
        if (isPanelOpen) {
          // Close the panel
          await chrome.sidePanel.setOptions({
            tabId: currentTab.id,
            enabled: false,
          });
          setIsPanelOpen(false);
        } else {
          // Open the panel
          await chrome.sidePanel.setOptions({
            tabId: currentTab.id,
            path: 'sidepanel.html',
            enabled: true,
          });
          await chrome.sidePanel.open({ tabId: currentTab.id });
          setIsPanelOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to toggle panel:', error);
      // Fallback to tab if panel is not available
      handleOpenInTab('services');
    }
  };

  return (
    <div className="w-[640px] h-[800px] bg-background-primary text-text-primary flex flex-col">
      {/* Header - matching kai-cd style */}
      <header className="flex items-center justify-between bg-background-secondary px-3 py-2 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-interactive-primary" />
          <span className="font-semibold text-text-primary">OWU+ Bridge</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 hover:bg-background-tertiary rounded text-text-secondary hover:text-text-primary"
            onClick={togglePanel}
            title={isPanelOpen ? 'Hide Panel' : 'Show Panel'}
          >
            {isPanelOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 hover:bg-background-tertiary rounded text-text-secondary hover:text-text-primary"
            onClick={() => handleOpenInTab('services')}
            title="Service Manager"
          >
            <Wrench className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 hover:bg-background-tertiary rounded text-text-secondary hover:text-text-primary"
            onClick={() => handleOpenInTab('settings')}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1 hover:bg-background-tertiary rounded text-text-secondary hover:text-text-primary"
            onClick={() => handleOpenInTab('chat')}
            title="Chat"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Services Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <ServicesTab />
      </main>

      {/* Footer - matching kai-cd style */}
      <footer className="border-t border-border-primary p-3 bg-background-secondary">
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <div className="flex items-center space-x-4">
            <span>Status: {servicesState.status}</span>
            <span>Services: {servicesState.services.length}</span>
            {servicesState.errors.length > 0 && (
              <span className="text-status-error">
                {servicesState.errors.length} errors
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>v1.0.0</span>
            <span>•</span>
            <span>OWU+ Bridge</span>
          </div>
        </div>
      </footer>
    </div>
  );
};