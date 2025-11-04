import { Component, ErrorInfo, ReactNode } from '@lynx-js/react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ThemeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Theme system error:', error);
    console.error('Error info:', errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Reset theme to safe defaults
    this.resetThemeToDefaults();
  }

  private resetThemeToDefaults() {
    try {
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        
        // Reset to safe default values
        root.setAttribute('data-theme', 'light');
        root.setAttribute('data-theme-mode', 'system');
        root.style.setProperty('--primary-hsl', '220 100% 50%');
        root.style.setProperty('--theme-transition-duration', '300ms');
        
        console.info('Theme reset to safe defaults due to error');
      }
    } catch (resetError) {
      console.error('Failed to reset theme to defaults:', resetError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <view className="flex flex-col items-center justify-center p-6 bg-white text-gray-900 min-h-screen">
          <view className="max-w-md text-center space-y-4">
            <text className="text-2xl font-bold text-red-600">Theme System Error</text>
            <text className="text-gray-700">
              Something went wrong with the theme system. The theme has been reset to safe defaults.
            </text>
            <view className="space-y-2">
              <view
                bindtap={this.handleRetry}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <text>Try Again</text>
              </view>
              <view
                bindtap={() => window.location.reload()}
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md cursor-pointer hover:bg-gray-700 transition-colors ml-2"
              >
                <text>Reload Page</text>
              </view>
            </view>
            {this.state.error && (
              <view className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
                <text className="font-mono text-red-600">
                  {this.state.error.message}
                </text>
              </view>
            )}
          </view>
        </view>
      );
    }

    return this.props.children;
  }
}