/**
 * TeamCard Component
 * Tarjeta individual para mostrar información de un equipo - Tailwind Version
 * OPTIMIZADO: React.memo para prevenir re-renders innecesarios
 */

import React from 'react';
import type { TeamCardProps } from '../types';

const TeamCard: React.FC<TeamCardProps> = React.memo(({ team, onSelect, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se ejecute onSelect
    onDelete(team.id);
  };

  return (
    <div className="relative group">
      {/* Tarjeta principal */}
      <div 
        className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 p-6 h-full min-h-[160px] flex flex-col justify-between animate-slide-in-up"
        onClick={() => onSelect(team)}
        style={{ borderLeftColor: team.color }}
      >
        {/* Color indicator */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: team.color }}
          />
          
          {/* Delete button - mejor visibilidad */}
          <button 
            className="opacity-60 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
            onClick={handleDelete}
            title="Eliminar equipo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Team info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {team.nombre}
          </h3>
          {team.descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {team.descripcion}
            </p>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm -z-10"
        style={{ backgroundColor: team.color }}
      />
    </div>
  );
});

// Display name for debugging
TeamCard.displayName = 'TeamCard';

export default TeamCard;
