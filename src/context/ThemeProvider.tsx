import { useState, useEffect, useCallback } from '@lynx-js/react';
import { ThemeContext } from './ThemeContext';
import { loadThemeFromStorage, saveThemeToStorage } from '../utils/themeStorage';
import { updateThemeColors, updateThemeMode, listenForSystemThemeChanges } from '../utils/cssPropertyUpdater';
import { setupAccessibilityProperties, listenForAccessibilityChanges, announceToScreenReader } from '../utils/accessibility';
import { useMemoizedThemeContext, useDebounce, performanceMonitor } from '../utils/performance';
import type { ThemeProviderProps, ThemeMode, ResolvedTheme } from '../types/theme';

export function ThemeProvider({ 
  children, 
  defaultMode = 'system',
  defaultCustomColor = '#3b82f6'
}: ThemeProviderProps) {
  // Initialize state with values from localStorage or defaults
  const [isInitialized, setIsInitialized] = useState(false);
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [customColor, setCustomColorState] = useState<string>(defaultCustomColor);
  const [resolvedMode, setResolvedMode] = useState<ResolvedTheme>('light');

  // Function to get system preference
  const getSystemPreference = useCallback((): ResolvedTheme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Function to resolve the actual theme based on mode
  const resolveTheme = useCallback((themeMode: ThemeMode): ResolvedTheme => {
    if (themeMode === 'system') {
      return getSystemPreference();
    }
    return themeMode;
  }, [getSystemPreference]);

  // Update resolved mode when mode changes
  useEffect(() => {
    const newResolvedMode = resolveTheme(mode);
    setResolvedMode(newResolvedMode);
    
    // Update CSS custom properties for theme mode
    updateThemeMode(mode, newResolvedMode);
  }, [mode, resolveTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const cleanup = listenForSystemThemeChanges((isDark) => {
      const newResolvedMode: ResolvedTheme = isDark ? 'dark' : 'light';
      setResolvedMode(newResolvedMode);
      updateThemeMode(mode, newResolvedMode);
    });

    return cleanup;
  }, [mode]);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = loadThemeFromStorage();
    setModeState(storedTheme.mode);
    setCustomColorState(storedTheme.customColor);
    
    // Setup accessibility properties
    setupAccessibilityProperties();
    
    setIsInitialized(true);
  }, []);

  // Listen for accessibility preference changes
  useEffect(() => {
    const cleanup = listenForAccessibilityChanges((preferences) => {
      // Update theme transition duration based on reduced motion preference
      if (preferences.reducedMotion) {
        console.info('Reduced motion detected, disabling theme transitions');
      }
    });

    return cleanup;
  }, []);

  // Debounced color update for performance
  const debouncedUpdateColors = useDebounce((color: string) => {
    performanceMonitor.measureThemeOperation('updateThemeColors', () => {
      updateThemeColors(color);
      performanceMonitor.trackMetrics.incrementColorChanges();
    });
  }, 100);

  // Update CSS properties when custom color changes
  useEffect(() => {
    if (customColor) {
      debouncedUpdateColors(customColor);
    }
  }, [customColor, debouncedUpdateColors]);

  // Wrapper functions that also persist to localStorage
  const setMode = useCallback((newMode: ThemeMode) => {
    const previousMode = mode;
    setModeState(newMode);
    saveThemeToStorage({ mode: newMode });
    
    // Track performance metrics
    performanceMonitor.trackMetrics.incrementModeChanges();
    
    // Announce theme change to screen readers
    if (previousMode !== newMode) {
      const modeLabels = {
        system: 'System theme (follows your device setting)',
        light: 'Light theme',
        dark: 'Dark theme'
      };
      announceToScreenReader(`Theme changed to ${modeLabels[newMode]}`);
    }
  }, [mode]);

  const setCustomColor = useCallback((newColor: string) => {
    const previousColor = customColor;
    setCustomColorState(newColor);
    saveThemeToStorage({ customColor: newColor });
    
    // Announce color change to screen readers
    if (previousColor !== newColor) {
      announceToScreenReader(`Theme color changed to ${newColor}`);
    }
  }, [customColor]);

  // Don't render until initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemoizedThemeContext(
    mode,
    resolvedMode,
    customColor,
    setMode,
    setCustomColor
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}