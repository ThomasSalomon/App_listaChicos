import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para virtualización de listas grandes
 * OPTIMIZACIÓN 7: Virtualización para manejar miles de elementos eficientemente
 */
export interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Elementos extra a renderizar fuera del viewport
}

export function useVirtualization<T>(
  items: T[], 
  config: VirtualizationConfig
) {
  const { itemHeight, containerHeight, overscan = 5 } = config;
  const [scrollTop, setScrollTop] = useState(0);

  // Calcular qué elementos son visibles
  const visibleRange = useMemo(() => {
    const totalItems = items.length;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems - 1, 
      startIndex + visibleCount + overscan * 2
    );

    return { startIndex, endIndex, visibleCount };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Elementos visibles actuales
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      }
    }));
  }, [items, visibleRange, itemHeight]);

  // Handler para el scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Props para el contenedor
  const containerProps = useMemo(() => ({
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      overflow: 'auto' as const,
      position: 'relative' as const,
    }
  }), [handleScroll, containerHeight]);

  // Props para el contenido interno (espaciador)
  const innerProps = useMemo(() => ({
    style: {
      height: items.length * itemHeight,
      position: 'relative' as const,
    }
  }), [items.length, itemHeight]);

  return {
    visibleItems,
    containerProps,
    innerProps,
    visibleRange,
    totalHeight: items.length * itemHeight
  };
}
