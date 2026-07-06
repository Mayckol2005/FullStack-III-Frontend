import {
    fireEvent,
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

import ProfesorDashboard from './ProfesorDashboard';

import {
    obtenerAsignaturasPorDocente,
    obtenerAvisosInstitucionales
} from '../../services/profesorService';

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

vi.mock('../../services/profesorService', () => ({
    obtenerAsignaturasPorDocente: vi.fn(),
    obtenerAvisosInstitucionales: vi.fn()
}));

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

describe('ProfesorDashboard', () => {

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

    it('debe cargar y mostrar las asignaturas reales del docente autenticado', async () => {
        obtenerAsignaturasPorDocente.mockResolvedValue([
            {
                id: 1,
                nombre: 'Matemática',
                cursoId: 1,
                docenteId: 10
            },
            {
                id: 2,
                nombre: 'Física',
                cursoId: 2,
                docenteId: 10
            },
            {
                id: 3,
                nombre: 'Matemática',
                cursoId: 3,
                docenteId: 10
            }
        ]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/Juan Pérez/i)
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                /Matemática · Física/i
            )
        ).toBeInTheDocument();

        expect(
            obtenerAsignaturasPorDocente
        ).toHaveBeenCalledTimes(1);

        expect(
            obtenerAsignaturasPorDocente
        ).toHaveBeenCalledWith(10);
    });

    it('debe mostrar el año escolar actual de forma dinámica', async () => {
        const anioActual =
            new Date().getFullYear();

        await renderizarDashboardYEsperarCarga();

        expect(
            screen.getByText(
                `Año Escolar ${anioActual}`
            )
        ).toBeInTheDocument();
    });

    it('debe mostrar un mensaje cuando el docente no posee asignaturas asociadas', async () => {
        obtenerAsignaturasPorDocente.mockResolvedValue(
            []
        );

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                /Sin asignaturas asociadas/i
            )
        ).toBeInTheDocument();

        expect(
            obtenerAsignaturasPorDocente
        ).toHaveBeenCalledWith(10);
    });

    it('debe evitar consultar asignaturas cuando el identificador del docente es inválido', async () => {
        localStorage.removeItem('usuario_id');

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                /No fue posible identificar el contexto académico del docente/i
            )
        ).toBeInTheDocument();

        expect(
            obtenerAsignaturasPorDocente
        ).not.toHaveBeenCalled();

        expect(
            obtenerAvisosInstitucionales
        ).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar avisos institucionales', async () => {
        obtenerAvisosInstitucionales.mockResolvedValue([
            {
                id: 1,
                titulo: 'Reunión',
                fecha: '2026-01-01',
                detalle: 'Consejo de profesores'
            }
        ]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            await screen.findByText('Reunión')
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Consejo de profesores'
            )
        ).toBeInTheDocument();

        expect(
            obtenerAvisosInstitucionales
        ).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar aviso sin detalle cuando el comunicado no posee contenido', async () => {
        obtenerAvisosInstitucionales.mockResolvedValue([
            {
                id: 2,
                titulo: 'Aviso General',
                fecha: '2026-07-06'
            }
        ]);

        render(
            <MemoryRouter>
                <ProfesorDashboard />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                'Aviso General'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Sin detalle disponible'
            )
        ).toBeInTheDocument();
    });

    it('debe navegar a asistencia', async () => {
        await renderizarDashboardYEsperarCarga();

        fireEvent.click(
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
        await renderizarDashboardYEsperarCarga();

        fireEvent.click(
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
        await renderizarDashboardYEsperarCarga();

        fireEvent.click(
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