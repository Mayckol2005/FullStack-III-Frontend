import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuarioBD,
    eliminarUsuarioBD
} from './usuarioService';

describe('Servicio de Usuarios: usuarioService.js', () => {

    beforeEach(() => {
        // Interceptamos por completo el fetch global del entorno
        vi.stubGlobal('fetch', vi.fn());
        
        // Silenciamos los logs de error para que la terminal se vea limpia
        vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Simulamos la respuesta del almacenamiento local
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-seguro-usuario-xyz');
    });

    afterEach(() => {
        // Limpiamos los mocks tras cada test individual
        vi.restoreAllMocks();
    });

    const headersEsperados = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token-seguro-usuario-xyz'
    };

    describe('obtenerUsuarios()', () => {
        it('debe retornar la lista completa de usuarios si el servidor responde exitosamente (ok: true)', async () => {
            const mockUsuarios = [
                { id: 1, username: 'admin', rol: 'ADMINISTRADOR' },
                { id: 2, username: 'profe_juan', rol: 'PROFESOR' }
            ];

            fetch.mockResolvedValue({
                ok: true,
                json: async () => mockUsuarios
            });

            const resultado = await obtenerUsuarios();

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/usuarios', {
                headers: headersEsperados
            });
            expect(resultado).toEqual(mockUsuarios);
        });

        it('debe retornar un arreglo vacío si el estatus HTTP es erróneo (ok: false)', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await obtenerUsuarios();

            expect(resultado).toEqual([]);
        });

        it('debe saltar al bloque catch, logear el error y retornar un arreglo vacío si el fetch es rechazado', async () => {
            fetch.mockRejectedValue(new Error('Fallo crítico de conexión'));

            const resultado = await obtenerUsuarios();

            expect(console.error).toHaveBeenCalledWith("Error obteniendo usuarios:", expect.any(Error));
            expect(resultado).toEqual([]);
        });
    });

    describe('crearUsuario()', () => {
        const nuevoUsuario = { username: 'nuevo_usuario', password: '123', rol: 'ESTUDIANTE' };

        it('debe retornar true si la petición POST se completa con éxito', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await crearUsuario(nuevoUsuario);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: headersEsperados,
                body: JSON.stringify(nuevoUsuario)
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si el servidor responde con un código de fallo (ok: false)', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await crearUsuario(nuevoUsuario);

            expect(resultado).toBe(false);
        });

        it('debe capturar la excepción y retornar false ante caídas de la red', async () => {
            fetch.mockRejectedValue(new Error('Servidor inaccesible'));

            const resultado = await crearUsuario(nuevoUsuario);

            expect(console.error).toHaveBeenCalledWith("Error creando usuario:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });

    describe('actualizarUsuarioBD()', () => {
        const idUsuario = 42;
        const datosActualizados = { username: 'usuario_modificado', rol: 'PROFESOR' };

        it('debe mandar un PUT al endpoint correcto con el ID y retornar true si es exitoso', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await actualizarUsuarioBD(idUsuario, datosActualizados);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/usuarios/${idUsuario}`, {
                method: 'PUT',
                headers: headersEsperados,
                body: JSON.stringify(datosActualizados)
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si la API rechaza la edición', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await actualizarUsuarioBD(idUsuario, datosActualizados);

            expect(resultado).toBe(false);
        });

        it('debe atrapar fallos del servidor y retornar false en el catch', async () => {
            fetch.mockRejectedValue(new Error('Error en BD'));

            const resultado = await actualizarUsuarioBD(idUsuario, datosActualizados);

            expect(console.error).toHaveBeenCalledWith("Error actualizando usuario:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });

    describe('eliminarUsuarioBD()', () => {
        const idUsuario = 99;

        it('debe enviar un DELETE a la URL destino y retornar true si la eliminación es exitosa', async () => {
            fetch.mockResolvedValue({ ok: true });

            const resultado = await eliminarUsuarioBD(idUsuario);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/api/usuarios/${idUsuario}`, {
                method: 'DELETE',
                headers: headersEsperados
            });
            expect(resultado).toBe(true);
        });

        it('debe retornar false si el backend no permite eliminar el registro', async () => {
            fetch.mockResolvedValue({ ok: false });

            const resultado = await eliminarUsuarioBD(idUsuario);

            expect(resultado).toBe(false);
        });

        it('debe capturar fallos graves de red y resolver falsos de forma controlada', async () => {
            fetch.mockRejectedValue(new Error('Error de Red'));

            const resultado = await eliminarUsuarioBD(idUsuario);

            expect(console.error).toHaveBeenCalledWith("Error eliminando usuario:", expect.any(Error));
            expect(resultado).toBe(false);
        });
    });
});