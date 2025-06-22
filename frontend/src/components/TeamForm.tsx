/**
 * TeamForm Component
 * Formulario para crear nuevos equipos
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import type { TeamFormProps } from '../types';

interface TeamFormData {
  nombre: string;
  descripcion?: string;
  color: string;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit, onCancel, isVisible }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TeamFormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      color: '#3B82F6'
    }
  });

  const watchedColor = watch('color');

  const onSubmitForm = (data: TeamFormData) => {
    onSubmit({
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || undefined,
      color: data.color
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  if (!isVisible) return null;
  return (
    <div className="create-team-form">
      <h2>Crear Nuevo Equipo</h2>
      <form className="form-grid" onSubmit={handleSubmit(onSubmitForm)}>
        <div>
          <label htmlFor="team-name">Nombre del Equipo *</label>
          <input
            id="team-name"
            type="text"
            {...register('nombre', {
              required: 'El nombre del equipo es obligatorio',
              minLength: {
                value: 4,
                message: 'El nombre debe tener al menos 4 caracteres'
              },
              maxLength: {
                value: 70,
                message: 'El nombre no puede exceder 70 caracteres'
              },
              pattern: {
                value: /^[a-zA-ZÀ-ÿÑñ\s]+$/,
                message: 'El nombre solo puede contener letras y espacios'
              }
            })}
            placeholder="Nombre del equipo (4-70 caracteres)"
            maxLength={70}
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && (
            <span className="error-text">{errors.nombre.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="team-description">Descripción (Opcional)</label>
          <input
            id="team-description"
            type="text"
            {...register('descripcion', {
              maxLength: {
                value: 100,
                message: 'La descripción no puede exceder 100 caracteres'
              }
            })}
            placeholder="Descripción del equipo (hasta 100 caracteres)"
            maxLength={100}
            className={errors.descripcion ? 'error' : ''}
          />
          {errors.descripcion && (
            <span className="error-text">{errors.descripcion.message}</span>
          )}
        </div>        <div className="color-input-group">
          <label htmlFor="team-color">Color del Equipo</label>
          <div className="color-picker-container">
            <div className="color-input-wrapper">
              <input
                id="team-color"
                type="color"
                {...register('color')}
              />
            </div>
            <div className="color-preview">
              <div 
                className="color-preview-dot" 
                style={{ backgroundColor: watchedColor }}
              ></div>
              <div className="color-preview-text">
                Vista Previa
                <div className="color-hex">{watchedColor}</div>
              </div>
            </div>
          </div>
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
