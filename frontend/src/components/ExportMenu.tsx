/**
 * Export Menu Component
 * Menú desplegable para opciones de exportación
 * 
 * @author Tommy
 * @version 1.0.0
 */

import { useState, useRef, useEffect } from 'react';
import { importExportService, type ExportOptions } from '../services/importExportService';
import { useTeams } from '../contexts/TeamsContext';

interface ExportMenuProps {
  type: 'children' | 'teams' | 'report';
  className?: string;
}

export const ExportMenu = ({ type, className = '' }: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { teams } = useTeams();

  const typeLabels = {
    children: 'Niños',
    teams: 'Equipos',
    report: 'Reporte Completo'
  };

  const typeIcons = {
    children: '👶',
    teams: '👥',
    report: '📊'
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (options: ExportOptions) => {
    setExporting(true);
    setIsOpen(false);

    try {
      switch (type) {
        case 'children':
          await importExportService.exportChildren(options);
          break;
        case 'teams':
          await importExportService.exportTeams(options);
          break;
        case 'report':
          await importExportService.exportCompleteReport(options);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert(`Error al exportar ${typeLabels[type].toLowerCase()}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {exporting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        ) : (
          <span>{typeIcons[type]}</span>
        )}
        <span>{exporting ? 'Exportando...' : `Exportar ${typeLabels[type]}`}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-900 text-sm">
              Exportar {typeLabels[type]}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona el formato de exportación
            </p>
          </div>

          <div className="p-2 space-y-1">
            {/* Exportar a Excel */}
            <button
              onClick={() => handleExport({ format: 'excel' })}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-3"
            >
              <span className="text-green-600">📊</span>
              <div>
                <div className="font-medium">Excel (.xlsx)</div>
                <div className="text-xs text-gray-500">Recomendado - Con formato y estilos</div>
              </div>
            </button>

            {/* Exportar a CSV */}
            <button
              onClick={() => handleExport({ format: 'csv' })}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-3"
            >
              <span className="text-blue-600">📄</span>
              <div>
                <div className="font-medium">CSV (.csv)</div>
                <div className="text-xs text-gray-500">Compatible con cualquier aplicación</div>
              </div>
            </button>

            {/* Opciones específicas para niños */}
            {type === 'children' && teams.length > 0 && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-3 py-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Filtrar por equipo
                  </div>
                </div>
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleExport({ format: 'excel', teamId: team.id })}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-3"
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <div>
                      <div className="font-medium">{team.nombre}</div>
                      <div className="text-xs text-gray-500">Solo niños de este equipo</div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Opciones específicas para equipos */}
            {type === 'teams' && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={() => handleExport({ format: 'excel', includeChildren: true })}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-3"
                >
                  <span className="text-purple-600">👶</span>
                  <div>
                    <div className="font-medium">Incluir niños</div>
                    <div className="text-xs text-gray-500">Con lista de niños por equipo</div>
                  </div>
                </button>
              </>
            )}
          </div>

          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
