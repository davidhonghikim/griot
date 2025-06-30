/**
 * Jotai Atoms for OWU+ Extension State Management
 * 
 * Modular state management using Jotai atoms for different
 * aspects of the extension.
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// =============================================================================
// EXTENSION STATE
// =============================================================================

export interface ExtensionState {
  isOpen: boolean;
  currentTab: 'chat' | 'services' | 'artefacts' | 'recipes' | 'agents' | 'settings';
  popup: {
    width: number;
    height: number;
    position: { x: number; y: number };
  };
  panel: {
    isOpen: boolean;
    width: number;
    height: number;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
}

export const extensionStateAtom = atomWithStorage<ExtensionState>('owu-extension-state', {
  isOpen: false,
  currentTab: 'chat',
  popup: {
    width: 400,
    height: 600,
    position: { x: 0, y: 0 },
  },
  panel: {
    isOpen: false,
    width: 800,
    height: 600,
  },
  theme: 'auto',
  language: 'en',
  notifications: true,
});

// =============================================================================
// RETICULUM STATE
// =============================================================================

export interface ReticulumState {
  isConnected: boolean;
  nodeId: string;
  networkName: string;
  discoveredNodes: ReticulumNode[];
  connections: ReticulumConnection[];
  messages: ReticulumMessage[];
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastActivity: Date;
  errors: ReticulumError[];
}

export interface ReticulumNode {
  id: string;
  name: string;
  type: 'client' | 'server' | 'relay';
  status: 'online' | 'offline' | 'unreachable';
  lastSeen: Date;
}

export interface ReticulumConnection {
  id: string;
  remoteNode: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  encrypted: boolean;
  establishedAt: Date;
  lastActivity: Date;
}

export interface ReticulumMessage {
  id: string;
  type: 'data' | 'control' | 'discovery' | 'routing';
  source: string;
  destination: string;
  payload: any;
  timestamp: Date;
  encrypted: boolean;
}

export interface ReticulumError {
  code: string;
  message: string;
  timestamp: Date;
  details?: any;
}

export const reticulumStateAtom = atomWithStorage<ReticulumState>('owu-reticulum-state', {
  isConnected: false,
  nodeId: '',
  networkName: '',
  discoveredNodes: [],
  connections: [],
  messages: [],
  status: 'disconnected',
  lastActivity: new Date(),
  errors: [],
});

// =============================================================================
// KLF STATE
// =============================================================================

export interface KLFState {
  isConnected: boolean;
  nodeId: string;
  networkName: string;
  registeredServices: KLFService[];
  discoveredServices: KLFService[];
  activeWorkflows: KLFWorkflowExecution[];
  workflows: KLFWorkflow[];
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastActivity: Date;
  errors: KLFError[];
}

export interface KLFService {
  id: string;
  name: string;
  type: 'ai' | 'generation' | 'storage' | 'utility';
  status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'error';
  lastSeen: Date;
  health: KLFHealthStatus;
}

export interface KLFHealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  responseTime: number;
  errorMessage?: string;
}

export interface KLFWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'inactive' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

export interface KLFWorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  startedAt: Date;
  completedAt?: Date;
  error?: KLFError;
}

export interface KLFError {
  code: string;
  message: string;
  timestamp: Date;
  details?: any;
}

export const klfStateAtom = atomWithStorage<KLFState>('owu-klf-state', {
  isConnected: false,
  nodeId: '',
  networkName: '',
  registeredServices: [],
  discoveredServices: [],
  activeWorkflows: [],
  workflows: [],
  status: 'disconnected',
  lastActivity: new Date(),
  errors: [],
});

// =============================================================================
// CHAT STATE
// =============================================================================

export interface ChatState {
  currentConversation: ConversationInfo;
  conversations: ConversationInfo[];
  personas: PersonaInfo[];
  models: ModelInfo[];
  messages: ChatMessage[];
  isTyping: boolean;
  streaming: boolean;
  error?: string;
}

export interface ConversationInfo {
  id: string;
  title: string;
  personaId: string;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface PersonaInfo {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  expertise: string[];
  modelId: string;
  temperature: number;
  systemPrompt: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  type: 'chat' | 'completion' | 'embedding';
  contextLength: number;
  maxTokens: number;
  status: 'available' | 'unavailable' | 'error';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  modelId: string;
  personaId: string;
  metadata: Record<string, any>;
}

export const chatStateAtom = atomWithStorage<ChatState>('owu-chat-state', {
  currentConversation: {
    id: '',
    title: 'New Conversation',
    personaId: '',
    modelId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: 0,
  },
  conversations: [],
  personas: [],
  models: [],
  messages: [],
  isTyping: false,
  streaming: false,
});

// =============================================================================
// SERVICES STATE
// =============================================================================

export interface ServicesState {
  services: ServiceInfo[];
  health: Record<string, ServiceHealth>;
  connections: ServiceConnection[];
  status: 'scanning' | 'ready' | 'error';
  lastScan: Date;
  errors: ServiceError[];
}

export interface ServiceInfo {
  id: string;
  name: string;
  type: 'ollama' | 'openai' | 'comfyui' | 'a1111' | 'huggingface';
  url: string;
  status: 'online' | 'offline' | 'error';
  lastCheck: Date;
  config: Record<string, any>;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  errorMessage?: string;
  metrics: ServiceMetrics;
}

export interface ServiceMetrics {
  uptime: number;
  requests: number;
  errors: number;
  latency: number;
  throughput: number;
}

export interface ServiceConnection {
  id: string;
  serviceId: string;
  status: 'connected' | 'disconnected' | 'error';
  establishedAt: Date;
  lastActivity: Date;
  config: Record<string, any>;
}

export interface ServiceError {
  serviceId: string;
  code: string;
  message: string;
  timestamp: Date;
  details?: any;
}

export const servicesStateAtom = atomWithStorage<ServicesState>('owu-services-state', {
  services: [],
  health: {},
  connections: [],
  status: 'scanning',
  lastScan: new Date(),
  errors: [],
});

// =============================================================================
// ARTEFACTS STATE
// =============================================================================

export interface ArtefactsState {
  artefacts: ArtefactInfo[];
  selectedArtefact?: string;
  filters: ArtefactFilters;
  view: 'grid' | 'list' | 'details';
  sortBy: 'name' | 'type' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error?: string;
}

export interface ArtefactInfo {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'model' | 'data';
  size: number;
  path: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtefactFilters {
  types: string[];
  tags: string[];
  dateRange: { start: Date; end: Date };
  sizeRange: { min: number; max: number };
  search: string;
}

export const artefactsStateAtom = atomWithStorage<ArtefactsState>('owu-artefacts-state', {
  artefacts: [],
  filters: {
    types: [],
    tags: [],
    dateRange: { start: new Date(0), end: new Date() },
    sizeRange: { min: 0, max: Infinity },
    search: '',
  },
  view: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
  loading: false,
});

// =============================================================================
// RECIPES STATE
// =============================================================================

export interface RecipesState {
  recipes: RecipeInfo[];
  selectedRecipe?: string;
  executions: RecipeExecution[];
  templates: RecipeTemplate[];
  view: 'list' | 'grid' | 'details';
  loading: boolean;
  error?: string;
}

export interface RecipeInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  inputs: RecipeInput[];
  outputs: RecipeOutput[];
  status: 'draft' | 'active' | 'inactive' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface RecipeOutput {
  name: string;
  type: string;
  description: string;
  source: string;
}

export interface RecipeExecution {
  id: string;
  recipeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface RecipeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  recipe: Partial<RecipeInfo>;
}

export const recipesStateAtom = atomWithStorage<RecipesState>('owu-recipes-state', {
  recipes: [],
  executions: [],
  templates: [],
  view: 'list',
  loading: false,
});

// =============================================================================
// AGENTS STATE
// =============================================================================

export interface AgentsState {
  agents: AgentInfo[];
  selectedAgent?: string;
  templates: AgentTemplate[];
  executions: AgentExecution[];
  view: 'list' | 'grid' | 'details';
  loading: boolean;
  error?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  config: Record<string, any>;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export const agentsStateAtom = atomWithStorage<AgentsState>('owu-agents-state', {
  agents: [],
  templates: [],
  executions: [],
  view: 'list',
  loading: false,
});

// =============================================================================
// VAULT STATE
// =============================================================================

export interface VaultState {
  isUnlocked: boolean;
  credentials: CredentialInfo[];
  selectedCredential?: string;
  categories: string[];
  search: string;
  view: 'list' | 'grid';
  loading: boolean;
  error?: string;
}

export interface CredentialInfo {
  id: string;
  name: string;
  type: 'api_key' | 'password' | 'token' | 'certificate';
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export const vaultStateAtom = atomWithStorage<VaultState>('owu-vault-state', {
  isUnlocked: false,
  credentials: [],
  categories: [],
  search: '',
  view: 'list',
  loading: false,
});

// =============================================================================
// NOTIFICATIONS STATE
// =============================================================================

export interface NotificationsState {
  notifications: NotificationInfo[];
  unreadCount: number;
  settings: NotificationSettings;
  enabled: boolean;
}

export interface NotificationInfo {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  url?: string;
  callback?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  duration: number;
  maxNotifications: number;
}

export const notificationsStateAtom = atomWithStorage<NotificationsState>('owu-notifications-state', {
  notifications: [],
  unreadCount: 0,
  settings: {
    enabled: true,
    sound: true,
    desktop: true,
    duration: 5000,
    maxNotifications: 100,
  },
  enabled: true,
});

// =============================================================================
// DERIVED ATOMS
// =============================================================================

// Extension status
export const extensionStatusAtom = atom((get) => {
  const extension = get(extensionStateAtom);
  const reticulum = get(reticulumStateAtom);
  const klf = get(klfStateAtom);
  
  return {
    isOpen: extension.isOpen,
    reticulumConnected: reticulum.isConnected,
    klfConnected: klf.isConnected,
    hasErrors: reticulum.errors.length > 0 || klf.errors.length > 0,
  };
});

// Active services count
export const activeServicesAtom = atom((get) => {
  const services = get(servicesStateAtom);
  return services.services.filter(s => s.status === 'online').length;
});

// Recent messages
export const recentMessagesAtom = atom((get) => {
  const chat = get(chatStateAtom);
  return chat.messages.slice(-10);
});

// Unread notifications
export const unreadNotificationsAtom = atom((get) => {
  const notifications = get(notificationsStateAtom);
  return notifications.notifications.filter(n => !n.read);
});

// =============================================================================
// ACTIONS
// =============================================================================

// Extension actions
export const toggleExtensionAtom = atom(
  (get) => get(extensionStateAtom).isOpen,
  (get, set) => {
    const current = get(extensionStateAtom);
    set(extensionStateAtom, { ...current, isOpen: !current.isOpen });
  }
);

export const setCurrentTabAtom = atom(
  null,
  (get, set, tab: ExtensionState['currentTab']) => {
    const current = get(extensionStateAtom);
    set(extensionStateAtom, { ...current, currentTab: tab });
  }
);

// Chat actions
export const addMessageAtom = atom(
  null,
  (get, set, message: ChatMessage) => {
    const current = get(chatStateAtom);
    set(chatStateAtom, {
      ...current,
      messages: [...current.messages, message],
    });
  }
);

export const clearMessagesAtom = atom(
  null,
  (get, set) => {
    const current = get(chatStateAtom);
    set(chatStateAtom, { ...current, messages: [] });
  }
);

// Notifications actions
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<NotificationInfo, 'id' | 'timestamp' | 'read'>) => {
    const current = get(notificationsStateAtom);
    const newNotification: NotificationInfo = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    
    set(notificationsStateAtom, {
      ...current,
      notifications: [...current.notifications, newNotification],
      unreadCount: current.unreadCount + 1,
    });
  }
);

export const markNotificationReadAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const current = get(notificationsStateAtom);
    const updatedNotifications = current.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    set(notificationsStateAtom, {
      ...current,
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.read).length,
    });
  }
);

// =============================================================================
// VIEW SWITCHING STATE
// =============================================================================

export interface ViewState {
  activeServiceId: string | null;
  activeView: 'chat' | 'services' | 'artefacts' | 'recipes' | 'agents' | 'settings' | 'vault';
  viewLocation: 'tab' | 'panel';
  lastTabUrl?: string;
  lastPanelUrl?: string;
}

export const viewStateAtom = atomWithStorage<ViewState>('owu-view-state', {
  activeServiceId: null,
  activeView: 'chat',
  viewLocation: 'tab',
});

// Active view atom for tab navigation
export const activeViewAtom = atomWithStorage<'chat' | 'image' | 'services' | 'artefacts' | 'recipes' | 'agents' | 'settings' | 'vault' | 'docs' | 'console'>('owu-active-view', 'chat');

// View switching actions
export const switchToTabAtom = atom(
  null,
  (get, set, payload: { serviceId?: string; view: ViewState['activeView'] }) => {
    const current = get(viewStateAtom);
    set(viewStateAtom, {
      ...current,
      activeServiceId: payload.serviceId || null,
      activeView: payload.view,
      viewLocation: 'tab',
    });
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'openTab',
      payload: {
        serviceId: payload.serviceId,
        view: payload.view,
      },
    });
  }
);

export const switchToPanelAtom = atom(
  null,
  (get, set, payload: { serviceId: string; view: ViewState['activeView'] }) => {
    const current = get(viewStateAtom);
    set(viewStateAtom, {
      ...current,
      activeServiceId: payload.serviceId,
      activeView: payload.view,
      viewLocation: 'panel',
    });
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'openPanel',
      payload: {
        serviceId: payload.serviceId,
        view: payload.view,
      },
    });
  }
);

// =============================================================================
// STORAGE INTEGRATION
// =============================================================================

// Export storage atoms for unified state management

