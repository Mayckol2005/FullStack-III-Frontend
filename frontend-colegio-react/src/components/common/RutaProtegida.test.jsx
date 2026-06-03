import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RutaProtegida from './RutaProtegida';

describe('Componente: RutaProtegida', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe redirigir al Login si no existe un token', () => {
    render(
      <BrowserRouter>
        <RutaProtegida><div>Privado</div></RutaProtegida>
      </BrowserRouter>
    );
    expect(window.location.pathname).toBe('/login');
  });

  it('debe permitir el acceso si hay token y no se requiere rol específico', () => {
    localStorage.setItem('token_colegio', 'valido');
    render(
      <BrowserRouter>
        <RutaProtegida>
          <div data-testid="privado">Contenido</div>
        </RutaProtegida>
      </BrowserRouter>
    );
    expect(screen.getByTestId('privado')).toBeInTheDocument();
  });

  // NUEVO TEST PARA CUBRIR EL BRANCH DE ROL (Línea 16)
  it('debe redirigir al Login si el rol del usuario no coincide con el requerido', () => {
    localStorage.setItem('token_colegio', 'valido');
    localStorage.setItem('usuario_rol', 'ESTUDIANTE');
    
    render(
      <BrowserRouter>
        <RutaProtegida rolRequerido="ADMINISTRADOR">
          <div>Privado</div>
        </RutaProtegida>
      </BrowserRouter>
    );
    
    // Al fallar la validación de rol, debería navegar a /login
    expect(window.location.pathname).toBe('/login');
  });

  // NUEVO TEST PARA ACCESO EXITOSO POR ROL
  it('debe permitir el acceso si el rol coincide', () => {
    localStorage.setItem('token_colegio', 'valido');
    localStorage.setItem('usuario_rol', 'ADMINISTRADOR');
    
    render(
      <BrowserRouter>
        <RutaProtegida rolRequerido="ADMINISTRADOR">
          <div data-testid="admin-content">Contenido Admin</div>
        </RutaProtegida>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });
});