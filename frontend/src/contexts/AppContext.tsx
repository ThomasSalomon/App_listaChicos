/**
 * AppContext - Contexto principal de la aplicación
 * Maneja el estado global básico y la navegación entre vistas
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Team } from '../types';

interface AppState {
  currentView: 'teams' | 'children';
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

interface AppContextType {
  appState: AppState;
  setCurrentView: (view: 'teams' | 'children') => void;
  setSelectedTeam: (team: Team | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  navigateToTeam: (team: Team) => void;
  navigateToTeams: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'teams',
    selectedTeam: null,
    loading: false,
    error: null
  });

  const setCurrentView = (view: 'teams' | 'children') => {
    setAppState(prev => ({ ...prev, currentView: view }));
  };

  const setSelectedTeam = (team: Team | null) => {
    setAppState(prev => ({ ...prev, selectedTeam: team }));
  };

  const setLoading = (loading: boolean) => {
    setAppState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setAppState(prev => ({ ...prev, error }));
  };

  const navigateToTeam = (team: Team) => {
    setAppState(prev => ({
      ...prev,
      selectedTeam: team,
      currentView: 'children'
    }));
  };

  const navigateToTeams = () => {
    setAppState(prev => ({
      ...prev,
      selectedTeam: null,
      currentView: 'teams'
    }));
  };

  const value: AppContextType = {
    appState,
    setCurrentView,
    setSelectedTeam,
    setLoading,
    setError,
    navigateToTeam,
    navigateToTeams
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
