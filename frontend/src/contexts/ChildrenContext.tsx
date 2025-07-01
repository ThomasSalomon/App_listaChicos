/**
 * ChildrenContext - Contexto para la gestión de niños
 * Maneja el estado y operaciones CRUD de niños
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Child, CreateChildData, UpdateChildData } from '../types';
import { childrenService } from '../services/childrenService';
import { useApp } from './AppContext';

interface ChildrenContextType {
  children: Child[];
  allChildren: Child[];
  loadChildren: () => Promise<void>;
  loadAllChildren: () => Promise<void>;
  createChild: (childData: CreateChildData) => Promise<Child>;
  updateChild: (id: number, childData: UpdateChildData) => Promise<void>;
  deleteChild: (childId: number) => Promise<void>;
  moveChild: (childId: number, newTeamId: number) => Promise<void>;
  clearAllChildren: () => Promise<void>;
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined);

export const useChildren = () => {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
};

interface ChildrenProviderProps {
  children: ReactNode;
}

export const ChildrenProvider: React.FC<ChildrenProviderProps> = ({ children }) => {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [allChildren, setAllChildren] = useState<Child[]>([]);
  const { appState, setLoading, setError } = useApp();

  const loadChildren = async () => {
    try {
      setLoading(true);
      const allChildrenData = await childrenService.getAllChildren();
      
      // Filtrar niños del equipo seleccionado
      const teamChildren = allChildrenData.filter(child => 
        child.team_id === appState.selectedTeam?.id
      );
      
      setChildrenList(teamChildren);
    } catch (error) {
      console.error('Error al cargar niños:', error);
      setError('Error al cargar los niños');
    } finally {
      setLoading(false);
    }
  };

  const loadAllChildren = async () => {
    try {
      const allChildrenData = await childrenService.getAllChildren();
      setAllChildren(allChildrenData);
    } catch (error) {
      console.error('Error al cargar todos los niños:', error);
    }
  };

  const createChild = async (childData: CreateChildData): Promise<Child> => {
    try {
      setLoading(true);
      const newChild = await childrenService.createChild(childData);
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => [...prevAll, newChild]);
      if (newChild.team_id === appState.selectedTeam?.id) {
        setChildrenList(prev => [...prev, newChild]);
      }
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
      return newChild;
    } catch (error) {
      console.error('Error al agregar niño:', error);
      setError('Error al agregar el niño');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateChild = async (id: number, childData: UpdateChildData) => {
    try {
      setLoading(true);
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.map(child => 
        child.id === id ? { ...child, ...childData } : child
      ));
      setChildrenList(prev => prev.map(child => 
        child.id === id ? { ...child, ...childData } : child
      ));
      
      await childrenService.updateChild(id, childData);
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
    } catch (error) {
      console.error('Error al actualizar niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
      setError('Error al actualizar el niño');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteChild = async (childId: number) => {
    try {
      setLoading(true);
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.filter(child => child.id !== childId));
      setChildrenList(prev => prev.filter(child => child.id !== childId));
      
      await childrenService.deleteChild(childId);
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
    } catch (error) {
      console.error('Error al eliminar niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
      setError('Error al eliminar el niño');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const moveChild = async (childId: number, newTeamId: number) => {
    try {
      setLoading(true);
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.map(child => 
        child.id === childId ? { ...child, team_id: newTeamId } : child
      ));
      
      await childrenService.moveChildToTeam(childId, { new_team_id: newTeamId });
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
    } catch (error) {
      console.error('Error al mover niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
      setError('Error al mover el niño');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAllChildren = async () => {
    if (!appState.selectedTeam) return;

    try {
      setLoading(true);
      // Eliminar todos los niños del equipo actual
      const deletePromises = childrenList.map(child => 
        childrenService.deleteChild(child.id)
      );
      await Promise.all(deletePromises);
      
      await loadChildren();
      await loadAllChildren();
    } catch (error) {
      console.error('Error al limpiar lista:', error);
      setError('Error al limpiar la lista');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los niños al montar el componente
  useEffect(() => {
    loadAllChildren();
  }, []);

  // Cargar niños del equipo cuando se selecciona un equipo
  useEffect(() => {
    if (appState.selectedTeam) {
      loadChildren();
    }
  }, [appState.selectedTeam]);

  const value: ChildrenContextType = {
    children: childrenList,
    allChildren,
    loadChildren,
    loadAllChildren,
    createChild,
    updateChild,
    deleteChild,
    moveChild,
    clearAllChildren
  };

  return (
    <ChildrenContext.Provider value={value}>
      {children}
    </ChildrenContext.Provider>
  );
};
