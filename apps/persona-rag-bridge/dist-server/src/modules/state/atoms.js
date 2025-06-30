"use strict";
/**
 * Jotai Atoms for OWU+ Extension State Management
 *
 * Modular state management using Jotai atoms for different
 * aspects of the extension.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchToPanelAtom = exports.switchToTabAtom = exports.viewStateAtom = exports.markNotificationReadAtom = exports.addNotificationAtom = exports.clearMessagesAtom = exports.addMessageAtom = exports.setCurrentTabAtom = exports.toggleExtensionAtom = exports.unreadNotificationsAtom = exports.recentMessagesAtom = exports.activeServicesAtom = exports.extensionStatusAtom = exports.notificationsStateAtom = exports.vaultStateAtom = exports.agentsStateAtom = exports.recipesStateAtom = exports.artefactsStateAtom = exports.servicesStateAtom = exports.chatStateAtom = exports.klfStateAtom = exports.reticulumStateAtom = exports.extensionStateAtom = void 0;
const jotai_1 = require("jotai");
const utils_1 = require("jotai/utils");
exports.extensionStateAtom = (0, utils_1.atomWithStorage)('owu-extension-state', {
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
exports.reticulumStateAtom = (0, utils_1.atomWithStorage)('owu-reticulum-state', {
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
exports.klfStateAtom = (0, utils_1.atomWithStorage)('owu-klf-state', {
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
exports.chatStateAtom = (0, utils_1.atomWithStorage)('owu-chat-state', {
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
exports.servicesStateAtom = (0, utils_1.atomWithStorage)('owu-services-state', {
    services: [],
    health: {},
    connections: [],
    status: 'scanning',
    lastScan: new Date(),
    errors: [],
});
exports.artefactsStateAtom = (0, utils_1.atomWithStorage)('owu-artefacts-state', {
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
exports.recipesStateAtom = (0, utils_1.atomWithStorage)('owu-recipes-state', {
    recipes: [],
    executions: [],
    templates: [],
    view: 'list',
    loading: false,
});
exports.agentsStateAtom = (0, utils_1.atomWithStorage)('owu-agents-state', {
    agents: [],
    templates: [],
    executions: [],
    view: 'list',
    loading: false,
});
exports.vaultStateAtom = (0, utils_1.atomWithStorage)('owu-vault-state', {
    isUnlocked: false,
    credentials: [],
    categories: [],
    search: '',
    view: 'list',
    loading: false,
});
exports.notificationsStateAtom = (0, utils_1.atomWithStorage)('owu-notifications-state', {
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
exports.extensionStatusAtom = (0, jotai_1.atom)((get) => {
    const extension = get(exports.extensionStateAtom);
    const reticulum = get(exports.reticulumStateAtom);
    const klf = get(exports.klfStateAtom);
    return {
        isOpen: extension.isOpen,
        reticulumConnected: reticulum.isConnected,
        klfConnected: klf.isConnected,
        hasErrors: reticulum.errors.length > 0 || klf.errors.length > 0,
    };
});
// Active services count
exports.activeServicesAtom = (0, jotai_1.atom)((get) => {
    const services = get(exports.servicesStateAtom);
    return services.services.filter(s => s.status === 'online').length;
});
// Recent messages
exports.recentMessagesAtom = (0, jotai_1.atom)((get) => {
    const chat = get(exports.chatStateAtom);
    return chat.messages.slice(-10);
});
// Unread notifications
exports.unreadNotificationsAtom = (0, jotai_1.atom)((get) => {
    const notifications = get(exports.notificationsStateAtom);
    return notifications.notifications.filter(n => !n.read);
});
// =============================================================================
// ACTIONS
// =============================================================================
// Extension actions
exports.toggleExtensionAtom = (0, jotai_1.atom)((get) => get(exports.extensionStateAtom).isOpen, (get, set) => {
    const current = get(exports.extensionStateAtom);
    set(exports.extensionStateAtom, { ...current, isOpen: !current.isOpen });
});
exports.setCurrentTabAtom = (0, jotai_1.atom)(null, (get, set, tab) => {
    const current = get(exports.extensionStateAtom);
    set(exports.extensionStateAtom, { ...current, currentTab: tab });
});
// Chat actions
exports.addMessageAtom = (0, jotai_1.atom)(null, (get, set, message) => {
    const current = get(exports.chatStateAtom);
    set(exports.chatStateAtom, {
        ...current,
        messages: [...current.messages, message],
    });
});
exports.clearMessagesAtom = (0, jotai_1.atom)(null, (get, set) => {
    const current = get(exports.chatStateAtom);
    set(exports.chatStateAtom, { ...current, messages: [] });
});
// Notifications actions
exports.addNotificationAtom = (0, jotai_1.atom)(null, (get, set, notification) => {
    const current = get(exports.notificationsStateAtom);
    const newNotification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
    };
    set(exports.notificationsStateAtom, {
        ...current,
        notifications: [...current.notifications, newNotification],
        unreadCount: current.unreadCount + 1,
    });
});
exports.markNotificationReadAtom = (0, jotai_1.atom)(null, (get, set, notificationId) => {
    const current = get(exports.notificationsStateAtom);
    const updatedNotifications = current.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    set(exports.notificationsStateAtom, {
        ...current,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
    });
});
exports.viewStateAtom = (0, utils_1.atomWithStorage)('owu-view-state', {
    activeServiceId: null,
    activeView: 'chat',
    viewLocation: 'tab',
});
// View switching actions
exports.switchToTabAtom = (0, jotai_1.atom)(null, (get, set, payload) => {
    const current = get(exports.viewStateAtom);
    set(exports.viewStateAtom, {
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
});
exports.switchToPanelAtom = (0, jotai_1.atom)(null, (get, set, payload) => {
    const current = get(exports.viewStateAtom);
    set(exports.viewStateAtom, {
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
});
// =============================================================================
// STORAGE INTEGRATION
// =============================================================================
// Export storage atoms for unified state management
