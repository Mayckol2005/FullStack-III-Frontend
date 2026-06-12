import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cursos from './Cursos';
import * as academicoService from '../../services/academicoService';
import * as usuarioService from '../../services/usuarioService';

vi.mock('../../services/academicoService');
vi.mock('../../services/usuarioService');

describe('Componente Cursos y Asignaturas', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCursos = [
        { id: 10, grado: '1ro', letra: 'A', nivel: 'Básica' }
    ];

    const mockDocentes = [
        { id: 5, nombre: 'Carlos', apellido: 'Mendoza', rol: 'PROFESOR' }
    ];

    const mockAsignaturas = [
        { id: 1, nombre: 'Matemáticas', cursoId: 10, docenteId: 5 }
    ];

    it('debe renderizar y mostrar los cursos, docentes y asignaturas con sus nombres legibles', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        academicoService.obtenerAsignaturas.mockResolvedValue(mockAsignaturas);
        usuarioService.obtenerUsuarios.mockResolvedValue(mockDocentes);

        await act(async () => {
            render(<Cursos />);
        });

        expect(screen.getByText('1ro')).toBeInTheDocument();
        expect(screen.getByText('Matemáticas')).toBeInTheDocument();
        
        // CORRECCIÓN 1: Manejar el curso duplicado en select y tabla
        const elementosCurso = screen.getAllByText('1ro° A (Básica)');
        expect(elementosCurso.length).toBeGreaterThan(0);
        
        // CORRECCIÓN 2: Manejar el docente duplicado en select y tabla
        const elementosDocente = screen.getAllByText('Carlos Mendoza');
        expect(elementosDocente.length).toBeGreaterThan(0);
    });

    it('debe registrar un nuevo curso correctamente si no es duplicado', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue([]);
        academicoService.obtenerAsignaturas.mockResolvedValue([]);
        usuarioService.obtenerUsuarios.mockResolvedValue([]);
        academicoService.crearCurso.mockResolvedValue(true);

        await act(async () => {
            render(<Cursos />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: 1ro, 2do, 4to'), { target: { value: '2do' } });
        fireEvent.change(screen.getByPlaceholderText('Ej: A, B, C'), { target: { value: 'B' } });
        
        const selectNivel = screen.getByDisplayValue('-- Seleccionar Nivel --');
        fireEvent.change(selectNivel, { target: { value: 'Media' } });

        fireEvent.click(screen.getByRole('button', { name: /Guardar Curso/i }));

        await waitFor(() => {
            expect(academicoService.crearCurso).toHaveBeenCalledWith({
                grado: '2do',
                letra: 'B',
                nivel: 'Media'
            });
        });
    });

    it('no debe guardar un curso si este ya existe en la lista (duplicado)', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        academicoService.obtenerAsignaturas.mockResolvedValue([]);
        usuarioService.obtenerUsuarios.mockResolvedValue([]);

        await act(async () => {
            render(<Cursos />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: 1ro, 2do, 4to'), { target: { value: '1ro' } });
        fireEvent.change(screen.getByPlaceholderText('Ej: A, B, C'), { target: { value: 'A' } });
        
        const selectNivel = screen.getByDisplayValue('-- Seleccionar Nivel --');
        fireEvent.change(selectNivel, { target: { value: 'Básica' } });

        fireEvent.click(screen.getByRole('button', { name: /Guardar Curso/i }));

        await waitFor(() => {
            expect(screen.getByText(/ya está creado y no se puede repetir/i)).toBeInTheDocument();
            expect(academicoService.crearCurso).not.toHaveBeenCalled();
        });
    });

    it('debe vincular una asignatura usando los selectores estructurados', async () => {
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        academicoService.obtenerAsignaturas.mockResolvedValue([]);
        usuarioService.obtenerUsuarios.mockResolvedValue(mockDocentes);
        academicoService.crearAsignatura.mockResolvedValue(true);

        await act(async () => {
            render(<Cursos />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Matemáticas, Historia'), { target: { value: 'Historia' } });
        
        const selectCurso = screen.getByDisplayValue('-- Selecciona un Curso Activo --');
        const selectDocente = screen.getByDisplayValue('-- Selecciona un Docente --');

        fireEvent.change(selectCurso, { target: { value: '10' } });
        fireEvent.change(selectDocente, { target: { value: '5' } });

        fireEvent.click(screen.getByRole('button', { name: /Vincular Asignatura/i }));

        await waitFor(() => {
            expect(academicoService.crearAsignatura).toHaveBeenCalledWith({
                nombre: 'Historia',
                cursoId: 10,
                docenteId: 5
            });
        });
    });

    it('debe ordenar los cursos de menor a mayor dentro del selector para asociar asignaturas', async () => {
        const mockCursosDesordenados = [
            { id: 20, grado: '2do', letra: 'B', nivel: 'Media' },
            { id: 12, grado: '1ro', letra: 'B', nivel: 'Básica' },
            { id: 10, grado: '1ro', letra: 'A', nivel: 'Básica' }
        ];

        academicoService.obtenerCursosReal.mockResolvedValue(mockCursosDesordenados);
        academicoService.obtenerAsignaturas.mockResolvedValue([]);
        usuarioService.obtenerUsuarios.mockResolvedValue([]);

        await act(async () => {
            render(<Cursos />);
        });

        const selectCurso = screen.getByDisplayValue('-- Selecciona un Curso Activo --');
        const opciones = Array.from(selectCurso.querySelectorAll('option'));
        
        expect(opciones[1].textContent).toBe('1ro° A (Básica)');
        expect(opciones[2].textContent).toBe('1ro° B (Básica)');
        expect(opciones[3].textContent).toBe('2do° B (Media)');
    });
});