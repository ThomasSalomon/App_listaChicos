/**
 * useTeamOperations - Hook para operaciones específicas de equipos
 * Combina la lógica de equipos con UI y navegación
 */

import { useTeams } from '../contexts/TeamsContext';
import { useUI } from '../contexts/UIContext';
import { useApp } from '../contexts/AppContext';
import type { CreateTeamData } from '../types';

export const useTeamOperations = () => {
  const { teams, createTeam, deleteTeam } = useTeams();
  const { 
    showTeamForm, 
    setShowTeamForm,
    openDeleteTeamConfirm,
    closeDeleteTeamConfirm,
    teamToDelete 
  } = useUI();
  const { navigateToTeams } = useApp();

  const handleCreateTeam = async (teamData: CreateTeamData) => {
    try {
      await createTeam(teamData);
      setShowTeamForm(false);
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en handleCreateTeam:', error);
    }
  };

  const handleDeleteTeam = (teamId: number) => {
    openDeleteTeamConfirm(teamId);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      await deleteTeam(teamToDelete);
      
      // Si eliminamos el equipo seleccionado, volver a la vista de equipos
      navigateToTeams();
      
      closeDeleteTeamConfirm();
    } catch (error) {
      // El error ya se maneja en el contexto
      closeDeleteTeamConfirm();
    }
  };

  return {
    teams,
    showTeamForm,
    setShowTeamForm,
    handleCreateTeam,
    handleDeleteTeam,
    confirmDeleteTeam
  };
};
