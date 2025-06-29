import { atom } from 'jotai';

export type Theme = 'light' | 'dark' | 'system';

// Theme atom
export const themeAtom = atom<Theme>('dark'); // Default to dark mode

// Theme manager
export const themeManagerAtom = atom(
  (get) => get(themeAtom),
  (_get, set, newTheme: Theme) => {
    set(themeAtom, newTheme);
    
    // Apply theme to document
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Save to storage
    chrome.storage.sync.set({ theme: newTheme });
  }
);

// Initialize theme from storage
export const initializeThemeAtom = atom(
  null,
  async (_get, set) => {
    try {
      const result = await chrome.storage.sync.get({ theme: 'dark' });
      set(themeManagerAtom, result.theme);
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
      // Default to dark mode
      set(themeManagerAtom, 'dark');
    }
  }
);

// System theme listener
export const systemThemeListenerAtom = atom(
  null,
  (get, set) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = get(themeAtom);
      if (currentTheme === 'system') {
        set(themeManagerAtom, 'system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
); 