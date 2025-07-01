/**
 * TeamsContext - Contexto para la gestión de equipos
 * Maneja el estado y operaciones CRUD de equipos
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Team, CreateTeamData } from '../types';
import { teamsService } from '../services/teamsService';
import { useApp } from './AppContext';

interface TeamsContextType {
  teams: Team[];
  loadTeams: () => Promise<void>;
  createTeam: (teamData: CreateTeamData) => Promise<void>;
  deleteTeam: (teamId: number) => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};

interface TeamsProviderProps {
  children: ReactNode;
}

export const TeamsProvider: React.FC<TeamsProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { setLoading, setError, appState } = useApp();

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await teamsService.getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setError('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: CreateTeamData) => {
    try {
      setLoading(true);
      await teamsService.createTeam(teamData);
      await loadTeams(); // Recargar equipos
    } catch (error) {
      console.error('Error al crear equipo:', error);
      setError('Error al crear el equipo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: number) => {
    try {
      setLoading(true);
      await teamsService.deleteTeam(teamId);
      
      // Si eliminamos el equipo seleccionado, volver a la vista de equipos
      if (appState.selectedTeam?.id === teamId) {
        // Esta lógica se manejará en el componente que use este hook
      }
      
      await loadTeams(); // Recargar equipos
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      setError('Error al eliminar el equipo. Puede que tenga niños asignados.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cargar equipos al montar el componente
  useEffect(() => {
    loadTeams();
  }, []);

  const value: TeamsContextType = {
    teams,
    loadTeams,
    createTeam,
    deleteTeam
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
};
