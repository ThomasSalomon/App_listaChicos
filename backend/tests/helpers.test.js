const { validateChild, validateTeam, errorResponse, successResponse } = require('../utils/helpers');

describe('Helpers', () => {
  describe('validateChild', () => {
    it('should validate correct child data', () => {
      const validChild = {
        name: 'Juan Pérez',
        age: 10,
        weight: 35.5,
        position: 'Delantero'
      };

      expect(() => validateChild(validChild)).not.toThrow();
    });

    it('should throw error for missing name', () => {
      const invalidChild = {
        age: 10,
        weight: 35.5,
        position: 'Delantero'
      };

      expect(() => validateChild(invalidChild)).toThrow(/nombre/i);
    });

    it('should throw error for invalid age', () => {
      const invalidChild = {
        name: 'Test',
        age: 25,
        weight: 35.5,
        position: 'Delantero'
      };

      expect(() => validateChild(invalidChild)).toThrow(/edad/i);
    });

    it('should throw error for invalid weight', () => {
      const invalidChild = {
        name: 'Test',
        age: 10,
        weight: 150,
        position: 'Delantero'
      };

      expect(() => validateChild(invalidChild)).toThrow(/peso/i);
    });
  });

  describe('validateTeam', () => {
    it('should validate correct team data', () => {
      const validTeam = {
        name: 'Equipo A',
        maxPlayers: 11,
        ageRange: '10-12'
      };

      expect(() => validateTeam(validTeam)).not.toThrow();
    });

    it('should throw error for missing name', () => {
      const invalidTeam = {
        maxPlayers: 11,
        ageRange: '10-12'
      };

      expect(() => validateTeam(invalidTeam)).toThrow(/nombre/i);
    });

    it('should throw error for invalid maxPlayers', () => {
      const invalidTeam = {
        name: 'Test Team',
        maxPlayers: 0,
        ageRange: '10-12'
      };

      expect(() => validateTeam(invalidTeam)).toThrow(/jugadores/i);
    });
  });

  describe('Response helpers', () => {
    describe('successResponse', () => {
      it('should create success response with data', () => {
        const data = { id: 1, name: 'Test' };
        const response = successResponse(data, 'Success message');

        expect(response).toEqual({
          success: true,
          data,
          message: 'Success message'
        });
      });

      it('should create success response without message', () => {
        const data = { id: 1 };
        const response = successResponse(data);

        expect(response).toEqual({
          success: true,
          data
        });
      });
    });

    describe('errorResponse', () => {
      it('should create error response with message', () => {
        const error = 'Error occurred';
        const response = errorResponse(error);

        expect(response).toEqual({
          success: false,
          error
        });
      });

      it('should handle Error objects', () => {
        const error = new Error('Test error');
        const response = errorResponse(error);

        expect(response).toEqual({
          success: false,
          error: 'Test error'
        });
      });
    });
  });
});

describe('Validation Middleware', () => {
  // Mock middleware tests removed since validation module doesn't exist
  // This could be implemented separately if needed
});
