/**
 * TeamForm Component
 * Formulario para crear nuevos equipos
 */

import React, { useState } from 'react';
import type { TeamFormProps } from '../types';

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit, onCancel, isVisible }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre del equipo es obligatorio');
      return;
    }

    if (nombre.trim().length < 2 || nombre.trim().length > 50) {
      alert('El nombre debe tener entre 2 y 50 caracteres');
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      color: color
    });

    // Limpiar formulario
    setNombre('');
    setDescripcion('');
    setColor('#3B82F6');
  };

  const handleCancel = () => {
    setNombre('');
    setDescripcion('');
    setColor('#3B82F6');
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="create-team-form">
      <h2>Crear Nuevo Equipo</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="team-name">Nombre del Equipo *</label>
          <input
            id="team-name"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del equipo (2-50 caracteres)"
            maxLength={50}
            required
          />
        </div>

        <div>
          <label htmlFor="team-description">Descripción (Opcional)</label>
          <input
            id="team-description"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del equipo (hasta 100 caracteres)"
            maxLength={100}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="team-color">Color del Equipo</label>
          <input
            id="team-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span style={{ color: color }}>●</span>
        </div>

        <div className="form-buttons">
          <button type="submit" className="create-btn">
            Crear Equipo
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
