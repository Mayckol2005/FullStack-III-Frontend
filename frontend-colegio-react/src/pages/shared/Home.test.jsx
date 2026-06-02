import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Home', () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test('renderiza vista administrador', () => {

        localStorage.setItem('usuario_rol', 'ADMINISTRADOR');

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText(/Bienvenido de Vuelta/i)).toBeInTheDocument();

        expect(
            screen.getByText(/Gestión de Usuarios/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Gestión de Estudiantes/i)
        ).toBeInTheDocument();
    });

    test('redirige automáticamente al dashboard profesor', () => {

        localStorage.setItem('usuario_rol', 'PROFESOR');

        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/profesor');
    });
});