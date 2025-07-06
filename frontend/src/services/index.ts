/**
 * Services Index
 * Exportaciones centralizadas de todos los servicios
 */

export { teamsService } from './teamsService';
export { childrenService } from './childrenService';
export { importExportService } from './importExportService';
export { apiClient } from './api';

// Re-exportar defaults
export { default as TeamsService } from './teamsService';
export { default as ChildrenService } from './childrenService';
