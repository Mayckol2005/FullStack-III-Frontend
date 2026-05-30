import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient from './apiClient';
import { getToken, removeToken } from '../utils/storage';

vi.mock('../utils/storage', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

describe('Cliente de Red Base: apiClient.js', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe inyectar la cabecera Bearer Token si este existe en storage', async () => {
    getToken.mockReturnValue('token-secreto-123');
    fetch.mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(JSON.stringify({ ok: true })),
    });

    await apiClient('/test-endpoint');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-secreto-123',
        }),
      })
    );
  });

  it('no debe incluir la cabecera Authorization si no hay un token guardado', async () => {
    getToken.mockReturnValue(null);
    fetch.mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(JSON.stringify({ data: 'public' })),
    });

    await apiClient('/public-endpoint');

    const fetchCalls = fetch.mock.calls[0];
    const configEnviada = fetchCalls[1];
    expect(configEnviada.headers.Authorization).toBeUndefined();
  });

  it('debe limpiar el token, redirigir al login y fallar si el status es 401', async () => {
    fetch.mockResolvedValue({
      status: 401,
      text: vi.fn().mockResolvedValue(''),
    });

    await expect(apiClient('/restricted')).rejects.toThrow(
      'Sesión expirada. Por favor, inicie sesión nuevamente.'
    );

    expect(removeToken).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('debe retornar null de forma controlada si la respuesta del servidor es exitosa pero vacía', async () => {
    getToken.mockReturnValue(null);
    fetch.mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(''),
    });

    const resultado = await apiClient('/empty-success');
    expect(resultado).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('debe emitir un warning por consola si la respuesta de texto no es un JSON estructurado', async () => {
    getToken.mockReturnValue(null);
    fetch.mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('ESTO_NO_ES_UN_JSON_VALIDO_ABC'),
    });

    const resultado = await apiClient('/broken-json');

    expect(console.warn).toHaveBeenCalledWith('El backend no devolvió un JSON válido');
    expect(resultado).toBeNull();
  });

  it('debe arrojar un error estructurado si el servidor responde con un estado no exitoso utilizando el message del backend', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue(JSON.stringify({ message: 'Error interno crítico' })),
    });

    await expect(apiClient('/fail')).rejects.toThrow('Error interno crítico');
  });

  it('debe arrojar un error por defecto con el código HTTP si el backend no incluye datos del error', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: vi.fn().mockResolvedValue(''),
    });

    await expect(apiClient('/not-found')).rejects.toThrow('Error del servidor: 404');
  });
});