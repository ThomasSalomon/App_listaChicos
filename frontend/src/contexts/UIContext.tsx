/**
 * UIContext - Contexto para la gestión del estado de la interfaz de usuario
 * Maneja modales, confirmaciones y otros elementos de UI
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Child } from '../types';

interface UIContextType {
  // Estados de modales
  showTeamForm: boolean;
  setShowTeamForm: (show: boolean) => void;
  
  showMoveModal: boolean;
  setShowMoveModal: (show: boolean) => void;
  
  childToMove: Child | null;
  setChildToMove: (child: Child | null) => void;
  
  showDeleteTeamConfirm: boolean;
  setShowDeleteTeamConfirm: (show: boolean) => void;
  
  teamToDelete: number | null;
  setTeamToDelete: (teamId: number | null) => void;
  
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  
  // Funciones helper
  openMoveModal: (child: Child) => void;
  closeMoveModal: () => void;
  openDeleteTeamConfirm: (teamId: number) => void;
  closeDeleteTeamConfirm: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  // Estados de modales
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [childToMove, setChildToMove] = useState<Child | null>(null);
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Funciones helper
  const openMoveModal = (child: Child) => {
    setChildToMove(child);
    setShowMoveModal(true);
  };

  const closeMoveModal = () => {
    setShowMoveModal(false);
    setChildToMove(null);
  };

  const openDeleteTeamConfirm = (teamId: number) => {
    setTeamToDelete(teamId);
    setShowDeleteTeamConfirm(true);
  };

  const closeDeleteTeamConfirm = () => {
    setShowDeleteTeamConfirm(false);
    setTeamToDelete(null);
  };

  const value: UIContextType = {
    showTeamForm,
    setShowTeamForm,
    showMoveModal,
    setShowMoveModal,
    childToMove,
    setChildToMove,
    showDeleteTeamConfirm,
    setShowDeleteTeamConfirm,
    teamToDelete,
    setTeamToDelete,
    showExitConfirm,
    setShowExitConfirm,
    openMoveModal,
    closeMoveModal,
    openDeleteTeamConfirm,
    closeDeleteTeamConfirm
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
