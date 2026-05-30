import { describe, it, expect, vi, beforeEach } from 'vitest';
import { iniciarSesionBD, cerrarSesionBD } from './authService';
import apiClient from '../api/apiClient';
import { guardarToken, guardarRol, eliminarAuthData } from '../utils/auth';

// Mock de la API cliente y utilidades de auth
vi.mock('../api/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../utils/auth', () => ({
  guardarToken: vi.fn(),
  guardarRol: vi.fn(),
  eliminarAuthData: vi.fn(),
}));

describe('Servicio de Autenticación: authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('iniciarSesionBD', () => {
    it('debe almacenar token/rol y retornar éxito si las credenciales son correctas', async () => {
      const mockRespuesta = { token: 'jwt-token-valido_123', rol: 'ADMINISTRADOR' };
      apiClient.post.mockResolvedValue(mockRespuesta);

      const resultado = await iniciarSesionBD('admin', 'password');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'admin',
        password: 'password',
      });
      expect(guardarToken).toHaveBeenCalledWith('jwt-token-valido_123');
      expect(guardarRol).toHaveBeenCalledWith('ADMINISTRADOR');
      expect(resultado).toEqual({ exito: true, rol: 'ADMINISTRADOR' });
    });

    it('debe retornar falso si el servidor responde sin un token explícito', async () => {
      apiClient.post.mockResolvedValue({ msg: 'Falta segundo factor' });

      const resultado = await iniciarSesionBD('user', 'pass');

      expect(guardarToken).not.toHaveBeenCalled();
      expect(resultado).toEqual({ exito: false, msg: 'Falta segundo factor' });
    });

    it('debe retornar mensaje por defecto si la respuesta no tiene token ni mensaje explícito', async () => {
      apiClient.post.mockResolvedValue(null);

      const resultado = await iniciarSesionBD('user', 'pass');

      expect(resultado).toEqual({ exito: false, msg: 'Credenciales inválidas' });
    });

    it('debe capturar el error de respuesta HTTP del backend si las credenciales fallan', async () => {
      const errorBackend = {
        response: {
          data: { msg: 'Contraseña errónea' },
        },
      };
      apiClient.post.mockRejectedValue(errorBackend);

      const resultado = await iniciarSesionBD('usuario', 'malaclav');

      expect(resultado).toEqual({ exito: false, msg: 'Contraseña errónea' });
    });

    it('debe retornar un mensaje genérico si el servidor sufre una caída de red sin respuesta estructurada', async () => {
      apiClient.post.mockRejectedValue(new Error('Network Error'));

      const resultado = await iniciarSesionBD('usuario', 'clave');

      expect(resultado).toEqual({ exito: false, msg: 'Error de conexión con el servidor' });
    });
  });

  describe('cerrarSesionBD', () => {
    it('debe invocar la eliminación de los datos de autenticación del storage', () => {
      cerrarSesionBD();
      expect(eliminarAuthData).toHaveBeenCalledTimes(1);
    });
  });
});