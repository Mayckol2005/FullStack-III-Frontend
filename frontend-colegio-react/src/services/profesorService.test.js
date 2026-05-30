import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    obtenerCursosReal,
    obtenerEvaluaciones,
    obtenerAnotaciones,
    obtenerAsistencias,
    crearAnotacionBD,
    crearAsistenciaBD,
    crearEvaluacionBD,
    obtenerAvisosInstitucionales
} from './profesorService';

describe('Servicio Docente: profesorService.js', () => {

    beforeEach(() => {
        // Interceptamos la red global del navegador
        vi.stubGlobal('fetch', vi.fn());
        
        // Mutamos console para evitar spam de alertas controladas en el log
        vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Mockeamos el token de seguridad almacenado en la sesión
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-profesor-abc');
    });

    afterEach(() => {
        // Restauramos los mocks para la siguiente prueba
        vi.restoreAllMocks();
    });

    const headersEsperados = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token-profesor-abc'
    };

    describe('Métodos GET (Lectura de Datos)', () => {
        
        it('obtenerCursosReal() debe retornar los cursos si la respuesta es exitosa', async () => {
            const mockData = [{ id: 1, grado: '3º Medio' }];
            fetch.mockResolvedValue({ ok: true, json: async () => mockData });

            const resultado = await obtenerCursosReal();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/academico/cursos', { headers: headersEsperados });
            expect(resultado).toEqual(mockData);
        });

        it('obtenerCursosReal() debe retornar un array vacío si la petición falla en el catch', async () => {
            fetch.mockRejectedValue(new Error('Fallo de Red'));
            const resultado = await obtenerCursosReal();
            expect(console.error).toHaveBeenCalledWith("Error obteniendo cursos reales:", expect.any(Error));
            expect(resultado).toEqual([]);
        });

        it('obtenerEvaluaciones() debe retornar evaluaciones si la respuesta es exitosa', async () => {
            const mockData = [{ id: 10, nota: 6.5 }];
            fetch.mockResolvedValue({ ok: true, json: async () => mockData });

            const resultado = await obtenerEvaluaciones();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/evaluaciones', { headers: headersEsperados });
            expect(resultado).toEqual(mockData);
        });

        it('obtenerEvaluaciones() debe retornar vacío si la respuesta no es OK', async () => {
            fetch.mockResolvedValue({ ok: false });
            const resultado = await obtenerEvaluaciones();
            expect(resultado).toEqual([]);
        });

        it('obtenerEvaluaciones() debe retornar vacío ante una excepción', async () => {
            fetch.mockRejectedValue(new Error('Fallo'));
            const resultado = await obtenerEvaluaciones();
            expect(resultado).toEqual([]);
        });

        it('obtenerAnotaciones() debe retornar anotaciones si la respuesta es exitosa', async () => {
            const mockData = [{ id: 2, tipo: 'NEGATIVA' }];
            fetch.mockResolvedValue({ ok: true, json: async () => mockData });

            const resultado = await obtenerAnotaciones();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/anotaciones', { headers: headersEsperados });
            expect(resultado).toEqual(mockData);
        });

        it('obtenerAnotaciones() debe retornar vacío ante un error', async () => {
            fetch.mockRejectedValue(new Error('Fallo'));
            const resultado = await obtenerAnotaciones();
            expect(resultado).toEqual([]);
        });

        it('obtenerAsistencias() debe retornar asistencias si la respuesta es exitosa', async () => {
            const mockData = [{ id: 5, presente: true }];
            fetch.mockResolvedValue({ ok: true, json: async () => mockData });

            const resultado = await obtenerAsistencias();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/asistencia', { headers: headersEsperados });
            expect(resultado).toEqual(mockData);
        });

        it('obtenerAsistencias() debe retornar vacío ante un error', async () => {
            fetch.mockRejectedValue(new Error('Fallo'));
            const resultado = await obtenerAsistencias();
            expect(resultado).toEqual([]);
        });

        it('obtenerAvisosInstitucionales() debe retornar avisos si la respuesta es exitosa', async () => {
            const mockData = [{ id: 1, mensaje: 'Reunión de apoderados' }];
            fetch.mockResolvedValue({ ok: true, json: async () => mockData });

            const resultado = await obtenerAvisosInstitucionales();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/comunicaciones', { headers: headersEsperados });
            expect(resultado).toEqual(mockData);
        });

        it('obtenerAvisosInstitucionales() debe retornar vacío ante un error', async () => {
            fetch.mockRejectedValue(new Error('Fallo'));
            const resultado = await obtenerAvisosInstitucionales();
            expect(resultado).toEqual([]);
        });
    });

    describe('Métodos POST (Creación de Registros)', () => {

        it('crearAnotacionBD() debe retornar true si se guarda con éxito', async () => {
            const payload = { detalle: 'Llegó tarde' };
            fetch.mockResolvedValue({ ok: true });

            const resultado = await crearAnotacionBD(payload);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/anotaciones', {
                method: 'POST',
                headers: headersEsperados,
                body: JSON.stringify(payload)
            });
            expect(resultado).toBe(true);
        });

        it('crearAnotacionBD() debe retornar false si falla o salta al catch', async () => {
            fetch.mockRejectedValue(new Error('Error'));
            const resultado = await crearAnotacionBD({});
            expect(resultado).toBe(false);
        });

        it('crearAsistenciaBD() debe retornar true si se guarda con éxito', async () => {
            const payload = { alumnoId: 4, presente: true };
            fetch.mockResolvedValue({ ok: true });

            const resultado = await crearAsistenciaBD(payload);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/asistencia', {
                method: 'POST',
                headers: headersEsperados,
                body: JSON.stringify(payload)
            });
            expect(resultado).toBe(true);
        });

        it('crearAsistenciaBD() debe retornar false si falla o salta al catch', async () => {
            fetch.mockRejectedValue(new Error('Error'));
            const resultado = await crearAsistenciaBD({});
            expect(resultado).toBe(false);
        });

        it('crearEvaluacionBD() debe retornar true si se guarda con éxito', async () => {
            const payload = { nota: 7.0, ponderacion: 20 };
            fetch.mockResolvedValue({ ok: true });

            const resultado = await crearEvaluacionBD(payload);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/evaluaciones', {
                method: 'POST',
                headers: headersEsperados,
                body: JSON.stringify(payload)
            });
            expect(resultado).toBe(true);
        });

        it('crearEvaluacionBD() debe retornar false si falla o salta al catch', async () => {
            fetch.mockRejectedValue(new Error('Error'));
            const resultado = await crearEvaluacionBD({});
            expect(resultado).toBe(false);
        });
    });
});