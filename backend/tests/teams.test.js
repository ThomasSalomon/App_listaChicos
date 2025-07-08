const TeamsModel = require('../models/Teams');
const testDatabase = require('./testDatabase');

describe('Teams Model', () => {
  beforeEach(async () => {
    // Limpiar datos de test
    await testDatabase.cleanTables();
  });

  afterAll(async () => {
    // Cleanup final
    await testDatabase.close();
  });

  describe('create', () => {
    test('debe crear un equipo correctamente', async () => {
      const teamData = {
        nombre: 'Equipo Test',
        descripcion: 'Descripción del equipo test',
        color: '#FF0000'
      };

      const result = await TeamsModel.create(teamData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.nombre).toBe(teamData.nombre);
      expect(result.descripcion).toBe(teamData.descripcion);
      expect(result.color).toBe(teamData.color);
    });

    test('debe fallar si falta el nombre', async () => {
      const teamData = {
        descripcion: 'Descripción sin nombre',
        color: '#FF0000'
      };

      await expect(TeamsModel.create(teamData)).rejects.toThrow();
    });

    test('debe usar color por defecto si no se proporciona', async () => {
      const teamData = {
        nombre: 'Equipo Sin Color',
        descripcion: 'Descripción del equipo'
      };

      const result = await TeamsModel.create(teamData);

      expect(result.color).toBeDefined();
      expect(result.color).toMatch(/^#[0-9A-F]{6}$/i); // Formato hex válido
    });
  });

  describe('getAll', () => {
    test('debe retornar un array vacío si no hay equipos', async () => {
      const teams = await TeamsModel.getAll();
      expect(Array.isArray(teams)).toBe(true);
      expect(teams.length).toBe(0);
    });

    test('debe retornar todos los equipos activos', async () => {
      // Crear algunos equipos de prueba
      await TeamsModel.create({
        nombre: 'Equipo 1',
        descripcion: 'Primer equipo',
        color: '#FF0000'
      });

      await TeamsModel.create({
        nombre: 'Equipo 2',
        descripcion: 'Segundo equipo',
        color: '#00FF00'
      });

      const teams = await TeamsModel.getAll();
      expect(teams.length).toBe(2);
      expect(teams[0].nombre).toBeDefined();
      expect(teams[1].nombre).toBeDefined();
    });
  });

  describe('getById', () => {
    test('debe retornar el equipo correcto por ID', async () => {
      const teamData = {
        nombre: 'Equipo Específico',
        descripcion: 'Para test de ID',
        color: '#0000FF'
      };

      const createdTeam = await TeamsModel.create(teamData);
      const foundTeam = await TeamsModel.getById(createdTeam.id);

      expect(foundTeam).toBeDefined();
      expect(foundTeam.id).toBe(createdTeam.id);
      expect(foundTeam.nombre).toBe(teamData.nombre);
    });

    test('debe retornar null si el ID no existe', async () => {
      const foundTeam = await TeamsModel.getById(999999);
      expect(foundTeam).toBeNull();
    });
  });

  describe('update', () => {
    test('debe update un equipo correctamente', async () => {
      const teamData = {
        nombre: 'Equipo Original',
        descripcion: 'Descripción original',
        color: '#FF0000'
      };

      const createdTeam = await TeamsModel.create(teamData);

      const updateData = {
        nombre: 'Equipo Actualizado',
        descripcion: 'Descripción actualizada',
        color: '#00FF00'
      };

      const updatedTeam = await TeamsModel.update(createdTeam.id, updateData);

      expect(updatedTeam.nombre).toBe(updateData.nombre);
      expect(updatedTeam.descripcion).toBe(updateData.descripcion);
      expect(updatedTeam.color).toBe(updateData.color);
    });

    test('debe fallar si el equipo no existe', async () => {
      const updateData = {
        nombre: 'Equipo No Existe'
      };

      await expect(TeamsModel.update(999999, updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    test('debe marcar un equipo como inactivo', async () => {
      const teamData = {
        nombre: 'Equipo a Eliminar',
        descripcion: 'Para test de eliminación',
        color: '#FF0000'
      };

      const createdTeam = await TeamsModel.create(teamData);
      await TeamsModel.delete(createdTeam.id);

      const foundTeam = await TeamsModel.getById(createdTeam.id);
      expect(foundTeam).toBeNull(); // No debe aparecer en búsquedas normales
    });

    test('debe fallar si el equipo no existe', async () => {
      await expect(TeamsModel.delete(999999)).rejects.toThrow();
    });
  });
});
