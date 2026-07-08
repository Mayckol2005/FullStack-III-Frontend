import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Usuarios from './Usuarios';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

vi.mock('../../services/usuarioService', () => ({
    obtenerUsuarios: vi.fn(),
    crearUsuario: vi.fn(),
    actualizarUsuarioBD: vi.fn(),
    eliminarUsuarioBD: vi.fn()
}));

import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuarioBD,
    eliminarUsuarioBD
} from '../../services/usuarioService';

describe('Usuarios', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    test('renderiza usuarios obtenidos del backend', async () => {
        obtenerUsuarios.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
                nombre: 'Juan',
                email: 'juan@test.cl',
                rol: 'PROFESOR'
            }
        ]);

        render(<Usuarios />);

        expect(await screen.findByText('Juan')).toBeInTheDocument();
    });

    test('permite crear usuario', async () => {
        obtenerUsuarios.mockResolvedValue([]);
        crearUsuario.mockResolvedValue({ exito: true });

        render(<Usuarios />);

        const inputRut = screen.getByPlaceholderText(/RUT/i);
        const inputNombre = screen.getByPlaceholderText(/Nombre Completo/i);
        const inputEmail = screen.getByPlaceholderText(/Email Corporativo/i);

        fireEvent.change(inputRut, {
            target: { value: '111111111' }
        });
        
        expect(inputRut.value).toBe('11.111.111-1');

        fireEvent.change(inputNombre, {
            target: { value: 'Juan Pérez' }
        });

        fireEvent.change(inputEmail, {
            target: { value: 'juan@test.cl' }
        });

        fireEvent.change(
            screen.getByPlaceholderText(/Contraseña/i),
            {
                target: { value: '123456' }
            }
        );

        fireEvent.change(
            screen.getByRole('combobox'),
            {
                target: { value: 'PROFESOR' }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /guardar/i
            })
        );

        await waitFor(() => {
            expect(crearUsuario).toHaveBeenCalledTimes(1);
            expect(crearUsuario).toHaveBeenCalledWith(expect.objectContaining({
                rut: '11.111.111-1',
                rol: 'PROFESOR'
            }));
        });
    });

    test('muestra error cuando crear usuario falla por validación', async () => {
        obtenerUsuarios.mockResolvedValue([]);
        crearUsuario.mockResolvedValue({
            exito: false,
            mensaje: 'password: La contraseña debe tener al menos 6 caracteres'
        });

        render(<Usuarios />);

        fireEvent.change(screen.getByPlaceholderText(/RUT/i), {
            target: { value: '111111111' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Nombre Completo/i), {
            target: { value: 'Juan Pérez' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Email Corporativo/i), {
            target: { value: 'juan@test.cl' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), {
            target: { value: '123456' }
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'PROFESOR' }
        });

        fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

        expect(await screen.findByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });

    test('permite iniciar edición y guardar cambios', async () => {
        obtenerUsuarios.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
                nombre: 'Juan',
                email: 'juan@test.cl',
                rol: 'PROFESOR'
            }
        ]);

        actualizarUsuarioBD.mockResolvedValue(true);

        render(<Usuarios />);

        await screen.findByText('Juan');

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const inputNombre = screen.getByDisplayValue('Juan');

        fireEvent.change(inputNombre, {
            target: {
                value: 'Juan Editado'
            }
        });

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        fireEvent.click(botonGuardar);

        await waitFor(() => {
            expect(actualizarUsuarioBD).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    nombre: 'Juan Editado'
                }
            ));
        });
    });

    test('permite cancelar edición', async () => {
        obtenerUsuarios.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
                nombre: 'Juan',
                email: 'juan@test.cl',
                rol: 'PROFESOR'
            }
        ]);

        render(<Usuarios />);

        await screen.findByText('Juan');

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();

        const botonCancelar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-times'));

        fireEvent.click(botonCancelar);

        await waitFor(() => {
            expect(screen.queryByDisplayValue('Juan')).not.toBeInTheDocument();
        });
    });

    test('permite eliminar usuario', async () => {
        obtenerUsuarios.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
                nombre: 'Juan',
                email: 'juan@test.cl',
                rol: 'PROFESOR'
            }
        ]);

        eliminarUsuarioBD.mockResolvedValue(true);

        render(<Usuarios />);

        await screen.findByText('Juan');

        const botonEliminar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-trash'));

        fireEvent.click(botonEliminar);

        await waitFor(() => {
            expect(eliminarUsuarioBD).toHaveBeenCalledWith(1);
        });
    });

    test('no guarda cambios cuando confirm devuelve false', async () => {
        window.confirm.mockReturnValue(false);

        obtenerUsuarios.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
                nombre: 'Juan',
                email: 'juan@test.cl',
                rol: 'PROFESOR'
            }
        ]);

        render(<Usuarios />);

        await screen.findByText('Juan');

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        fireEvent.click(botonGuardar);

        expect(actualizarUsuarioBD).not.toHaveBeenCalled();
    });
});
