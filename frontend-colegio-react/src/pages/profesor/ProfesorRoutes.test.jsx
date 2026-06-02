import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ProfesorDashboard from './ProfesorDashboard';

// 1. Mockeamos el servicio para que no haga peticiones reales
vi.mock('../../services/profesorService', () => ({
    obtenerAvisosInstitucionales: vi.fn(() => Promise.resolve([]))
}));

// 2. Mockeamos la navegación para poder verificar hacia dónde intenta ir el usuario
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('ProfesorDashboard', () => {
    
    // Limpiamos los mocks antes de cada test para que no interfieran entre sí
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar banner docente', async () => {
        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        // Esperamos a que el useEffect termine su trabajo
        await waitFor(() => {
            expect(screen.queryByText(/Cargando comunicados/i)).not.toBeInTheDocument();
        });

        // Ahora hacemos las aserciones
        expect(screen.getByText(/Mural de Novedades/i)).toBeInTheDocument();
        expect(screen.getByText(/Acceso Rápido/i)).toBeInTheDocument();
    });

    it('debe navegar a asistencia', async () => {
        render(<MemoryRouter><ProfesorDashboard /></MemoryRouter>);
        
        await waitFor(() => expect(screen.queryByText(/Cargando comunicados/i)).not.toBeInTheDocument());

        const btnAsistencia = screen.getByText(/Pasar Lista Diaria/i);
        await userEvent.click(btnAsistencia);
        
        expect(mockNavigate).toHaveBeenCalledWith('/profesor/asistencia');
    });

    it('debe navegar a anotaciones', async () => {
        render(<MemoryRouter><ProfesorDashboard /></MemoryRouter>);
        
        await waitFor(() => expect(screen.queryByText(/Cargando comunicados/i)).not.toBeInTheDocument());

        const btnAnotacion = screen.getByText(/Registrar Observación/i);
        await userEvent.click(btnAnotacion);
        
        expect(mockNavigate).toHaveBeenCalledWith('/profesor/anotaciones');
    });

    it('debe navegar a evaluaciones', async () => {
        render(<MemoryRouter><ProfesorDashboard /></MemoryRouter>);
        
        await waitFor(() => expect(screen.queryByText(/Cargando comunicados/i)).not.toBeInTheDocument());

        const btnEvaluacion = screen.getByText(/Ingresar Calificaciones/i);
        await userEvent.click(btnEvaluacion);
        
        expect(mockNavigate).toHaveBeenCalledWith('/profesor/evaluaciones');
    });
});