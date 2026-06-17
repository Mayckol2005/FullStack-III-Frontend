import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AlumnoDashboard from './AlumnoDashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('AlumnoDashboard', () => {

    beforeEach(() => {
        localStorage.setItem(
            'usuario_nombre',
            'Martin Ignacio Baza Seron'
        );
    });

    test('renderiza nombre del alumno', () => {

        render(
            <MemoryRouter>
                <AlumnoDashboard />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/Martin Ignacio Baza Seron/i)
        ).toBeInTheDocument();
    });

    test('navega a notas', () => {

        render(
            <MemoryRouter>
                <AlumnoDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Ver Mis Notas/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/alumno/notas');
    });

    test('navega a asistencia', () => {

        render(
            <MemoryRouter>
                <AlumnoDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Ver Asistencia/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/alumno/asistencia');
    });

    test('navega a anotaciones', () => {

        render(
            <MemoryRouter>
                <AlumnoDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Ver Anotaciones/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/alumno/anotaciones');
    });
});