import type { ThemeStorage, ThemeMode } from '../types/theme';

const THEME_STORAGE_KEY = 'lynx-theme-preferences';
const THEME_STORAGE_VERSION = '1.0.0';

// Default theme storage values
const defaultThemeStorage: ThemeStorage = {
  mode: 'system',
  customColor: '#3b82f6',
  version: THEME_STORAGE_VERSION,
};

/**
 * Load theme preferences from localStorage
 * Returns default values if storage is unavailable or corrupted
 */
export function loadThemeFromStorage(): ThemeStorage {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultThemeStorage;
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) {
      return defaultThemeStorage;
    }

    const parsed = JSON.parse(stored) as ThemeStorage;
    
    // Validate the stored data structure
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Invalid theme storage data, using defaults');
      return defaultThemeStorage;
    }

    // Check version compatibility (for future migrations)
    if (parsed.version !== THEME_STORAGE_VERSION) {
      console.info('Theme storage version mismatch, migrating to current version');
      return migrateThemeStorage(parsed);
    }

    // Validate theme mode
    const validModes: ThemeMode[] = ['system', 'light', 'dark'];
    if (!validModes.includes(parsed.mode)) {
      console.warn('Invalid theme mode in storage, using default');
      parsed.mode = defaultThemeStorage.mode;
    }

    // Validate custom color (basic hex color validation)
    if (!parsed.customColor || !isValidHexColor(parsed.customColor)) {
      console.warn('Invalid custom color in storage, using default');
      parsed.customColor = defaultThemeStorage.customColor;
    }

    return parsed;
  } catch (error) {
    console.error('Error loading theme from storage:', error);
    return defaultThemeStorage;
  }
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemeToStorage(themeStorage: Partial<ThemeStorage>): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const currentStorage = loadThemeFromStorage();
    const updatedStorage: ThemeStorage = {
      ...currentStorage,
      ...themeStorage,
      version: THEME_STORAGE_VERSION,
    };

    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updatedStorage));
  } catch (error) {
    console.error('Error saving theme to storage:', error);
  }
}

/**
 * Clear theme preferences from localStorage
 */
export function clearThemeStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error clearing theme storage:', error);
  }
}

/**
 * Migrate theme storage from older versions
 * Currently just returns defaults, but can be extended for future migrations
 */
function migrateThemeStorage(oldStorage: any): ThemeStorage {
  // For now, just return defaults
  // In the future, this can handle migrations between versions
  console.info('Migrating theme storage to version', THEME_STORAGE_VERSION);
  return defaultThemeStorage;
}

/**
 * Validate if a string is a valid hex color
 */
function isValidHexColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}