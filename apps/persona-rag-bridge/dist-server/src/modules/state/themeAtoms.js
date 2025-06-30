"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemThemeListenerAtom = exports.initializeThemeAtom = exports.themeManagerAtom = exports.themeAtom = void 0;
const jotai_1 = require("jotai");
// Theme atom
exports.themeAtom = (0, jotai_1.atom)('dark'); // Default to dark mode
// Theme manager
exports.themeManagerAtom = (0, jotai_1.atom)((get) => get(exports.themeAtom), (_get, set, newTheme) => {
    set(exports.themeAtom, newTheme);
    // Apply theme to document
    const root = document.documentElement;
    if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
    }
    else if (newTheme === 'light') {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
    }
    else {
        // System theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (isDark) {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }
    // Save to storage
    chrome.storage.sync.set({ theme: newTheme });
});
// Initialize theme from storage
exports.initializeThemeAtom = (0, jotai_1.atom)(null, async (_get, set) => {
    try {
        const result = await chrome.storage.sync.get({ theme: 'dark' });
        set(exports.themeManagerAtom, result.theme);
    }
    catch (error) {
        console.error('Failed to load theme from storage:', error);
        // Default to dark mode
        set(exports.themeManagerAtom, 'dark');
    }
});
// System theme listener
exports.systemThemeListenerAtom = (0, jotai_1.atom)(null, (get, set) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        const currentTheme = get(exports.themeAtom);
        if (currentTheme === 'system') {
            set(exports.themeManagerAtom, 'system');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange);
});
