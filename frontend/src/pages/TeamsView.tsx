/**
 * TeamsView - Vista principal de equipos
 * Maneja la visualización y gestión de equipos
 */

import React, { useState } from 'react';
import TeamCard from '../components/TeamCard';
import TeamForm from '../components/TeamForm';
import ConfirmDialog from '../components/ConfirmDialog';
import GlobalSearch from '../components/GlobalSearch';
import { ImportModal, ExportMenu } from '../components';
import { useTeamOperations } from '../hooks/useTeamOperations';
import { useUI } from '../contexts/UIContext';
import { useApp } from '../contexts/AppContext';
import { useTeams } from '../contexts/TeamsContext';

const TeamsView: React.FC = () => {
  const { 
    teams, 
    showTeamForm, 
    setShowTeamForm, 
    handleCreateTeam, 
    handleDeleteTeam, 
    confirmDeleteTeam 
  } = useTeamOperations();
  
  const { loadTeams } = useTeams();
  const [showImportModal, setShowImportModal] = useState(false);
  
  const { 
    showDeleteTeamConfirm, 
    closeDeleteTeamConfirm,
    showExitConfirm,
    setShowExitConfirm
  } = useUI();
  
  const { navigateToTeam } = useApp();

  const handleImportSuccess = () => {
    loadTeams();
    setShowImportModal(false);
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
          <GlobalSearch />
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Botones de acción principales */}
          {!showTeamForm && (
            <div className="text-center space-y-4">
              <button 
                className="btn-primary inline-flex items-center px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowTeamForm(true)}
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Nuevo Equipo
              </button>
              
              {/* Botones de importación/exportación */}
              <div className="flex justify-center items-center space-x-4 pt-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <span>📥</span>
                  <span>Importar Equipos</span>
                </button>
                
                <ExportMenu type="teams" />
                
                <ExportMenu type="report" />
              </div>
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
            {teams.length === 0 ? (
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
              teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onSelect={navigateToTeam}
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
        onCancel={closeDeleteTeamConfirm}
      />

      <ConfirmDialog
        isVisible={showExitConfirm}
        title="Salir de la Aplicación"
        message="¿Estás seguro de que quieres cerrar la aplicación?"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        type="teams"
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default TeamsView;
