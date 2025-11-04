import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadThemeFromStorage,
  saveThemeToStorage,
  clearThemeStorage,
} from '../themeStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('themeStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('loadThemeFromStorage', () => {
    it('should return default values when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadThemeFromStorage();
      
      expect(result).toEqual({
        mode: 'system',
        customColor: '#3b82f6',
        version: '1.0.0',
      });
    });

    it('should return stored values when localStorage has valid data', () => {
      const storedData = {
        mode: 'dark',
        customColor: '#ff0000',
        version: '1.0.0',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadThemeFromStorage();
      
      expect(result).toEqual(storedData);
    });

    it('should return defaults when stored data is invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadThemeFromStorage();
      
      expect(result).toEqual({
        mode: 'system',
        customColor: '#3b82f6',
        version: '1.0.0',
      });
    });

    it('should validate and correct invalid theme mode', () => {
      const storedData = {
        mode: 'invalid-mode',
        customColor: '#ff0000',
        version: '1.0.0',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadThemeFromStorage();
      
      expect(result.mode).toBe('system');
      expect(result.customColor).toBe('#ff0000');
    });

    it('should validate and correct invalid custom color', () => {
      const storedData = {
        mode: 'dark',
        customColor: 'invalid-color',
        version: '1.0.0',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadThemeFromStorage();
      
      expect(result.mode).toBe('dark');
      expect(result.customColor).toBe('#3b82f6');
    });

    it('should handle version mismatch by migrating to defaults', () => {
      const storedData = {
        mode: 'dark',
        customColor: '#ff0000',
        version: '0.9.0',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      
      const result = loadThemeFromStorage();
      
      expect(result).toEqual({
        mode: 'system',
        customColor: '#3b82f6',
        version: '1.0.0',
      });
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const result = loadThemeFromStorage();
      
      expect(result).toEqual({
        mode: 'system',
        customColor: '#3b82f6',
        version: '1.0.0',
      });
    });
  });

  describe('saveThemeToStorage', () => {
    it('should save theme data to localStorage', () => {
      const themeData = {
        mode: 'dark' as const,
        customColor: '#ff0000',
      };
      
      // Mock existing data
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        mode: 'system',
        customColor: '#3b82f6',
        version: '1.0.0',
      }));
      
      saveThemeToStorage(themeData);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lynx-theme-preferences',
        JSON.stringify({
          mode: 'dark',
          customColor: '#ff0000',
          version: '1.0.0',
        })
      );
    });

    it('should merge with existing data', () => {
      const existingData = {
        mode: 'light' as const,
        customColor: '#00ff00',
        version: '1.0.0',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));
      
      saveThemeToStorage({ mode: 'dark' });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lynx-theme-preferences',
        JSON.stringify({
          mode: 'dark',
          customColor: '#00ff00',
          version: '1.0.0',
        })
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Should not throw
      expect(() => {
        saveThemeToStorage({ mode: 'dark' });
      }).not.toThrow();
    });
  });

  describe('clearThemeStorage', () => {
    it('should remove theme data from localStorage', () => {
      clearThemeStorage();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'lynx-theme-preferences'
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Should not throw
      expect(() => {
        clearThemeStorage();
      }).not.toThrow();
    });
  });
});