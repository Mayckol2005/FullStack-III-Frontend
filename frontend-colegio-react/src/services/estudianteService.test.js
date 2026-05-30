import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
    obtenerEstudiantes, 
    crearEstudiante, 
    actualizarEstudianteBD, 
    eliminarEstudianteBD 
} from './estudianteService';

describe('Servicio de Estudiantes: estudianteService.js', () => {

    beforeEach(() => {
        // Interceptamos el fetch global del entorno de pruebas
        vi.stubGlobal('fetch', vi.fn());
        
        // Silenciamos console.error y console.log para mantener limpia la terminal
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        
        // Mockeamos el token guardado en el almacenamiento local
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-valido-xyz');
    });

    afterEach(() => {
        // Limpiamos los mocks al terminar cada test individual
        vi.restoreAllMocks();
    });

    describe('obtenerEstudiantes()', () => {
        const mockEstudiantes = [
            { id: 1, nombre: 'Juan Pérez', cursoId: 2 },
            { id: 2, nombre: 'María López', cursoId: 2 }
        ];

        it('debe retornar todos los estudiantes si NO se le pasa un cursoId y la petición es exitosa', async () => {
            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockEstudiantes
            });

            const resultado = await obtenerEstudiantes();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/estudiantes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-valido-xyz'
                }
            });
            expect(resultado).toEqual(mockEstudiantes);
        });

        it('debe retornar los estudiantes de un curso específico si se le pasa un cursoId', async () => {
            const cursoId = 2;
            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockEstudiantes
            });

            const resultado = await obtenerEstudiantes(cursoId);

            // Verificamos que la URL construida incluya el filtro por curso
            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/estudiantes/curso/${cursoId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-valido-xyz'
                }
            });
            expect(resultado).toEqual(mockEstudiantes);
        });

        it('debe retornar un arreglo vacío si la respuesta del servidor no es exitosa (ok: false)', async () => {
            fetch.mockResolvedValue({
                ok: false
            });

            const resultado = await obtenerEstudiantes();

            expect(resultado).toEqual([]);
        });

        it('debe capturar el error en el catch, logearlo y retornar un arreglo vacío ante un fallo de red', async () => {
            fetch.mockRejectedValue(new Error('Fallo de red de servidor'));

            const resultado = await obtenerEstudiantes();

            expect(console.error).toHaveBeenCalledWith("Error obteniendo estudiantes:", expect.any(Error));
            expect(resultado).toEqual([]);
        });
    });

    describe('crearEstudiante()', () => {
        const nuevoEstudiante = { nombre: 'Carlos Ruiz', cursoId: 1 };

        it('debe retornar true si el servidor crea el estudiante con éxito (ok: true)', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await crearEstudiante(nuevoEstudiante);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/estudiantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-valido-xyz'
                },
                body: JSON.stringify(nuevoEstudiante)
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si el servidor responde con un código de error (ok: false)', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await crearEstudiante(nuevoEstudiante);

            expect(resultado).toBe(false);
        });

        it('debe atrapar la excepción en el catch, logear el error y retornar false si el fetch falla', async () => {
            fetch.mockRejectedValue(new Error('Internal Server Error'));

            const resultado = await crearEstudiante(nuevoEstudiante);

            expect(console.error).toHaveBeenCalledWith("Error creando estudiante:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });

    describe('actualizarEstudianteBD()', () => {
        const idEstudiante = 10;
        const datosActualizados = { nombre: 'Carlos Ruiz Modificado', cursoId: 1 };

        it('debe ejecutar una petición PUT a la URL con ID y retornar true si es exitosa', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await actualizarEstudianteBD(idEstudiante, datosActualizados);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/estudiantes/${idEstudiante}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-valido-xyz'
                },
                body: JSON.stringify(datosActualizados)
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si la actualización falla en el servidor (ok: false)', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await actualizarEstudianteBD(idEstudiante, datosActualizados);

            expect(resultado).toBe(false);
        });

        it('debe manejar la excepción en el catch y retornar false ante fallos severos', async () => {
            fetch.mockRejectedValue(new Error('No hay conexión'));

            const resultado = await actualizarEstudianteBD(idEstudiante, datosActualizados);

            expect(console.error).toHaveBeenCalledWith("Error actualizando estudiante:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });

    describe('eliminarEstudianteBD()', () => {
        const idEstudiante = 15;

        it('debe realizar una petición DELETE y retornar true si se borró de la BD', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await eliminarEstudianteBD(idEstudiante);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/estudiantes/${idEstudiante}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token-valido-xyz'
                }
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si el backend deniega la eliminación (ok: false)', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await eliminarEstudianteBD(idEstudiante);

            expect(resultado).toBe(false);
        });

        it('debe capturar el error y retornar false si el backend está caído', async () => {
            fetch.mockRejectedValue(new Error('Timeout de red'));

            const resultado = await eliminarEstudianteBD(idEstudiante);

            expect(console.error).toHaveBeenCalledWith("Error eliminando estudiante:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });
});