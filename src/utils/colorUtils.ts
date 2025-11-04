import type { HSLColor, ColorPalette } from '../types/theme';

/**
 * Convert hex color to HSL
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @returns HSL color object
 */
export function hexToHSL(hex: string): HSLColor {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to hex color
 * @param hsl - HSL color object
 * @returns Hex color string
 */
export function hslToHex(hsl: HSLColor): string {
  const { h, s, l } = hsl;
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= hNorm && hNorm < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= hNorm && hNorm < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= hNorm && hNorm < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= hNorm && hNorm < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= hNorm && hNorm < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= hNorm && hNorm < 1) {
    r = c; g = 0; b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Generate a lighter variant of an HSL color
 * @param hsl - Base HSL color
 * @param amount - Amount to lighten (0-100)
 * @returns Lighter HSL color
 */
export function lightenColor(hsl: HSLColor, amount: number = 20): HSLColor {
  return {
    ...hsl,
    l: Math.min(100, hsl.l + amount),
  };
}

/**
 * Generate a darker variant of an HSL color
 * @param hsl - Base HSL color
 * @param amount - Amount to darken (0-100)
 * @returns Darker HSL color
 */
export function darkenColor(hsl: HSLColor, amount: number = 20): HSLColor {
  return {
    ...hsl,
    l: Math.max(0, hsl.l - amount),
  };
}

/**
 * Generate a complementary color (180 degrees on color wheel)
 * @param hsl - Base HSL color
 * @returns Complementary HSL color
 */
export function getComplementaryColor(hsl: HSLColor): HSLColor {
  return {
    ...hsl,
    h: (hsl.h + 180) % 360,
  };
}

/**
 * Generate an analogous color (30 degrees offset)
 * @param hsl - Base HSL color
 * @param offset - Degree offset (default: 30)
 * @returns Analogous HSL color
 */
export function getAnalogousColor(hsl: HSLColor, offset: number = 30): HSLColor {
  return {
    ...hsl,
    h: (hsl.h + offset) % 360,
  };
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const hsl = hexToHSL(hex);
    const rgb = hslToRgb(hsl);
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA contrast requirements
 * @param foreground - Foreground color in hex
 * @param background - Background color in hex
 * @returns True if contrast ratio >= 4.5
 */
export function meetsContrastRequirement(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Generate a complete color palette from a base color
 * @param baseColor - Base color in hex format
 * @returns Complete color palette
 */
export function generateColorPalette(baseColor: string): ColorPalette {
  const baseHSL = hexToHSL(baseColor);
  
  // Generate primary variants
  const primaryLight = lightenColor(baseHSL, 15);
  const primaryDark = darkenColor(baseHSL, 15);
  
  // Generate secondary color (analogous)
  const secondaryHSL = getAnalogousColor(baseHSL, 60);
  
  // Generate accent color (complementary with adjusted saturation)
  const accentHSL = {
    ...getComplementaryColor(baseHSL),
    s: Math.min(80, baseHSL.s + 20),
  };

  return {
    primary: hslToHex(baseHSL),
    primaryLight: hslToHex(primaryLight),
    primaryDark: hslToHex(primaryDark),
    secondary: hslToHex(secondaryHSL),
    accent: hslToHex(accentHSL),
    // These will be set by theme mode (light/dark)
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
  };
}

/**
 * Convert HSL to RGB (helper function)
 * @param hsl - HSL color object
 * @returns RGB object
 */
function hslToRgb(hsl: HSLColor): { r: number; g: number; b: number } {
  const { h, s, l } = hsl;
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= hNorm && hNorm < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= hNorm && hNorm < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= hNorm && hNorm < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= hNorm && hNorm < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= hNorm && hNorm < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= hNorm && hNorm < 1) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}