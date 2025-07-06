/**
 * ChildrenView - Vista de gestión de niños de un equipo
 * Maneja la visualización y gestión de niños
 */

import React, { useState } from 'react';
import ChildList from '../components/ChildList';
import MoveChildModal from '../components/MoveChildModal';
import { ImportModal, ExportMenu } from '../components';
import { useChildOperations } from '../hooks/useChildOperations';
import { useHighlight } from '../contexts/HighlightContext';
import { useApp } from '../contexts/AppContext';
import { useTeams } from '../contexts/TeamsContext';
import { useChildren } from '../contexts/ChildrenContext';

const ChildrenView: React.FC = () => {
  const { appState, navigateToTeams } = useApp();
  const { teams } = useTeams();
  const { loadChildren } = useChildren();
  const { highlightedChildId } = useHighlight();
  const [showImportModal, setShowImportModal] = useState(false);
  
  const {
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
  } = useChildOperations();

  const handleImportSuccess = () => {
    loadChildren();
    setShowImportModal(false);
  };

  if (!appState.selectedTeam) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Barra de herramientas */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={navigateToTeams}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <span>←</span>
              <span>Volver a equipos</span>
            </button>
            <div className="text-sm text-gray-500">|</div>
            <h1 className="text-lg font-semibold text-gray-900">
              {appState.selectedTeam.nombre}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <span>📥</span>
              <span>Importar</span>
            </button>
            
            <ExportMenu type="children" />
          </div>
        </div>
      </div>

      <ChildList
        team={appState.selectedTeam}
        children={children}
        highlightedChildId={highlightedChildId}
        onBack={navigateToTeams}
        onAddChild={handleAddChild}
        onUpdateChild={handleUpdateChild}
        onDeleteChild={handleDeleteChild}
        onMoveChild={handleMoveChild}
        onClearAll={handleClearAllChildren}
      />

      <MoveChildModal
        child={childToMove}
        teams={teams}
        currentTeamId={appState.selectedTeam.id}
        isVisible={showMoveModal}
        onMove={confirmMoveChild}
        onCancel={closeMoveModal}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        type="children"
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default ChildrenView;
