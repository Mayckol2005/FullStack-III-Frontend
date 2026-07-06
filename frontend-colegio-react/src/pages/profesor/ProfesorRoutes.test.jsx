import {
    render,
    screen,
    waitFor
} from '@testing-library/react';

import {
    MemoryRouter
} from 'react-router-dom';

import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';

import userEvent from '@testing-library/user-event';

import ProfesorDashboard from './ProfesorDashboard';

import {
    obtenerAsignaturasPorDocente,
    obtenerAvisosInstitucionales
} from '../../services/profesorService';

vi.mock('../../services/profesorService', () => ({
    obtenerAsignaturasPorDocente: vi.fn(),
    obtenerAvisosInstitucionales: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual(
        'react-router-dom'
    );

    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderizarDashboardYEsperarCarga = async () => {
    render(
        <MemoryRouter>
            <ProfesorDashboard />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(
            screen.queryByText(
                /Cargando comunicados/i
            )
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(
                /Cargando contexto académico/i
            )
        ).not.toBeInTheDocument();
    });
};

describe('ProfesorDashboard - navegación docente', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.setItem(
            'usuario_id',
            '10'
        );

        localStorage.setItem(
            'usuario_nombre',
            'Juan Pérez'
        );

        obtenerAsignaturasPorDocente.mockResolvedValue(
            []
        );

        obtenerAvisosInstitucionales.mockResolvedValue(
            []
        );
    });

    it('debe renderizar el panel principal del docente', async () => {
        await renderizarDashboardYEsperarCarga();

        expect(
            screen.getByText(
                /Mural de Novedades/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /Acceso Rápido/i
            )
        ).toBeInTheDocument();

        expect(
            obtenerAsignaturasPorDocente
        ).toHaveBeenCalledWith(10);

        expect(
            obtenerAvisosInstitucionales
        ).toHaveBeenCalledTimes(1);
    });

    it('debe navegar a asistencia', async () => {
        const user = userEvent.setup();

        await renderizarDashboardYEsperarCarga();

        await user.click(
            screen.getByRole('button', {
                name: /Pasar Lista Diaria/i
            })
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                '/profesor/asistencia'
            );
    });

    it('debe navegar a anotaciones', async () => {
        const user = userEvent.setup();

        await renderizarDashboardYEsperarCarga();

        await user.click(
            screen.getByRole('button', {
                name: /Registrar Observación/i
            })
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                '/profesor/anotaciones'
            );
    });

    it('debe navegar a evaluaciones', async () => {
        const user = userEvent.setup();

        await renderizarDashboardYEsperarCarga();

        await user.click(
            screen.getByRole('button', {
                name: /Ingresar Calificaciones/i
            })
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                '/profesor/evaluaciones'
            );
    });
});