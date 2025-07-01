/**
 * MoveChildModal Component
 * Modal para mover un niño a otro equipo
 * OPTIMIZADO: React.memo para prevenir re-renders innecesarios
 */

import React, { useState } from 'react';
import type { MoveChildModalProps } from '../types';

const MoveChildModal: React.FC<MoveChildModalProps> = React.memo(({ 
  child, 
  teams, 
  currentTeamId, 
  isVisible, 
  onMove, 
  onCancel 
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const handleMove = () => {
    if (selectedTeamId && child) {
      onMove(child.id, selectedTeamId);
      setSelectedTeamId(null);
    }
  };

  const handleCancel = () => {
    setSelectedTeamId(null);
    onCancel();
  };

  if (!isVisible || !child) return null;

  // Filtrar equipos para no mostrar el equipo actual
  const availableTeams = teams.filter(team => team.id !== currentTeamId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slide-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white mb-1">
            Mover Niño
          </h3>
          <p className="text-indigo-100 text-sm">
            {child.nombre} {child.apellido}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4 font-medium">
            Selecciona el equipo destino:
          </p>
          
          {availableTeams.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">
                No hay otros equipos disponibles para mover este niño.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableTeams.map(team => (
                <label 
                  key={team.id} 
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    selectedTeamId === team.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetTeam"
                    value={team.id}
                    checked={selectedTeamId === team.id}
                    onChange={() => setSelectedTeamId(team.id)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3 flex items-center space-x-3 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {team.nombre}
                      </p>
                      {team.descripcion && (
                        <p className="text-sm text-gray-500 truncate">
                          {team.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button 
            onClick={handleCancel}
            className="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          >
            Cancelar
          </button>
          <button 
            onClick={handleMove}
            disabled={!selectedTeamId}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedTeamId
                ? 'btn-success'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Mover
          </button>
        </div>
      </div>
    </div>
  );
});

// Display name for debugging
MoveChildModal.displayName = 'MoveChildModal';

export default MoveChildModal;
