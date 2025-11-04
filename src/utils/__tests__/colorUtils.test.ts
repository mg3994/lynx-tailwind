import { describe, it, expect } from 'vitest';
import {
  hexToHSL,
  hslToHex,
  lightenColor,
  darkenColor,
  getComplementaryColor,
  getAnalogousColor,
  getContrastRatio,
  meetsContrastRequirement,
  generateColorPalette,
} from '../colorUtils';

describe('colorUtils', () => {
  describe('hexToHSL', () => {
    it('should convert hex to HSL correctly', () => {
      const result = hexToHSL('#3b82f6'); // Blue
      expect(result.h).toBeCloseTo(217, 0);
      expect(result.s).toBeCloseTo(91, 0);
      expect(result.l).toBeCloseTo(60, 0);
    });

    it('should handle hex without # prefix', () => {
      const result = hexToHSL('ff0000'); // Red
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should handle white color', () => {
      const result = hexToHSL('#ffffff');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(100);
    });

    it('should handle black color', () => {
      const result = hexToHSL('#000000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(0);
    });
  });

  describe('hslToHex', () => {
    it('should convert HSL to hex correctly', () => {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      expect(result.toLowerCase()).toBe('#ff0000');
    });

    it('should convert blue HSL to hex', () => {
      const result = hslToHex({ h: 240, s: 100, l: 50 });
      expect(result.toLowerCase()).toBe('#0000ff');
    });

    it('should handle grayscale colors', () => {
      const result = hslToHex({ h: 0, s: 0, l: 50 });
      expect(result.toLowerCase()).toBe('#808080');
    });
  });

  describe('lightenColor', () => {
    it('should lighten a color by default amount', () => {
      const baseColor = { h: 220, s: 91, l: 60 };
      const result = lightenColor(baseColor);
      expect(result.l).toBe(80);
      expect(result.h).toBe(baseColor.h);
      expect(result.s).toBe(baseColor.s);
    });

    it('should lighten by custom amount', () => {
      const baseColor = { h: 220, s: 91, l: 60 };
      const result = lightenColor(baseColor, 10);
      expect(result.l).toBe(70);
    });

    it('should not exceed 100% lightness', () => {
      const baseColor = { h: 220, s: 91, l: 90 };
      const result = lightenColor(baseColor, 20);
      expect(result.l).toBe(100);
    });
  });

  describe('darkenColor', () => {
    it('should darken a color by default amount', () => {
      const baseColor = { h: 220, s: 91, l: 60 };
      const result = darkenColor(baseColor);
      expect(result.l).toBe(40);
      expect(result.h).toBe(baseColor.h);
      expect(result.s).toBe(baseColor.s);
    });

    it('should darken by custom amount', () => {
      const baseColor = { h: 220, s: 91, l: 60 };
      const result = darkenColor(baseColor, 10);
      expect(result.l).toBe(50);
    });

    it('should not go below 0% lightness', () => {
      const baseColor = { h: 220, s: 91, l: 10 };
      const result = darkenColor(baseColor, 20);
      expect(result.l).toBe(0);
    });
  });

  describe('getComplementaryColor', () => {
    it('should generate complementary color', () => {
      const baseColor = { h: 0, s: 100, l: 50 }; // Red
      const result = getComplementaryColor(baseColor);
      expect(result.h).toBe(180); // Cyan
      expect(result.s).toBe(baseColor.s);
      expect(result.l).toBe(baseColor.l);
    });

    it('should wrap around 360 degrees', () => {
      const baseColor = { h: 270, s: 100, l: 50 };
      const result = getComplementaryColor(baseColor);
      expect(result.h).toBe(90);
    });
  });

  describe('getAnalogousColor', () => {
    it('should generate analogous color with default offset', () => {
      const baseColor = { h: 0, s: 100, l: 50 };
      const result = getAnalogousColor(baseColor);
      expect(result.h).toBe(30);
      expect(result.s).toBe(baseColor.s);
      expect(result.l).toBe(baseColor.l);
    });

    it('should generate analogous color with custom offset', () => {
      const baseColor = { h: 0, s: 100, l: 50 };
      const result = getAnalogousColor(baseColor, 60);
      expect(result.h).toBe(60);
    });

    it('should wrap around 360 degrees', () => {
      const baseColor = { h: 350, s: 100, l: 50 };
      const result = getAnalogousColor(baseColor, 30);
      expect(result.h).toBe(20);
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio between black and white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate contrast ratio between same colors', () => {
      const ratio = getContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBeCloseTo(1, 0);
    });

    it('should be symmetric', () => {
      const ratio1 = getContrastRatio('#3b82f6', '#ffffff');
      const ratio2 = getContrastRatio('#ffffff', '#3b82f6');
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });
  });

  describe('meetsContrastRequirement', () => {
    it('should return true for high contrast combinations', () => {
      const result = meetsContrastRequirement('#000000', '#ffffff');
      expect(result).toBe(true);
    });

    it('should return false for low contrast combinations', () => {
      const result = meetsContrastRequirement('#cccccc', '#ffffff');
      expect(result).toBe(false);
    });

    it('should validate blue on white meets requirements', () => {
      const result = meetsContrastRequirement('#0000ff', '#ffffff');
      expect(result).toBe(true);
    });
  });

  describe('generateColorPalette', () => {
    it('should generate a complete color palette', () => {
      const palette = generateColorPalette('#3b82f6');
      
      expect(palette.primary).toBe('#3b82f6');
      expect(palette.primaryLight).toBeDefined();
      expect(palette.primaryDark).toBeDefined();
      expect(palette.secondary).toBeDefined();
      expect(palette.accent).toBeDefined();
      expect(palette.background).toBeDefined();
      expect(palette.surface).toBeDefined();
      expect(palette.text).toBeDefined();
      expect(palette.textSecondary).toBeDefined();
    });

    it('should generate different colors for each palette entry', () => {
      const palette = generateColorPalette('#3b82f6');
      
      expect(palette.primary).not.toBe(palette.primaryLight);
      expect(palette.primary).not.toBe(palette.primaryDark);
      expect(palette.primary).not.toBe(palette.secondary);
      expect(palette.primary).not.toBe(palette.accent);
    });

    it('should generate valid hex colors', () => {
      const palette = generateColorPalette('#ff0000');
      const hexRegex = /^#[0-9a-fA-F]{6}$/;
      
      expect(hexRegex.test(palette.primary)).toBe(true);
      expect(hexRegex.test(palette.primaryLight)).toBe(true);
      expect(hexRegex.test(palette.primaryDark)).toBe(true);
      expect(hexRegex.test(palette.secondary)).toBe(true);
      expect(hexRegex.test(palette.accent)).toBe(true);
    });
  });
});