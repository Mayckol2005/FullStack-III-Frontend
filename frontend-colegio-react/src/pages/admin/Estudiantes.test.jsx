import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Estudiantes from './Estudiantes';
import * as estudianteService from '../../services/estudianteService';

vi.mock('../../services/estudianteService');

describe('Componente Estudiantes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('debe cargar y mostrar la lista de estudiantes', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Pérez',
                email: 'j@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        await act(async () => {
            render(<Estudiantes />);
        });

        expect(await screen.findByText('Juan')).toBeInTheDocument();
    });

    it('debe matricular un estudiante', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([]);
        estudianteService.crearEstudiante.mockResolvedValue(true);

        render(<Estudiantes />);

        fireEvent.change(screen.getByPlaceholderText('RUT'), {
            target: { value: '123-K' }
        });

        fireEvent.change(screen.getByPlaceholderText('Nombres'), {
            target: { value: 'Ana' }
        });

        fireEvent.change(screen.getByPlaceholderText('Apellidos'), {
            target: { value: 'Díaz' }
        });

        fireEvent.change(screen.getByPlaceholderText('Email Alumno'), {
            target: { value: 'ana@test.com' }
        });

        const dateInput = document.querySelector('input[type="date"]');

        fireEvent.change(dateInput, {
            target: { value: '2010-01-01' }
        });

        fireEvent.change(screen.getByPlaceholderText('ID Curso'), {
            target: { value: '2' }
        });

        fireEvent.click(
            screen.getByRole('button', { name: /matricular/i })
        );

        await waitFor(() => {
            expect(estudianteService.crearEstudiante).toHaveBeenCalledTimes(1);
        });

        expect(estudianteService.crearEstudiante).toHaveBeenCalledWith({
            rut: '123-K',
            nombres: 'Ana',
            apellidos: 'Díaz',
            email: 'ana@test.com',
            fechaNacimiento: '2010-01-01',
            cursoId: 2,
            estado: 'MATRICULADO'
        });
    });

    it('debe editar un estudiante', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Perez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        estudianteService.actualizarEstudianteBD.mockResolvedValue(true);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const inputNombre = screen.getByDisplayValue('Juan');

        fireEvent.change(inputNombre, {
            target: { value: 'Juan Modificado' }
        });

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        await act(async () => {
            fireEvent.click(botonGuardar);
        });

        expect(
            estudianteService.actualizarEstudianteBD
        ).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                nombres: 'Juan Modificado'
            })
        );
    });

    it('debe cancelar edición', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Perez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        expect(
            screen.getByDisplayValue('Juan')
        ).toBeInTheDocument();

        const botonCancelar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-times'));

        fireEvent.click(botonCancelar);

        await waitFor(() => {
            expect(
                screen.queryByDisplayValue('Juan')
            ).not.toBeInTheDocument();
        });
    });

    it('no debe guardar cambios cuando confirm retorna false', async () => {
        window.confirm.mockReturnValue(false);

        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Perez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        fireEvent.click(botonGuardar);

        expect(
            estudianteService.actualizarEstudianteBD
        ).not.toHaveBeenCalled();
    });

    it('debe eliminar un estudiante', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 99,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Pérez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        estudianteService.eliminarEstudianteBD.mockResolvedValue(true);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEliminar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-trash'));

        await act(async () => {
            fireEvent.click(botonEliminar);
        });

        expect(
            estudianteService.eliminarEstudianteBD
        ).toHaveBeenCalledWith(99);
    });

    it('no debe cerrar edición cuando actualizarEstudianteBD retorna false', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Perez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        estudianteService.actualizarEstudianteBD.mockResolvedValue(false);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        await act(async () => {
            fireEvent.click(botonGuardar);
        });

        expect(
            estudianteService.actualizarEstudianteBD
        ).toHaveBeenCalled();

        expect(
            screen.getByDisplayValue('Juan')
        ).toBeInTheDocument();
    });

    it('no debe limpiar formulario cuando crearEstudiante retorna false', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([]);
        estudianteService.crearEstudiante.mockResolvedValue(false);

        render(<Estudiantes />);

        fireEvent.change(screen.getByPlaceholderText('RUT'), {
            target: { value: '123-K' }
        });

        fireEvent.change(screen.getByPlaceholderText('Nombres'), {
            target: { value: 'Ana' }
        });

        fireEvent.change(screen.getByPlaceholderText('Apellidos'), {
            target: { value: 'Díaz' }
        });

        fireEvent.change(screen.getByPlaceholderText('Email Alumno'), {
            target: { value: 'ana@test.com' }
        });

        const dateInput = document.querySelector(
            'input[type="date"]'
        );

        fireEvent.change(dateInput, {
            target: { value: '2010-01-01' }
        });

        fireEvent.change(
            screen.getByPlaceholderText('ID Curso'),
            {
                target: { value: '2' }
            }
        );

        fireEvent.click(
            screen.getByRole('button', {
                name: /matricular/i
            })
        );

        await waitFor(() => {
            expect(
                estudianteService.crearEstudiante
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByDisplayValue('123-K')
        ).toBeInTheDocument();
    });

    it('debe cambiar el estado del estudiante durante la edición', async () => {
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Perez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ]);

        estudianteService.actualizarEstudianteBD.mockResolvedValue(true);

        await act(async () => {
            render(<Estudiantes />);
        });

        const botonEditar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-pencil-alt'));

        fireEvent.click(botonEditar);

        const selectEstado =
            screen.getByDisplayValue('MATRICULADO');

        fireEvent.change(selectEstado, {
            target: {
                value: 'RETIRADO'
            }
        });

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        await act(async () => {
            fireEvent.click(botonGuardar);
        });

        expect(
            estudianteService.actualizarEstudianteBD
        ).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                estado: 'RETIRADO'
            })
        );
    });

    it('no debe eliminar estudiante cuando confirm retorna false', async () => {
    window.confirm.mockReturnValue(false);

    estudianteService.obtenerEstudiantes.mockResolvedValue([
        {
            id: 99,
            rut: '111-1',
            nombres: 'Juan',
            apellidos: 'Pérez',
            email: 'juan@test.com',
            cursoId: 1,
            estado: 'MATRICULADO'
        }
    ]);

    await act(async () => {
        render(<Estudiantes />);
    });

    const botonEliminar = screen
        .getAllByRole('button')
        .find(btn => btn.querySelector('.fa-trash'));

    fireEvent.click(botonEliminar);

    expect(
        estudianteService.eliminarEstudianteBD
    ).not.toHaveBeenCalled();
});

