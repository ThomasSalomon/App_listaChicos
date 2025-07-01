/**
 * useChildOperations - Hook para operaciones específicas de niños
 * Combina la lógica de niños con UI y highlighting
 */

import { useChildren } from '../contexts/ChildrenContext';
import { useUI } from '../contexts/UIContext';
import { useHighlight } from '../contexts/HighlightContext';
import type { CreateChildData, UpdateChildData, Child } from '../types';

export const useChildOperations = () => {
  const { 
    children, 
    createChild, 
    updateChild, 
    deleteChild, 
    moveChild, 
    clearAllChildren 
  } = useChildren();
  
  const { 
    showMoveModal,
    childToMove,
    openMoveModal,
    closeMoveModal
  } = useUI();
  
  const { 
    highlightChild 
  } = useHighlight();

  const handleAddChild = async (childData: CreateChildData) => {
    try {
      const newChild = await createChild(childData);
      
      // Destacar el niño recién agregado
      highlightChild(newChild.id, 3000); // 3 segundos
      
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en handleAddChild:', error);
    }
  };

  const handleUpdateChild = async (id: number, childData: UpdateChildData) => {
    try {
      await updateChild(id, childData);
      
      // Destacar el niño editado
      highlightChild(id, 3000); // 3 segundos
      
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en handleUpdateChild:', error);
    }
  };

  const handleDeleteChild = async (childId: number) => {
    try {
      await deleteChild(childId);
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en handleDeleteChild:', error);
    }
  };

  const handleMoveChild = (child: Child) => {
    openMoveModal(child);
  };

  const confirmMoveChild = async (childId: number, newTeamId: number) => {
    try {
      await moveChild(childId, newTeamId);
      
      // Destacar el niño si fue movido AL equipo actual
      // Esta lógica se manejará en el contexto
      highlightChild(childId, 4000); // 4 segundos para movimientos
      
      closeMoveModal();
    } catch (error) {
      // El error ya se maneja en el contexto
      closeMoveModal();
    }
  };

  const handleClearAllChildren = async () => {
    try {
      await clearAllChildren();
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en handleClearAllChildren:', error);
    }
  };

  return {
    children,
    showMoveModal,
    childToMove,
    handleAddChild,
    handleUpdateChild,
    handleDeleteChild,
    handleMoveChild,
    confirmMoveChild,
    handleClearAllChildren,
    closeMoveModal
  };
};
