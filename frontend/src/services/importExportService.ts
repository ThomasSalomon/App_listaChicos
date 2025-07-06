/**
 * Import/Export Service
 * Servicio para manejar importación y exportación de datos
 * 
 * @author Tommy
 * @version 1.0.0
 */

import { apiClient } from './api';

// Tipos para importación/exportación
export interface ImportResult {
  success: boolean;
  data?: {
    imported: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
    }>;
    duplicates: Array<{
      row: number;
      name: string;
      message: string;
    }>;
  };
  message: string;
  error?: string;
}

export interface ExportOptions {
  format?: 'excel' | 'csv';
  teamId?: number;
  includeChildren?: boolean;
}

export interface ImportInfo {
  supportedFormats: Array<{
    format: string;
    description: string;
    recommended: boolean;
  }>;
  maxFileSize: string;
  childrenColumns: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;
  teamsColumns: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;
  tips: string[];
}

export interface ExportInfo {
  exportOptions: Array<{
    endpoint: string;
    description: string;
    formats: string[];
    filters?: string[];
    options?: string[];
    content?: string[];
    defaultFormat: string;
  }>;
  supportedFormats: Array<{
    format: string;
    extension: string;
    description: string;
    features: string[];
    recommended: boolean;
    note?: string;
  }>;
  queryParameters: Record<string, any>;
  examples: string[];
}

class ImportExportService {
  /**
   * Obtener información sobre formatos de importación soportados
   */
  async getImportInfo(): Promise<ImportInfo> {
    try {
      const response = await apiClient.get('/import/info');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener información de importación:', error);
      throw new Error('Error al obtener información de importación');
    }
  }

  /**
   * Obtener información sobre opciones de exportación disponibles
   */
  async getExportInfo(): Promise<ExportInfo> {
    try {
      const response = await apiClient.get('/import/export/info');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener información de exportación:', error);
      throw new Error('Error al obtener información de exportación');
    }
  }

  /**
   * Descargar template para importar niños
   */
  async downloadChildrenTemplate(): Promise<void> {
    try {
      const response = await apiClient.get('/import/templates/children', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template_ninos.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar template de niños:', error);
      throw new Error('Error al descargar template de niños');
    }
  }

  /**
   * Descargar template para importar equipos
   */
  async downloadTeamsTemplate(): Promise<void> {
    try {
      const response = await apiClient.get('/import/templates/teams', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template_equipos.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar template de equipos:', error);
      throw new Error('Error al descargar template de equipos');
    }
  }

  /**
   * Importar niños desde archivo
   */
  async importChildren(file: File): Promise<ImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/import/children', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error al importar niños:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      throw new Error('Error al importar niños');
    }
  }

  /**
   * Importar equipos desde archivo
   */
  async importTeams(file: File): Promise<ImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/import/teams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error al importar equipos:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      throw new Error('Error al importar equipos');
    }
  }

  /**
   * Exportar niños
   */
  async exportChildren(options: ExportOptions = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      if (options.format) {
        params.append('format', options.format);
      }
      
      if (options.teamId) {
        params.append('teamId', options.teamId.toString());
      }

      const response = await apiClient.get(`/import/export/children?${params.toString()}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determinar extensión basada en el formato
      const extension = options.format === 'csv' ? 'csv' : 'xlsx';
      const teamSuffix = options.teamId ? `_equipo${options.teamId}` : '';
      const timestamp = new Date().toISOString().slice(0, 10);
      
      link.download = `lista_ninos${teamSuffix}_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar niños:', error);
      throw new Error('Error al exportar niños');
    }
  }

  /**
   * Exportar equipos
   */
  async exportTeams(options: ExportOptions = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      if (options.format) {
        params.append('format', options.format);
      }
      
      if (options.includeChildren !== undefined) {
        params.append('includeChildren', options.includeChildren.toString());
      }

      const response = await apiClient.get(`/import/export/teams?${params.toString()}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determinar extensión basada en el formato
      const extension = options.format === 'csv' ? 'csv' : 'xlsx';
      const timestamp = new Date().toISOString().slice(0, 10);
      
      link.download = `lista_equipos_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar equipos:', error);
      throw new Error('Error al exportar equipos');
    }
  }

  /**
   * Exportar reporte completo
   */
  async exportCompleteReport(options: ExportOptions = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      if (options.format) {
        params.append('format', options.format);
      }

      const response = await apiClient.get(`/import/export/report?${params.toString()}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determinar extensión basada en el formato
      const extension = options.format === 'csv' ? 'csv' : 'xlsx';
      const timestamp = new Date().toISOString().slice(0, 10);
      
      link.download = `reporte_completo_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar reporte completo:', error);
      throw new Error('Error al exportar reporte completo');
    }
  }

  /**
   * Validar archivo antes de subir
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Verificar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB permitido.'
      };
    }

    // Verificar extensión
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Solo se aceptan archivos .xlsx, .xls o .csv'
      };
    }

    return { valid: true };
  }
}

export const importExportService = new ImportExportService();
