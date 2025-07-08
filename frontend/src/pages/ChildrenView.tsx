/**
 * ChildrenView - Vista de gestión de niños de un equipo
 * Maneja la visualización y gestión de niños
 */

import React, { useState } from 'react';
import ChildList from '../components/ChildList';
import MoveChildModal from '../components/MoveChildModal';
import { ImportModal } from '../components';
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
        onImport={() => setShowImportModal(true)}
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
