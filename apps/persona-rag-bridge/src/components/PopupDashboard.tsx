import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  servicesStateAtom, 
  activeServicesAtom,
  switchToTabAtom
} from '../modules/state/atoms';
import { ServicesTab } from './tabs/ServicesTab';
import { Button } from './ui';
import { 
  ExternalLink, 
  PanelLeftClose,
  Settings,
  HelpCircle
} from 'lucide-react';
import { ServiceInitializer } from '../services/service-initializer';

export const PopupDashboard: React.FC = () => {
  const [servicesState, setServicesState] = useAtom(servicesStateAtom);
  const [activeServices] = useAtom(activeServicesAtom);
  const [, switchToTab] = useAtom(switchToTabAtom);

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

  const handleOpenInTab = () => {
    switchToTab({ serviceId: undefined, view: 'services' });
    window.close();
  };

  const handleOpenInPanel = () => {
    // For panel, we need a serviceId, so we'll use a default one or skip this for now
    // switchToPanel({ serviceId: 'default', view: 'services' });
    // For now, just open in tab since panel requires a specific service
    switchToTab({ serviceId: undefined, view: 'services' });
    window.close();
  };

  return (
    <div className="w-[640px] h-[600px] bg-background-primary text-text-primary flex flex-col">
      {/* Header - matching kai-cd style */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-secondary">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-interactive-primary/20 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-interactive-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">OWU+ Services</h1>
            <p className="text-xs text-text-secondary">
              {activeServices} active • {servicesState.status}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary"
            onClick={handleOpenInTab}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Tab
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary"
            onClick={handleOpenInPanel}
          >
            <PanelLeftClose className="w-4 h-4 mr-1" />
            Panel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Services Content */}
      <div className="flex-1 overflow-hidden">
        <ServicesTab />
      </div>

      {/* Footer - matching kai-cd style */}
      <div className="border-t border-border-primary p-3 bg-background-secondary">
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
      </div>
    </div>
  );
};