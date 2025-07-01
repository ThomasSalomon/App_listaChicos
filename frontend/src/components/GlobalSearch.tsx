/**
 * GlobalSearch - Componente de búsqueda global
 * Permite buscar niños en todos los equipos
 */

import React from 'react';
import { useSearch } from '../contexts/SearchContext';

const GlobalSearch: React.FC = () => {
  const { 
    globalSearchTerm, 
    setGlobalSearchTerm, 
    filteredGlobalChildren, 
    getTeamForChild, 
    handleNavigateToTeam 
  } = useSearch();

  return (
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
                    onClick={() => handleNavigateToTeam(child.team_id, child.id)}
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
  );
};

export default GlobalSearch;
