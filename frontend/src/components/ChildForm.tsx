/**
 * ChildForm Component
 * Formulario para agregar nuevos niños a un equipo
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

const ChildForm: React.FC<ChildFormProps> = ({ teamId, onSubmit, isVisible }) => {
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
    <div className="add-child-form">
      <h3>Agregar Nuevo Niño</h3>
      <form className="row g-3" onSubmit={handleSubmit(onSubmitForm)}>
        <div className="col-md-6">
          <label htmlFor="child-name" className="form-label">Nombre *</label>
          <input
            id="child-name"
            type="text"
            className={`form-control ${errors.nombre ? 'error' : ''}`}
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
            <span className="error-text">{errors.nombre.message}</span>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="child-lastname" className="form-label">Apellido *</label>
          <input
            id="child-lastname"
            type="text"
            className={`form-control ${errors.apellido ? 'error' : ''}`}
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
            <span className="error-text">{errors.apellido.message}</span>
          )}
        </div>        <div className="col-md-4">
          <label htmlFor="child-birthdate" className="form-label">Fecha de Nacimiento *</label>
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
                className={`form-control date-picker-input ${errors.fecha_nacimiento ? 'error' : ''}`}
                calendarClassName="custom-datepicker"
                wrapperClassName="date-picker-wrapper"
              />
            )}
          />
          {errors.fecha_nacimiento && (
            <span className="error-text">{errors.fecha_nacimiento.message}</span>
          )}
        </div>

        <div className="col-md-4">
          <label htmlFor="child-physical-state" className="form-label">Estado Físico</label>
          <select
            id="child-physical-state"
            className="form-select"
            {...register('estado_fisico')}
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
            {...register('condicion_pago')}
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
