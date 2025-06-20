/**
 * Teams Service
 * Maneja todas las operaciones relacionadas con equipos
 */

import { apiClient } from './api';
import type { Team, CreateTeamData, UpdateTeamData } from '../types';

class TeamsService {
  /**
   * Obtener todos los equipos
   */
  async getAllTeams(): Promise<Team[]> {
    const response = await apiClient.get('/teams');
    return response.data;
  }

  /**
   * Obtener un equipo por ID
   */
  async getTeamById(id: number): Promise<Team> {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo equipo
   */
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    const response = await apiClient.post('/teams', teamData);
    return response.data;
  }

  /**
   * Actualizar un equipo existente
   */
  async updateTeam(id: number, teamData: UpdateTeamData): Promise<Team> {
    const response = await apiClient.put(`/teams/${id}`, teamData);
    return response.data;
  }

  /**
   * Eliminar un equipo
   */
  async deleteTeam(id: number): Promise<{ message: string; deletedId: number }> {
    const response = await apiClient.delete(`/teams/${id}`);
    return response.data;
  }

  /**
   * Obtener equipos con estadísticas
   */
  async getTeamsWithStats(): Promise<Team[]> {
    const response = await apiClient.get('/teams/stats');
    return response.data;
  }
}

// Exportar instancia singleton
export const teamsService = new TeamsService();
export default teamsService;
