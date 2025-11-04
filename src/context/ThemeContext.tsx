import { createContext } from '@lynx-js/react';
import type { ThemeContextType } from '../types/theme';

// Default theme context values
const defaultThemeContext: ThemeContextType = {
  mode: 'system',
  resolvedMode: 'light',
  customColor: '#3b82f6', // Default blue color
  setMode: () => {
    console.warn('ThemeContext setMode called outside of ThemeProvider');
  },
  setCustomColor: () => {
    console.warn('ThemeContext setCustomColor called outside of ThemeProvider');
  },
};

// Create the theme context
export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

// Context display name for debugging
ThemeContext.displayName = 'ThemeContext';