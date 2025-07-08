/**
 * Tests de integración para las rutas de Teams
 */

const request = require('supertest');
const express = require('express');
const teamsRouter = require('../routes/teams');

// Configurar app de testing
const app = express();
app.use(express.json());
app.use('/api/teams', teamsRouter);

describe('Teams API Routes', () => {
  describe('GET /api/teams', () => {
    test('debe retornar lista vacía inicialmente', async () => {
      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('debe retornar todos los equipos', async () => {
      // Crear un equipo primero
      await request(app)
        .post('/api/teams')
        .send({
          nombre: 'Equipo API Test',
          descripcion: 'Test desde API',
          color: '#FF0000'
        });

      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe('Equipo API Test');
    });
  });

  describe('POST /api/teams', () => {
    test('debe crear un equipo correctamente', async () => {
      const teamData = {
        nombre: 'Nuevo Equipo API',
        descripcion: 'Creado desde test',
        color: '#00FF00'
      };

      const response = await request(app)
        .post('/api/teams')
        .send(teamData)
        .expect(201);

      expect(response.body.nombre).toBe(teamData.nombre);
      expect(response.body.descripcion).toBe(teamData.descripcion);
      expect(response.body.color).toBe(teamData.color);
      expect(response.body.id).toBeDefined();
    });

    test('debe fallar con datos inválidos', async () => {
      const invalidData = {
        descripcion: 'Sin nombre',
        color: '#FF0000'
      };

      await request(app)
        .post('/api/teams')
        .send(invalidData)
        .expect(400);
    });

    test('debe usar valores por defecto cuando corresponda', async () => {
      const minimalData = {
        nombre: 'Equipo Mínimo'
      };

      const response = await request(app)
        .post('/api/teams')
        .send(minimalData)
        .expect(201);

      expect(response.body.nombre).toBe(minimalData.nombre);
      expect(response.body.color).toBeDefined();
      expect(response.body.descripcion).toBe('');
    });
  });

  describe('GET /api/teams/:id', () => {
    test('debe retornar un equipo específico', async () => {
      // Crear un equipo
      const createResponse = await request(app)
        .post('/api/teams')
        .send({
          nombre: 'Equipo Específico',
          descripcion: 'Para test de ID',
          color: '#0000FF'
        });

      const teamId = createResponse.body.id;

      // Obtener el equipo por ID
      const response = await request(app)
        .get(`/api/teams/${teamId}`)
        .expect(200);

      expect(response.body.id).toBe(teamId);
      expect(response.body.nombre).toBe('Equipo Específico');
    });

    test('debe retornar 404 para ID inexistente', async () => {
      await request(app)
        .get('/api/teams/999999')
        .expect(404);
    });

    test('debe retornar 400 para ID inválido', async () => {
      await request(app)
        .get('/api/teams/invalid-id')
        .expect(400);
    });
  });

  describe('PUT /api/teams/:id', () => {
    test('debe actualizar un equipo correctamente', async () => {
      // Crear un equipo
      const createResponse = await request(app)
        .post('/api/teams')
        .send({
          nombre: 'Equipo Original',
          descripcion: 'Descripción original',
          color: '#FF0000'
        });

      const teamId = createResponse.body.id;

      // Actualizar el equipo
      const updateData = {
        nombre: 'Equipo Actualizado',
        descripcion: 'Descripción actualizada',
        color: '#00FF00'
      };

      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nombre).toBe(updateData.nombre);
      expect(response.body.descripcion).toBe(updateData.descripcion);
      expect(response.body.color).toBe(updateData.color);
    });

    test('debe retornar 404 para equipo inexistente', async () => {
      await request(app)
        .put('/api/teams/999999')
        .send({ nombre: 'No existe' })
        .expect(404);
    });
  });

  describe('DELETE /api/teams/:id', () => {
    test('debe eliminar un equipo correctamente', async () => {
      // Crear un equipo
      const createResponse = await request(app)
        .post('/api/teams')
        .send({
          nombre: 'Equipo a Eliminar',
          descripcion: 'Para test de eliminación',
          color: '#FF0000'
        });

      const teamId = createResponse.body.id;

      // Eliminar el equipo
      await request(app)
        .delete(`/api/teams/${teamId}`)
        .expect(204);

      // Verificar que no existe
      await request(app)
        .get(`/api/teams/${teamId}`)
        .expect(404);
    });

    test('debe retornar 404 para equipo inexistente', async () => {
      await request(app)
        .delete('/api/teams/999999')
        .expect(404);
    });
  });
});
