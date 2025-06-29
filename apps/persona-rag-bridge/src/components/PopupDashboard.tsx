import React from 'react';
import { useAtom } from 'jotai';
import { 
  servicesStateAtom, 
  activeServicesAtom,
  switchToTabAtom,
  switchToPanelAtom
} from '../modules/state/atoms';
import { Button } from './ui';

export const PopupDashboard: React.FC = () => {
  const [servicesState] = useAtom(servicesStateAtom);
  const [activeServices] = useAtom(activeServicesAtom);
  const [, switchToTab] = useAtom(switchToTabAtom);
  const [, switchToPanel] = useAtom(switchToPanelAtom);

  const services = [
    {
      id: 'reticulum',
      name: 'Reticulum',
      description: 'Decentralized communication network',
      status: 'online',
      type: 'communication'
    },
    {
      id: 'klf',
      name: 'KLF Protocol',
      description: 'Kind Link Framework for service discovery',
      status: 'online',
      type: 'protocol'
    },
    {
      id: 'griot',
      name: 'Griot Node',
      description: 'AI orchestration and workflow management',
      status: 'online',
      type: 'ai'
    }
  ];

  const handleOpenInTab = (serviceId: string) => {
    switchToTab({ serviceId, view: 'services' });
    window.close();
  };

  const handleOpenInPanel = (serviceId: string) => {
    switchToPanel({ serviceId, view: 'services' });
    window.close();
  };

  return (
    <div className="w-80 h-96 bg-background text-foreground p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">OWU+ Dashboard</h1>
        <div className="text-xs text-muted-foreground">
          {activeServices} active
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-3 border border-border rounded-lg bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-sm">{service.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                service.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleOpenInTab(service.id)}
              >
                Open in Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleOpenInPanel(service.id)}
              >
                Open in Panel
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-3 mt-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Status: {servicesState.status}</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};