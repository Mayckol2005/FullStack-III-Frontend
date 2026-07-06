import {
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react';

import { vi } from 'vitest';
import Asistencia from './Asistencia';

vi.mock('../../services/profesorService', () => ({
    obtenerCursosReal: vi.fn(),
    obtenerAsistenciasPorCursoYFecha: vi.fn(),
    guardarListaAsistenciaBD: vi.fn()
}));

vi.mock('../../services/estudianteService', () => ({
    obtenerEstudiantes: vi.fn()
}));

import {
    guardarListaAsistenciaBD,
    obtenerAsistenciasPorCursoYFecha,
    obtenerCursosReal
} from '../../services/profesorService';

import {
    obtenerEstudiantes
} from '../../services/estudianteService';

describe('Asistencia', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        obtenerCursosReal.mockResolvedValue([]);
        obtenerEstudiantes.mockResolvedValue([]);
        obtenerAsistenciasPorCursoYFecha.mockResolvedValue([]);
        guardarListaAsistenciaBD.mockResolvedValue([]);
    });

    test('renderiza cursos cargados desde backend', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        render(<Asistencia />);

        expect(
            await screen.findByText('1°A')
        ).toBeInTheDocument();

        expect(obtenerCursosReal).toHaveBeenCalledTimes(1);
    });

    test('carga estudiantes al seleccionar un curso', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        obtenerAsistenciasPorCursoYFecha.mockResolvedValue([]);

        render(<Asistencia />);

        const selectCurso = await screen.findByRole('combobox');

        fireEvent.change(selectCurso, {
            target: {
                value: '1'
            }
        });

        expect(
            await screen.findByText(/Pérez, Juan/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText('111')
        ).toBeInTheDocument();

        expect(obtenerEstudiantes)
            .toHaveBeenCalledWith('1');

        expect(obtenerAsistenciasPorCursoYFecha)
            .toHaveBeenCalledWith(
                '1',
                expect.any(String)
            );
    });

    test('mezcla la nómina con la asistencia previamente guardada', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
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

        obtenerAsistenciasPorCursoYFecha.mockResolvedValue([
            {
                id: 50,
                fecha: '2026-07-08',
                cursoId: 1,
                estudianteId: 10,
                presente: false,
                observacion: ''
            }
        ]);

        render(<Asistencia />);

        const inputFecha = document.querySelector(
            'input[type="date"]'
        );

        fireEvent.change(inputFecha, {
            target: {
                value: '2026-07-08'
            }
        });

        const selectCurso = await screen.findByRole('combobox');

        fireEvent.change(selectCurso, {
            target: {
                value: '1'
            }
        });

        expect(
            await screen.findByText(/Pérez, Juan/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText('11.111.111-1')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: /Ausente/i
            })
        ).toBeInTheDocument();

        expect(obtenerAsistenciasPorCursoYFecha)
            .toHaveBeenCalledWith(
                '1',
                '2026-07-08'
            );
    });

    test('permite cambiar un estudiante de presente a ausente', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                nombres: 'Juan',
                apellidos: 'Pérez',
                rut: '111'
            }
        ]);

        obtenerAsistenciasPorCursoYFecha.mockResolvedValue([]);

        render(<Asistencia />);

        const selectCurso = await screen.findByRole('combobox');

        fireEvent.change(selectCurso, {
            target: {
                value: '1'
            }
        });

        const botonPresente = await screen.findByRole(
            'button',
            {
                name: /Presente/i
            }
        );

        fireEvent.click(botonPresente);

        expect(
            screen.getByRole('button', {
                name: /Ausente/i
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('0%')
        ).toBeInTheDocument();
    });

    test('guarda la lista completa y recarga la asistencia desde backend', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
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

        obtenerAsistenciasPorCursoYFecha
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                {
                    id: 50,
                    fecha: '2026-07-08',
                    cursoId: 1,
                    estudianteId: 10,
                    presente: false,
                    observacion: ''
                },
                {
                    id: 51,
                    fecha: '2026-07-08',
                    cursoId: 1,
                    estudianteId: 11,
                    presente: true,
                    observacion: ''
                }
            ]);

        guardarListaAsistenciaBD.mockResolvedValue([
            {
                id: 50,
                fecha: '2026-07-08',
                cursoId: 1,
                estudianteId: 10,
                presente: false,
                observacion: ''
            },
            {
                id: 51,
                fecha: '2026-07-08',
                cursoId: 1,
                estudianteId: 11,
                presente: true,
                observacion: ''
            }
        ]);

        render(<Asistencia />);

        const inputFecha = document.querySelector(
            'input[type="date"]'
        );

        fireEvent.change(inputFecha, {
            target: {
                value: '2026-07-08'
            }
        });

        const selectCurso = await screen.findByRole('combobox');

        fireEvent.change(selectCurso, {
            target: {
                value: '1'
            }
        });

        const botonesPresentes = await screen.findAllByRole(
            'button',
            {
                name: /Presente/i
            }
        );

        fireEvent.click(botonesPresentes[0]);

        expect(
            screen.getByRole('button', {
                name: /Ausente/i
            })
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole('button', {
                name: /Finalizar Pasar Lista/i
            })
        );

        await waitFor(() => {
            expect(guardarListaAsistenciaBD)
                .toHaveBeenCalledWith([
                    {
                        fecha: '2026-07-08',
                        cursoId: 1,
                        estudianteId: 10,
                        presente: false,
                        observacion: ''
                    },
                    {
                        fecha: '2026-07-08',
                        cursoId: 1,
                        estudianteId: 11,
                        presente: true,
                        observacion: ''
                    }
                ]);
        });

        await waitFor(() => {
            expect(obtenerAsistenciasPorCursoYFecha)
                .toHaveBeenCalledTimes(2);
        });

        expect(
            await screen.findByText(
                /Asistencia guardada correctamente/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: /Ausente/i
            })
        ).toBeInTheDocument();
    });

    test('muestra mensaje de error cuando falla la sincronización', async () => {
        obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
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

        obtenerAsistenciasPorCursoYFecha.mockResolvedValue([]);

        guardarListaAsistenciaBD.mockResolvedValue(null);

        render(<Asistencia />);

        const selectCurso = await screen.findByRole('combobox');

        fireEvent.change(selectCurso, {
            target: {
                value: '1'
            }
        });

        await screen.findByText(/Pérez, Juan/i);

        fireEvent.click(
            screen.getByRole('button', {
                name: /Finalizar Pasar Lista/i
            })
        );

        expect(
            await screen.findByText(
                /No fue posible guardar la asistencia/i
            )
        ).toBeInTheDocument();

        expect(obtenerAsistenciasPorCursoYFecha)
            .toHaveBeenCalledTimes(1);
    });
});