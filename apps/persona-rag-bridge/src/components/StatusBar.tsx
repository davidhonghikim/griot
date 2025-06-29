/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
import React from 'react';
import { useAtom } from 'jotai';
import { 
  reticulumStateAtom, 
  klfStateAtom, 
  servicesStateAtom,
  activeServicesAtom 
} from '../modules/state/atoms';
import { Button } from './ui';

export const StatusBar: React.FC = () => {
  const [reticulumState] = useAtom(reticulumStateAtom);
  const [klfState] = useAtom(klfStateAtom);
  const [servicesState] = useAtom(servicesStateAtom);
  const [activeServices] = useAtom(activeServicesAtom);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'online':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
      case 'offline':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="border-t border-border p-2 bg-muted/50">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          {/* Reticulum Status */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(reticulumState.status)}`} />
            <span className="text-muted-foreground">Reticulum</span>
            <span className="text-foreground font-medium">
              {reticulumState.discoveredNodes.length}
            </span>
          </div>

          {/* KLF Status */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(klfState.status)}`} />
            <span className="text-muted-foreground">KLF</span>
            <span className="text-foreground font-medium">
              {klfState.discoveredServices.length}
            </span>
          </div>

          {/* Services Status */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(servicesState.status)}`} />
            <span className="text-muted-foreground">Services</span>
            <span className="text-foreground font-medium">
              {activeServices}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => {
              // Open panel
              chrome.runtime.sendMessage({ action: 'openPanel' });
            }}
          >
            Panel
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => {
              // Open vault
              chrome.runtime.sendMessage({ action: 'openVault' });
            }}
          >
            Vault
          </Button>
        </div>
      </div>
    </div>
  );
}; 