import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import MisAnotaciones from './MisAnotaciones';
import { obtenerAnotacionesAlumnoActual } from '../../services/alumnoService';

vi.mock('../../services/alumnoService', () => ({
    obtenerAnotacionesAlumnoActual: vi.fn()
}));

describe('MisAnotaciones', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        obtenerAnotacionesAlumnoActual.mockResolvedValue([
            {
                id: 1,
                fecha: '05/06/2026',
                tipo: 'POSITIVA',
                descripcion: 'Participación destacada en clases.'
            }
        ]);
    });

    test('muestra detalle al seleccionar una anotacion', async () => {

        render(<MisAnotaciones />);

        const opciones = await screen.findAllByText('POSITIVA');
        fireEvent.click(opciones[0]);

        expect(
            await screen.findByText(
                /Participación destacada en clases/i
            )
        ).toBeInTheDocument();

    });

});
