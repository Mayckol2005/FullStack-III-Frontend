import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Anotaciones from './Anotaciones';

import * as profesorService from '../../services/profesorService';
import * as estudianteService from '../../services/estudianteService';

vi.mock('../../services/profesorService');
vi.mock('../../services/estudianteService');

describe('Anotaciones', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.setItem('usuario_id', '10');

        profesorService.obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 5,
                nombres: 'Juan',
                apellidos: 'Pérez'
            }
        ]);

        profesorService.crearAnotacionBD.mockResolvedValue(true);

        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('debe cargar cursos al iniciar', async () => {
        render(<Anotaciones />);

        expect(
            await screen.findByText('1°A')
        ).toBeInTheDocument();
    });

    it('debe registrar una anotación', async () => {
        render(<Anotaciones />);

        const selects = await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: { value: '1' }
        });

        await waitFor(() => {
            expect(
                estudianteService.obtenerEstudiantes
            ).toHaveBeenCalled();
        });

        const alumnoSelect = screen.getAllByRole('combobox')[1];

        fireEvent.change(alumnoSelect, {
            target: { value: '5' }
        });

        const tipoSelect = screen.getAllByRole('combobox')[2];

        fireEvent.change(tipoSelect, {
            target: { value: 'POSITIVA' }
        });

        fireEvent.change(
            screen.getByRole('textbox'),
            {
                target: {
                    value: 'Excelente comportamiento'
                }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /ingresar al libro de vida/i
            })
        );

        await waitFor(() => {
            expect(
                profesorService.crearAnotacionBD
            ).toHaveBeenCalledTimes(1);
        });
    });
});