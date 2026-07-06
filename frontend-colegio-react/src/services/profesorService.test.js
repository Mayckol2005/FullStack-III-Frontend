import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';

import apiClient from '../api/apiClient';

import {
    crearAnotacionBD,
    crearAsistenciaBD,
    crearEvaluacionBD,
    guardarListaAsistenciaBD,
    guardarListaEvaluacionesBD,
    obtenerAnotaciones,
    obtenerAnotacionesPorEstudiante,
    obtenerAsignaturasPorDocente,
    obtenerAsistencias,
    obtenerAsistenciasPorCursoYFecha,
    obtenerAvisosInstitucionales,
    obtenerCursosReal,
    obtenerEvaluaciones,
    obtenerEvaluacionesPorAsignatura,
    obtenerEvaluacionesPorEstudianteYAsignatura,
    obtenerPromedioEvaluacion
} from './profesorService';

vi.mock('../api/apiClient', () => ({
    default: vi.fn()
}));

describe('Servicio Docente: profesorService.js', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(
            console,
            'error'
        ).mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Métodos GET', () => {

        it('obtenerCursosReal() debe retornar los cursos obtenidos desde la API', async () => {
            const mockData = [
                {
                    id: 1,
                    grado: '3º Medio'
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado = await obtenerCursosReal();

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/academico/cursos'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerCursosReal() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Fallo de red')
            );

            const resultado = await obtenerCursosReal();

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo cursos reales:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerAsignaturasPorDocente() debe consultar las asignaturas del docente indicado', async () => {
            const mockData = [
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
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerAsignaturasPorDocente(10);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/academico/asignaturas/docente/10'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAsignaturasPorDocente() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error(
                    'Error consultando asignaturas del docente'
                )
            );

            const resultado =
                await obtenerAsignaturasPorDocente(10);

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo asignaturas del docente:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerEvaluaciones() debe retornar las evaluaciones obtenidas desde la API', async () => {
            const mockData = [
                {
                    id: 10,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 6.5
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado = await obtenerEvaluaciones();

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerEvaluaciones() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando evaluaciones')
            );

            const resultado = await obtenerEvaluaciones();

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo evaluaciones:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerEvaluacionesPorAsignatura() debe consultar las evaluaciones de la asignatura indicada', async () => {
            const mockData = [
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
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerEvaluacionesPorAsignatura(5);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones/asignatura/5'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerEvaluacionesPorAsignatura() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando asignatura')
            );

            const resultado =
                await obtenerEvaluacionesPorAsignatura(5);

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo evaluaciones por asignatura:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerEvaluacionesPorEstudianteYAsignatura() debe consultar estudiante y asignatura indicados', async () => {
            const mockData = [
                {
                    id: 50,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 6.5
                },
                {
                    id: 51,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 2,
                    nota: 5.8
                },
                {
                    id: 52,
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 3,
                    nota: 6.1
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerEvaluacionesPorEstudianteYAsignatura(
                    10,
                    5
                );

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones/estudiante/10/asignatura/5'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerEvaluacionesPorEstudianteYAsignatura() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando estudiante')
            );

            const resultado =
                await obtenerEvaluacionesPorEstudianteYAsignatura(
                    10,
                    5
                );

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo evaluaciones del estudiante por asignatura:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerPromedioEvaluacion() debe consultar el promedio por estudiante y asignaturaId', async () => {
            apiClient.mockResolvedValue(6.1);

            const resultado =
                await obtenerPromedioEvaluacion(
                    10,
                    5
                );

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones/estudiante/10/promedio?asignaturaId=5'
                );

            expect(resultado).toBe(6.1);
        });

        it('obtenerPromedioEvaluacion() debe retornar null ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error calculando promedio')
            );

            const resultado =
                await obtenerPromedioEvaluacion(
                    10,
                    5
                );

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo promedio de evaluación:',
                    expect.any(Error)
                );

            expect(resultado).toBeNull();
        });

        it('obtenerAnotaciones() debe retornar las anotaciones obtenidas desde la API', async () => {
            const mockData = [
                {
                    id: 2,
                    tipo: 'NEGATIVA'
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado = await obtenerAnotaciones();

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/anotaciones'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAnotaciones() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando anotaciones')
            );

            const resultado = await obtenerAnotaciones();

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo anotaciones:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerAnotacionesPorEstudiante() debe consultar la hoja de vida del estudiante indicado', async () => {
            const mockData = [
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
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerAnotacionesPorEstudiante(5);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/anotaciones/estudiante/5'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAnotacionesPorEstudiante() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando hoja de vida')
            );

            const resultado =
                await obtenerAnotacionesPorEstudiante(5);

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo anotaciones del estudiante:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerAsistencias() debe retornar el historial general de asistencia', async () => {
            const mockData = [
                {
                    id: 5,
                    presente: true
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado = await obtenerAsistencias();

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/asistencia'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAsistencias() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando asistencias')
            );

            const resultado = await obtenerAsistencias();

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo asistencias:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerAsistenciasPorCursoYFecha() debe consultar el curso y la fecha indicados', async () => {
            const mockData = [
                {
                    id: 50,
                    fecha: '2026-07-08',
                    cursoId: 1,
                    estudianteId: 10,
                    presente: false,
                    observacion: ''
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerAsistenciasPorCursoYFecha(
                    1,
                    '2026-07-08'
                );

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/asistencia/curso/1?fecha=2026-07-08'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAsistenciasPorCursoYFecha() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando asistencia')
            );

            const resultado =
                await obtenerAsistenciasPorCursoYFecha(
                    1,
                    '2026-07-08'
                );

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo asistencia por curso y fecha:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });

        it('obtenerAvisosInstitucionales() debe retornar los avisos obtenidos desde la API', async () => {
            const mockData = [
                {
                    id: 1,
                    mensaje: 'Reunión de apoderados'
                }
            ];

            apiClient.mockResolvedValue(mockData);

            const resultado =
                await obtenerAvisosInstitucionales();

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/comunicaciones'
                );

            expect(resultado).toEqual(mockData);
        });

        it('obtenerAvisosInstitucionales() debe retornar un arreglo vacío ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error consultando avisos')
            );

            const resultado =
                await obtenerAvisosInstitucionales();

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error obteniendo avisos del mural:',
                    expect.any(Error)
                );

            expect(resultado).toEqual([]);
        });
    });

    describe('Métodos POST', () => {

        it('crearAnotacionBD() debe retornar true cuando la anotación se guarda correctamente', async () => {
            const payload = {
                estudianteId: 5,
                docenteId: 10,
                tipo: 'POSITIVA',
                descripcion: 'Excelente participación',
                fecha: '2026-07-06'
            };

            apiClient.mockResolvedValue({
                id: 1
            });

            const resultado =
                await crearAnotacionBD(payload);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/anotaciones',
                    {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    }
                );

            expect(resultado).toBe(true);
        });

        it('crearAnotacionBD() debe retornar false ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error guardando anotación')
            );

            const resultado =
                await crearAnotacionBD({});

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error al persistir anotación:',
                    expect.any(Error)
                );

            expect(resultado).toBe(false);
        });

        it('crearAsistenciaBD() debe retornar true cuando la asistencia se guarda correctamente', async () => {
            const payload = {
                fecha: '2026-07-08',
                cursoId: 1,
                estudianteId: 10,
                presente: true,
                observacion: ''
            };

            apiClient.mockResolvedValue({
                id: 50
            });

            const resultado =
                await crearAsistenciaBD(payload);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/asistencia',
                    {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    }
                );

            expect(resultado).toBe(true);
        });

        it('crearAsistenciaBD() debe retornar false ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error guardando asistencia')
            );

            const resultado =
                await crearAsistenciaBD({});

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error al persistir asistencia:',
                    expect.any(Error)
                );

            expect(resultado).toBe(false);
        });

        it('crearEvaluacionBD() debe retornar true cuando la evaluación se guarda correctamente', async () => {
            const payload = {
                estudianteId: 10,
                asignaturaId: 5,
                numeroEvaluacion: 1,
                nota: 7.0,
                fecha: '2026-07-08'
            };

            apiClient.mockResolvedValue({
                id: 20
            });

            const resultado =
                await crearEvaluacionBD(payload);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones',
                    {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    }
                );

            expect(resultado).toBe(true);
        });

        it('crearEvaluacionBD() debe retornar false ante un error', async () => {
            apiClient.mockRejectedValue(
                new Error('Error guardando evaluación')
            );

            const resultado =
                await crearEvaluacionBD({});

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error al persistir calificación:',
                    expect.any(Error)
                );

            expect(resultado).toBe(false);
        });
    });

    describe('Métodos PUT', () => {

        it('guardarListaAsistenciaBD() debe sincronizar la lista completa de asistencia', async () => {
            const payload = [
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
            ];

            const respuestaBackend = [
                {
                    id: 50,
                    ...payload[0]
                },
                {
                    id: 51,
                    ...payload[1]
                }
            ];

            apiClient.mockResolvedValue(
                respuestaBackend
            );

            const resultado =
                await guardarListaAsistenciaBD(payload);

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/asistencia/lista',
                    {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    }
                );

            expect(resultado).toEqual(
                respuestaBackend
            );
        });

        it('guardarListaAsistenciaBD() debe retornar null cuando falla la sincronización', async () => {
            apiClient.mockRejectedValue(
                new Error('Error sincronizando asistencia')
            );

            const resultado =
                await guardarListaAsistenciaBD([]);

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error al sincronizar la lista de asistencia:',
                    expect.any(Error)
                );

            expect(resultado).toBeNull();
        });

        it('guardarListaEvaluacionesBD() debe sincronizar N1 N2 y N3', async () => {
            const payload = [
                {
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 1,
                    nota: 6.5,
                    fecha: '2026-07-08'
                },
                {
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 2,
                    nota: 5.8,
                    fecha: '2026-07-08'
                },
                {
                    estudianteId: 10,
                    asignaturaId: 5,
                    numeroEvaluacion: 3,
                    nota: 6.1,
                    fecha: '2026-07-08'
                }
            ];

            const respuestaBackend = [
                {
                    id: 50,
                    ...payload[0]
                },
                {
                    id: 51,
                    ...payload[1]
                },
                {
                    id: 52,
                    ...payload[2]
                }
            ];

            apiClient.mockResolvedValue(
                respuestaBackend
            );

            const resultado =
                await guardarListaEvaluacionesBD(
                    payload
                );

            expect(apiClient)
                .toHaveBeenCalledWith(
                    '/evaluaciones/lista',
                    {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    }
                );

            expect(resultado).toEqual(
                respuestaBackend
            );

            expect(
                resultado.map(
                    evaluacion =>
                        evaluacion.numeroEvaluacion
                )
            ).toEqual([
                1,
                2,
                3
            ]);
        });

        it('guardarListaEvaluacionesBD() debe retornar null cuando falla la sincronización', async () => {
            apiClient.mockRejectedValue(
                new Error('Error sincronizando evaluaciones')
            );

            const resultado =
                await guardarListaEvaluacionesBD([]);

            expect(console.error)
                .toHaveBeenCalledWith(
                    'Error al sincronizar las evaluaciones:',
                    expect.any(Error)
                );

            expect(resultado).toBeNull();
        });
    });
});