import React, { useState, useEffect } from 'react';
import {
  CubeTransparentIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface Service {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  enabled: boolean;
  capabilities: string[];
}

const SidepanelView: React.FC = () => {
  const [services] = useState<Service[]>([
    {
      id: 'reticulum',
      name: 'Reticulum',
      type: 'core',
      status: 'online',
      enabled: true,
      capabilities: ['llm_chat', 'image_generation']
    },
    {
      id: 'klf',
      name: 'KLF',
      type: 'protocol',
      status: 'online',
      enabled: true,
      capabilities: ['llm_chat']
    },
    {
      id: 'griot',
      name: 'Griot Node',
      type: 'node',
      status: 'offline',
      enabled: true,
      capabilities: ['llm_chat', 'image_generation']
    },
  ]);
  
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activeCapability, setActiveCapability] = useState<string>('llm_chat');

  const selectedService = services.find(s => s.id === selectedServiceId);

  const getPrimaryCapability = (service: Service | undefined): string => {
    if (!service) return 'llm_chat';
    if (service.capabilities.includes('llm_chat')) return 'llm_chat';
    if (service.capabilities.includes('image_generation')) return 'image_generation';
    return 'llm_chat'; // Fallback
  };

  const openInNewTab = async () => {
    if (!selectedService) return;
    
    try {
      chrome.storage.local.set({ 
        initialView: selectedService.id,
        initialCapability: activeCapability 
      }, () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('tab.html') });
        window.close();
      });
    } catch (error) {
      console.error('Failed to open in new tab:', error);
    }
  };

  const closePanel = async () => {
    try {
      const currentTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
      if (currentTab?.id) {
        await chrome.sidePanel.setOptions({ tabId: currentTab.id, enabled: false });
        window.close();
      }
    } catch (error) {
      console.error('Failed to close side panel:', error);
      window.close();
    }
  };

  // Auto-select first available service
  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      const firstEnabledService = services.find(s => s.enabled);
      if (firstEnabledService) {
        setSelectedServiceId(firstEnabledService.id);
        setActiveCapability(getPrimaryCapability(firstEnabledService));
      }
    }
  }, [services, selectedServiceId]);

  const renderCapabilityUI = () => {
    if (!selectedService) return null;

    switch (activeCapability) {
      case 'llm_chat':
        return (
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 bg-background-secondary rounded-lg p-3 mb-3">
              <div className="text-sm text-text-secondary mb-2">Chat History</div>
              <div className="text-xs text-text-tertiary">No messages yet</div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-placeholder focus:outline-none focus:border-accent-primary"
              />
              <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-state text-sm">
                Send
              </button>
            </div>
          </div>
        );
      
      case 'image_generation':
        return (
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 bg-background-secondary rounded-lg p-3 mb-3">
              <div className="text-sm text-text-secondary mb-2">Generated Images</div>
              <div className="text-xs text-text-tertiary">No images generated yet</div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Describe the image you want..."
                className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-placeholder focus:outline-none focus:border-accent-primary"
              />
              <button className="w-full px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-state text-sm">
                Generate Image
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            <div className="text-center">
              <CubeTransparentIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Unknown capability</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background-primary text-text-primary">
      {selectedService ? (
        <>
          <header className="flex-shrink-0 p-3 border-b border-border-primary flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{selectedService.name}</h1>
              <p className="text-xs text-text-secondary capitalize">
                {selectedService.type.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openInNewTab}
                className="p-1 text-text-secondary hover:text-text-primary"
                title="Open in new tab"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={closePanel}
                className="p-1 text-text-secondary hover:text-text-primary"
                title="Close Panel"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </header>
          
          <div className="p-2 border-b border-border-primary">
            <div className="flex gap-1">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setActiveCapability(getPrimaryCapability(service));
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedServiceId === service.id
                      ? 'bg-accent-primary text-white'
                      : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>
          
          {selectedService.capabilities.length > 1 && (
            <div className="p-2 border-b border-border-primary">
              <div className="flex gap-1">
                {selectedService.capabilities.includes('llm_chat') && (
                  <button
                    onClick={() => setActiveCapability('llm_chat')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      activeCapability === 'llm_chat'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                    }`}
                  >
                    <ChatBubbleLeftRightIcon className="h-3 w-3" />
                    Chat
                  </button>
                )}
                {selectedService.capabilities.includes('image_generation') && (
                  <button
                    onClick={() => setActiveCapability('image_generation')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      activeCapability === 'image_generation'
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                    }`}
                  >
                    <PhotoIcon className="h-3 w-3" />
                    Image
                  </button>
                )}
              </div>
            </div>
          )}
          
          <main className="flex-1 overflow-y-auto">
            {renderCapabilityUI()}
          </main>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-text-secondary">
          <CubeTransparentIcon className="w-16 h-16 mb-4" />
          <h2 className="text-lg font-semibold">No Service Selected</h2>
          <p className="text-sm">Select a service from the popup to begin.</p>
        </div>
      )}
    </div>
  );
};

export default SidepanelView; 