/**
 * SearchContext - Contexto para la gestión de búsqueda global
 * Maneja el estado de búsqueda y las funciones relacionadas
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Child, Team } from '../types';
import { useChildren } from './ChildrenContext';
import { useTeams } from './TeamsContext';
import { useApp } from './AppContext';
import { useHighlight } from './HighlightContext';

interface SearchContextType {
  globalSearchTerm: string;
  setGlobalSearchTerm: (term: string) => void;
  filteredGlobalChildren: Child[];
  getTeamForChild: (teamId: number) => Team | undefined;
  handleNavigateToTeam: (teamId: number, childId?: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const { allChildren } = useChildren();
  const { teams } = useTeams();
  const { navigateToTeam } = useApp();
  const { highlightChild } = useHighlight();

  /**
   * Filtrar niños para búsqueda global
   */
  const filteredGlobalChildren = allChildren.filter(child =>
    globalSearchTerm && (
      child.nombre.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      child.apellido.toLowerCase().includes(globalSearchTerm.toLowerCase())
    )
  );

  /**
   * Obtener equipo de un niño específico
   */
  const getTeamForChild = (teamId: number): Team | undefined => {
    return teams.find(team => team.id === teamId);
  };

  /**
   * Navegar directamente a un equipo desde la búsqueda global y hacer foco en un niño específico
   */
  const handleNavigateToTeam = (teamId: number, childId?: number) => {
    const team = getTeamForChild(teamId);
    if (team) {
      setGlobalSearchTerm(''); // Limpiar búsqueda
      
      // Si se especifica un niño, pre-establecer el highlight
      if (childId) {
        highlightChild(childId, 5000); // 5 segundos para búsqueda desde menú principal
      }
      
      // Navegar al equipo inmediatamente
      navigateToTeam(team);
    }
  };

  const value: SearchContextType = {
    globalSearchTerm,
    setGlobalSearchTerm,
    filteredGlobalChildren,
    getTeamForChild,
    handleNavigateToTeam
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
