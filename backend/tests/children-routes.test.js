const request = require('supertest');
const app = require('../server');
const testDatabase = require('./testDatabase');

describe('Children Routes', () => {
  beforeEach(async () => {
    // Limpiar datos de test
    await testDatabase.cleanTables();
  });

  afterAll(async () => {
    // Cleanup final
    await testDatabase.close();
  });

  describe('POST /api/children', () => {
    it('should create a new child', async () => {
      const childData = {
        name: 'Juan Pérez',
        age: 10,
        weight: 35.5,
        position: 'Delantero'
      };

      const response = await request(app)
        .post('/api/children')
        .send(childData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(childData.name);
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        age: 10,
        weight: 35.5
        // name is missing
      };

      const response = await request(app)
        .post('/api/children')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('name');
    });

    it('should validate data types', async () => {
      const invalidData = {
        name: 'Test Child',
        age: 'not-a-number',
        weight: 35.5,
        position: 'Medio'
      };

      const response = await request(app)
        .post('/api/children')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/children', () => {
    beforeEach(async () => {
      // Crear datos de prueba
      await request(app)
        .post('/api/children')
        .send({
          name: 'Child 1',
          age: 8,
          weight: 30,
          position: 'Portero'
        });
      
      await request(app)
        .post('/api/children')
        .send({
          name: 'Child 2',
          age: 12,
          weight: 40,
          position: 'Defensa'
        });
    });

    it('should get all children', async () => {
      const response = await request(app)
        .get('/api/children')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should search children by query', async () => {
      const response = await request(app)
        .get('/api/children?search=Child 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Child 1');
    });
  });

  describe('PUT /api/children/:id', () => {
    let childId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/children')
        .send({
          name: 'Original Name',
          age: 10,
          weight: 35,
          position: 'Medio'
        });
      childId = response.body.data.id;
    });

    it('should update child data', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 11,
        weight: 37
      };

      const response = await request(app)
        .put(`/api/children/${childId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.age).toBe(updateData.age);
    });

    it('should return 404 for non-existent child', async () => {
      const response = await request(app)
        .put('/api/children/99999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/children/:id', () => {
    let childId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/children')
        .send({
          name: 'To Delete',
          age: 10,
          weight: 35,
          position: 'Delantero'
        });
      childId = response.body.data.id;
    });

    it('should delete existing child', async () => {
      const response = await request(app)
        .delete(`/api/children/${childId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que ya no existe
      await request(app)
        .get(`/api/children/${childId}`)
        .expect(404);
    });

    it('should return 404 for non-existent child', async () => {
      const response = await request(app)
        .delete('/api/children/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/children/:id/move', () => {
    let childId, teamId;

    beforeEach(async () => {
      // Crear niño
      const childResponse = await request(app)
        .post('/api/children')
        .send({
          name: 'Test Child',
          age: 10,
          weight: 35,
          position: 'Medio'
        });
      childId = childResponse.body.data.id;

      // Crear equipo
      const teamResponse = await request(app)
        .post('/api/teams')
        .send({
          name: 'Test Team',
          maxPlayers: 11,
          ageRange: '10-12'
        });
      teamId = teamResponse.body.data.id;
    });

    it('should move child to team', async () => {
      const response = await request(app)
        .post(`/api/children/${childId}/move`)
        .send({ teamId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.team_id).toBe(teamId);
    });

    it('should remove child from team', async () => {
      // Primero asignar
      await request(app)
        .post(`/api/children/${childId}/move`)
        .send({ teamId });

      // Luego remover
      const response = await request(app)
        .post(`/api/children/${childId}/move`)
        .send({ teamId: null })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.team_id).toBeNull();
    });
  });
});
