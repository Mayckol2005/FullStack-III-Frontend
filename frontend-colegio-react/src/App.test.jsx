import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./routes/AppRoutes', () => ({
    default: () => <div data-testid="app-routes">Rutas cargadas</div>
}));

describe('App', () => {
    it('debe renderizar AppRoutes dentro del Router', () => {
        render(<App />);

        expect(
            screen.getByTestId('app-routes')
        ).toBeInTheDocument();
    });
});