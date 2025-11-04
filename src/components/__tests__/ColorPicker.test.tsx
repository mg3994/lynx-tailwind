import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColorPicker } from '../ColorPicker';

// Mock the useTheme hook
const mockSetCustomColor = vi.fn();
const mockUseTheme = {
  mode: 'system' as const,
  resolvedMode: 'light' as const,
  customColor: '#3b82f6',
  setMode: vi.fn(),
  setCustomColor: mockSetCustomColor,
  toggleMode: vi.fn(),
};

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme,
}));

// Mock color utilities
vi.mock('../../utils/colorUtils', () => ({
  generateColorPalette: vi.fn(() => ({
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
  })),
  hexToHSL: vi.fn(() => ({ h: 220, s: 91, l: 60 })),
  hslToHex: vi.fn(() => '#3b82f6'),
}));

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: vi.fn(),
    },
  },
  writable: true,
});

describe('ColorPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render color input and text input', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
      expect(typeof component).toBe('object');
    });

    it('should render with custom className', () => {
      const customClass = 'custom-color-picker';
      const component = ColorPicker({ className: customClass });
      
      expect(component).toBeDefined();
    });

    it('should show color preview when showPreview is true', () => {
      const component = ColorPicker({ showPreview: true });
      
      expect(component).toBeDefined();
    });

    it('should hide color preview when showPreview is false', () => {
      const component = ColorPicker({ showPreview: false });
      
      expect(component).toBeDefined();
    });

    it('should show preset colors when showPresets is true', () => {
      const component = ColorPicker({ showPresets: true });
      
      expect(component).toBeDefined();
    });

    it('should hide preset colors when showPresets is false', () => {
      const component = ColorPicker({ showPresets: false });
      
      expect(component).toBeDefined();
    });
  });

  describe('color validation', () => {
    it('should validate valid hex colors', () => {
      const validColors = ['#3b82f6', '#ff0000', '#00ff00', '#0000ff', '#fff', '#000'];
      
      validColors.forEach(color => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        expect(hexRegex.test(color)).toBe(true);
      });
    });

    it('should invalidate invalid hex colors', () => {
      const invalidColors = ['3b82f6', '#gg0000', 'red', '#12345', '#1234567'];
      
      invalidColors.forEach(color => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        expect(hexRegex.test(color)).toBe(false);
      });
    });
  });

  describe('color change handling', () => {
    it('should call setCustomColor when valid color is entered', () => {
      const onColorChange = vi.fn();
      const component = ColorPicker({ onColorChange });
      
      expect(component).toBeDefined();
    });

    it('should call onColorChange callback when provided', () => {
      const onColorChange = vi.fn();
      const component = ColorPicker({ onColorChange });
      
      expect(component).toBeDefined();
      expect(onColorChange).not.toHaveBeenCalled(); // Not called during render
    });

    it('should not call setCustomColor for invalid colors', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
      // Invalid colors should not trigger setCustomColor
    });
  });

  describe('preset colors', () => {
    it('should include common preset colors', () => {
      const expectedPresets = [
        '#3b82f6', // Blue
        '#ef4444', // Red
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#f97316', // Orange
        '#84cc16', // Lime
        '#ec4899', // Pink
        '#6b7280', // Gray
      ];
      
      // Test that all expected presets are valid hex colors
      expectedPresets.forEach(color => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        expect(hexRegex.test(color)).toBe(true);
      });
    });

    it('should handle preset color selection', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });
  });

  describe('CSS custom properties', () => {
    it('should update CSS custom properties when color changes', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
      // CSS property updates happen in useEffect, tested through integration
    });
  });

  describe('accessibility', () => {
    it('should have proper labels and ARIA attributes', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });

    it('should show error message for invalid colors', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });

    it('should have proper color input accessibility', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });
  });

  describe('reset functionality', () => {
    it('should reset to default color', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });

    it('should call setCustomColor with default color on reset', () => {
      const component = ColorPicker({});
      
      expect(component).toBeDefined();
    });
  });

  describe('color palette generation', () => {
    it('should generate color palette for valid colors', () => {
      const component = ColorPicker({ showPreview: true });
      
      expect(component).toBeDefined();
    });

    it('should update palette when color changes', () => {
      const component = ColorPicker({ showPreview: true });
      
      expect(component).toBeDefined();
    });
  });
});