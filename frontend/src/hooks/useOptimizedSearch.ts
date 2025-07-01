import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { Child } from '../types';

/**
 * Hook optimizado para búsqueda con índices precalculados y debounce
 */
export function useOptimizedSearch(children: Child[], searchTerm: string, delay: number = 300) {
  // 1. OPTIMIZACIÓN: Debounce para evitar búsquedas excesivas
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // 2. OPTIMIZACIÓN: Crear índice de búsqueda precalculado
  const searchIndex = useMemo(() => {
    return children.map(child => ({
      id: child.id,
      searchText: `${child.nombre} ${child.apellido}`.toLowerCase(),
      original: child
    }));
  }, [children]);

  // 3. OPTIMIZACIÓN: Filtrar usando el índice precalculado
  const filteredChildren = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return children;
    }

    const lowercaseSearch = debouncedSearchTerm.toLowerCase();
    
    return searchIndex
      .filter(item => item.searchText.includes(lowercaseSearch))
      .map(item => item.original);
  }, [searchIndex, debouncedSearchTerm, children]);

  return {
    filteredChildren,
    isSearching: searchTerm !== debouncedSearchTerm,
    debouncedSearchTerm
  };
}