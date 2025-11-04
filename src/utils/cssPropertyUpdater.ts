import { generateColorPalette, hexToHSL } from './colorUtils';
import type { ThemeMode, ResolvedTheme } from '../types/theme';

// Debounce utility for performance optimization
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

/**
 * Update CSS custom properties for theme colors
 * @param customColor - The primary color in hex format
 */
export function updateThemeColors(customColor: string): void {
  if (typeof document === 'undefined') return;

  try {
    const palette = generateColorPalette(customColor);
    const root = document.documentElement;

    // Convert colors to HSL for CSS custom properties
    const primaryHSL = hexToHSL(customColor);
    const primaryLightHSL = hexToHSL(palette.primaryLight);
    const primaryDarkHSL = hexToHSL(palette.primaryDark);
    const secondaryHSL = hexToHSL(palette.secondary);
    const accentHSL = hexToHSL(palette.accent);

    // Update CSS custom properties
    root.style.setProperty('--primary-hsl', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    root.style.setProperty('--primary-light-hsl', `${primaryLightHSL.h} ${primaryLightHSL.s}% ${primaryLightHSL.l}%`);
    root.style.setProperty('--primary-dark-hsl', `${primaryDarkHSL.h} ${primaryDarkHSL.s}% ${primaryDarkHSL.l}%`);
    root.style.setProperty('--secondary-hsl', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    root.style.setProperty('--accent-hsl', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);

    // Dispatch custom event for theme color change
    const event = new CustomEvent('themeColorChange', {
      detail: { customColor, palette }
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error updating theme colors:', error);
  }
}

/**
 * Update CSS custom properties for theme mode
 * @param mode - The theme mode (system, light, dark)
 * @param resolvedMode - The resolved theme mode (light, dark)
 */
export function updateThemeMode(mode: ThemeMode, resolvedMode: ResolvedTheme): void {
  if (typeof document === 'undefined') return;

  try {
    const root = document.documentElement;
    
    // Set data attribute for theme mode
    root.setAttribute('data-theme', resolvedMode);
    root.setAttribute('data-theme-mode', mode);

    // Dispatch custom event for theme mode change
    const event = new CustomEvent('themeModeChange', {
      detail: { mode, resolvedMode }
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error updating theme mode:', error);
  }
}

/**
 * Debounced version of updateThemeColors for performance optimization
 */
export const debouncedUpdateThemeColors = debounce(updateThemeColors, 100);

/**
 * Initialize theme system with default values
 * @param customColor - Initial custom color
 * @param mode - Initial theme mode
 * @param resolvedMode - Initial resolved theme mode
 */
export function initializeTheme(
  customColor: string,
  mode: ThemeMode,
  resolvedMode: ResolvedTheme
): void {
  updateThemeColors(customColor);
  updateThemeMode(mode, resolvedMode);
}

/**
 * Get current theme values from CSS custom properties
 * @returns Object containing current theme values
 */
export function getCurrentThemeValues(): {
  primaryHSL: string;
  mode: string;
  resolvedMode: string;
} {
  if (typeof document === 'undefined') {
    return {
      primaryHSL: '220 100% 50%',
      mode: 'system',
      resolvedMode: 'light'
    };
  }

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  return {
    primaryHSL: computedStyle.getPropertyValue('--primary-hsl').trim() || '220 100% 50%',
    mode: root.getAttribute('data-theme-mode') || 'system',
    resolvedMode: root.getAttribute('data-theme') || 'light'
  };
}

/**
 * Reset theme to default values
 */
export function resetTheme(): void {
  const defaultColor = '#3b82f6';
  const defaultMode: ThemeMode = 'system';
  const defaultResolvedMode: ResolvedTheme = 'light';
  
  updateThemeColors(defaultColor);
  updateThemeMode(defaultMode, defaultResolvedMode);
}

/**
 * Listen for system theme changes and update accordingly
 * @param callback - Function to call when system theme changes
 * @returns Cleanup function to remove the listener
 */
export function listenForSystemThemeChanges(
  callback: (isDark: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handleChange);
  
  // Call immediately with current value
  callback(mediaQuery.matches);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}