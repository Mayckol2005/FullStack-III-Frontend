import {
    fireEvent,
    render,
    screen,
    waitFor,
    within
} from '@testing-library/react';

import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';

import Anotaciones from './Anotaciones';

import * as profesorService from '../../services/profesorService';
import * as estudianteService from '../../services/estudianteService';

vi.mock('../../services/profesorService');
vi.mock('../../services/estudianteService');

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

describe('Anotaciones', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.setItem(
            'usuario_id',
            '10'
        );

        profesorService.obtenerCursosReal.mockResolvedValue([
            {
                id: 1,
                nombre: '1°A'
            }
        ]);

        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 5,
                nombres: 'Juan',
                apellidos: 'Pérez'
            }
        ]);

        profesorService
            .obtenerAnotacionesPorEstudiante
            .mockResolvedValue([]);

        profesorService
            .crearAnotacionBD
            .mockResolvedValue(true);
    });

    it('debe cargar cursos al iniciar', async () => {
        render(<Anotaciones />);

        expect(
            await screen.findByText('1°A')
        ).toBeInTheDocument();

        expect(
            profesorService.obtenerCursosReal
        ).toHaveBeenCalledTimes(1);
    });

    it('debe cargar estudiantes al seleccionar un curso', async () => {
        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        expect(
            await screen.findByRole('option', {
                name: 'Pérez, Juan'
            })
        ).toBeInTheDocument();

        expect(
            estudianteService.obtenerEstudiantes
        ).toHaveBeenCalledWith('1');

        expect(
            profesorService.obtenerAnotacionesPorEstudiante
        ).not.toHaveBeenCalled();
    });

    it('debe cargar la hoja de vida y calcular anotaciones positivas y negativas', async () => {
        profesorService
            .obtenerAnotacionesPorEstudiante
            .mockResolvedValue([
                {
                    id: 10,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'POSITIVA',
                    descripcion: 'Excelente participación',
                    fecha: '2026-07-06'
                },
                {
                    id: 11,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'NEGATIVA',
                    descripcion: 'Interrumpe la clase',
                    fecha: '2026-07-05'
                },
                {
                    id: 12,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'POSITIVA',
                    descripcion: 'Apoya a sus compañeros',
                    fecha: '2026-07-04'
                }
            ]);

        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Pérez, Juan'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        expect(
            await screen.findByText(
                'Excelente participación'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Interrumpe la clase'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                'Apoya a sus compañeros'
            )
        ).toBeInTheDocument();

        const contadorPositivas = screen
            .getByText('Positivas (+)')
            .closest('.stat-item');

        const contadorNegativas = screen
            .getByText('Negativas (-)')
            .closest('.stat-item');

        expect(
            within(contadorPositivas).getByText('2')
        ).toBeInTheDocument();

        expect(
            within(contadorNegativas).getByText('1')
        ).toBeInTheDocument();

        expect(
            profesorService.obtenerAnotacionesPorEstudiante
        ).toHaveBeenCalledWith('5');
    });

    it('debe mostrar el historial ordenado desde la anotación más reciente', async () => {
        profesorService
            .obtenerAnotacionesPorEstudiante
            .mockResolvedValue([
                {
                    id: 10,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'POSITIVA',
                    descripcion: 'Anotación antigua',
                    fecha: '2026-07-01'
                },
                {
                    id: 12,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'NEGATIVA',
                    descripcion: 'Anotación reciente',
                    fecha: '2026-07-06'
                },
                {
                    id: 11,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'POSITIVA',
                    descripcion: 'Anotación intermedia',
                    fecha: '2026-07-04'
                }
            ]);

        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Pérez, Juan'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        await screen.findByText(
            'Anotación reciente'
        );

        const filas = screen
            .getAllByRole('row')
            .slice(1);

        expect(
            within(filas[0]).getByText(
                'Anotación reciente'
            )
        ).toBeInTheDocument();

        expect(
            within(filas[1]).getByText(
                'Anotación intermedia'
            )
        ).toBeInTheDocument();

        expect(
            within(filas[2]).getByText(
                'Anotación antigua'
            )
        ).toBeInTheDocument();
    });

    it('debe registrar una anotación y recargar la hoja de vida del estudiante', async () => {
        const fechaEsperada =
            obtenerFechaActualEsperada();

        profesorService
            .obtenerAnotacionesPorEstudiante
            .mockResolvedValueOnce([
                {
                    id: 10,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'NEGATIVA',
                    descripcion: 'Interrumpe la clase',
                    fecha: '2026-07-05'
                }
            ])
            .mockResolvedValueOnce([
                {
                    id: 13,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'POSITIVA',
                    descripcion: 'Excelente comportamiento',
                    fecha: fechaEsperada
                },
                {
                    id: 10,
                    estudianteId: 5,
                    docenteId: 10,
                    tipo: 'NEGATIVA',
                    descripcion: 'Interrumpe la clase',
                    fecha: '2026-07-05'
                }
            ]);

        profesorService
            .crearAnotacionBD
            .mockResolvedValue(true);

        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Pérez, Juan'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        await screen.findByText(
            'Interrumpe la clase'
        );

        fireEvent.change(selects[2], {
            target: {
                value: 'POSITIVA'
            }
        });

        fireEvent.change(
            screen.getByRole('textbox', {
                name: /Descripción del Suceso/i
            }),
            {
                target: {
                    value: '  Excelente comportamiento  '
                }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /Ingresar al Libro de Vida/i
            })
        );

        await waitFor(() => {
            expect(
                profesorService.crearAnotacionBD
            ).toHaveBeenCalledWith({
                estudianteId: 5,
                docenteId: 10,
                tipo: 'POSITIVA',
                descripcion: 'Excelente comportamiento',
                fecha: fechaEsperada
            });
        });

        await waitFor(() => {
            expect(
                profesorService.obtenerAnotacionesPorEstudiante
            ).toHaveBeenCalledTimes(2);
        });

        expect(
            await screen.findByText(
                'Excelente comportamiento'
            )
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                /Observación positiva registrada correctamente/i
            )
        ).toBeInTheDocument();

        const contadorPositivas = screen
            .getByText('Positivas (+)')
            .closest('.stat-item');

        const contadorNegativas = screen
            .getByText('Negativas (-)')
            .closest('.stat-item');

        expect(
            within(contadorPositivas).getByText('1')
        ).toBeInTheDocument();

        expect(
            within(contadorNegativas).getByText('1')
        ).toBeInTheDocument();

        expect(selects[1].value).toBe('5');
        expect(selects[2].value).toBe('');

        expect(
            screen.getByRole('textbox', {
                name: /Descripción del Suceso/i
            }).value
        ).toBe('');
    });

    it('debe mostrar un error cuando falla el registro de la anotación', async () => {
        profesorService
            .crearAnotacionBD
            .mockResolvedValue(false);

        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Pérez, Juan'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        await waitFor(() => {
            expect(
                profesorService.obtenerAnotacionesPorEstudiante
            ).toHaveBeenCalledTimes(1);
        });

        fireEvent.change(selects[2], {
            target: {
                value: 'NEGATIVA'
            }
        });

        fireEvent.change(
            screen.getByRole('textbox', {
                name: /Descripción del Suceso/i
            }),
            {
                target: {
                    value: 'Conducta inadecuada'
                }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /Ingresar al Libro de Vida/i
            })
        );

        expect(
            await screen.findByText(
                /No fue posible registrar la observación/i
            )
        ).toBeInTheDocument();

        expect(
            profesorService.crearAnotacionBD
        ).toHaveBeenCalledTimes(1);

        expect(
            profesorService.obtenerAnotacionesPorEstudiante
        ).toHaveBeenCalledTimes(1);
    });

    it('debe impedir el registro cuando no se puede identificar al docente', async () => {
        localStorage.removeItem('usuario_id');

        render(<Anotaciones />);

        const selects =
            await screen.findAllByRole('combobox');

        fireEvent.change(selects[0], {
            target: {
                value: '1'
            }
        });

        await screen.findByRole('option', {
            name: 'Pérez, Juan'
        });

        fireEvent.change(selects[1], {
            target: {
                value: '5'
            }
        });

        fireEvent.change(selects[2], {
            target: {
                value: 'POSITIVA'
            }
        });

        fireEvent.change(
            screen.getByRole('textbox', {
                name: /Descripción del Suceso/i
            }),
            {
                target: {
                    value: 'Excelente participación'
                }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /Ingresar al Libro de Vida/i
            })
        );

        expect(
            await screen.findByText(
                /No fue posible identificar al docente autenticado/i
            )
        ).toBeInTheDocument();

        expect(
            profesorService.crearAnotacionBD
        ).not.toHaveBeenCalled();
    });
});