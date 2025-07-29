const Children = require('../models/Children');
const testDatabase = require('./testDatabase');

describe('Children Model', () => {
  beforeEach(async () => {
    // Limpiar datos de test
    await testDatabase.cleanTables();
  });

  afterAll(async () => {
    // Cleanup final
    await testDatabase.close();
  });

  describe('createChild', () => {
    it('should create a child with valid data', async () => {
      const childData = {
        name: 'Juan Pérez',
        age: 10,
        weight: 35.5,
        position: 'Delantero',
        team_id: null
      };

      const result = await Children.createChild(childData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data.name).toBe(childData.name);
      expect(result.data.age).toBe(childData.age);
      expect(result.data.weight).toBe(childData.weight);
    });

    it('should fail with missing required fields', async () => {
      const invalidData = {
        age: 10,
        weight: 35.5
        // name is missing
      };

      const result = await Children.createChild(invalidData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('name');
    });

    it('should validate age range', async () => {
      const invalidAgeData = {
        name: 'Test Child',
        age: 25, // Invalid age
        weight: 35.5,
        position: 'Defensa'
      };

      const result = await Children.createChild(invalidAgeData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('edad');
    });

    it('should validate weight range', async () => {
      const invalidWeightData = {
        name: 'Test Child',
        age: 10,
        weight: 150, // Invalid weight
        position: 'Defensa'
      };

      const result = await Children.createChild(invalidWeightData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('peso');
    });
  });

  describe('getAllChildren', () => {
    beforeEach(async () => {
      // Crear datos de prueba
      await Children.createChild({
        name: 'Child 1',
        age: 8,
        weight: 30,
        position: 'Portero'
      });
      await Children.createChild({
        name: 'Child 2',
        age: 12,
        weight: 40,
        position: 'Defensa'
      });
    });

    it('should return all children', async () => {
      const result = await Children.getAllChildren();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('age');
    });

    it('should return empty array when no children exist', async () => {
      await db.prepare('DELETE FROM children').run();
      
      const result = await Children.getAllChildren();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('updateChild', () => {
    let childId;

    beforeEach(async () => {
      const child = await Children.createChild({
        name: 'Original Name',
        age: 10,
        weight: 35,
        position: 'Medio'
      });
      childId = child.data.id;
    });

    it('should update child data', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 11,
        weight: 37
      };

      const result = await Children.updateChild(childId, updateData);
      
      expect(result.success).toBe(true);
      expect(result.data.name).toBe(updateData.name);
      expect(result.data.age).toBe(updateData.age);
      expect(result.data.weight).toBe(updateData.weight);
    });

    it('should fail with invalid child ID', async () => {
      const result = await Children.updateChild(99999, { name: 'Test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('no encontrado');
    });

    it('should validate updated data', async () => {
      const invalidData = {
        age: 25 // Invalid age
      };

      const result = await Children.updateChild(childId, invalidData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('edad');
    });
  });

  describe('deleteChild', () => {
    let childId;

    beforeEach(async () => {
      const child = await Children.createChild({
        name: 'To Delete',
        age: 10,
        weight: 35,
        position: 'Delantero'
      });
      childId = child.data.id;
    });

    it('should delete existing child', async () => {
      const result = await Children.deleteChild(childId);
      expect(result.success).toBe(true);

      // Verificar que ya no existe
      const getResult = await Children.getChildById(childId);
      expect(getResult.success).toBe(false);
    });

    it('should fail with non-existent child ID', async () => {
      const result = await Children.deleteChild(99999);
      expect(result.success).toBe(false);
      expect(result.error).toContain('no encontrado');
    });
  });

  describe('searchChildren', () => {
    beforeEach(async () => {
      await Children.createChild({ name: 'Juan Carlos', age: 10, weight: 35, position: 'Portero' });
      await Children.createChild({ name: 'María Fernández', age: 9, weight: 32, position: 'Defensa' });
      await Children.createChild({ name: 'Carlos Rodríguez', age: 11, weight: 38, position: 'Medio' });
    });

    it('should search by name', async () => {
      const result = await Children.searchChildren('Carlos');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data.every(child => child.name.includes('Carlos'))).toBe(true);
    });

    it('should search by position', async () => {
      const result = await Children.searchChildren('Portero');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].position).toBe('Portero');
    });

    it('should return empty for non-matching search', async () => {
      const result = await Children.searchChildren('NoExiste');
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('moveChildToTeam', () => {
    let childId, teamId;

    beforeEach(async () => {
      // Crear niño de prueba
      const child = await Children.createChild({
        name: 'Test Child',
        age: 10,
        weight: 35,
        position: 'Medio'
      });
      childId = child.data.id;

      // Crear equipo de prueba (simulado)
      teamId = 1;
    });

    it('should move child to team', async () => {
      const result = await Children.moveChildToTeam(childId, teamId);
      
      expect(result.success).toBe(true);
      expect(result.data.team_id).toBe(teamId);
    });

    it('should remove child from team (set to null)', async () => {
      // Primero asignar a equipo
      await Children.moveChildToTeam(childId, teamId);
      
      // Luego remover
      const result = await Children.moveChildToTeam(childId, null);
      
      expect(result.success).toBe(true);
      expect(result.data.team_id).toBeNull();
    });
  });
});
