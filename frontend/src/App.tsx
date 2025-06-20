/**
 * App Component - Componente Principal
 * Refactorizado para usar arquitectura de componentes y servicios
 */

import { useState, useEffect } from 'react';
import './App.css';

// Importar servicios
import { teamsService } from './services/teamsService';
import { childrenService } from './services/childrenService';

// Importar tipos
import type { Team, Child, CreateTeamData, CreateChildData, UpdateChildData, AppState } from './types';

// Importar componentes
import TeamCard from './components/TeamCard';
import TeamForm from './components/TeamForm';
import ChildList from './components/ChildList';
import MoveChildModal from './components/MoveChildModal';
import ConfirmDialog from './components/ConfirmDialog';

function App() {
  // Estado principal de la aplicación
  const [appState, setAppState] = useState<AppState>({
    currentView: 'teams',
    selectedTeam: null,
    teams: [],
    children: [],
    loading: false,
    error: null
  });

  // Estados UI específicos
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [childToMove, setChildToMove] = useState<Child | null>(null);
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Cargar equipos al montar el componente
  useEffect(() => {
    loadTeams();
  }, []);

  // Cargar niños cuando se selecciona un equipo
  useEffect(() => {
    if (appState.selectedTeam) {
      loadChildren();
    }
  }, [appState.selectedTeam]);

  /**
   * Funciones de carga de datos
   */
  const loadTeams = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }));
      const teams = await teamsService.getAllTeams();
      setAppState(prev => ({ ...prev, teams, loading: false }));
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cargar los equipos' 
      }));
    }
  };

  const loadChildren = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      const children = await childrenService.getAllChildren();
      // Filtrar niños del equipo seleccionado
      const teamChildren = children.filter(child => 
        child.team_id === appState.selectedTeam?.id
      );
      setAppState(prev => ({ ...prev, children: teamChildren, loading: false }));
    } catch (error) {
      console.error('Error al cargar niños:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cargar los niños' 
      }));
    }
  };

  /**
   * Funciones de gestión de equipos
   */
  const handleSelectTeam = (team: Team) => {
    setAppState(prev => ({ 
      ...prev, 
      selectedTeam: team, 
      currentView: 'children' 
    }));
  };

  const handleCreateTeam = async (teamData: CreateTeamData) => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await teamsService.createTeam(teamData);
      await loadTeams();
      setShowTeamForm(false);
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al crear equipo:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al crear el equipo' 
      }));
    }
  };

  const handleDeleteTeam = (teamId: number) => {
    setTeamToDelete(teamId);
    setShowDeleteTeamConfirm(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await teamsService.deleteTeam(teamToDelete);
      
      // Si eliminamos el equipo seleccionado, volver a la vista de equipos
      if (appState.selectedTeam?.id === teamToDelete) {
        setAppState(prev => ({ 
          ...prev, 
          selectedTeam: null, 
          currentView: 'teams',
          children: []
        }));
      }
      
      await loadTeams();
      setShowDeleteTeamConfirm(false);
      setTeamToDelete(null);
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al eliminar el equipo. Puede que tenga niños asignados.' 
      }));
      setShowDeleteTeamConfirm(false);
      setTeamToDelete(null);
    }
  };

  /**
   * Funciones de gestión de niños
   */
  const handleAddChild = async (childData: CreateChildData) => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await childrenService.createChild(childData);
      await loadChildren();
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al agregar niño:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al agregar el niño' 
      }));
    }
  };

  const handleUpdateChild = async (id: number, childData: UpdateChildData) => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await childrenService.updateChild(id, childData);
      await loadChildren();
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al actualizar niño:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al actualizar el niño' 
      }));
    }
  };

  const handleDeleteChild = async (childId: number) => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await childrenService.deleteChild(childId);
      await loadChildren();
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al eliminar niño:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al eliminar el niño' 
      }));
    }
  };
  const confirmMoveChild = async (childId: number, newTeamId: number) => {
    try {
      setAppState(prev => ({ ...prev, loading: true }));
      await childrenService.moveChildToTeam(childId, { new_team_id: newTeamId });
      await loadChildren();
      setShowMoveModal(false);
      setChildToMove(null);
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al mover niño:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al mover el niño' 
      }));
      setShowMoveModal(false);
      setChildToMove(null);
    }
  };

  const handleClearAllChildren = async () => {
    if (!appState.selectedTeam) return;

    try {
      setAppState(prev => ({ ...prev, loading: true }));
      // Eliminar todos los niños del equipo actual
      const deletePromises = appState.children.map(child => 
        childrenService.deleteChild(child.id)
      );
      await Promise.all(deletePromises);
      await loadChildren();
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al limpiar lista:', error);
      setAppState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al limpiar la lista' 
      }));
    }
  };

  /**
   * Funciones de navegación
   */
  const handleBackToTeams = () => {
    setAppState(prev => ({ 
      ...prev, 
      selectedTeam: null, 
      currentView: 'teams',
      children: []
    }));
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };
  const confirmExit = () => {
    if ((window as any).electronAPI && (window as any).electronAPI.closeApp) {
      (window as any).electronAPI.closeApp();
    } else {
      window.close();
    }
  };

  /**
   * Render de la aplicación
   */
  if (appState.loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (appState.currentView === 'children' && appState.selectedTeam) {
    return (
      <div className="app">        <ChildList
          team={appState.selectedTeam}
          children={appState.children}
          teams={appState.teams}
          onBack={handleBackToTeams}
          onAddChild={handleAddChild}
          onUpdateChild={handleUpdateChild}
          onDeleteChild={handleDeleteChild}
          onMoveChild={(id, newTeamId) => confirmMoveChild(id, newTeamId)}
          onClearAll={handleClearAllChildren}
        />

        <MoveChildModal
          child={childToMove}
          teams={appState.teams}
          currentTeamId={appState.selectedTeam.id}
          isVisible={showMoveModal}
          onMove={confirmMoveChild}
          onCancel={() => {
            setShowMoveModal(false);
            setChildToMove(null);
          }}
        />

        {appState.error && (
          <div className="error-message">
            {appState.error}
            <button onClick={() => setAppState(prev => ({ ...prev, error: null }))}>
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="teams-view">        <header className="app-header">
          <div className="header-content">
            <h1>Lista de Chicos</h1>
            <p className="subtitle">Gestión de equipos y participantes</p>
          </div>
        </header>

        <main className="teams-container">
          {!showTeamForm && (            <button 
              className="create-team-btn-floating btn"
              onClick={() => setShowTeamForm(true)}
            >
              <i className="bi bi-plus-circle-fill me-2"></i>
              <span className="btn-text">Crear Nuevo Equipo</span>
            </button>
          )}

          <TeamForm
            onSubmit={handleCreateTeam}
            onCancel={() => setShowTeamForm(false)}
            isVisible={showTeamForm}
          />

          <div className="teams-grid">
            {appState.teams.length === 0 ? (
              <div className="empty-state">
                <h3>¡Bienvenido!</h3>
                <p>No hay equipos creados aún.</p>
                <p>Haz clic en "Crear Nuevo Equipo" para comenzar.</p>
              </div>
            ) : (
              appState.teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onSelect={handleSelectTeam}
                  onDelete={handleDeleteTeam}
                />
              ))
            )}
          </div>
        </main>        <footer className="app-footer">
          <button onClick={handleExit} className="exit-btn btn">
            <i className="bi bi-box-arrow-right me-2"></i>
            Salir de la Aplicación
          </button>
        </footer>
      </div>

      {/* Modales */}
      <ConfirmDialog
        isVisible={showDeleteTeamConfirm}
        title="Confirmar Eliminación de Equipo"
        message="¿Estás seguro de que quieres eliminar este equipo? Los niños asignados deben ser movidos primero."
        onConfirm={confirmDeleteTeam}
        onCancel={() => {
          setShowDeleteTeamConfirm(false);
          setTeamToDelete(null);
        }}
      />

      <ConfirmDialog
        isVisible={showExitConfirm}
        title="Salir de la Aplicación"
        message="¿Estás seguro de que quieres cerrar la aplicación?"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      {appState.error && (
        <div className="error-message">
          {appState.error}
          <button onClick={() => setAppState(prev => ({ ...prev, error: null }))}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
