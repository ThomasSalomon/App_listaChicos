/**
 * AppContent - Componente de contenido principal
 * Maneja el routing entre vistas y el estado de carga/error
 */

import React from 'react';
import { useApp } from './contexts/AppContext';
import { TeamsView, ChildrenView } from './pages';

const AppContent: React.FC = () => {
  const { appState, setError } = useApp();

  // Pantalla de carga
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

  return (
    <>
      {/* Routing principal */}
      {appState.currentView === 'children' && appState.selectedTeam ? (
        <ChildrenView />
      ) : (
        <TeamsView />
      )}

      {/* Error Message Global */}
      {appState.error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-slide-in-up z-50">
          <div className="flex items-center justify-between">
            <span>{appState.error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-xl font-bold hover:text-red-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppContent;
