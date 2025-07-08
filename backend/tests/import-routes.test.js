const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const path = require('path');
const fs = require('fs');

describe('Import Routes', () => {
  beforeEach(async () => {
    // Limpiar datos de test
    await db.prepare('DELETE FROM children').run();
    await db.prepare('DELETE FROM teams').run();
  });

  afterAll(async () => {
    // Cleanup final
    await db.prepare('DELETE FROM children').run();
    await db.prepare('DELETE FROM teams').run();
    db.close();
  });

  describe('POST /api/import/children', () => {
    it('should import children from CSV', async () => {
      // Crear archivo CSV de prueba
      const csvContent = 'Nombre,Edad,Peso,Posición\nJuan Pérez,10,35.5,Delantero\nMaría García,9,32.0,Defensa';
      const csvPath = path.join(__dirname, 'test-children.csv');
      fs.writeFileSync(csvPath, csvContent);

      const response = await request(app)
        .post('/api/import/children')
        .attach('file', csvPath)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(2);
      expect(response.body.data.errors).toHaveLength(0);

      // Limpiar archivo de prueba
      fs.unlinkSync(csvPath);
    });

    it('should handle invalid CSV data', async () => {
      // CSV con datos inválidos
      const csvContent = 'Nombre,Edad,Peso,Posición\n,25,35.5,Delantero\nMaría García,9,200,Defensa';
      const csvPath = path.join(__dirname, 'test-invalid.csv');
      fs.writeFileSync(csvPath, csvContent);

      const response = await request(app)
        .post('/api/import/children')
        .attach('file', csvPath)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(0);
      expect(response.body.data.errors).toHaveLength(2);

      // Limpiar archivo de prueba
      fs.unlinkSync(csvPath);
    });

    it('should require file upload', async () => {
      const response = await request(app)
        .post('/api/import/children')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('archivo');
    });
  });

  describe('POST /api/import/teams', () => {
    it('should import teams from CSV', async () => {
      const csvContent = 'Nombre,Jugadores Máximos,Rango de Edad\nEquipo A,11,10-12\nEquipo B,7,8-10';
      const csvPath = path.join(__dirname, 'test-teams.csv');
      fs.writeFileSync(csvPath, csvContent);

      const response = await request(app)
        .post('/api/import/teams')
        .attach('file', csvPath)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(2);
      expect(response.body.data.errors).toHaveLength(0);

      // Limpiar archivo de prueba
      fs.unlinkSync(csvPath);
    });

    it('should handle duplicate team names', async () => {
      // Crear un equipo primero
      await request(app)
        .post('/api/teams')
        .send({
          name: 'Equipo Existente',
          maxPlayers: 11,
          ageRange: '10-12'
        });

      const csvContent = 'Nombre,Jugadores Máximos,Rango de Edad\nEquipo Existente,11,10-12\nEquipo Nuevo,7,8-10';
      const csvPath = path.join(__dirname, 'test-duplicate.csv');
      fs.writeFileSync(csvPath, csvContent);

      const response = await request(app)
        .post('/api/import/teams')
        .attach('file', csvPath)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(1);
      expect(response.body.data.errors).toHaveLength(1);
      expect(response.body.data.errors[0]).toContain('ya existe');

      // Limpiar archivo de prueba
      fs.unlinkSync(csvPath);
    });
  });

  describe('GET /api/import/template/children', () => {
    it('should download children template', async () => {
      const response = await request(app)
        .get('/api/import/template/children')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('template-children.csv');
      expect(response.text).toContain('Nombre,Edad,Peso,Posición');
    });
  });

  describe('GET /api/import/template/teams', () => {
    it('should download teams template', async () => {
      const response = await request(app)
        .get('/api/import/template/teams')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('template-teams.csv');
      expect(response.text).toContain('Nombre,Jugadores Máximos,Rango de Edad');
    });
  });
});
