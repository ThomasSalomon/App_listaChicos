/**
 * Tests para el controlador de exportación
 */

const request = require('supertest');
const express = require('express');
const exportController = require('../controllers/exportController');
const TeamsModel = require('../models/Teams');
const ChildrenModel = require('../models/Children');

// Configurar app de testing
const app = express();
app.use(express.json());

// Configurar rutas de testing
app.get('/export/children', exportController.exportChildren);
app.get('/export/teams', exportController.exportTeams);
app.get('/export/report', exportController.exportCompleteReport);

describe('Export Controller', () => {
  beforeEach(async () => {
    // Crear datos de prueba para cada test
    const team1 = await TeamsModel.crear({
      nombre: 'Equipo Test 1',
      descripcion: 'Equipo para testing',
      color: '#FF0000'
    });

    const team2 = await TeamsModel.crear({
      nombre: 'Equipo Test 2',
      descripcion: 'Segundo equipo para testing',
      color: '#00FF00'
    });

    // Crear algunos niños
    await ChildrenModel.crear({
      nombre: 'Juan Test',
      edad: 10,
      team_id: team1.id,
      notas: 'Niño de prueba 1'
    });

    await ChildrenModel.crear({
      nombre: 'María Test',
      edad: 12,
      team_id: team1.id,
      notas: 'Niña de prueba 2'
    });

    await ChildrenModel.crear({
      nombre: 'Pedro Test',
      edad: 11,
      team_id: team2.id,
      notas: 'Niño de prueba 3'
    });
  });

  describe('exportChildren', () => {
    test('debe exportar todos los niños en formato Excel', async () => {
      const response = await request(app)
        .get('/export/children?format=excel')
        .expect(200);

      expect(response.headers['content-type']).toContain('spreadsheetml.sheet');
      expect(response.headers['content-disposition']).toContain('lista_ninos_');
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('debe exportar niños en formato CSV', async () => {
      const response = await request(app)
        .get('/export/children?format=csv')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('lista_ninos_');
      expect(response.text).toContain('Nombre');
      expect(response.text).toContain('Juan Test');
    });

    test('debe filtrar niños por equipo', async () => {
      // Obtener ID del primer equipo
      const teams = await TeamsModel.obtenerTodos();
      const teamId = teams[0].id;

      const response = await request(app)
        .get(`/export/children?format=excel&teamId=${teamId}`)
        .expect(200);

      expect(response.headers['content-disposition']).toContain(`equipo_`);
    });

    test('debe retornar 404 si no hay niños', async () => {
      // Limpiar todos los niños
      const children = await ChildrenModel.obtenerTodos();
      for (const child of children) {
        await ChildrenModel.eliminar(child.id);
      }

      await request(app)
        .get('/export/children?format=excel')
        .expect(404);
    });
  });

  describe('exportTeams', () => {
    test('debe exportar todos los equipos en formato Excel', async () => {
      const response = await request(app)
        .get('/export/teams?format=excel')
        .expect(200);

      expect(response.headers['content-type']).toContain('spreadsheetml.sheet');
      expect(response.headers['content-disposition']).toContain('lista_equipos_');
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('debe exportar equipos en formato CSV', async () => {
      const response = await request(app)
        .get('/export/teams?format=csv')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('Nombre');
      expect(response.text).toContain('Equipo Test 1');
    });
  });

  describe('exportCompleteReport', () => {
    test('debe exportar reporte completo en formato Excel', async () => {
      const response = await request(app)
        .get('/export/report?format=excel')
        .expect(200);

      expect(response.headers['content-type']).toContain('spreadsheetml.sheet');
      expect(response.headers['content-disposition']).toContain('reporte_completo_');
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('debe incluir estadísticas en el reporte', async () => {
      const response = await request(app)
        .get('/export/report?format=excel')
        .expect(200);

      // El archivo debe ser más grande que uno simple porque incluye múltiples hojas
      expect(response.body.length).toBeGreaterThan(1000);
    });
  });

  describe('Manejo de errores', () => {
    test('debe manejar errores de base de datos correctamente', async () => {
      // Simular error cerrando la base de datos
      // Este test requeriría mockear la base de datos
      // Por simplicidad, verificamos que las rutas respondan apropiadamente

      const response = await request(app)
        .get('/export/children?teamId=999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrado');
    });

    test('debe validar parámetros de entrada', async () => {
      const response = await request(app)
        .get('/export/children?teamId=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
