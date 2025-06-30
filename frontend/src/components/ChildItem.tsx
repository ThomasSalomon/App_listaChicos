/**
 * ChildItem Component
 * Componente individual para mostrar y editar información de un niño
 */

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { ChildItemProps } from '../types';

const ChildItem: React.FC<ChildItemProps> = ({ 
  child, 
  onEdit, 
  onDelete, 
  onMove, 
  isEditing, 
  onUpdate, 
  onCancelEdit,
  teamColor
}) => {
  const [editData, setEditData] = useState({
    nombre: child.nombre,
    apellido: child.apellido,
    fecha_nacimiento: new Date(child.fecha_nacimiento),
    estado_fisico: child.estado_fisico,
    condicion_pago: child.condicion_pago
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        nombre: child.nombre,
        apellido: child.apellido,
        fecha_nacimiento: new Date(child.fecha_nacimiento),
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
    const birthDate = editData.fecha_nacimiento;
    const today = new Date();
    if (birthDate > today) {
      alert('La fecha de nacimiento no puede ser futura');
      return;
    }

    onUpdate(child.id, {
      ...editData,
      nombre: editData.nombre.trim(),
      apellido: editData.apellido.trim(),
      fecha_nacimiento: editData.fecha_nacimiento.toISOString().split('T')[0], // Convertir Date a string
      team_id: child.team_id // Preservar el team_id actual
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
    return state === 'En forma' ? (
      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const getPaymentStatusIcon = (status: string) => {
    return status === 'Al dia' ? (
      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md border-l-4 p-4 animate-slide-in-up" style={{ borderLeftColor: teamColor }}>
        <div className="space-y-4">
          {/* Primera fila: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={editData.nombre}
                onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                placeholder="Nombre"
                onKeyDown={handleKeyPress}
                maxLength={50}
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                value={editData.apellido}
                onChange={(e) => setEditData({ ...editData, apellido: e.target.value })}
                placeholder="Apellido"
                onKeyDown={handleKeyPress}
                maxLength={50}
                className="form-input text-sm"
              />
            </div>
          </div>
          
          {/* Segunda fila: Fecha, Estado físico, Condición pago */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <DatePicker
                selected={editData.fecha_nacimiento}
                onChange={(date) => setEditData({ ...editData, fecha_nacimiento: date || new Date() })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona una fecha"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={25}
                dropdownMode="select"
                className="form-input text-sm"
                calendarClassName="bg-white border border-gray-300 rounded-lg shadow-lg"
                wrapperClassName="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado físico</label>
              <select
                value={editData.estado_fisico}
                onChange={(e) => setEditData({ ...editData, estado_fisico: e.target.value as 'En forma' | 'Lesionado' })}
                className="form-select text-sm"
              >
                <option value="En forma">💪 En forma</option>
                <option value="Lesionado">🤕 Lesionado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condición pago</label>
              <select
                value={editData.condicion_pago}
                onChange={(e) => setEditData({ ...editData, condicion_pago: e.target.value as 'Al dia' | 'En deuda' })}
                className="form-select text-sm"
              >
                <option value="Al dia">✅ Al día</option>
                <option value="En deuda">⚠️ En deuda</option>
              </select>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              onClick={handleSave} 
              className="btn-success px-3 py-1 text-sm rounded-md inline-flex items-center"
              title="Guardar (Enter)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button 
              onClick={onCancelEdit} 
              className="btn-secondary px-3 py-1 text-sm rounded-md inline-flex items-center"
              title="Cancelar (Escape)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 p-4 group animate-slide-in-up" style={{ borderLeftColor: teamColor }}>
      <div className="flex items-center justify-between">
        {/* Información del niño */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {child.nombre} {child.apellido}
              </h3>
              <p className="text-sm text-gray-600">
                {child.edad} años • Nació: {formatBirthDate(child.fecha_nacimiento)}
              </p>
            </div>
          </div>
          
          {/* Badges de estado */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              child.estado_fisico === 'En forma' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {getPhysicalStateIcon(child.estado_fisico)}
              <span>{child.estado_fisico}</span>
            </span>
            
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              child.condicion_pago === 'Al dia' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getPaymentStatusIcon(child.condicion_pago)}
              <span>{child.condicion_pago}</span>
            </span>
          </div>
        </div>
        
        {/* Botones de acción - mejor visibilidad */}
        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200 ml-4">
          <button 
            onClick={() => onEdit(child)} 
            className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200"
            title="Editar niño"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button 
            onClick={() => onMove(child)} 
            className="p-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200"
            title="Mover a otro equipo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          
          <button 
            onClick={() => onDelete(child.id)} 
            className="p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-200"
            title="Eliminar niño"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildItem;
