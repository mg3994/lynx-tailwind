import { describe, it, expect, vi } from 'vitest';
import { useTheme } from '../useTheme';
import type { ThemeMode, ResolvedTheme } from '../../types/theme';

// Mock the storage utilities
vi.mock('../../utils/themeStorage', () => ({
  loadThemeFromStorage: vi.fn(() => ({
    mode: 'system',
    customColor: '#3b82f6',
    version: '1.0.0',
  })),
  saveThemeToStorage: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useTheme', () => {
  it('should throw error when used outside ThemeProvider', () => {
    expect(() => {
      useTheme();
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('should return context values when used within provider', () => {
    // Mock context value for testing
    const mockContextValue = {
      mode: 'system' as ThemeMode,
      resolvedMode: 'light' as ResolvedTheme,
      customColor: '#3b82f6',
      setMode: vi.fn(),
      setCustomColor: vi.fn(),
    };

    // Mock useContext to return our mock value
    const useContextSpy = vi.spyOn(require('@lynx-js/react'), 'useContext');
    useContextSpy.mockReturnValue(mockContextValue);

    const result = useTheme();
    
    expect(result).toMatchObject({
      mode: 'system',
      resolvedMode: 'light',
      customColor: '#3b82f6',
    });
    expect(typeof result.setMode).toBe('function');
    expect(typeof result.setCustomColor).toBe('function');
    expect(typeof result.toggleMode).toBe('function');

    useContextSpy.mockRestore();
  });

  it('should toggle mode in correct sequence', () => {
    const mockSetMode = vi.fn();
    
    // Test toggle from system
    const mockContextValueSystem = {
      mode: 'system' as ThemeMode,
      resolvedMode: 'light' as ResolvedTheme,
      customColor: '#3b82f6',
      setMode: mockSetMode,
      setCustomColor: vi.fn(),
    };

    let useContextSpy = vi.spyOn(require('@lynx-js/react'), 'useContext');
    useContextSpy.mockReturnValue(mockContextValueSystem);

    let { toggleMode } = useTheme();
    toggleMode();
    expect(mockSetMode).toHaveBeenCalledWith('light');

    useContextSpy.mockRestore();

    // Test toggle from light
    const mockContextValueLight = {
      mode: 'light' as ThemeMode,
      resolvedMode: 'light' as ResolvedTheme,
      customColor: '#3b82f6',
      setMode: mockSetMode,
      setCustomColor: vi.fn(),
    };

    useContextSpy = vi.spyOn(require('@lynx-js/react'), 'useContext');
    useContextSpy.mockReturnValue(mockContextValueLight);

    ({ toggleMode } = useTheme());
    toggleMode();
    expect(mockSetMode).toHaveBeenCalledWith('dark');

    useContextSpy.mockRestore();

    // Test toggle from dark
    const mockContextValueDark = {
      mode: 'dark' as ThemeMode,
      resolvedMode: 'dark' as ResolvedTheme,
      customColor: '#3b82f6',
      setMode: mockSetMode,
      setCustomColor: vi.fn(),
    };

    useContextSpy = vi.spyOn(require('@lynx-js/react'), 'useContext');
    useContextSpy.mockReturnValue(mockContextValueDark);

    ({ toggleMode } = useTheme());
    toggleMode();
    expect(mockSetMode).toHaveBeenCalledWith('system');

    useContextSpy.mockRestore();
  });

  it('should provide setMode and setCustomColor functions', () => {
    const mockSetMode = vi.fn();
    const mockSetCustomColor = vi.fn();
    const mockContextValue = {
      mode: 'system' as ThemeMode,
      resolvedMode: 'light' as ResolvedTheme,
      customColor: '#3b82f6',
      setMode: mockSetMode,
      setCustomColor: mockSetCustomColor,
    };

    const useContextSpy = vi.spyOn(require('@lynx-js/react'), 'useContext');
    useContextSpy.mockReturnValue(mockContextValue);

    const { setMode, setCustomColor } = useTheme();
    
    setMode('dark');
    expect(mockSetMode).toHaveBeenCalledWith('dark');

    setCustomColor('#ff0000');
    expect(mockSetCustomColor).toHaveBeenCalledWith('#ff0000');

    useContextSpy.mockRestore();
  });
});