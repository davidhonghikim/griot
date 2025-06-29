import React from 'react';
import { useAtom } from 'jotai';
import { agentsStateAtom } from '../../modules/state/atoms';
import { Button } from '../ui';
import { 
  Bot, 
  Play, 
  Plus, 
  Settings, 
  Zap,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export const AgentsTab: React.FC = () => {
  const [agentsState] = useAtom(agentsStateAtom);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4" />
          <span className="font-medium">Agents</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-4">
        {agentsState.agents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No agents configured</p>
            <p className="text-xs">Create AI agents for automation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agentsState.agents.map((agent) => (
              <div
                key={agent.id}
                className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{agent.name}</span>
                    {getStatusIcon(agent.status)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{agent.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {agent.capabilities.slice(0, 3).map((capability) => (
                    <span
                      key={capability}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                    >
                      {capability}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{agent.capabilities.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{agent.status}</span>
                  <span>{agent.createdAt.toLocaleDateString()}</span>
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
            New Agent
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Templates
          </Button>
        </div>
      </div>
    </div>
  );
}; 