import { describe, it, expect } from 'vitest';
import { getRolEtiqueta, tienePermiso } from './auth';

describe('Utilidades: auth', () => {
  describe('getRolEtiqueta', () => {
    it('debe retornar la etiqueta correcta para roles conocidos', () => {
      expect(getRolEtiqueta('ADMIN')).toBe('Administrador');
      expect(getRolEtiqueta('PROFESOR')).toBe('Profesor de Aula');
      expect(getRolEtiqueta('ESTUDIANTE')).toBe('Estudiante');
    });

    it('debe retornar Usuario General si el rol no es reconocido o es nulo', () => {
      expect(getRolEtiqueta('OTRO_ROL')).toBe('Usuario General');
      expect(getRolEtiqueta(null)).toBe('Usuario General');
    });
  });

  describe('tienePermiso', () => {
    it('debe retornar true si no se requiere un rol específico', () => {
      expect(tienePermiso('ESTUDIANTE', null)).toBe(true);
    });

    it('debe retornar false si se requiere un rol pero el usuario no tiene ninguno', () => {
      expect(tienePermiso(null, 'ADMIN')).toBe(false);
    });

    it('debe retornar true si los roles coinciden sin importar mayúsculas/minúsculas', () => {
      expect(tienePermiso('profesor', 'PROFESOR')).toBe(true);
    });

    it('debe retornar false si los roles no coinciden', () => {
      expect(tienePermiso('ESTUDIANTE', 'PROFESOR')).toBe(false);
    });
  });
});