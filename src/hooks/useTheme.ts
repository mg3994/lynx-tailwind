import { useContext, useCallback } from '@lynx-js/react';
import { ThemeContext } from '../context/ThemeContext';
import type { UseThemeReturn, ThemeMode } from '../types/theme';

/**
 * Custom hook for accessing and manipulating theme state
 * 
 * @returns {UseThemeReturn} Theme state and control functions
 * @throws {Error} When used outside of ThemeProvider
 */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);

  // Ensure hook is used within ThemeProvider
  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure your component is wrapped with <ThemeProvider>.'
    );
  }

  const { mode, resolvedMode, customColor, setMode, setCustomColor } = context;

  /**
   * Toggle between light and dark modes
   * If currently in system mode, switches to light
   * If in light mode, switches to dark
   * If in dark mode, switches back to system
   */
  const toggleMode = useCallback(() => {
    const modeSequence: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = modeSequence.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modeSequence.length;
    setMode(modeSequence[nextIndex]);
  }, [mode, setMode]);

  return {
    mode,
    resolvedMode,
    customColor,
    setMode,
    setCustomColor,
    toggleMode,
  };
}