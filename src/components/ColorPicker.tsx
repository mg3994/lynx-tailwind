import { useState, useCallback, useEffect } from '@lynx-js/react';
import { useTheme } from '../hooks/useTheme';
import { generateColorPalette, hexToHSL } from '../utils/colorUtils';

interface ColorPickerProps {
  className?: string;
  showPreview?: boolean;
  showPresets?: boolean;
  onColorChange?: (color: string) => void;
}

const PRESET_COLORS = [
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

export function ColorPicker({ 
  className = '',
  showPreview = true,
  showPresets = true,
  onColorChange
}: ColorPickerProps) {
  const { customColor, setCustomColor } = useTheme();
  const [localColor, setLocalColor] = useState(customColor);
  const [isValidColor, setIsValidColor] = useState(true);
  const [colorPalette, setColorPalette] = useState(() => generateColorPalette(customColor));

  // Validate hex color format
  const validateColor = useCallback((color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }, []);

  // Update color palette when color changes
  const updateColorPalette = useCallback((color: string) => {
    if (validateColor(color)) {
      const palette = generateColorPalette(color);
      setColorPalette(palette);
      return palette;
    }
    return null;
  }, [validateColor]);

  // Handle color input change
  const handleColorChange = useCallback((newColor: string) => {
    setLocalColor(newColor);
    const isValid = validateColor(newColor);
    setIsValidColor(isValid);

    if (isValid) {
      updateColorPalette(newColor);
      setCustomColor(newColor);
      onColorChange?.(newColor);
    }
  }, [validateColor, updateColorPalette, setCustomColor, onColorChange]);

  // Handle preset color selection
  const handlePresetSelect = useCallback((color: string) => {
    handleColorChange(color);
  }, [handleColorChange]);

  // Sync with theme context changes
  useEffect(() => {
    if (customColor !== localColor && validateColor(customColor)) {
      setLocalColor(customColor);
      updateColorPalette(customColor);
    }
  }, [customColor, localColor, validateColor, updateColorPalette]);

  // CSS properties are now updated automatically by ThemeProvider

  return (
    <view className={`space-y-4 ${className}`}>
      {/* Color Input */}
      <view className="space-y-2">
        <text className="block text-sm font-medium text-theme">
          Custom Color
        </text>
        <view className="flex gap-2 items-center">
          <view className="relative">
            <input
              type="text"
              bindinput={(e: any) => handleColorChange(e.detail.value)}
              className={`
                w-12 h-10 rounded-md border-2 text-center font-mono text-xs
                ${isValidColor ? 'border-theme' : 'border-destructive'}
                transition-theme
              `}
              placeholder="#3b82f6"
            />
          </view>
          <input
            type="text"
            bindinput={(e: any) => handleColorChange(e.detail.value)}
            placeholder="#3b82f6"
            className={`
              input-theme flex-1 font-mono text-sm
              ${!isValidColor ? 'border-destructive' : ''}
            `}
          />
        </view>
        {!isValidColor && (
          <text className="text-sm text-destructive">
            Please enter a valid hex color (e.g., #3b82f6)
          </text>
        )}
      </view>

      {/* Color Preview */}
      {showPreview && isValidColor && (
        <view className="space-y-2">
          <text className="text-sm font-medium text-theme">Color Preview</text>
          <view className="grid grid-cols-5 gap-2">
            <view className="space-y-1">
              <view 
                className="w-full h-8 rounded border border-theme"
                style={{ backgroundColor: colorPalette.primary }}
              />
              <text className="text-xs text-theme-secondary text-center">Primary</text>
            </view>
            <view className="space-y-1">
              <view 
                className="w-full h-8 rounded border border-theme"
                style={{ backgroundColor: colorPalette.primaryLight }}
              />
              <text className="text-xs text-theme-secondary text-center">Light</text>
            </view>
            <view className="space-y-1">
              <view 
                className="w-full h-8 rounded border border-theme"
                style={{ backgroundColor: colorPalette.primaryDark }}
              />
              <text className="text-xs text-theme-secondary text-center">Dark</text>
            </view>
            <view className="space-y-1">
              <view 
                className="w-full h-8 rounded border border-theme"
                style={{ backgroundColor: colorPalette.secondary }}
              />
              <text className="text-xs text-theme-secondary text-center">Secondary</text>
            </view>
            <view className="space-y-1">
              <view 
                className="w-full h-8 rounded border border-theme"
                style={{ backgroundColor: colorPalette.accent }}
              />
              <text className="text-xs text-theme-secondary text-center">Accent</text>
            </view>
          </view>
        </view>
      )}

      {/* Preset Colors */}
      {showPresets && (
        <view className="space-y-2">
          <text className="text-sm font-medium text-theme">Preset Colors</text>
          <view className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((color) => (
              <view
                key={color}
                bindtap={() => handlePresetSelect(color)}
                className={`
                  w-full h-8 rounded border-2 transition-theme cursor-pointer
                  hover:scale-105 focus:scale-105
                  ${localColor.toLowerCase() === color.toLowerCase() 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-theme hover:border-primary/50'
                  }
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </view>
        </view>
      )}

      {/* Reset Button */}
      <view
        bindtap={() => handleColorChange('#3b82f6')}
        className="btn-secondary text-sm cursor-pointer inline-block px-4 py-2 rounded-md text-center"
      >
        <text>Reset to Default</text>
      </view>
    </view>
  );
}