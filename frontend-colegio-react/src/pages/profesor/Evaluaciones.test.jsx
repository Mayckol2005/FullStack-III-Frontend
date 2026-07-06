import {
    fireEvent,
    render,
    screen,
    waitFor,
    within
} from '@testing-library/react';

import { vi } from 'vitest';
import Evaluaciones from './Evaluaciones';

vi.mock('../../services/profesorService', () => ({
    obtenerCursosReal: vi.fn(),
    obtenerEvaluacionesPorAsignatura: vi.fn(),
    guardarListaEvaluacionesBD: vi.fn()
}));

vi.mock('../../services/academicoService', () => ({
    obtenerAsignaturasPorCursoReal: vi.fn()
}));

vi.mock('../../services/estudianteService', () => ({
    obtenerEstudiantes: vi.fn()
}));

import {
    guardarListaEvaluacionesBD,
    obtenerCursosReal,
    obtenerEvaluacionesPorAsignatura
} from '../../services/profesorService';

import {
    obtenerAsignaturasPorCursoReal
} from '../../services/academicoService';

import {
    obtenerEstudiantes
} from '../../services/estudianteService';

const obtenerFechaActualEsperada = () => {
    const ahora = new Date();
    const compensacionZonaHoraria =
        ahora.getTimezoneOffset() * 60000;

    return new Date(
        ahora.getTime() - compensacionZonaHoraria
    )
        .toISOString()
        .split('T')[0];
};

