/**
 * ChildList Component
 * Componente contenedor para la gestión de niños de un equipo
 */

import React, { useState } from 'react';
import ChildItem from './ChildItem';
import ChildForm from './ChildForm';
import MoveChildModal from './MoveChildModal';
import ConfirmDialog from './ConfirmDialog';
import type { Team, Child, CreateChildData, UpdateChildData } from '../types';

export interface ChildListProps {
  team: Team;
  children: Child[];
  teams: Team[]; // Agregar esta prop
  onBack: () => void;
  onAddChild: (childData: CreateChildData) => void;
  onUpdateChild: (id: number, childData: UpdateChildData) => void;
  onDeleteChild: (id: number) => void;
  onMoveChild: (id: number, newTeamId: number) => void;
  onClearAll: () => void;
}

const ChildList: React.FC<ChildListProps> = ({ 
  team, 
  children,
  teams, // Nueva prop
  onBack, 
  onAddChild, 
  onUpdateChild, 
  onDeleteChild, 
  onMoveChild, 
  onClearAll 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [childToMove, setChildToMove] = useState<Child | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [childToDelete, setChildToDelete] = useState<number | null>(null);  const [showClearConfirm, setShowClearConfirm] = useState(false);
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
    setChildToMove(child);
    setShowMoveModal(true);
  };

  const handleConfirmMove = (childId: number, newTeamId: number) => {
    onMoveChild(childId, newTeamId);
    setShowMoveModal(false);
    setChildToMove(null);
  };

  const handleCancelMove = () => {
    setShowMoveModal(false);
    setChildToMove(null);
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
    <div className="children-view">
      <div className="selected-team-header">
        <div className="team-info">
          <div className="team-color-indicator" style={{ backgroundColor: team.color }}></div>
          <div>
            <h2>{team.nombre}</h2>
            {team.descripcion && <p className="team-description">{team.descripcion}</p>}
          </div>
        </div>
        <button onClick={onBack} className="back-btn btn">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Equipos
        </button>
      </div><div className="children-content">
        <div className="children-controls">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="add-child-btn btn"
            disabled={editingChild !== null}
          >
            <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-person-plus-fill'} me-2`}></i>
            {showForm ? 'Cancelar' : 'Agregar Niño'}
          </button>
          
          {children.length > 0 && (
            <button onClick={handleClearAllClick} className="clear-all-btn btn">
              <i className="bi bi-trash3-fill me-2"></i>
              Limpiar Lista
            </button>
          )}
          
          <div className="children-count">
            Total: {children.length} niño{children.length !== 1 ? 's' : ''}
            {searchTerm && (
              <span className="filtered-count">
                {' '} - Mostrando: {filteredChildren.length}
              </span>
            )}
          </div>
        </div>

        {/* Campo de búsqueda */}
        {children.length > 0 && (
          <div className="search-container">
            <div className="search-box">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Buscar niños por nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search-btn"
                  title="Limpiar búsqueda"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>
        )}

        <ChildForm 
          teamId={team.id}
          onSubmit={handleAddChild}
          isVisible={showForm}
        />        <div className="children-list">
          {filteredChildren.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <p>No se encontraron niños que coincidan con "{searchTerm}"</p>
                  <p>Intenta con otro término de búsqueda</p>
                </>
              ) : (
                <>
                  <p>No hay niños en este equipo</p>
                  <p>Usa el botón "Agregar Niño" para comenzar</p>
                </>
              )}
            </div>
          ) : (
            filteredChildren.map(child => (
              <ChildItem
                key={child.id}
                child={child}
                onEdit={handleEditChild}
                onDelete={handleDeleteClick}
                onMove={handleMoveChild}
                isEditing={editingChild?.id === child.id}
                onUpdate={handleUpdateChild}
                onCancelEdit={handleCancelEdit}
              />
            ))
          )}
        </div>
      </div>      <MoveChildModal
        child={childToMove}
        teams={teams}
        currentTeamId={team.id}
        isVisible={showMoveModal}
        onMove={handleConfirmMove}
        onCancel={handleCancelMove}
      />

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
};

export default ChildList;
