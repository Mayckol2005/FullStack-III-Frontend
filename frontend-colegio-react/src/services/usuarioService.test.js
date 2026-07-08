import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { obtenerUsuarios, crearUsuario, actualizarUsuarioBD, eliminarUsuarioBD } from './usuarioService';

describe('Servicio de Usuarios', () => {

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());

        vi.spyOn(console, 'error')
            .mockImplementation(() => {});

        vi.spyOn(Storage.prototype, 'getItem')
            .mockReturnValue('token-seguro-usuario-xyz');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('obtenerUsuarios', () => {

        it('debe retornar lista de usuarios cuando la respuesta es correcta', async () => {

            fetch.mockResolvedValue({
                ok: true,
                json: async () => [
                    { id: 1, nombre: 'Juan' }
                ]
            });

            const resultado = await obtenerUsuarios();

            expect(resultado).toEqual([
                { id: 1, nombre: 'Juan' }
            ]);
        });

        it('debe retornar arreglo vacío cuando res.ok es false', async () => {

            fetch.mockResolvedValue({
                ok: false
            });

            const resultado = await obtenerUsuarios();

            expect(resultado).toEqual([]);
        });

        it('debe retornar arreglo vacío cuando ocurre una excepción', async () => {

            fetch.mockRejectedValue(
                new Error('Error de red')
            );

            const resultado = await obtenerUsuarios();

            expect(resultado).toEqual([]);
        });
    });

    describe('crearUsuario', () => {

        it('debe enviar POST a /crear', async () => {

            fetch.mockResolvedValue({
                ok: true,
                text: async () => JSON.stringify({ id: 1, nombre: 'admin' })
            });

            const usuario = {
                username: 'admin'
            };

            const resultado = await crearUsuario(usuario);

            expect(resultado).toEqual({
                exito: true,
                usuario: { id: 1, nombre: 'admin' }
            });

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/usuarios/crear',
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        it('debe retornar mensaje cuando el backend rechaza la creación', async () => {

            fetch.mockResolvedValue({
                ok: false,
                text: async () => JSON.stringify({
                    password: 'La contraseña debe tener al menos 6 caracteres'
                })
            });

            const resultado = await crearUsuario({
                username: 'admin'
            });

            expect(resultado).toEqual({
                exito: false,
                mensaje: 'password: La contraseña debe tener al menos 6 caracteres'
            });
        });

        it('debe retornar error de conexión cuando ocurre una excepción', async () => {

            fetch.mockRejectedValue(
                new Error('Error creando usuario')
            );

            const resultado = await crearUsuario({
                username: 'admin'
            });

            expect(resultado).toEqual({
                exito: false,
                mensaje: 'Error de conexión al crear el usuario.'
            });
        });
    });

    describe('actualizarUsuarioBD', () => {

        it('debe actualizar usuario correctamente', async () => {

            fetch.mockResolvedValue({
                ok: true
            });

            const resultado =
                await actualizarUsuarioBD(1, {
                    nombre: 'Pedro'
                });

            expect(resultado).toBe(true);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/usuarios/1',
                expect.objectContaining({
                    method: 'PUT'
                })
            );
        });

        it('debe retornar false cuando falla la actualización', async () => {

            fetch.mockRejectedValue(
                new Error('Error actualizando')
            );

            const resultado =
                await actualizarUsuarioBD(1, {});

            expect(resultado).toBe(false);
        });
    });

    describe('eliminarUsuarioBD', () => {

        it('debe eliminar usuario correctamente', async () => {

            fetch.mockResolvedValue({
                ok: true
            });

            const resultado =
                await eliminarUsuarioBD(1);

            expect(resultado).toBe(true);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/usuarios/1',
                expect.objectContaining({
                    method: 'DELETE'
                })
            );
        });

        it('debe retornar false cuando falla la eliminación', async () => {

            fetch.mockRejectedValue(
                new Error('Error eliminando')
            );

            const resultado =
                await eliminarUsuarioBD(1);

            expect(resultado).toBe(false);
        });
    });
});
