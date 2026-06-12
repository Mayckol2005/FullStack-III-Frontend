import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Estudiantes from './Estudiantes';
import * as estudianteService from '../../services/estudianteService';
import * as academicoService from '../../services/academicoService';

vi.mock('../../services/estudianteService');
vi.mock('../../services/academicoService');

describe('Componente Estudiantes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    const mockCursos = [
        { id: 1, grado: '1ro', letra: 'A', nivel: 'Básica' },
        { id: 2, grado: '2do', letra: 'A', nivel: 'Básica' }
    ];

    it('debe cargar y mostrar la lista de estudiantes', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
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
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([]);
        estudianteService.crearEstudiante.mockResolvedValue(true);

        // Se usa act() para esperar que cargarDatos() poble el combobox de cursos
        await act(async () => {
            render(<Estudiantes />);
        });

        fireEvent.change(screen.getByPlaceholderText(/RUT/i), {
            target: { value: '123456789' }
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

        // Ahora el curso 2 sí existe en el DOM al momento de seleccionarlo
        const selectCurso = screen.getByRole('combobox');
        fireEvent.change(selectCurso, { target: { value: '2' } });

        // Envolvemos el click en act() por precaución al disparar eventos que actualizan el estado
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /matricular/i }));
        });

        await waitFor(() => {
            expect(estudianteService.crearEstudiante).toHaveBeenCalledTimes(1);
        });

        expect(estudianteService.crearEstudiante).toHaveBeenCalledWith({
            rut: '12.345.678-9',
            nombres: 'Ana',
            apellidos: 'Díaz',
            email: 'ana@test.com',
            fechaNacimiento: '2010-01-01',
            cursoId: 2,
            estado: 'MATRICULADO'
        });
    });

    it('debe editar un estudiante', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
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

        expect(estudianteService.actualizarEstudianteBD).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                nombres: 'Juan Modificado'
            })
        );
    });

    it('debe cancelar edición', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
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

        expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();

        const botonCancelar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-times'));

        fireEvent.click(botonCancelar);

        await waitFor(() => {
            expect(screen.queryByDisplayValue('Juan')).not.toBeInTheDocument();
        });
    });

    it('no debe guardar cambios cuando confirm retorna false', async () => {
        window.confirm.mockReturnValue(false);
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
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

        expect(estudianteService.actualizarEstudianteBD).not.toHaveBeenCalled();
    });

    it('debe eliminar un estudiante', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 99,
                rut: '11.111.111-1',
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

        expect(estudianteService.eliminarEstudianteBD).toHaveBeenCalledWith(99);
    });

    it('no debe limpiar formulario cuando crearEstudiante retorna false', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([]);
        estudianteService.crearEstudiante.mockResolvedValue(false);

        // Renderizamos con act() por la misma razón que en la creación exitosa
        await act(async () => {
            render(<Estudiantes />);
        });

        fireEvent.change(screen.getByPlaceholderText(/RUT/i), {
            target: { value: '123456789' }
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

        const selectCurso = screen.getByRole('combobox');
        fireEvent.change(selectCurso, { target: { value: '2' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /matricular/i }));
        });

        await waitFor(() => {
            expect(estudianteService.crearEstudiante).toHaveBeenCalled();
        });

        expect(screen.getByDisplayValue('12.345.678-9')).toBeInTheDocument();
    });

    it('debe cambiar el estado del estudiante durante la edición', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        estudianteService.obtenerEstudiantes.mockResolvedValue([
            {
                id: 1,
                rut: '11.111.111-1',
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

        const selectEstado = screen.getByDisplayValue('MATRICULADO');
        fireEvent.change(selectEstado, {
            target: { value: 'MATRICULA SUSPENDIDA' }
        });

        const botonGuardar = screen
            .getAllByRole('button')
            .find(btn => btn.querySelector('.fa-check'));

        await act(async () => {
            fireEvent.click(botonGuardar);
        });

        expect(estudianteService.actualizarEstudianteBD).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                estado: 'MATRICULA SUSPENDIDA'
            })
        );
    });
});