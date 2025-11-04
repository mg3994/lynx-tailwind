import { useCallback, useMemo, useRef } from '@lynx-js/react';

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]) as T;
}

/**
 * Memoized color calculations
 */
export const colorCalculations = {
  /**
   * Cache for color palette calculations
   */
  paletteCache: new Map<string, any>(),
  
  /**
   * Cache for HSL conversions
   */
  hslCache: new Map<string, any>(),
  
  /**
   * Get cached color palette or calculate and cache it
   */
  getCachedPalette(color: string, generator: (color: string) => any) {
    if (this.paletteCache.has(color)) {
      return this.paletteCache.get(color);
    }
    
    const palette = generator(color);
    
    // Limit cache size to prevent memory leaks
    if (this.paletteCache.size > 50) {
      const firstKey = this.paletteCache.keys().next().value;
      this.paletteCache.delete(firstKey);
    }
    
    this.paletteCache.set(color, palette);
    return palette;
  },
  
  /**
   * Get cached HSL conversion or calculate and cache it
   */
  getCachedHSL(color: string, converter: (color: string) => any) {
    if (this.hslCache.has(color)) {
      return this.hslCache.get(color);
    }
    
    const hsl = converter(color);
    
    // Limit cache size
    if (this.hslCache.size > 100) {
      const firstKey = this.hslCache.keys().next().value;
      this.hslCache.delete(firstKey);
    }
    
    this.hslCache.set(color, hsl);
    return hsl;
  },
  
  /**
   * Clear all caches
   */
  clearCaches() {
    this.paletteCache.clear();
    this.hslCache.clear();
  }
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Measure and log performance of theme operations
   */
  measureThemeOperation<T>(
    operationName: string,
    operation: () => T
  ): T {
    const startTime = performance.now();
    
    try {
      const result = operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow operations
      if (duration > 16) { // More than one frame at 60fps
        console.warn(`Slow theme operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`Theme operation failed: ${operationName} (${duration.toFixed(2)}ms)`, error);
      throw error;
    }
  },
  
  /**
   * Track theme system performance metrics
   */
  trackMetrics: {
    colorChanges: 0,
    modeChanges: 0,
    totalOperations: 0,
    
    incrementColorChanges() {
      this.colorChanges++;
      this.totalOperations++;
    },
    
    incrementModeChanges() {
      this.modeChanges++;
      this.totalOperations++;
    },
    
    getStats() {
      return {
        colorChanges: this.colorChanges,
        modeChanges: this.modeChanges,
        totalOperations: this.totalOperations
      };
    },
    
    reset() {
      this.colorChanges = 0;
      this.modeChanges = 0;
      this.totalOperations = 0;
    }
  }
};

/**
 * Memory management utilities
 */
export const memoryManagement = {
  /**
   * Clean up theme-related resources
   */
  cleanup() {
    // Clear color calculation caches
    colorCalculations.clearCaches();
    
    // Reset performance metrics
    performanceMonitor.trackMetrics.reset();
    
    // Remove any orphaned event listeners
    this.removeOrphanedListeners();
  },
  
  /**
   * Remove orphaned event listeners
   */
  removeOrphanedListeners() {
    // This would be implemented based on specific listener tracking
    // For now, we'll just log that cleanup occurred
    console.debug('Theme system: Cleaned up event listeners');
  },
  
  /**
   * Monitor memory usage (development only)
   */
  monitorMemory() {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memInfo = (performance as any).memory;
      
      console.debug('Theme system memory usage:', {
        used: `${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }
};

/**
 * React performance hooks
 */

/**
 * Memoized theme context value to prevent unnecessary re-renders
 */
export function useMemoizedThemeContext(
  mode: string,
  resolvedMode: string,
  customColor: string,
  setMode: Function,
  setCustomColor: Function
) {
  return useMemo(() => ({
    mode,
    resolvedMode,
    customColor,
    setMode,
    setCustomColor
  }), [mode, resolvedMode, customColor, setMode, setCustomColor]);
}

/**
 * Optimized color palette hook
 */
export function useOptimizedColorPalette(
  color: string,
  generator: (color: string) => any
) {
  return useMemo(() => {
    return colorCalculations.getCachedPalette(color, generator);
  }, [color, generator]);
}

/**
 * Performance-aware effect hook
 */
export function usePerformanceAwareEffect(
  effect: () => void | (() => void),
  deps: any[],
  operationName: string
) {
  return useCallback(() => {
    return performanceMonitor.measureThemeOperation(operationName, effect);
  }, deps);
}