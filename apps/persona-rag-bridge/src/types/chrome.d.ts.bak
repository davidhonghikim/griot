// Chrome Extension API type declarations
declare namespace chrome {
  namespace action {
    function setIcon(details: { path?: string | { [key: string]: string } }): void;
    function setBadgeText(details: { text: string }): void;
    function setBadgeBackgroundColor(details: { color: string }): void;
  }

  namespace runtime {
    function getURL(path: string): string;
    function sendMessage(message: any): void;
    
    const onInstalled: chrome.runtime.RuntimeInstalledEvent;
    const onStartup: chrome.runtime.RuntimeStartupEvent;
    const onMessage: chrome.runtime.RuntimeMessageEvent;
    const onSuspend: chrome.runtime.RuntimeSuspendEvent;
  }

  namespace tabs {
    function create(createProperties: { url?: string }): void;
    const onUpdated: chrome.tabs.TabUpdatedEvent;
    const onActivated: chrome.tabs.TabActivatedEvent;
  }

  namespace storage {
    const onChanged: chrome.storage.StorageChangedEvent;
  }

  namespace sidePanel {
    function open(details: { windowId?: number }): void;
  }

  namespace windows {
    const WINDOW_ID_CURRENT: number;
  }
}

declare namespace chrome.runtime {
  interface RuntimeInstalledEvent {
    addListener(callback: (details: any) => void): void;
  }

  interface RuntimeStartupEvent {
    addListener(callback: () => void): void;
  }

  interface RuntimeMessageEvent {
    addListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
  }

  interface RuntimeSuspendEvent {
    addListener(callback: () => void): void;
  }
}

declare namespace chrome.tabs {
  interface TabUpdatedEvent {
    addListener(callback: (tabId: any, changeInfo: any, tab: any) => void): void;
  }

  interface TabActivatedEvent {
    addListener(callback: (activeInfo: any) => void): void;
  }
}

declare namespace chrome.storage {
  interface StorageChangedEvent {
    addListener(callback: (changes: any, namespace: any) => void): void;
  }
}
