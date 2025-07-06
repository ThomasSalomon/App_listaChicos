/**
 * ChildList Component
 * Componente contenedor para la gestión de niños de un equipo
 * OPTIMIZADO: React.memo para prevenir re-renders innecesarios
 */

import React, { useState } from 'react';
import ChildItem from './ChildItem';
import ChildForm from './ChildForm';
import ConfirmDialog from './ConfirmDialog';
import { ExportMenu } from './index';
import type { Team, Child, CreateChildData, UpdateChildData } from '../types';

export interface ChildListProps {
  team: Team;
  children: Child[];
  highlightedChildId?: number | null; // Prop para destacar niño
  onBack: () => void;
  onAddChild: (childData: CreateChildData) => void;
  onUpdateChild: (id: number, childData: UpdateChildData) => void;
  onDeleteChild: (id: number) => void;
  onMoveChild: (child: Child) => void; // Recibe el objeto Child
  onClearAll: () => void;
  onImport?: () => void; // Nueva prop para importar
}

const ChildList: React.FC<ChildListProps> = React.memo(({ 
  team, 
  children,
  highlightedChildId, // Prop para destacar niño
  onBack, 
  onAddChild, 
  onUpdateChild, 
  onDeleteChild, 
  onMoveChild, 
  onClearAll,
  onImport // Nueva prop para importar
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [childToDelete, setChildToDelete] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar niños basado en el término de búsqueda
  const filteredChildren = children.filter(child =>
    child.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddChild = (childData: any) => {
    onAddChild(childData);
    setShowForm(false);
  };

  const handleEditChild = (child: Child) => {
    if (showForm) return; // No permitir editar si se está agregando
    setEditingChild(child);
  };

  const handleUpdateChild = (id: number, childData: any) => {
    onUpdateChild(id, childData);
    setEditingChild(null);
  };

  const handleCancelEdit = () => {
    setEditingChild(null);
  };

  const handleMoveChild = (child: Child) => {
    onMoveChild(child); // Llamar directamente a la prop
  };

  const handleDeleteClick = (childId: number) => {
    setChildToDelete(childId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (childToDelete) {
      onDeleteChild(childToDelete);
      setShowDeleteConfirm(false);
      setChildToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setChildToDelete(null);
  };

  const handleClearAllClick = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  const handleCancelClearAll = () => {
    setShowClearConfirm(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del equipo */}
        <div className="glass rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-md flex-shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{team.nombre}</h2>
                {team.descripcion && (
                  <p className="text-gray-600 mt-1">{team.descripcion}</p>
                )}
              </div>
            </div>
            <button 
              onClick={onBack} 
              className="btn-secondary inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a Equipos
            </button>
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showForm 
                  ? 'btn-secondary' 
                  : 'btn-primary hover:shadow-md'
              }`}
              disabled={editingChild !== null}
            >
              {showForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Agregar Niño
                </>
              )}
            </button>
            
            {children.length > 0 && (
              <button 
                onClick={handleClearAllClick} 
                className="btn-danger inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Lista
              </button>
            )}

            {/* Botones de Importar/Exportar */}
            {onImport && (
              <button
                onClick={onImport}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-md"
              >
                <i className="bi bi-upload mr-2"></i>
                Importar
              </button>
            )}
            
            <ExportMenu type="children" />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="badge badge-info">
              Total: {children.length} niño{children.length !== 1 ? 's' : ''}
            </span>
            {searchTerm && (
              <span className="badge badge-primary">
                Mostrando: {filteredChildren.length}
              </span>
            )}
          </div>
        </div>

        {/* Campo de búsqueda */}
        {children.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar niños por nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="Limpiar búsqueda"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Formulario de agregar niño */}
        <ChildForm 
          teamId={team.id}
          teamColor={team.color}
          onSubmit={handleAddChild}
          isVisible={showForm}
        />

        {/* Lista de niños */}
        <div className="space-y-4">
          {filteredChildren.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                {searchTerm ? (
                  <>
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-600 mb-1">No se encontraron niños que coincidan con "{searchTerm}"</p>
                    <p className="text-gray-600">Intenta con otro término de búsqueda</p>
                  </>
                ) : (
                  <>
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lista vacía</h3>
                    <p className="text-gray-600 mb-1">No hay niños en este equipo</p>
                    <p className="text-gray-600">Usa el botón "Agregar Niño" para comenzar</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredChildren.map(child => (
                <ChildItem
                  key={child.id}
                  child={child}
                  onEdit={handleEditChild}
                  onDelete={handleDeleteClick}
                  onMove={handleMoveChild}
                  isEditing={editingChild?.id === child.id}
                  isHighlighted={highlightedChildId === child.id}
                  onUpdate={handleUpdateChild}
                  onCancelEdit={handleCancelEdit}
                  teamColor={team.color}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ConfirmDialog
        isVisible={showDeleteConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar este niño de la lista?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        isVisible={showClearConfirm}
        title="Confirmar Limpiar Lista"
        message={`¿Estás seguro de que quieres eliminar TODOS los niños de ${team.nombre}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmClearAll}
        onCancel={handleCancelClearAll}
      />
    </div>
  );
});

// Display name for debugging
ChildList.displayName = 'ChildList';

export default ChildList;
