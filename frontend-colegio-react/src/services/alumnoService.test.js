import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../api/apiClient';
import {
    agruparEvaluacionesPorAsignatura,
    obtenerAsistenciaAlumnoActual,
    obtenerComunicadosAlumnoActual
} from './alumnoService';

vi.mock('../api/apiClient', () => ({
    default: vi.fn()
}));

describe('alumnoService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test('agrupa las evaluaciones reales por asignatura', () => {
        const resultado = agruparEvaluacionesPorAsignatura(
            [
                { asignaturaId: 2, numeroEvaluacion: 1, nota: 6.1 },
                { asignaturaId: 2, numeroEvaluacion: 2, nota: 5.8 },
                { asignaturaId: 3, numeroEvaluacion: 1, nota: 6.5 }
            ],
            [
                { id: 2, nombre: 'Matemáticas' },
                { id: 3, nombre: 'Lenguaje' }
            ]
        );

        expect(resultado).toEqual([
            {
                asignaturaId: 3,
                asignatura: 'Lenguaje',
                n1: 6.5,
                n2: null,
                n3: null
            },
            {
                asignaturaId: 2,
                asignatura: 'Matemáticas',
                n1: 6.1,
                n2: 5.8,
                n3: null
            }
        ]);
    });

    test('consulta la asistencia usando el estudiante asociado al correo de sesion', async () => {
        localStorage.setItem('usuario_email', 'alumno@colegio.com');

        apiClient
            .mockResolvedValueOnce({ id: 7 })
            .mockResolvedValueOnce([
                {
                    id: 10,
                    fecha: '2026-07-08',
                    presente: true,
                    observacion: ''
                }
            ]);

        const resultado = await obtenerAsistenciaAlumnoActual();

        expect(apiClient).toHaveBeenNthCalledWith(
            1,
            '/estudiantes/buscar-por-email?email=alumno%40colegio.com'
        );
        expect(apiClient).toHaveBeenNthCalledWith(
            2,
            '/asistencia/estudiante/7'
        );
        expect(resultado[0]).toMatchObject({
            id: 10,
            fecha: '08/07/2026',
            estado: 'Presente',
            observacion: 'Sin observaciones.'
        });
    });

    test('convierte comunicados del backend al formato de la vista alumno', async () => {
        apiClient.mockResolvedValueOnce([
            {
                id: 3,
                titulo: 'Reunion de apoderados',
                contenido: 'Comunicado oficial.',
                remitente: 'Direccion',
                fechaPublicacion: '2026-07-08T09:30:00'
            }
        ]);

        const resultado = await obtenerComunicadosAlumnoActual();

        expect(apiClient).toHaveBeenCalledWith('/comunicaciones');
        expect(resultado[0]).toMatchObject({
            id: 3,
            titulo: 'Reunion de apoderados',
            fecha: '08/07/2026',
            hora: '09:30',
            detalle: 'Comunicado oficial.',
            remitente: 'Direccion'
        });
    });
});
