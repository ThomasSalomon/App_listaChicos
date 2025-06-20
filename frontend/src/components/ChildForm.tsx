/**
 * ChildForm Component
 * Formulario para agregar nuevos niños a un equipo
 */

import React, { useState } from 'react';
import type { ChildFormProps } from '../types';

const ChildForm: React.FC<ChildFormProps> = ({ teamId, onSubmit, isVisible }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [estadoFisico, setEstadoFisico] = useState<'En forma' | 'Lesionado'>('En forma');
  const [condicionPago, setCondicionPago] = useState<'Al dia' | 'En deuda'>('Al dia');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento) {
      alert('Nombre, apellido y fecha de nacimiento son obligatorios');
      return;
    }

    if (nombre.trim().length < 2 || apellido.trim().length < 2) {
      alert('El nombre y apellido deben tener al menos 2 caracteres');
      return;
    }

    // Validar que la fecha no sea futura
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    if (birthDate > today) {
      alert('La fecha de nacimiento no puede ser futura');
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      fecha_nacimiento: fechaNacimiento,
      estado_fisico: estadoFisico,
      condicion_pago: condicionPago,
      team_id: teamId
    });

    // Limpiar formulario
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setEstadoFisico('En forma');
    setCondicionPago('Al dia');
  };

  if (!isVisible) return null;

  return (    <div className="add-child-form">
      <h3>Agregar Nuevo Niño</h3>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="child-name" className="form-label">Nombre *</label>
          <input
            id="child-name"
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del niño"
            maxLength={50}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="child-lastname" className="form-label">Apellido *</label>
          <input
            id="child-lastname"
            type="text"
            className="form-control"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Apellido del niño"
            maxLength={50}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="child-birthdate" className="form-label">Fecha de Nacimiento *</label>
          <input
            id="child-birthdate"
            type="date"
            className="form-control"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="child-physical-state" className="form-label">Estado Físico</label>
          <select
            id="child-physical-state"
            className="form-select"
            value={estadoFisico}
            onChange={(e) => setEstadoFisico(e.target.value as 'En forma' | 'Lesionado')}
          >
            <option value="En forma">💪 En forma</option>
            <option value="Lesionado">🤕 Lesionado</option>
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="child-payment-status" className="form-label">Condición de Pago</label>
          <select
            id="child-payment-status"
            className="form-select"
            value={condicionPago}
            onChange={(e) => setCondicionPago(e.target.value as 'Al dia' | 'En deuda')}
          >
            <option value="Al dia">✅ Al día</option>
            <option value="En deuda">⚠️ En deuda</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-person-plus-fill me-2"></i>
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChildForm;
