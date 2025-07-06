/**
 * Import Modal Component
 * Modal para importar datos desde archivos Excel/CSV
 * 
 * @author Tommy
 * @version 1.0.0
 */

import { useState, useRef } from 'react';
import { importExportService, type ImportResult } from '../services/importExportService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'children' | 'teams';
  onSuccess: () => void;
}

export const ImportModal = ({ isOpen, onClose, type, onSuccess }: ImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeLabels = {
    children: 'Niños',
    teams: 'Equipos'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validation = importExportService.validateFile(selectedFile);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      if (type === 'children') {
        await importExportService.downloadChildrenTemplate();
      } else {
        await importExportService.downloadTeamsTemplate();
      }
    } catch (error) {
      console.error('Error al descargar template:', error);
      alert('Error al descargar template');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    try {
      let result: ImportResult;
      
      if (type === 'children') {
        result = await importExportService.importChildren(file);
      } else {
        result = await importExportService.importTeams(file);
      }

      setResult(result);
      
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al importar:', error);
      setResult({
        success: false,
        error: 'Error al importar archivo',
        message: 'Error interno del servidor'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Importar {typeLabels[type]}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {!result && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv) para importar {typeLabels[type].toLowerCase()}.
              </p>
              
              <div className="mb-3">
                <button
                  onClick={handleDownloadTemplate}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  📥 Descargar template de ejemplo
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer block"
                >
                  <div className="text-gray-400 mb-2">
                    📄
                  </div>
                  <div className="text-sm text-gray-600">
                    Haz clic para seleccionar un archivo<br />
                    o arrastra y suelta aquí
                  </div>
                </label>
              </div>

              {file && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={!file || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                <span>{uploading ? 'Importando...' : 'Importar'}</span>
              </button>
            </div>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✅' : '❌'}
                </span>
                <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Importación exitosa' : 'Error en importación'}
                </h3>
              </div>
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>
            </div>

            {result.success && result.data && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1">Resumen</h4>
                  <p className="text-sm text-blue-700">
                    {result.data.imported} {typeLabels[type].toLowerCase()} importados correctamente
                  </p>
                </div>

                {result.data.duplicates.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-800 mb-2">Duplicados omitidos</h4>
                    <div className="text-xs text-yellow-700 space-y-1 max-h-24 overflow-y-auto">
                      {result.data.duplicates.map((dup, index) => (
                        <div key={index}>
                          Fila {dup.row}: {dup.name} - {dup.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.data.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-2">Errores encontrados</h4>
                    <div className="text-xs text-red-700 space-y-1 max-h-24 overflow-y-auto">
                      {result.data.errors.map((error, index) => (
                        <div key={index}>
                          Fila {error.row}, {error.field}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result.success && result.error && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-1">Detalles del error</h4>
                <p className="text-sm text-gray-600">{result.error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {result.success && (
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  Importar otro archivo
                </button>
              )}
              <button
                onClick={handleClose}
                className={`px-4 py-2 rounded-lg ${
                  result.success 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {result.success ? 'Completar' : 'Cerrar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
