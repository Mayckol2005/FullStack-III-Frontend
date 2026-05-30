import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { saveToken, saveUserRole } from '../utils/storage';

describe('Hook useAuth', () => {
  beforeEach(() => {
    // Limpiamos todo antes de cada prueba
    localStorage.clear();
    
    // "Mockeamos" (simulamos) window.location para que JSDOM no explote al hacer la redirección del logout
    delete window.location;
    window.location = { href: '' };
  });

  it('debe inicializar sin autenticación si el storage está vacío', () => {
    const { result } = renderHook(() => useAuth());
    
    // Al principio, no debería estar logueado
    expect(result.current.autenticado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.rol).toBeNull();
    expect(result.current.cargando).toBe(false);
  });

  it('debe inicializar autenticado si ya hay datos en el storage', () => {
    // Simulamos que el usuario ya se había logueado antes
    saveToken('token-viejo');
    saveUserRole('ADMINISTRADOR');

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.autenticado).toBe(true);
    expect(result.current.token).toBe('token-viejo');
    expect(result.current.rol).toBe('ADMINISTRADOR');
  });

  it('debe iniciar sesión globalmente con loginGlobal', () => {
    const { result } = renderHook(() => useAuth());

    // act() envuelve cualquier función que actualice el estado de React
    act(() => {
      result.current.loginGlobal('nuevo-token-123', 'PROFESOR');
    });

    expect(result.current.autenticado).toBe(true);
    expect(result.current.token).toBe('nuevo-token-123');
    expect(result.current.rol).toBe('PROFESOR');
  });

  it('debe limpiar todo y redirigir al hacer logoutGlobal', () => {
    saveToken('token-a-borrar');
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logoutGlobal();
    });

    expect(result.current.autenticado).toBe(false);
    expect(result.current.token).toBeNull();
    expect(window.location.href).toBe('/login'); // Verificamos que hizo la redirección
  });
});