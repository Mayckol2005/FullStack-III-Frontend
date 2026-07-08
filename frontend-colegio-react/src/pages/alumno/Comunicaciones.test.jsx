import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Comunicaciones from './Comunicaciones';
import { obtenerComunicadosAlumnoActual } from '../../services/alumnoService';

vi.mock('../../services/alumnoService', () => ({
    obtenerComunicadosAlumnoActual: vi.fn()
}));

describe('Comunicaciones', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        obtenerComunicadosAlumnoActual.mockResolvedValue([
            {
                id: 1,
                titulo: 'Suspensión de clases',
                fecha: '08/07/2026',
                hora: '09:30',
                nuevo: true,
                detalle: 'Se suspenden las clases por jornada institucional.',
                remitente: 'Dirección Académica'
            }
        ]);
    });

    test('renderiza el título principal', () => {
        render(<Comunicaciones />);

        expect(
            screen.getByText(/Comunicaciones Institucionales/i)
        ).toBeInTheDocument();
    });

    test('muestra comunicados disponibles', async () => {
        render(<Comunicaciones />);

        expect(
            await screen.findAllByText(/Suspensión de clases/i)
        ).toHaveLength(2);
    });

});
