import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Evaluaciones from './Evaluaciones';

vi.mock('../../services/profesorService', () => ({
    obtenerCursosReal: vi.fn(),
    crearEvaluacionBD: vi.fn()
}));

vi.mock('../../services/academicoService', () => ({
    obtenerAsignaturasPorCursoReal: vi.fn()
}));

vi.mock('../../services/estudianteService', () => ({
    obtenerEstudiantes: vi.fn()
}));

import { obtenerCursosReal } from '../../services/profesorService';
import { obtenerAsignaturasPorCursoReal } from '../../services/academicoService';
import { obtenerEstudiantes } from '../../services/estudianteService';

describe('Evaluaciones', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra cursos cargados', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        render(<Evaluaciones />);

        expect(await screen.findByText('1°A')).toBeInTheDocument();
    });

    test('carga alumnos y asignaturas al seleccionar curso', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            { id: 1, nombre: 'Matemática' }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        render(<Evaluaciones />);

        const selects = await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: { value: '1' }
        });

        await waitFor(() => {
            expect(screen.getByText(/Juan/i)).toBeInTheDocument();
            expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
        });
    });

    test('permite ingresar nota', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            { id: 1, nombre: 'Matemática' }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        render(<Evaluaciones />);

        const selects = await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: { value: '1' }
        });

        const inputsNota = await screen.findAllByRole('spinbutton');

        fireEvent.change(inputsNota[0], {
            target: { value: '6.0' }
        });

        await waitFor(() => {
            expect(inputsNota[0].value).toBe('6.0');
        });
    });

});