describe('Evaluaciones', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        obtenerCursosReal.mockResolvedValue([]);
        obtenerAsignaturasPorCursoReal.mockResolvedValue([]);
        obtenerEstudiantes.mockResolvedValue([]);
        obtenerEvaluacionesPorAsignatura.mockResolvedValue([]);
        guardarListaEvaluacionesBD.mockResolvedValue([]);
    });

    test('muestra cursos cargados desde backend', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        render(<Evaluaciones />);

        expect(
            await screen.findByText('1°A')
        ).toBeInTheDocument();

        expect(obtenerCursosReal)
            .toHaveBeenCalledTimes(1);
    });

    test('carga asignaturas al seleccionar un curso', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        expect(
            await screen.findByRole('option', {
                name: 'Matemática'
            })
        ).toBeInTheDocument();

        expect(obtenerAsignaturasPorCursoReal)
            .toHaveBeenCalledWith('1');

        expect(obtenerEstudiantes)
            .not.toHaveBeenCalled();

        expect(obtenerEvaluacionesPorAsignatura)
            .not.toHaveBeenCalled();
    });

    test('carga estudiantes y mezcla las evaluaciones N1 N2 y N3 guardadas', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 10,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '11.111.111-1'
            }
        ]);

        obtenerEvaluacionesPorAsignatura.mockResolvedValue([
            {
                id: 50,
                estudianteId: 10,
                asignaturaId: 5,
                numeroEvaluacion: 1,
                nota: 6.5,
                fecha: '2026-07-08'
            },
            {
                id: 51,
                estudianteId: 10,
                asignaturaId: 5,
                numeroEvaluacion: 2,
                nota: 5.8,
                fecha: '2026-07-08'
            },
            {
                id: 52,
                estudianteId: 10,
                asignaturaId: 5,
                numeroEvaluacion: 3,
                nota: 6.1,
                fecha: '2026-07-08'
            }
        ]);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Matemática'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        expect(
            await screen.findByText(/Pérez, Juan/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText('11.111.111-1')
        ).toBeInTheDocument();

        const n1 = screen.getByRole(
            'spinbutton',
            {
                name: /N1 Juan Pérez/i
            }
        );

        const n2 = screen.getByRole(
            'spinbutton',
            {
                name: /N2 Juan Pérez/i
            }
        );

        const n3 = screen.getByRole(
            'spinbutton',
            {
                name: /N3 Juan Pérez/i
            }
        );

        expect(n1.value).toBe('6.5');
        expect(n2.value).toBe('5.8');
        expect(n3.value).toBe('6.1');

        expect(obtenerEstudiantes)
            .toHaveBeenCalledWith('1');

        expect(obtenerEvaluacionesPorAsignatura)
            .toHaveBeenCalledWith('5');
    });

    test('permite editar una nota y recalcula el promedio del estudiante y del curso', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 10,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        obtenerEvaluacionesPorAsignatura.mockResolvedValue([]);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Matemática'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        const inputN1 = await screen.findByRole(
            'spinbutton',
            {
                name: /N1 Juan Pérez/i
            }
        );

        fireEvent.change(inputN1, {
            target: {
                value: '6.0'
            }
        });

        expect(inputN1.value).toBe('6.0');

        const filaEstudiante = screen
            .getByText(/Pérez, Juan/i)
            .closest('tr');

        expect(
            within(filaEstudiante).getByText('6.0')
        ).toBeInTheDocument();

        const resumenCurso = screen
            .getByText('Promedio del Curso')
            .parentElement;

        expect(
            within(resumenCurso).getByText('6.0')
        ).toBeInTheDocument();
    });

    test('sincroniza las calificaciones y recarga N1 N2 y N3 desde backend', async () => {
        const fechaEsperada =
            obtenerFechaActualEsperada();

        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 10,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            },
            {
                id: 11,
                nombres: 'María',
                apellidos: 'Soto',
                rut: '222'
            }
        ]);

        obtenerEvaluacionesPorAsignatura
            .mockResolvedValueOnce([
                {
                    id: 50,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 6.5,
                    fecha: '2026-07-08'
                },
                {
                    id: 51,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 2,
                    nota: 5.8,
                    fecha: '2026-07-08'
                },
                {
                    id: 52,
                    estudianteId: 11,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 5.0,
                    fecha: '2026-07-08'
                }
            ])
            .mockResolvedValueOnce([
                {
                    id: 50,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 6.5,
                    fecha: fechaEsperada
                },
                {
                    id: 51,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 2,
                    nota: 6.2,
                    fecha: fechaEsperada
                },
                {
                    id: 52,
                    estudianteId: 11,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 5.0,
                    fecha: fechaEsperada
                },
                {
                    id: 53,
                    estudianteId: 11,
                    asignaturaId: 5,
                    numeroEvaluacion: 3,
                    nota: 5.5,
                    fecha: fechaEsperada
                }
            ]);

        guardarListaEvaluacionesBD.mockResolvedValue([
            {
                id: 50
            },
            {
                id: 51
            },
            {
                id: 52
            },
            {
                id: 53
            }
        ]);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Matemática'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        const juanN2 = await screen.findByRole(
            'spinbutton',
            {
                name: /N2 Juan Pérez/i
            }
        );

        const mariaN3 = screen.getByRole(
            'spinbutton',
            {
                name: /N3 María Soto/i
            }
        );

        fireEvent.change(juanN2, {
            target: {
                value: '6.2'
            }
        });

        fireEvent.change(mariaN3, {
            target: {
                value: '5.5'
            }
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /Sincronizar Calificaciones/i
            })
        );

        await waitFor(() => {
            expect(guardarListaEvaluacionesBD)
                .toHaveBeenCalledWith([
                    {
                        estudianteId: 10,
                        asignaturaId: 5,
                        numeroEvaluacion: 1,
                        nota: 6.5,
                        fecha: fechaEsperada
                    },
                    {
                        estudianteId: 10,
                        asignaturaId: 5,
                        numeroEvaluacion: 2,
                        nota: 6.2,
                        fecha: fechaEsperada
                    },
                    {
                        estudianteId: 11,
                        asignaturaId: 5,
                        numeroEvaluacion: 1,
                        nota: 5.0,
                        fecha: fechaEsperada
                    },
                    {
                        estudianteId: 11,
                        asignaturaId: 5,
                        numeroEvaluacion: 3,
                        nota: 5.5,
                        fecha: fechaEsperada
                    }
                ]);
        });

        await waitFor(() => {
            expect(obtenerEvaluacionesPorAsignatura)
                .toHaveBeenCalledTimes(2);
        });

        expect(
            await screen.findByText(
                /Calificaciones sincronizadas correctamente/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole('spinbutton', {
                name: /N2 Juan Pérez/i
            }).value
        ).toBe('6.2');

        expect(
            screen.getByRole('spinbutton', {
                name: /N3 María Soto/i
            }).value
        ).toBe('5.5');
    });

    test('muestra error cuando falla la sincronización de calificaciones', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 10,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        obtenerEvaluacionesPorAsignatura.mockResolvedValue([]);

        guardarListaEvaluacionesBD.mockResolvedValue(null);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Matemática'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        const inputN1 = await screen.findByRole(
            'spinbutton',
            {
                name: /N1 Juan Pérez/i
            }
        );

        fireEvent.change(inputN1, {
            target: {
                value: '6.0'
            }
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /Sincronizar Calificaciones/i
            })
        );

        expect(
            await screen.findByText(
                /No fue posible sincronizar las calificaciones/i
            )
        ).toBeInTheDocument();

        expect(guardarListaEvaluacionesBD)
            .toHaveBeenCalledTimes(1);

        expect(obtenerEvaluacionesPorAsignatura)
            .toHaveBeenCalledTimes(1);
    });

    test('impide sincronizar una calificación fuera de la escala 1.0 a 7.0', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerAsignaturasPorCursoReal.mockResolvedValue([
            {
                id: 5,
                nombre: 'Matemática'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 10,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        obtenerEvaluacionesPorAsignatura.mockResolvedValue([]);

        render(<Evaluaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Matemática'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        const inputN1 = await screen.findByRole(
            'spinbutton',
            {
                name: /N1 Juan Pérez/i
            }
        );

        fireEvent.change(inputN1, {
            target: {
                value: '7.5'
            }
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /Sincronizar Calificaciones/i
            })
        );

        expect(
            await screen.findByText(
                /Las calificaciones deben estar entre 1.0 y 7.0/i
            )
        ).toBeInTheDocument();

        expect(guardarListaEvaluacionesBD)
            .not.toHaveBeenCalled();
    });
});