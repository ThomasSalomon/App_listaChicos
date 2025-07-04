/**
 * useHighlight - Hook para manejar el efecto de destacado visual
 * Centraliza la lógica de highlighting y scroll automático
 */

import { useState, useCallback, useEffect } from 'react';

export const useHighlight = () => {
  const [highlightedChildId, setHighlightedChildId] = useState<number | null>(null);

  /**
   * Destacar un niño con scroll automático
   */
  const highlightChild = useCallback((childId: number, duration: number = 3000) => {
    setHighlightedChildId(childId);
    
    // Limpiar el destacado después del tiempo especificado
    setTimeout(() => {
      setHighlightedChildId(null);
    }, duration);
  }, []);

  /**
   * Destacar después de crear un niño
   */
  const highlightAfterCreate = useCallback((childId: number) => {
    highlightChild(childId, 3000);
  }, [highlightChild]);

  /**
   * Destacar después de editar un niño
   */
  const highlightAfterUpdate = useCallback((childId: number) => {
    highlightChild(childId, 3000);
  }, [highlightChild]);

  /**
   * Destacar después de mover un niño
   */
  const highlightAfterMove = useCallback((childId: number) => {
    highlightChild(childId, 4000);
  }, [highlightChild]);

  /**
   * Destacar desde búsqueda global
   */
  const highlightFromSearch = useCallback((childId: number) => {
    highlightChild(childId, 5000);
  }, [highlightChild]);

  // Escuchar eventos personalizados para highlighting
  useEffect(() => {
    const handleHighlightEvent = (event: CustomEvent) => {
      const { childId, duration } = event.detail;
      highlightChild(childId, duration);
    };

    window.addEventListener('highlightChild', handleHighlightEvent as EventListener);
    
    return () => {
      window.removeEventListener('highlightChild', handleHighlightEvent as EventListener);
    };
  }, [highlightChild]);

  return {
    highlightedChildId,
    highlightChild,
    highlightAfterCreate,
    highlightAfterUpdate,
    highlightAfterMove,
    highlightFromSearch
  };
};
