// Theme system TypeScript interfaces

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  customColor: string;
  colorPalette: ColorPalette;
  preferences: {
    animationDuration: number;
    persistTheme: boolean;
  };
}

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: ResolvedTheme;
  customColor: string;
  setMode: (mode: ThemeMode) => void;
  setCustomColor: (color: string) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultCustomColor?: string;
}

export interface UseThemeReturn extends ThemeContextType {
  toggleMode: () => void;
}

// HSL color representation for color manipulation
export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

// Theme storage interface for localStorage
export interface ThemeStorage {
  mode: ThemeMode;
  customColor: string;
  version: string; // For future migration compatibility
}