/**
 * MoveChildModal Component
 * Modal para mover un niño a otro equipo
 */

import React, { useState } from 'react';
import type { MoveChildModalProps } from '../types';

const MoveChildModal: React.FC<MoveChildModalProps> = ({ 
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
    <div className="modal-overlay">
      <div className="move-child-modal">
        <h3>Mover a {child.nombre} {child.apellido}</h3>
        <p>Selecciona el equipo destino:</p>
        
        <div className="team-selection">
          {availableTeams.map(team => (
            <label key={team.id} className="team-option">
              <input
                type="radio"
                name="targetTeam"
                value={team.id}
                checked={selectedTeamId === team.id}
                onChange={() => setSelectedTeamId(team.id)}
              />
              <div className="team-option-content">
                <div 
                  className="team-color-indicator" 
                  style={{ backgroundColor: team.color }}
                ></div>
                <span className="team-name">{team.nombre}</span>
                {team.descripcion && (
                  <span className="team-description">({team.descripcion})</span>
                )}
              </div>
            </label>
          ))}
        </div>

        {availableTeams.length === 0 && (
          <p className="no-teams-message">
            No hay otros equipos disponibles para mover este niño.
          </p>
        )}
        
        <div className="move-buttons">
          <button 
            onClick={handleMove} 
            className="move-confirm-btn"
            disabled={!selectedTeamId}
          >
            Mover
          </button>
          <button onClick={handleCancel} className="move-cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveChildModal;
