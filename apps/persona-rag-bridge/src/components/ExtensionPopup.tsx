/// <reference path="../types/chrome.d.ts" />
import React from 'react';
import { useAtom } from 'jotai';
import { 
  extensionStateAtom, 
  extensionStatusAtom
} from '../modules/state/atoms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui';
import { ChatTab } from './tabs/ChatTab';
import { ServicesTab } from './tabs/ServicesTab';
import { ArtefactsTab } from './tabs/ArtefactsTab';
import { RecipesTab } from './tabs/RecipesTab';
import { AgentsTab } from './tabs/AgentsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { StatusBar } from './StatusBar';

export const ExtensionPopup: React.FC = () => {
  const [extensionState] = useAtom(extensionStateAtom);
  const [status] = useAtom(extensionStatusAtom);

  return (
    <div className="w-96 h-96 bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-medium">OWU+ Extension</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {status.reticulumConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Tabs */}
      <Tabs 
        defaultValue={extensionState.currentTab} 
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger 
              value="chat" 
              className="flex-1"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="flex-1"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="artefacts" 
              className="flex-1"
            >
              Artefacts
            </TabsTrigger>
            <TabsTrigger 
              value="recipes" 
              className="flex-1"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger 
              value="agents" 
              className="flex-1"
            >
              Agents
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full">
            <ChatTab />
          </TabsContent>
          <TabsContent value="services" className="h-full">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="artefacts" className="h-full">
            <ArtefactsTab />
          </TabsContent>
          <TabsContent value="recipes" className="h-full">
            <RecipesTab />
          </TabsContent>
          <TabsContent value="agents" className="h-full">
            <AgentsTab />
          </TabsContent>
          <TabsContent value="settings" className="h-full">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}; 