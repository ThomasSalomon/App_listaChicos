/**
 * TeamCard Component
 * Tarjeta individual para mostrar información de un equipo
 */

import React from 'react';
import type { TeamCardProps } from '../types';

const TeamCard: React.FC<TeamCardProps> = ({ team, onSelect, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se ejecute onSelect
    onDelete(team.id);
  };

  return (
    <div className="team-card-container">
      <div 
        className="team-card"
        onClick={() => onSelect(team)}
        style={{ borderColor: team.color }}
      >
        <div className="team-color" style={{ backgroundColor: team.color }}></div>
        <div className="team-info">
          <h3>{team.nombre}</h3>
          {team.descripcion && <p>{team.descripcion}</p>}
        </div>
      </div>
      <button 
        className="team-delete-btn"
        onClick={handleDelete}
        title="Eliminar equipo"
      >
        🗑️
      </button>
    </div>
  );
};

export default TeamCard;
