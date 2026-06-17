import { render, screen } from '@testing-library/react';
import Comunicaciones from './Comunicaciones';

describe('Comunicaciones', () => {

    test('renderiza el título principal', () => {
        render(<Comunicaciones />);

        expect(
            screen.getByText(/Comunicaciones Institucionales/i)
        ).toBeInTheDocument();
    });

    test('muestra comunicados disponibles', () => {
        render(<Comunicaciones />);

        expect(
            screen.getByText(/Suspensión de clases/i)
        ).toBeInTheDocument();
    });

});