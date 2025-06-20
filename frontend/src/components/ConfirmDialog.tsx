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
          <button onClick={onConfirm} className="confirm-btn">
            Confirmar
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
