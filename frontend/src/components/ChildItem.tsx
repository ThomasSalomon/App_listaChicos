/**
 * ChildItem Component
 * Componente individual para mostrar y editar información de un niño
 */

import React, { useState, useEffect } from 'react';
import type { ChildItemProps } from '../types';

const ChildItem: React.FC<ChildItemProps> = ({ 
  child, 
  onEdit, 
  onDelete, 
  onMove, 
  isEditing, 
  onUpdate, 
  onCancelEdit 
}) => {
  const [editData, setEditData] = useState({
    nombre: child.nombre,
    apellido: child.apellido,
    fecha_nacimiento: child.fecha_nacimiento,
    estado_fisico: child.estado_fisico,
    condicion_pago: child.condicion_pago
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        nombre: child.nombre,
        apellido: child.apellido,
        fecha_nacimiento: child.fecha_nacimiento,
        estado_fisico: child.estado_fisico,
        condicion_pago: child.condicion_pago
      });
    }
  }, [isEditing, child]);

  const handleSave = () => {
    if (!editData.nombre.trim() || !editData.apellido.trim() || !editData.fecha_nacimiento) {
      alert('Nombre, apellido y fecha de nacimiento son obligatorios');
      return;
    }

    // Validar que la fecha no sea futura
    const birthDate = new Date(editData.fecha_nacimiento);
    const today = new Date();
    if (birthDate > today) {
      alert('La fecha de nacimiento no puede ser futura');
      return;
    }

    onUpdate(child.id, {
      ...editData,
      nombre: editData.nombre.trim(),
      apellido: editData.apellido.trim()
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const formatBirthDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };
  const getPhysicalStateIcon = (state: string) => {
    return state === 'En forma' ? 
      <i className="bi bi-heart-pulse-fill text-success"></i> : 
      <i className="bi bi-bandaid-fill text-danger"></i>;
  };

  const getPaymentStatusIcon = (status: string) => {
    return status === 'Al dia' ? 
      <i className="bi bi-check-circle-fill text-success"></i> : 
      <i className="bi bi-exclamation-triangle-fill text-warning"></i>;
  };

  if (isEditing) {
    return (
      <div className="child-item editing">
        <div className="edit-form">
          <div className="edit-row">
            <input
              type="text"
              value={editData.nombre}
              onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
              placeholder="Nombre"
              onKeyDown={handleKeyPress}
              maxLength={50}
            />
            <input
              type="text"
              value={editData.apellido}
              onChange={(e) => setEditData({ ...editData, apellido: e.target.value })}
              placeholder="Apellido"
              onKeyDown={handleKeyPress}
              maxLength={50}
            />
          </div>
          
          <div className="edit-row">
            <input
              type="date"
              value={editData.fecha_nacimiento}
              onChange={(e) => setEditData({ ...editData, fecha_nacimiento: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              onKeyDown={handleKeyPress}
            />
              <select
              value={editData.estado_fisico}
              onChange={(e) => setEditData({ ...editData, estado_fisico: e.target.value as 'En forma' | 'Lesionado' })}
              className="form-select form-select-sm"
            >
              <option value="En forma">💪 En forma</option>
              <option value="Lesionado">🤕 Lesionado</option>
            </select>
            
            <select
              value={editData.condicion_pago}
              onChange={(e) => setEditData({ ...editData, condicion_pago: e.target.value as 'Al dia' | 'En deuda' })}
              className="form-select form-select-sm"
            >
              <option value="Al dia">✅ Al día</option>
              <option value="En deuda">⚠️ En deuda</option>
            </select>
          </div>
          
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-btn btn btn-success btn-sm" title="Guardar (Enter)">
              <i className="bi bi-check-lg"></i>
            </button>
            <button onClick={onCancelEdit} className="cancel-edit-btn btn btn-secondary btn-sm" title="Cancelar (Escape)">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="child-item">
      <div className="child-info">
        <div className="child-name">
          <strong>{child.nombre} {child.apellido}</strong>
          <span className="child-age">({child.edad} años)</span>
        </div>
        
        <div className="child-details">
          <span className="child-birthdate">
            Nació: {formatBirthDate(child.fecha_nacimiento)}
          </span>
          
          <div className="child-badges">
            <span className={`badge ${child.estado_fisico === 'En forma' ? 'badge-success' : 'badge-warning'}`}>
              {getPhysicalStateIcon(child.estado_fisico)} {child.estado_fisico}
            </span>
            
            <span className={`badge ${child.condicion_pago === 'Al dia' ? 'badge-success' : 'badge-danger'}`}>
              {getPaymentStatusIcon(child.condicion_pago)} {child.condicion_pago}
            </span>
          </div>
        </div>
      </div>
        <div className="child-actions">
        <button onClick={() => onEdit(child)} className="edit-btn btn btn-sm" title="Editar niño">
          <i className="bi bi-pencil-fill"></i>
        </button>
        <button onClick={() => onMove(child)} className="move-btn btn btn-sm" title="Mover a otro equipo">
          <i className="bi bi-arrow-left-right"></i>
        </button>
        <button onClick={() => onDelete(child.id)} className="delete-btn btn btn-sm" title="Eliminar niño">
          <i className="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default ChildItem;
