import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui';
import { ChatTab } from '../components/tabs/ChatTab';
import { ServicesTab } from '../components/tabs/ServicesTab';
import { ArtefactsTab } from '../components/tabs/ArtefactsTab';
import { RecipesTab } from '../components/tabs/RecipesTab';
import { AgentsTab } from '../components/tabs/AgentsTab';
import { SettingsTab } from '../components/tabs/SettingsTab';

interface TabViewProps {
  initialView: string;
}

export const TabView: React.FC<TabViewProps> = ({ initialView }) => {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">OWU+ Extension</h1>
          <p className="text-text-secondary">AI-Powered Knowledge Management</p>
        </header>
        <Tabs defaultValue={initialView} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="artefacts">Artefacts</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="space-y-4"><ChatTab /></TabsContent>
          <TabsContent value="services" className="space-y-4"><ServicesTab /></TabsContent>
          <TabsContent value="artefacts" className="space-y-4"><ArtefactsTab /></TabsContent>
          <TabsContent value="recipes" className="space-y-4"><RecipesTab /></TabsContent>
          <TabsContent value="agents" className="space-y-4"><AgentsTab /></TabsContent>
          <TabsContent value="settings" className="space-y-4"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