it('debe recargar estudiantes después de eliminar', async () => {
    estudianteService.obtenerEstudiantes
        .mockResolvedValueOnce([
            {
                id: 99,
                rut: '111-1',
                nombres: 'Juan',
                apellidos: 'Pérez',
                email: 'juan@test.com',
                cursoId: 1,
                estado: 'MATRICULADO'
            }
        ])
        .mockResolvedValueOnce([]);

    estudianteService.eliminarEstudianteBD.mockResolvedValue(true);

    await act(async () => {
        render(<Estudiantes />);
    });

    expect(
        estudianteService.obtenerEstudiantes
    ).toHaveBeenCalledTimes(1);

    const botonEliminar = screen
        .getAllByRole('button')
        .find(btn => btn.querySelector('.fa-trash'));

    await act(async () => {
        fireEvent.click(botonEliminar);
    });

    await waitFor(() => {
        expect(
            estudianteService.obtenerEstudiantes
        ).toHaveBeenCalledTimes(2);
    });
});

it('debe editar apellidos, email y cursoId', async () => {
    estudianteService.obtenerEstudiantes.mockResolvedValue([
        {
            id: 1,
            rut: '111-1',
            nombres: 'Juan',
            apellidos: 'Perez',
            email: 'juan@test.com',
            cursoId: 1,
            estado: 'MATRICULADO'
        }
    ]);

    estudianteService.actualizarEstudianteBD.mockResolvedValue(true);

    await act(async () => {
        render(<Estudiantes />);
    });

    const botonEditar = screen
        .getAllByRole('button')
        .find(btn => btn.querySelector('.fa-pencil-alt'));

    fireEvent.click(botonEditar);

    fireEvent.change(
        screen.getByDisplayValue('Perez'),
        {
            target: { value: 'Gonzalez' }
        }
    );

    fireEvent.change(
        screen.getByDisplayValue('juan@test.com'),
        {
            target: { value: 'gonzalez@test.com' }
        }
    );

    fireEvent.change(
        screen.getByDisplayValue('1'),
        {
            target: { value: '2' }
        }
    );

    expect(
        screen.getByDisplayValue('Gonzalez')
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue('gonzalez@test.com')
    ).toBeInTheDocument();

    expect(
        screen.getByDisplayValue('2')
    ).toBeInTheDocument();
});
});