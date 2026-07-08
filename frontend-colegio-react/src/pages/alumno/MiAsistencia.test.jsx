import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import MiAsistencia from './MiAsistencia';
import { obtenerAsistenciaAlumnoActual } from '../../services/alumnoService';

vi.mock('../../services/alumnoService', () => ({
    obtenerAsistenciaAlumnoActual: vi.fn()
}));

describe('MiAsistencia', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        obtenerAsistenciaAlumnoActual.mockResolvedValue([
            {
                id: 1,
                fecha: '01/06/2026',
                estado: 'Presente',
                observacion: 'Sin observaciones.'
            },
            {
                id: 2,
                fecha: '02/06/2026',
                estado: 'Presente',
                observacion: 'Sin observaciones.'
            },
            {
                id: 3,
                fecha: '03/06/2026',
                estado: 'Ausente',
                observacion: 'Licencia médica presentada.'
            },
            {
                id: 4,
                fecha: '04/06/2026',
                estado: 'Presente',
                observacion: 'Sin observaciones.'
            }
        ]);
    });

    test('muestra porcentaje asistencia', async () => {

        render(<MiAsistencia />);

        expect(
            await screen.findByText(/75/i)
        ).toBeInTheDocument();
    });

    test('muestra registros asistencia', async () => {

        render(<MiAsistencia />);

        expect(
            await screen.findAllByText('01/06/2026')
        ).toHaveLength(2);

        expect(
            screen.getByText(/Ausente/i)
        ).toBeInTheDocument();
    });

});
