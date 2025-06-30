/// <reference types="chrome"/>

declare namespace chrome {
  namespace tabs {
    function query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]>;
    function sendMessage(tabId: number, message: any): Promise<any>;
    function executeScript(tabId: number, details: chrome.scripting.InjectionDetails): Promise<any>;
    
    const onUpdated: chrome.tabs.TabUpdatedEvent;
    const onActivated: chrome.tabs.TabActivatedEvent;
  }

  namespace runtime {
    function sendMessage(message: any): Promise<any>;
    function getURL(path: string): string;
    
    const onMessage: chrome.runtime.RuntimeMessageEvent;
  }

  namespace storage {
    namespace local {
      function get(keys?: string | string[] | object | null): Promise<object>;
      function set(items: object): Promise<void>;
      function remove(keys: string | string[]): Promise<void>;
      function clear(): Promise<void>;
    }
  }

  namespace scripting {
    interface InjectionDetails {
      target: { tabId: number };
      func: Function;
      args?: any[];
    }
  }
}

declare namespace chrome.tabs {
  interface QueryInfo {
    active?: boolean;
    currentWindow?: boolean;
    url?: string | string[];
  }

  interface Tab {
    id?: number;
    url?: string;
    title?: string;
    active: boolean;
    windowId: number;
  }

  interface TabUpdatedEvent {
    addListener(callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void): void;
  }

  interface TabActivatedEvent {
    addListener(callback: (activeInfo: chrome.tabs.TabActiveInfo) => void): void;
  }

  interface TabChangeInfo {
    status?: string;
    url?: string;
  }

  interface TabActiveInfo {
    tabId: number;
    windowId: number;
  }
}

declare namespace chrome.runtime {
  interface RuntimeMessageEvent {
    addListener(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void): void;
  }

  interface MessageSender {
    tab?: chrome.tabs.Tab;
    frameId?: number;
    id?: string;
    url?: string;
    tlsChannelId?: string;
  }
} 