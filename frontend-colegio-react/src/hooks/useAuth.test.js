import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as authService from '../services/authService';
import {
  saveToken,
  saveUserRole
} from '../utils/storage';

vi.mock('../services/authService', () => ({
  login: vi.fn(),
  cerrarSesion: vi.fn(),
}));

describe('Hook useAuth', () => {
  beforeEach(() => {
    localStorage.clear();

    delete window.location;

    window.location = {
      href: '',
    };

    vi.clearAllMocks();
  });

  it('debe inicializar sin autenticación', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.autenticado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.rol).toBeNull();
    expect(result.current.cargando).toBe(false);
  });

  it('debe inicializar autenticado desde storage', () => {
    saveToken('token-viejo');
    saveUserRole('ADMINISTRADOR');

    const { result } = renderHook(() => useAuth());

    expect(result.current.autenticado).toBe(true);
    expect(result.current.token).toBe('token-viejo');
    expect(result.current.rol).toBe('ADMINISTRADOR');
  });

  it('debe actualizar estado con loginGlobal', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.loginGlobal(
        'nuevo-token',
        'PROFESOR'
      );
    });

    expect(result.current.autenticado).toBe(true);
    expect(result.current.token).toBe('nuevo-token');
    expect(result.current.rol).toBe('PROFESOR');
  });

  it('debe actualizar token y rol cuando login es exitoso', async () => {
    saveToken('token123');
    saveUserRole('ADMINISTRADOR');

    authService.login.mockResolvedValue({
      exito: true,
    });

    const { result } = renderHook(() => useAuth());

    let respuesta;

    await act(async () => {
      respuesta = await result.current.login(
        'admin',
        '1234'
      );
    });

    expect(respuesta.exito).toBe(true);

    expect(result.current.token).toBe(
      'token123'
    );

    expect(result.current.rol).toBe(
      'ADMINISTRADOR'
    );
  });

  it('debe devolver error cuando login falla', async () => {
    authService.login.mockRejectedValue(
      new Error('Servidor caído')
    );

    const { result } = renderHook(() => useAuth());

    let respuesta;

    await act(async () => {
      respuesta = await result.current.login(
        'admin',
        '1234'
      );
    });

    expect(respuesta).toEqual({
      exito: false,
      msg: 'Servidor caído',
    });
  });

  it('debe devolver resultado fallido cuando login retorna exito false', async () => {
  authService.login.mockResolvedValue({
    exito: false,
    msg: 'Credenciales inválidas',
  });

  const { result } = renderHook(() => useAuth());

  let respuesta;

  await act(async () => {
    respuesta = await result.current.login(
      'usuario',
      '1234'
    );
  });

  expect(respuesta).toEqual({
    exito: false,
    msg: 'Credenciales inválidas',
  });

  expect(result.current.autenticado).toBe(false);
});

  it('debe limpiar sesión y redirigir al hacer logoutGlobal', () => {
    saveToken('token-borrar');
    saveUserRole('ADMINISTRADOR');

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logoutGlobal();
    });

    expect(result.current.autenticado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.rol).toBeNull();

    expect(
      authService.cerrarSesion
    ).toHaveBeenCalled();

    expect(window.location.href).toBe(
      '/login'
    );
  });
});