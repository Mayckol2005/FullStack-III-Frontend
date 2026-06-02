import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { useAuth } from '../hooks/useAuth.js';

vi.mock('../pages/public/LandingPage.jsx', () => ({
    default: () => <div data-testid="landing-page">Landing</div>
}));

vi.mock('../pages/public/Login.jsx', () => ({
    default: () => <div data-testid="login-page">Login</div>
}));

vi.mock('../pages/shared/Home.jsx', () => ({
    default: () => <div data-testid="home-page">Home</div>
}));

vi.mock('../pages/profesor/ProfesorRoutes.jsx', () => ({
    default: () => (
        <div data-testid="profesor-routes">
            Profesor Routes
        </div>
    )
}));

vi.mock('../pages/admin/Estudiantes.jsx', () => ({
    default: () => (
        <div data-testid="estudiantes-page">
            Estudiantes
        </div>
    )
}));

vi.mock('../pages/admin/Usuarios.jsx', () => ({
    default: () => (
        <div data-testid="usuarios-page">
            Usuarios
        </div>
    )
}));

vi.mock('../components/common/Loader.jsx', () => ({
    default: () => <div>Cargando información...</div>
}));

vi.mock('../components/common/RutaProtegida.jsx', () => ({
    default: ({ children }) => (
        <div data-testid="ruta-protegida">
            {children}
        </div>
    )
}));

vi.mock('../hooks/useAuth.js', () => ({
    useAuth: vi.fn()
}));

describe('Rutas de la Aplicación: AppRoutes', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar la pantalla de carga si cargando es true', () => {

        useAuth.mockReturnValue({
            autenticado: false,
            cargando: true
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(
            screen.getByText('Cargando información...')
        ).toBeInTheDocument();
    });

    it('debe renderizar la LandingPage en la ruta raíz (/)', () => {

        useAuth.mockReturnValue({
            autenticado: false,
            cargando: false
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(
            screen.getByTestId('landing-page')
        ).toBeInTheDocument();
    });

    it('debe renderizar Login en /login si el usuario NO está autenticado', () => {

        useAuth.mockReturnValue({
            autenticado: false,
            cargando: false
        });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(
            screen.getByTestId('login-page')
        ).toBeInTheDocument();
    });

    it('debe renderizar Home cuando el usuario está autenticado', () => {

        useAuth.mockReturnValue({
            autenticado: true,
            cargando: false
        });

        render(
            <MemoryRouter initialEntries={['/home']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(
            screen.getByTestId('home-page')
        ).toBeInTheDocument();
    });

});