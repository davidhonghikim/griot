import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  servicesStateAtom, 
  activeViewAtom
} from '../modules/state/atoms';
import { ServicesTab } from '../components/tabs/ServicesTab';
import { SettingsTab } from '../components/tabs/SettingsTab';
import { ChatTab } from '../components/tabs/ChatTab';
import { IFrameView } from '../components/IFrameView';
import { 
  MessageSquare, 
  Image, 
  Settings, 
  Server, 
  FileText, 
  Shield, 
  Wrench,
  Archive,
  Command,
  Lock
} from 'lucide-react';

interface TabViewProps {
  initialView: string;
}

type TabView = 'chat' | 'image' | 'services' | 'artefacts' | 'recipes' | 'agents' | 'settings' | 'vault' | 'docs' | 'console';

export const TabView: React.FC<TabViewProps> = ({ initialView }) => {
  const [servicesState] = useAtom(servicesStateAtom);
  const [activeView, setActiveView] = useAtom(activeViewAtom);
  const [showIframeView, setShowIframeView] = useState(false);
  const [activeService, setActiveService] = useState<any>(null);

  // Initialize view from props
  useEffect(() => {
    if (initialView && initialView !== activeView) {
      setActiveView(initialView as TabView);
    }
  }, [initialView, activeView, setActiveView]);

  // Handle messages from popup/background
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === 'setState') {
        const { serviceId, view } = message.payload;
        console.log(`[Tab] Received setState message. ServiceID: ${serviceId}, View: ${view}`);
        if (view) {
          setActiveView(view as TabView);
        }
        if (serviceId) {
          // Find service by ID and set as active
          const service = servicesState.services.find(s => s.id === serviceId);
          setActiveService(service);
        }
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    // Note: Chrome extension listeners are automatically cleaned up when the page unloads
  }, [servicesState.services, setActiveView]);

  const getServiceHost = (service?: any) => {
    if (!service || !service.url) return '';
    try {
      const url = new URL(service.url);
      return url.host;
    } catch (_error) {
      return '';
    }
  };

  const renderMainContent = () => {
    if (showIframeView && activeService) {
      return <IFrameView src={activeService.url} title={activeService.name} />;
    }
    
    switch (activeView) {
      case 'chat':
        return <ChatTab />;
      case 'image':
        return <div className="p-6">Image Generation - Coming Soon</div>;
      case 'services':
        return <ServicesTab />;
      case 'artefacts':
        return <div className="p-6">Artefacts Manager - Coming Soon</div>;
      case 'recipes':
        return <div className="p-6">Recipes Manager - Coming Soon</div>;
      case 'agents':
        return <div className="p-6">Agents Manager - Coming Soon</div>;
      case 'settings':
        return <SettingsTab />;
      case 'vault':
        return <div className="p-6">Vault Manager - Coming Soon</div>;
      case 'docs':
        return <div className="p-6">Documentation - Coming Soon</div>;
      case 'console':
        return <div className="p-6">Debug Console - Coming Soon</div>;
      default:
        return <div className="p-6">Select a view from the sidebar</div>;
    }
  };

  const NavItem: React.FC<{
    icon: React.FC<any>;
    view: TabView;
    activeView: TabView;
    setView: (v: TabView) => void;
    title?: string;
  }> = ({ icon: Icon, view, activeView, setView, title }) => (
    <button
      onClick={() => setView(view)}
      className={`p-3 rounded-lg transition-colors ${
        activeView === view
          ? 'bg-interactive-primary text-white'
          : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
      }`}
      title={title}
    >
      <Icon className="h-6 w-6" />
    </button>
  );

  return (
    <div className="flex h-screen bg-background-primary text-text-primary">
      {/* Sidebar Navigation - matching kai-cd style */}
      <nav className="w-16 bg-background-secondary flex flex-col items-center py-4 space-y-4 border-r border-border-primary">
        {/* Main Navigation Icons */}
        <NavItem 
          icon={MessageSquare} 
          view="chat" 
          activeView={activeView} 
          setView={setActiveView} 
          title="LLM Chat - AI conversation interface" 
        />
        <NavItem 
          icon={Image} 
          view="image" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Image Generation - AI image creation tools" 
        />
        
        <div className="flex-grow"></div>
        
        {/* Management Icons */}
        <NavItem 
          icon={Wrench} 
          view="services" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Service Management - Configure AI services" 
        />
        <NavItem 
          icon={Archive} 
          view="artefacts" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Artefacts Manager - Generated content storage" 
        />
        <NavItem 
          icon={Command} 
          view="recipes" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Recipes Manager - Workflow templates" 
        />
        <NavItem 
          icon={Server} 
          view="agents" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Agents Manager - AI agent configuration" 
        />
        
        {/* Security & Settings Icons */}
        <NavItem 
          icon={Lock} 
          view="vault" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Secure Vault - Encrypted credential storage" 
        />
        <NavItem 
          icon={Shield} 
          view="console" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Debug Console - Application logs and diagnostics" 
        />
        <NavItem 
          icon={FileText} 
          view="docs" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Documentation - User guides and help" 
        />
        <NavItem 
          icon={Settings} 
          view="settings" 
          activeView={activeView} 
          setView={setActiveView} 
          title="Application Settings - Themes and preferences" 
        />
      </nav>
      
      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-3 border-b border-border-primary bg-background-secondary shrink-0">
          <div className="flex-1 min-w-0 flex items-center">
            <h1 className="text-xl font-bold text-text-primary truncate" title={activeService?.name}>
              {activeService ? activeService.name : 'OWU+ Bridge'}
            </h1>
            {activeService && (
              <>
                <span className="mx-2 text-text-secondary">|</span>
                <div className={`w-2 h-2 rounded-full ${
                  activeService.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="ml-2 text-sm text-text-secondary">{getServiceHost(activeService)}</span>
                {activeService.hasExternalUi && (
                  <button 
                    onClick={() => setShowIframeView(!showIframeView)} 
                    className="ml-3 p-1 text-text-secondary hover:text-text-primary transition-colors" 
                    title={showIframeView ? 'Show Custom Interface' : 'Show Server Web UI'}
                  >
                    {showIframeView ? (
                      <MessageSquare className="h-5 w-5" />
                    ) : (
                      <Server className="h-5 w-5" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-xs text-text-secondary">
              {servicesState.services.length} services
            </div>
            <div className={`w-2 h-2 rounded-full ${
              servicesState.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
