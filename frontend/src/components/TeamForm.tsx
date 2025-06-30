/**
 * TeamForm Component
 * Formulario para crear nuevos equipos - Tailwind Version
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
    <div className="max-w-2xl mx-auto mb-8 animate-slide-in-up">
      <div className="glass rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Equipo</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Nombre del equipo */}
          <div>
            <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
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
              className={`form-input ${errors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="team-description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
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
              className={`form-input ${errors.descripcion ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Color picker */}
          <div>
            <label htmlFor="team-color" className="block text-sm font-medium text-gray-700 mb-3">
              Color del Equipo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  id="team-color"
                  type="color"
                  {...register('color')}
                  className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: watchedColor }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">Vista Previa</p>
                  <p className="text-xs text-gray-500 font-mono">{watchedColor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <button 
              type="submit" 
              className="btn-success flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Equipo
            </button>
            
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn-secondary flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
