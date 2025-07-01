/**
 * ChildrenView - Vista de gestión de niños de un equipo
 * Maneja la visualización y gestión de niños
 */

import React from 'react';
import ChildList from '../components/ChildList';
import MoveChildModal from '../components/MoveChildModal';
import { useChildOperations } from '../hooks/useChildOperations';
import { useHighlight } from '../contexts/HighlightContext';
import { useApp } from '../contexts/AppContext';
import { useTeams } from '../contexts/TeamsContext';

const ChildrenView: React.FC = () => {
  const { appState, navigateToTeams } = useApp();
  const { teams } = useTeams();
  const { highlightedChildId } = useHighlight();
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
      />

      <MoveChildModal
        child={childToMove}
        teams={teams}
        currentTeamId={appState.selectedTeam.id}
        isVisible={showMoveModal}
        onMove={confirmMoveChild}
        onCancel={closeMoveModal}
      />
    </div>
  );
};

export default ChildrenView;
