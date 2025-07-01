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
  
  // Estados para búsqueda global
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [allChildren, setAllChildren] = useState<Child[]>([]);  // Cargar equipos al montar el componente
  useEffect(() => {
    loadTeams();
    loadAllChildren(); // Cargar todos los niños para búsqueda global
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
    }  };

  /**
   * Función para cargar todos los niños (para búsqueda global)
   */
  const loadAllChildren = async () => {
    try {
      const children = await childrenService.getAllChildren();
      setAllChildren(children);
    } catch (error) {
      console.error('Error al cargar todos los niños:', error);
    }
  };

  /**
   * Filtrar niños para búsqueda global
   */
  const filteredGlobalChildren = allChildren.filter(child =>
    globalSearchTerm && (
      child.nombre.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      child.apellido.toLowerCase().includes(globalSearchTerm.toLowerCase())
    )
  );
  /**
   * Obtener equipo de un niño específico
   */
  const getTeamForChild = (teamId: number): Team | undefined => {
    return appState.teams.find(team => team.id === teamId);
  };

  /**
   * Navegar directamente a un equipo desde la búsqueda global
   */
  const handleNavigateToTeam = (teamId: number) => {
    const team = getTeamForChild(teamId);
    if (team) {
      setGlobalSearchTerm(''); // Limpiar búsqueda
      handleSelectTeam(team); // Navegar al equipo
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
      const newChild = await childrenService.createChild(childData);
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => [...prevAll, newChild]);
      if (newChild.team_id === appState.selectedTeam?.id) {
        setAppState(prev => ({ 
          ...prev, 
          children: [...prev.children, newChild]
        }));
      }
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
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
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.map(child => 
        child.id === id ? { ...child, ...childData } : child
      ));
      setAppState(prev => ({ 
        ...prev, 
        children: prev.children.map(child => 
          child.id === id ? { ...child, ...childData } : child
        )
      }));
      
      await childrenService.updateChild(id, childData);
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al actualizar niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
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
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.filter(child => child.id !== childId));
      setAppState(prev => ({ 
        ...prev, 
        children: prev.children.filter(child => child.id !== childId)
      }));
      
      await childrenService.deleteChild(childId);
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al eliminar niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
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
      
      // OPTIMIZACIÓN: Actualización optimista local inmediata
      setAllChildren(prevAll => prevAll.map(child => 
        child.id === childId ? { ...child, team_id: newTeamId } : child
      ));
      
      await childrenService.moveChildToTeam(childId, { new_team_id: newTeamId });
      
      // Recargar para asegurar sincronización con el servidor
      await loadAllChildren();
      await loadChildren();
      
      setShowMoveModal(false);
      setChildToMove(null);
      setAppState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      console.error('Error al mover niño:', error);
      // Revertir cambios optimistas en caso de error
      await loadAllChildren();
      await loadChildren();
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
      await loadAllChildren(); // Actualizar búsqueda global
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (appState.currentView === 'children' && appState.selectedTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <ChildList
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
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-slide-in-up z-50">
            <div className="flex items-center justify-between">
              <span>{appState.error}</span>
              <button 
                onClick={() => setAppState(prev => ({ ...prev, error: null }))}
                className="ml-4 text-xl font-bold hover:text-red-900 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="glass rounded-2xl p-8 mb-8 shadow-xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 gradient-text">
              Lista de Chicos
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Gestión de equipos y participantes
            </p>
          </div>
          
          {/* Búsqueda global */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar niños en todos los equipos..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-all duration-200"
              />
              {globalSearchTerm && (
                <button
                  onClick={() => setGlobalSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="Limpiar búsqueda"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Resultados de búsqueda */}
            {globalSearchTerm && (
              <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {filteredGlobalChildren.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.726-6.248 1.957"/>
                    </svg>
                    <p className="text-gray-500">No se encontraron niños que coincidan con "{globalSearchTerm}"</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        Encontrados: {filteredGlobalChildren.length} niño{filteredGlobalChildren.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {filteredGlobalChildren.map(child => {
                      const team = getTeamForChild(child.team_id);
                      return (
                        <div 
                          key={child.id} 
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                          onClick={() => handleNavigateToTeam(child.team_id)}
                          title={`Ir al equipo ${team?.nombre || 'desconocido'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{child.nombre} {child.apellido}</span>
                                <span className="text-sm text-gray-500">({child.edad} años)</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span 
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: team?.color || '#6b7280' }}
                              >
                                {team?.nombre || 'Equipo desconocido'}
                              </span>
                              <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Botón crear equipo flotante */}
          {!showTeamForm && (
            <div className="text-center">
              <button 
                className="btn-primary inline-flex items-center px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowTeamForm(true)}
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Nuevo Equipo
              </button>
            </div>
          )}

          {/* Formulario de creación de equipo */}
          <TeamForm
            onSubmit={handleCreateTeam}
            onCancel={() => setShowTeamForm(false)}
            isVisible={showTeamForm}
          />

          {/* Grid de equipos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appState.teams.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Bienvenido!</h3>
                  <p className="text-gray-600 mb-1">No hay equipos creados aún.</p>
                  <p className="text-gray-600">Haz clic en "Crear Nuevo Equipo" para comenzar.</p>
                </div>
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
        </main>
        
        {/* Footer */}
        <footer className="mt-16 text-center">
          <button 
            onClick={handleExit} 
            className="btn-secondary inline-flex items-center px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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

      {/* Error Message */}
      {appState.error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-slide-in-up z-50">
          <div className="flex items-center justify-between">
            <span>{appState.error}</span>
            <button 
              onClick={() => setAppState(prev => ({ ...prev, error: null }))}
              className="ml-4 text-xl font-bold hover:text-red-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
