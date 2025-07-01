/**
 * ChildForm Component
 * Formulario para agregar nuevos niños a un equipo
 * OPTIMIZADO: React.memo para prevenir re-renders innecesarios
 */

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { ChildFormProps } from '../types';

interface ChildFormData {
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date | null;
  estado_fisico: 'En forma' | 'Lesionado';
  condicion_pago: 'Al dia' | 'En deuda';
}

const ChildForm: React.FC<ChildFormProps> = React.memo(({ teamId, teamColor, onSubmit, isVisible }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<ChildFormData>({
    defaultValues: {
      nombre: '',
      apellido: '',
      fecha_nacimiento: new Date(),
      estado_fisico: 'En forma',
      condicion_pago: 'Al dia'
    }
  });

  const onSubmitForm = (data: ChildFormData) => {
    onSubmit({
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      fecha_nacimiento: data.fecha_nacimiento?.toISOString().split('T')[0] || '',
      estado_fisico: data.estado_fisico,
      condicion_pago: data.condicion_pago,
      team_id: teamId
    });
    reset({
      nombre: '',
      apellido: '',
      fecha_nacimiento: new Date(),
      estado_fisico: 'En forma',
      condicion_pago: 'Al dia'
    });
  };

  if (!isVisible) return null;
  
  return (
    <div className="mb-8 animate-slide-in-up">
      <div className="glass rounded-2xl p-6 shadow-xl border" style={{ borderLeftColor: teamColor, borderLeftWidth: '4px' }}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Agregar Nuevo Niño</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Primera fila: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="child-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                id="child-name"
                type="text"
                className={`form-input ${errors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                {...register('nombre', {
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
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
                placeholder="Nombre del niño"
                maxLength={70}
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

            <div>
              <label htmlFor="child-lastname" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                id="child-lastname"
                type="text"
                className={`form-input ${errors.apellido ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                {...register('apellido', {
                  required: 'El apellido es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'El apellido debe tener al menos 2 caracteres'
                  },
                  maxLength: {
                    value: 70,
                    message: 'El apellido no puede exceder 70 caracteres'
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿÑñ\s]+$/,
                    message: 'El apellido solo puede contener letras y espacios'
                  }
                })}
                placeholder="Apellido del niño"
                maxLength={70}
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          {/* Segunda fila: Fecha, Estado físico, Condición pago */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="child-birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento *
              </label>
              <Controller
                name="fecha_nacimiento"
                control={control}
                rules={{
                  required: 'La fecha de nacimiento es obligatoria',
                  validate: {
                    notFuture: (value) => {
                      if (!value) return 'La fecha de nacimiento es obligatoria';
                      const today = new Date();
                      return value <= today || 'La fecha de nacimiento no puede ser futura';
                    },
                    notTooOld: (value) => {
                      if (!value) return 'La fecha de nacimiento es obligatoria';
                      const today = new Date();
                      const age = today.getFullYear() - value.getFullYear();
                      return age <= 25 || 'La edad no puede ser mayor a 25 años';
                    }
                  }
                }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona una fecha"
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    yearDropdownItemNumber={25}
                    dropdownMode="select"
                    className={`form-input ${errors.fecha_nacimiento ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                    calendarClassName="bg-white border border-gray-300 rounded-lg shadow-lg"
                    wrapperClassName="w-full"
                  />
                )}
              />
              {errors.fecha_nacimiento && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fecha_nacimiento.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="child-physical-state" className="block text-sm font-medium text-gray-700 mb-2">
                Estado Físico
              </label>
              <select
                id="child-physical-state"
                className="form-select"
                {...register('estado_fisico')}
              >
                <option value="En forma">💪 En forma</option>
                <option value="Lesionado">🤕 Lesionado</option>
              </select>
            </div>

            <div>
              <label htmlFor="child-payment-status" className="block text-sm font-medium text-gray-700 mb-2">
                Condición de Pago
              </label>
              <select
                id="child-payment-status"
                className="form-select"
                {...register('condicion_pago')}
              >
                <option value="Al dia">✅ Al día</option>
                <option value="En deuda">⚠️ En deuda</option>
              </select>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center pt-4">
            <button 
              type="submit" 
              className="btn-primary inline-flex items-center px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Display name for debugging
ChildForm.displayName = 'ChildForm';

export default ChildForm;
