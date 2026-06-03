import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Asistencia from './Asistencia';

vi.mock('../../services/profesorService', () => ({
    obtenerCursosReal: vi.fn(),
    obtenerAsistencias: vi.fn(),
    crearAsistenciaBD: vi.fn()
}));

vi.mock('../../services/estudianteService', () => ({
    obtenerEstudiantes: vi.fn()
}));

import {
    obtenerCursosReal,
    obtenerAsistencias
} from '../../services/profesorService';

import {
    obtenerEstudiantes
} from '../../services/estudianteService';

describe('Asistencia', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renderiza cursos cargados desde backend', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        render(<Asistencia />);

        expect(await screen.findByText('1°A')).toBeInTheDocument();
    });

    test('carga estudiantes al seleccionar curso', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        obtenerAsistencias.mockResolvedValue([]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        render(<Asistencia />);

        const select = await screen.findByRole('combobox');

        fireEvent.change(select, {
            target: { value: '1' }
        });

        await waitFor(() => {
            expect(screen.getByText(/Juan/i)).toBeInTheDocument();
        });
    });

    test('permite cambiar presente a ausente', async () => {

        obtenerCursosReal.mockResolvedValue([
            { id: 1, nombre: '1°A' }
        ]);

        obtenerAsistencias.mockResolvedValue([]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        render(<Asistencia />);

        const select = await screen.findByRole('combobox');

        fireEvent.change(select, {
            target: { value: '1' }
        });

        const boton = await screen.findByText(/Presente/i);

        fireEvent.click(boton);

        expect(screen.getByText(/Ausente/i)).toBeInTheDocument();
    });
});