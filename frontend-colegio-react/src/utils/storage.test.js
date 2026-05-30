import { describe, it, expect, beforeEach } from 'vitest';
import { saveToken, getToken, removeToken, saveUserRole, getUserRole, clearAuth } from './storage';

describe('Funciones de Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe guardar y recuperar un token correctamente', () => {
    const testToken = 'mi-token-secreto';
    saveToken(testToken);
    expect(getToken()).toBe(testToken);
  });

  it('debe eliminar el token correctamente', () => {
    saveToken('token-a-borrar');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('debe guardar y recuperar el rol del usuario', () => {
    const testRol = 'ADMINISTRADOR';
    saveUserRole(testRol);
    expect(getUserRole()).toBe(testRol);
  });

  it('debe limpiar toda la autenticación con clearAuth', () => {
    saveToken('token-prueba');
    saveUserRole('PROFESOR');
    
    clearAuth(); // Llamamos a la función que limpia todo
    
    expect(getToken()).toBeNull();
    expect(getUserRole()).toBeNull();
  });
});