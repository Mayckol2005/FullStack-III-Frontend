import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { obtenerCursosReal, obtenerAsignaturasPorCursoReal } from './academicoService';

describe('Servicio Académico Real: academicoService.js', () => {

    beforeEach(() => {
        // Interceptamos el fetch global del navegador para controlarlo en el entorno de pruebas
        vi.stubGlobal('fetch', vi.fn());
        
        // Silenciamos console.error para no ensuciar la terminal con los errores controlados de los catch
        vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Simulamos que el localStorage contiene el token institucional correcto
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-jwt-falso-123');
    });

    afterEach(() => {
        // Limpiamos los mocks después de cada caso para evitar contaminación de datos
        vi.restoreAllMocks();
    });

    describe('obtenerCursosReal()', () => {
        it('debe retornar la lista de cursos si la respuesta HTTP es exitosa (ok: true)', async () => {
            const mockData = [{ id: 1, nombre: '1º Medio A' }, { id: 2, nombre: '2º Medio B' }];
            
            // Simular respuesta exitosa del servidor
            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockData
            });

            const resultado = await obtenerCursosReal();

            // Validamos que se invocó a la URL correcta del backend con sus headers de autenticación
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/academico/cursos', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-jwt-falso-123'
                }
            });
            expect(resultado).toEqual(mockData);
        });

        it('debe retornar un arreglo vacío si el servidor responde con un estado erróneo (ok: false)', async () => {
            fetch.mockResolvedValue({
                ok: false
            });

            const resultado = await obtenerCursosReal();

            expect(resultado).toEqual([]);
        });

        it('debe capturar la excepción en el bloque catch, logear el error y retornar un arreglo vacío ante un fallo de red', async () => {
            fetch.mockRejectedValue(new Error('Conexión rechazada por el servidor'));

            const resultado = await obtenerCursosReal();

            expect(console.error).toHaveBeenCalledWith("Error consultando cursos del backend:", expect.any(Error));
            expect(resultado).toEqual([]);
        });
    });

    describe('obtenerAsignaturasPorCursoReal()', () => {
        it('debe retornar las asignaturas asociadas al pasar un cursoId válido', async () => {
            const cursoId = 3;
            const mockAsignaturas = [{ id: 10, nombre: 'Matemáticas' }, { id: 11, nombre: 'Física' }];
            
            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockAsignaturas
            });

            const resultado = await obtenerAsignaturasPorCursoReal(cursoId);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/academico/asignaturas/curso/${cursoId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-jwt-falso-123'
                }
            });
            expect(resultado).toEqual(mockAsignaturas);
        });

        it('debe retornar un arreglo vacío si el endpoint responde con un código de error (ok: false)', async () => {
            fetch.mockResolvedValue({
                ok: false
            });

            const resultado = await obtenerAsignaturasPorCursoReal(99);

            expect(resultado).toEqual([]);
        });

        it('debe capturar la falla en el bloque catch, registrarla en la consola y retornar un arreglo vacío', async () => {
            fetch.mockRejectedValue(new Error('Error de Timeout'));

            const resultado = await obtenerAsignaturasPorCursoReal(4);

            expect(console.error).toHaveBeenCalledWith("Error consultando asignaturas por curso:", expect.any(Error));
            expect(resultado).toEqual([]);
        });
    });
});