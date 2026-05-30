import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Mocks apuntando a los directorios reales mapeados en tu árbol de carpetas
vi.mock('../pages/public/LandingPage.jsx', () => ({ default: () => <div data-testid="landing-page">Landing</div> }));
vi.mock('../pages/public/Login.jsx', () => ({ default: () => <div data-testid="login-page">Login</div> }));
vi.mock('../pages/shared/Home.jsx', () => ({ default: () => <div data-testid="home-page">Home</div> }));
vi.mock('../components/common/RutaProtegida.jsx', () => ({ default: ({ children }) => <div data-testid="ruta-protegida">{children}</div> }));
vi.mock('../hooks/useAuth.js', () => ({ useAuth: vi.fn() }));

describe('Rutas de la Aplicación: AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar la pantalla de carga si cargando es true', () => {
    useAuth.mockReturnValue({ autenticado: false, rol: null, cargando: true });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando información...')).toBeInTheDocument();
  });

  it('debe renderizar la LandingPage en la ruta raíz (/)', () => {
    useAuth.mockReturnValue({ autenticado: false, rol: null, cargando: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('debe renderizar Login en /login si el usuario NO está autenticado', () => {
    useAuth.mockReturnValue({ autenticado: false, rol: null, cargando: false });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});