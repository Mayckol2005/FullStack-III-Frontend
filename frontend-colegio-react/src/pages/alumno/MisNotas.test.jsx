import { render, screen } from '@testing-library/react';
import MisNotas from './MisNotas';

describe('MisNotas', () => {

    test('muestra asignaturas', () => {

        render(<MisNotas />);

        expect(
            screen.getByText('Matemáticas')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Lenguaje')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Historia')
        ).toBeInTheDocument();
    });

    test('muestra promedio general', () => {

        render(<MisNotas />);

        expect(
            screen.getByText('6.0')
        ).toBeInTheDocument();
    });
});