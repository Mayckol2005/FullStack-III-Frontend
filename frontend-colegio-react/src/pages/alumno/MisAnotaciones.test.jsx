import { render, screen, fireEvent } from '@testing-library/react';
import MisAnotaciones from './MisAnotaciones';

describe('MisAnotaciones', () => {

    test('muestra detalle al seleccionar una anotacion', () => {

        render(<MisAnotaciones />);

        // Selecciona la primera anotación
        fireEvent.click(
            screen.getAllByText('POSITIVA')[0]
        );

        expect(
            screen.getByText(
                /Participación destacada en clases/i
            )
        ).toBeInTheDocument();

    });

});