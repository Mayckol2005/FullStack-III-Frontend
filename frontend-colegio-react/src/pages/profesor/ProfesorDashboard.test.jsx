import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ProfesorDashboard from './ProfesorDashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock('../../services/profesorService', () => ({
    obtenerAvisosInstitucionales: vi.fn()
}));

import { obtenerAvisosInstitucionales } from '../../services/profesorService';

describe('ProfesorDashboard', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.setItem(
            'usuario_nombre',
            'Juan Pérez'
        );
    });

    it('debe renderizar banner docente', async () => {

        obtenerAvisosInstitucionales.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/Juan Pérez/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Matemáticas y Ciencias/i)
        ).toBeInTheDocument();
    });

    it('debe mostrar avisos institucionales', async () => {

        obtenerAvisosInstitucionales.mockResolvedValue([
            {
                id: 1,
                titulo: 'Reunión',
                fecha: '2026-01-01',
                detalle: 'Consejo de profesores'
            }
        ]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText('Reunión')
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText('Consejo de profesores')
        ).toBeInTheDocument();
    });

    it('debe navegar a asistencia', async () => {

        obtenerAvisosInstitucionales.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Pasar Lista Diaria/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/profesor/asistencia');
    });

    it('debe navegar a anotaciones', async () => {

        obtenerAvisosInstitucionales.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Registrar Observación/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/profesor/anotaciones');
    });

    it('debe navegar a evaluaciones', async () => {

        obtenerAvisosInstitucionales.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/Ingresar Calificaciones/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith('/profesor/evaluaciones');
    });

});