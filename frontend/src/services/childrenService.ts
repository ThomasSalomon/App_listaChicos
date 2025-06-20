/**
 * Children Service
 * Maneja todas las operaciones relacionadas con niños
 */

import { apiClient } from './api';
import type { Child, CreateChildData, UpdateChildData, MoveChildData, MoveChildResponse } from '../types';

class ChildrenService {
  /**
   * Obtener todos los niños
   */
  async getAllChildren(): Promise<Child[]> {
    const response = await apiClient.get('/children');
    return response.data;
  }

  /**
   * Obtener un niño por ID
   */
  async getChildById(id: number): Promise<Child> {
    const response = await apiClient.get(`/children/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo niño
   */
  async createChild(childData: CreateChildData): Promise<Child & { message: string }> {
    const response = await apiClient.post('/children', childData);
    return response.data;
  }

  /**
   * Actualizar un niño existente
   */
  async updateChild(id: number, childData: UpdateChildData): Promise<Child & { message: string }> {
    const response = await apiClient.put(`/children/${id}`, childData);
    return response.data;
  }

  /**
   * Eliminar un niño
   */
  async deleteChild(id: number): Promise<{ message: string; deletedId: number }> {
    const response = await apiClient.delete(`/children/${id}`);
    return response.data;
  }

  /**
   * Mover un niño a otro equipo
   */
  async moveChildToTeam(id: number, moveData: MoveChildData): Promise<MoveChildResponse> {
    const response = await apiClient.put(`/children/${id}/move`, moveData);
    return response.data;
  }

  /**
   * Eliminar todos los niños
   */
  async deleteAllChildren(): Promise<{ message: string; deletedCount: number }> {
    const response = await apiClient.delete('/children/all');
    return response.data;
  }

  /**
   * Obtener estadísticas de niños
   */
  async getStats(): Promise<any> {
    const response = await apiClient.get('/children/stats');
    return response.data;
  }

  /**
   * Obtener niños de un equipo específico
   */
  async getChildrenByTeam(teamId: number): Promise<Child[]> {
    const response = await apiClient.get(`/teams/${teamId}/children`);
    return response.data;
  }
}

// Exportar instancia singleton
export const childrenService = new ChildrenService();
export default childrenService;
