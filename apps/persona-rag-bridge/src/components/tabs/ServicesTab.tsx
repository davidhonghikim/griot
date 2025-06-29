import React from 'react';
import { useAtom } from 'jotai';
import { servicesStateAtom } from '../../modules/state/atoms';
import { Button } from '../ui';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Settings, 
  Plus, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const [servicesState] = useAtom(servicesStateAtom);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'error':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4" />
          <span className="font-medium">Services</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto p-4">
        {servicesState.services.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No services configured</p>
            <p className="text-xs">Add your first AI service to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {servicesState.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Server className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{service.name}</span>
                      {getStatusIcon(service.status)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{service.type}</span>
                      <span>•</span>
                      <span className={getStatusColor(service.status)}>
                        {service.status}
                      </span>
                      <span>•</span>
                      <span>
                        {service.lastCheck.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Wifi className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Service
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Scan Network
          </Button>
        </div>
      </div>
    </div>
  );
}; 