import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RutaProtegida from './RutaProtegida';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate-mock" data-to={to} />),
  };
});

describe('Componente: RutaProtegida', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Silenciamos los logs y el alert de la ventana para que no ensucien la consola
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'alert').mockImplementation(() => {}); // Evita el error de "Not implemented"
  });

  it('debe redirigir al Login si no existe un token en el localStorage', () => {
    render(
      <RutaProtegida>
        <div data-testid="contenido-privado">Territorio Sagrado</div>
      </RutaProtegida>
    );

    const navigateMock = screen.getByTestId('navigate-mock');
    expect(navigateMock).toBeInTheDocument();
    expect(navigateMock.getAttribute('data-to')).toBe('/login');
    expect(screen.queryByTestId('contenido-privado')).not.toBeInTheDocument();
  });

  it('debe permitir el acceso al contenido si hay token y no se requiere un rol específico', () => {
    localStorage.setItem('token_colegio', 'un-token-valido-xyz');

    render(
      <RutaProtegida>
        <div data-testid="contenido-privado">Territorio Sagrado</div>
      </RutaProtegida>
    );

    expect(screen.getByTestId('contenido-privado')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });

  it('debe redirigir a /login si el rol del usuario no coincide con el rol requerido', () => {
    localStorage.setItem('token_colegio', 'un-token-valido-xyz');
    localStorage.setItem('usuario_rol', 'ESTUDIANTE');

    render(
      <RutaProtegida rolRequerido="PROFESOR">
        <div data-testid="contenido-privado">Panel de Notas del Profesor</div>
      </RutaProtegida>
    );

    const navigateMock = screen.getByTestId('navigate-mock');
    expect(navigateMock).toBeInTheDocument();
    expect(navigateMock.getAttribute('data-to')).toBe('/login'); 
    expect(screen.queryByTestId('contenido-privado')).not.toBeInTheDocument();
  });

  it('debe permitir el acceso si el rol del usuario coincide exactamente con el rol requerido', () => {
    localStorage.setItem('token_colegio', 'un-token-valido-xyz');
    localStorage.setItem('usuario_rol', 'PROFESOR');

    render(
      <RutaProtegida rolRequerido="PROFESOR">
        <div data-testid="contenido-privado">Panel de Notas del Profesor</div>
      </RutaProtegida>
    );

    expect(screen.getByTestId('contenido-privado')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-mock')).not.toBeInTheDocument();
  });
});