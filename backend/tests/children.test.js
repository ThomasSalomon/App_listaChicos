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

  describe('create', () => {
    it('should create a child with valid data', async () => {
      const childData = {
        name: 'Juan Pérez',
        age: 10,
        weight: 35.5,
        position: 'Delantero',
        team_id: null
      };

      const result = await Children.create(childData);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(childData.name);
      expect(result.age).toBe(childData.age);
      expect(result.weight).toBe(childData.weight);
    });

    it('should fail with missing required fields', async () => {
      const invalidData = {
        age: 10,
        weight: 35.5
        // name is missing
      };

      await expect(Children.create(invalidData)).rejects.toThrow();
    });

    it('should create child with default values', async () => {
      const childData = {
        name: 'Test Child',
        age: 10,
        weight: 35.5,
        position: 'Defensa'
      };

      const result = await Children.create(childData);
      expect(result).toBeDefined();
      expect(result.team_id).toBeNull();
    });
  });

  describe('getAll', () => {
    beforeEach(async () => {
      // Crear datos de prueba
      await Children.create({
        name: 'Child 1',
        age: 8,
        weight: 30,
        position: 'Portero'
      });
      await Children.create({
        name: 'Child 2',
        age: 12,
        weight: 40,
        position: 'Defensa'
      });
    });

    it('should return all children', async () => {
      const result = await Children.getAll();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('age');
    });

    it('should return empty array when no children exist', async () => {
      await testDatabase.cleanTables();
      
      const result = await Children.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    let childId;

    beforeEach(async () => {
      const child = await Children.create({
        name: 'Original Name',
        age: 10,
        weight: 35,
        position: 'Medio'
      });
      childId = child.id;
    });

    it('should update child data', async () => {
      const updateData = {
        name: 'Updated Name',
        age: 11,
        weight: 37
      };

      const result = await Children.update(childId, updateData);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
      expect(result.age).toBe(updateData.age);
      expect(result.weight).toBe(updateData.weight);
    });

    it('should fail with invalid child ID', async () => {
      await expect(Children.update(99999, { name: 'Test' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    let childId;

    beforeEach(async () => {
      const child = await Children.create({
        name: 'To Delete',
        age: 10,
        weight: 35,
        position: 'Delantero'
      });
      childId = child.id;
    });

    it('should delete existing child', async () => {
      await Children.delete(childId);

      // Verificar que ya no existe
      await expect(Children.getById(childId)).rejects.toThrow();
    });

    it('should fail with non-existent child ID', async () => {
      await expect(Children.delete(99999)).rejects.toThrow();
    });
  });

  describe('getById', () => {
    let childId;

    beforeEach(async () => {
      const child = await Children.create({
        name: 'Test Child',
        age: 10,
        weight: 35,
        position: 'Medio'
      });
      childId = child.id;
    });

    it('should get child by ID', async () => {
      const result = await Children.getById(childId);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(childId);
      expect(result.name).toBe('Test Child');
    });

    it('should fail with non-existent ID', async () => {
      await expect(Children.getById(99999)).rejects.toThrow();
    });
  });
});
