import { render, screen } from '@testing-library/react';
import MiAsistencia from './MiAsistencia';

describe('MiAsistencia', () => {

    test('muestra porcentaje asistencia', () => {

        render(<MiAsistencia />);

        expect(
            screen.getByText(/75/i)
        ).toBeInTheDocument();
    });

    test('muestra registros asistencia', () => {

        render(<MiAsistencia />);

        expect(
            screen.getByText('01/06/2026')
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Ausente/i)
        ).toBeInTheDocument();
    });

});