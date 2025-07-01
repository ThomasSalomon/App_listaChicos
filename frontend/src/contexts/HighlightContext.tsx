/**
 * HighlightContext - Contexto para manejar el destacado de niños
 * Centraliza la lógica de highlighting sin usar eventos
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface HighlightContextType {
  highlightedChildId: number | null;
  highlightChild: (childId: number, duration?: number) => void;
  clearHighlight: () => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export const useHighlight = () => {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
};

interface HighlightProviderProps {
  children: ReactNode;
}

export const HighlightProvider: React.FC<HighlightProviderProps> = ({ children }) => {
  const [highlightedChildId, setHighlightedChildId] = useState<number | null>(null);

  const highlightChild = (childId: number, duration: number = 3000) => {
    setHighlightedChildId(childId);
    
    // Limpiar el destacado después del tiempo especificado
    setTimeout(() => {
      setHighlightedChildId(null);
    }, duration);
  };

  const clearHighlight = () => {
    setHighlightedChildId(null);
  };

  const value: HighlightContextType = {
    highlightedChildId,
    highlightChild,
    clearHighlight
  };

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
};
