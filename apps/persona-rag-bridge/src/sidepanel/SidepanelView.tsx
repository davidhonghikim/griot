import React, { useState } from "react";import { ChatBubbleLeftRightIcon, ArchiveBoxIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const SidepanelView: React.FC = () => {
  const [currentView, setCurrentView] = useState('chat');

  return (
    <div className="h-full bg-background-primary text-text-primary flex flex-col">
      <header className="bg-background-secondary p-3 border-b border-border-primary">
        <h2 className="text-lg font-semibold">OWU+ Panel</h2>
      </header>

      <nav className="bg-background-secondary p-2 border-b border-border-primary">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              currentView === 'chat' 
                ? 'bg-accent-primary text-white' 
                : 'bg-background-tertiary text-text-primary hover:bg-border-primary'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            Chat
          </button>
          <button
            onClick={() => setCurrentView('artefacts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              currentView === 'artefacts' 
                ? 'bg-accent-primary text-white' 
                : 'bg-background-tertiary text-text-primary hover:bg-border-primary'
            }`}
          >
            <ArchiveBoxIcon className="h-4 w-4" />
            Artefacts
          </button>
          <button
            onClick={() => setCurrentView('agents')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              currentView === 'agents' 
                ? 'bg-accent-primary text-white' 
                : 'bg-background-tertiary text-text-primary hover:bg-border-primary'
            }`}
          >
            <UserGroupIcon className="h-4 w-4" />
            Agents
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-4">
        {currentView === 'chat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Chat</h3>
            <div className="bg-background-secondary rounded-lg p-4">
              <p className="text-text-secondary">Chat interface will be implemented here.</p>
            </div>
          </div>
        )}
        
        {currentView === 'artefacts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Artefacts</h3>
            <div className="bg-background-secondary rounded-lg p-4">
              <p className="text-text-secondary">Artefacts interface will be implemented here.</p>
            </div>
          </div>
        )}
        
        {currentView === 'agents' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Agents</h3>
            <div className="bg-background-secondary rounded-lg p-4">
              <p className="text-text-secondary">Agents interface will be implemented here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
