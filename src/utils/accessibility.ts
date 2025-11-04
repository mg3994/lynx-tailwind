/**
 * Accessibility utilities for the theme system
 */

/**
 * Check if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 * @returns boolean indicating if high contrast is preferred
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get user's preferred color scheme
 * @returns 'light' | 'dark' | 'no-preference'
 */
export function getPreferredColorScheme(): 'light' | 'dark' | 'no-preference' {
  if (typeof window === 'undefined') return 'no-preference';
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return 'no-preference';
}

/**
 * Set up accessibility-aware CSS custom properties
 */
export function setupAccessibilityProperties(): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set reduced motion preference
  if (prefersReducedMotion()) {
    root.style.setProperty('--theme-transition-duration', '0ms');
    root.setAttribute('data-reduced-motion', 'true');
  } else {
    root.style.setProperty('--theme-transition-duration', '300ms');
    root.setAttribute('data-reduced-motion', 'false');
  }
  
  // Set high contrast preference
  if (prefersHighContrast()) {
    root.setAttribute('data-high-contrast', 'true');
  } else {
    root.setAttribute('data-high-contrast', 'false');
  }
}

/**
 * Listen for accessibility preference changes
 * @param callback Function to call when preferences change
 * @returns Cleanup function
 */
export function listenForAccessibilityChanges(
  callback: (preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    colorScheme: 'light' | 'dark' | 'no-preference';
  }) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');

  const handleChange = () => {
    const preferences = {
      reducedMotion: reducedMotionQuery.matches,
      highContrast: highContrastQuery.matches,
      colorScheme: darkSchemeQuery.matches 
        ? 'dark' as const
        : lightSchemeQuery.matches 
        ? 'light' as const 
        : 'no-preference' as const
    };
    
    setupAccessibilityProperties();
    callback(preferences);
  };

  // Add listeners
  reducedMotionQuery.addEventListener('change', handleChange);
  highContrastQuery.addEventListener('change', handleChange);
  darkSchemeQuery.addEventListener('change', handleChange);
  lightSchemeQuery.addEventListener('change', handleChange);

  // Call immediately with current values
  handleChange();

  // Return cleanup function
  return () => {
    reducedMotionQuery.removeEventListener('change', handleChange);
    highContrastQuery.removeEventListener('change', handleChange);
    darkSchemeQuery.removeEventListener('change', handleChange);
    lightSchemeQuery.removeEventListener('change', handleChange);
  };
}

/**
 * Announce theme changes to screen readers
 * @param message Message to announce
 */
export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return;
  
  // Create or get existing live region
  let liveRegion = document.getElementById('theme-announcements');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'theme-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  
  // Clear and set new message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: Element): Element[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'a[href]',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  /**
   * Trap focus within a container (for modals, panels, etc.)
   */
  trapFocus(container: Element): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Restore focus to a previously focused element
   */
  restoreFocus(element: HTMLElement | null): void {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation for a group of elements
   */
  handleArrowKeys(
    elements: Element[],
    currentIndex: number,
    key: string
  ): number {
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = elements.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex) {
      (elements[newIndex] as HTMLElement)?.focus();
    }
    
    return newIndex;
  }
};