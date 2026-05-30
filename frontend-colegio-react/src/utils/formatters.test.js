import { describe, it, expect } from 'vitest';
import { formatRut, formatNota } from './formatters';

describe('Utilidades: formatters', () => {
  describe('formatRut', () => {
    it('debe retornar un string vacío si no se recibe un valor', () => {
      expect(formatRut('')).toBe('');
      expect(formatRut(null)).toBe('');
    });

    it('debe formatear un RUT limpio correctamente', () => {
      expect(formatRut('123456789')).toBe('12.345.678-9');
      expect(formatRut('9876543k')).toBe('9.876.543-K');
    });

    it('debe manejar RUTs cortos correctamente', () => {
      expect(formatRut('5')).toBe('5');
    });
  });

  describe('formatNota', () => {
    it('debe formatear un número entero con un decimal', () => {
      expect(formatNota(6)).toBe('6.0');
    });

    it('debe mantener el decimal de una nota flotante', () => {
      expect(formatNota(5.7)).toBe('5.7');
    });

    it('debe retornar 0.0 si el valor no es un número válido', () => {
      expect(formatNota('not-a-number')).toBe('0.0');
    });
  });
});