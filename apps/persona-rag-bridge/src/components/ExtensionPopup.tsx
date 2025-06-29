import React from 'react';
import { useAtom } from 'jotai';
import { 
  extensionStateAtom, 
  extensionStatusAtom,
  setCurrentTabAtom 
} from '../modules/state/atoms';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui';
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
  const [, setCurrentTab] = useAtom(setCurrentTabAtom);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as any);
  };

  return (
    <div className="w-[400px] h-[600px] bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OWU+</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">OWU+ Extension</h1>
            <p className="text-xs text-muted-foreground">Open-WebUI+</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            status.reticulumConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <div className={`w-2 h-2 rounded-full ${
            status.klfConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
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
              onClick={() => handleTabChange('chat')}
              className="flex-1"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              onClick={() => handleTabChange('services')}
              className="flex-1"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="artefacts" 
              onClick={() => handleTabChange('artefacts')}
              className="flex-1"
            >
              Artefacts
            </TabsTrigger>
            <TabsTrigger 
              value="recipes" 
              onClick={() => handleTabChange('recipes')}
              className="flex-1"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger 
              value="agents" 
              onClick={() => handleTabChange('agents')}
              className="flex-1"
            >
              Agents
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              onClick={() => handleTabChange('settings')}
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