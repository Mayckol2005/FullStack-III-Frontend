import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import MisNotas from './MisNotas';
import { obtenerNotasAlumnoActual } from '../../services/alumnoService';

vi.mock('../../services/alumnoService', () => ({
    obtenerNotasAlumnoActual: vi.fn()
}));

describe('MisNotas', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        obtenerNotasAlumnoActual.mockResolvedValue([
            { asignatura: 'Matemáticas', n1: 6.0, n2: 6.0, n3: 6.0 },
            { asignatura: 'Lenguaje', n1: 5.8, n2: 6.1, n3: 6.0 },
            { asignatura: 'Historia', n1: 6.2, n2: 5.9, n3: 6.0 }
        ]);
    });

    test('muestra asignaturas', async () => {

        render(<MisNotas />);

        expect(
            await screen.findByText('Matemáticas')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Lenguaje')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Historia')
        ).toBeInTheDocument();
    });

    test('muestra promedio general', async () => {

        render(<MisNotas />);

        expect(
            await screen.findByText('6.0')
        ).toBeInTheDocument();
    });
});
