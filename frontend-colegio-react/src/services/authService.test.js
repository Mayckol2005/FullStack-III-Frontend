import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, cerrarSesion } from './authService';
import apiClient from '../api/apiClient';
import { saveToken, saveUserRole, removeToken } from '../utils/storage';

// Mock del apiClient como una función simple
vi.mock('../api/apiClient', () => ({
  default: vi.fn(), 
}));

vi.mock('../utils/storage', () => ({
  saveToken: vi.fn(),
  saveUserRole: vi.fn(),
  removeToken: vi.fn(),
}));

describe('Servicio de Autenticación: authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('debe almacenar token/rol y retornar éxito si las credenciales son correctas', async () => {
      const mockRespuesta = { token: 'jwt-token-valido_123', rol: 'ADMINISTRADOR' };
      apiClient.mockResolvedValue(mockRespuesta); 

      const resultado = await login('admin', 'password');

      expect(apiClient).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin', password: 'password' })
      }));
      expect(saveToken).toHaveBeenCalledWith('jwt-token-valido_123');
      expect(saveUserRole).toHaveBeenCalledWith('ADMINISTRADOR');
      expect(resultado).toEqual({ exito: true, rol: 'ADMINISTRADOR', token: 'jwt-token-valido_123' });
    });

    it('debe retornar falso si el servidor responde sin un token explícito', async () => {
      apiClient.mockResolvedValue({ msg: 'Falta segundo factor' });

      const resultado = await login('user', 'pass');

      expect(saveToken).not.toHaveBeenCalled();
      expect(resultado).toEqual({ exito: false, msg: 'Falta segundo factor' });
    });

    it('debe retornar mensaje por defecto si la respuesta es nula', async () => {
      apiClient.mockResolvedValue(null);

      const resultado = await login('user', 'pass');

      expect(resultado).toEqual({ exito: false, msg: 'Credenciales inválidas' });
    });

    it('debe capturar el error de red o backend', async () => {
      apiClient.mockRejectedValue(new Error('Error de conexión con el servidor'));

      const resultado = await login('usuario', 'clave');

      expect(resultado).toEqual({ exito: false, msg: 'Error de conexión con el servidor' });
    });
  });

  describe('cerrarSesion', () => {
    it('debe invocar la eliminación de los datos de autenticación del storage', () => {
      cerrarSesion();
      expect(removeToken).toHaveBeenCalledTimes(1);
    });
  });
});