/**
 * ConfirmDialog Component
 * Modal de confirmación reutilizable
 */

import React from 'react';
import type { ConfirmDialogProps } from '../types';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isVisible, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-dialog">
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        
        <div className="dialog-content">
          <p>{message}</p>
        </div>
          <div className="dialog-buttons">
          <button onClick={onConfirm} className="confirm-btn btn btn-success">
            <i className="bi bi-check-lg me-2"></i>
            Confirmar
          </button>
          <button onClick={onCancel} className="cancel-btn btn btn-secondary">
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
