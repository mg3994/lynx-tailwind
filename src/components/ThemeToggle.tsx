import { useTheme } from '../hooks/useTheme';
import type { ThemeMode } from '../types/theme';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'button' | 'select' | 'segmented';
}

export function ThemeToggle({ 
  className = '', 
  showLabels = true,
  variant = 'segmented'
}: ThemeToggleProps) {
  const { mode, setMode, resolvedMode } = useTheme();

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'system', label: 'System', icon: '🖥️' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ];

  const handleThemeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const cycleTheme = () => {
    const currentIndex = themeOptions.findIndex(option => option.value === mode);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    setMode(themeOptions[nextIndex].value);
  };

  if (variant === 'button') {
    const currentOption = themeOptions.find(option => option.value === mode);
    return (
      <view
        bindtap={cycleTheme}
        className={`
          inline-flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
          bg-surface border border-theme text-theme
          hover:bg-muted focus:bg-muted transition-theme
          ${className}
        `}
      >
        <text className="text-sm">
          {currentOption?.icon}
        </text>
        {showLabels && (
          <text className="text-sm font-medium">
            {currentOption?.label}
          </text>
        )}
        <text className="text-xs text-theme-secondary ml-1">
          ({resolvedMode})
        </text>
      </view>
    );
  }

  if (variant === 'select') {
    return (
      <view className={`${className}`}>
        <view className="bg-surface border border-theme rounded-md p-2">
          {themeOptions.map((option) => (
            <view
              key={option.value}
              bindtap={() => handleThemeChange(option.value)}
              className={`
                flex items-center gap-2 p-2 rounded cursor-pointer transition-theme
                ${mode === option.value ? 'bg-primary text-white' : 'text-theme hover:bg-muted'}
              `}
            >
              <text>{option.icon} {option.label}</text>
            </view>
          ))}
        </view>
      </view>
    );
  }

  // Segmented control variant (default)
  return (
    <view 
      className={`
        inline-flex bg-surface border border-theme rounded-lg p-1 gap-1
        ${className}
      `}
    >
      {themeOptions.map((option) => (
        <view
          key={option.value}
          bindtap={() => handleThemeChange(option.value)}
          className={`
            relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer
            transition-theme
            ${mode === option.value
              ? 'bg-primary text-white shadow-sm'
              : 'text-theme hover:bg-muted'
            }
          `}
        >
          <text>{option.icon}</text>
          {showLabels && <text>{option.label}</text>}
          {mode === option.value && mode === 'system' && (
            <text className="text-xs opacity-75">
              ({resolvedMode})
            </text>
          )}
        </view>
      ))}
    </view>
  );
}