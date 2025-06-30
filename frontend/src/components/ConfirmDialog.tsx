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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">
            {title}
          </h3>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button 
            onClick={onCancel}
            className="btn-secondary w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="btn-danger w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
