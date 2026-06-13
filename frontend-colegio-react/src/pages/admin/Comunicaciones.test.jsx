import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Comunicaciones from './Comunicaciones';
import * as comunicacionService from '../../services/comunicacionService';
import * as academicoService from '../../services/academicoService';

vi.mock('../../services/comunicacionService');
vi.mock('../../services/academicoService');

describe('Componente de Gestión de Comunicaciones', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCursos = [
        { id: 10, grado: '1ro', letra: 'A', nivel: 'Básica' },
        { id: 20, grado: '2do', letra: 'B', nivel: 'Media' }
    ];

    const mockAvisos = [
        { id: 1, titulo: 'Vacunación Escolar', contenido: 'Mañana toca vacunación.', cursoId: 10 }
    ];

    it('debe renderizar el mural y mostrar las circulares previas con sus destinatarios', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue(mockAvisos);
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);

        await act(async () => {
            render(<Comunicaciones />);
        });

        expect(screen.getByText('Mural de Avisos y Comunicaciones')).toBeInTheDocument();
        expect(screen.getByText('Vacunación Escolar')).toBeInTheDocument();
        expect(screen.getByText('Mañana toca vacunación.')).toBeInTheDocument();
        expect(screen.getByText('Target: 1ro° A (Básica)')).toBeInTheDocument();
    });

    it('debe impedir el envío del formulario si hay campos vacíos', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.click(screen.getByRole('button', { name: /Publicar Aviso/i }));

        await waitFor(() => {
            expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
            expect(comunicacionService.crearAviso).not.toHaveBeenCalled();
        });
    });

    it('debe enviar los datos correctamente al publicar un aviso válido', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);
        academicoService.obtenerCursosReal.mockResolvedValue(mockCursos);
        comunicacionService.crearAviso.mockResolvedValue({ id: 2, titulo: 'Nueva Reunión', contenido: 'Citación', cursoId: 20 });

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Reunión de Apoderados'), { target: { value: 'Urgente Suspensión' } });
        fireEvent.change(screen.getByPlaceholderText('Escriba el cuerpo del mensaje aquí...'), { target: { value: 'No habrá clases por lluvia.' } });
        
        const selectCurso = screen.getByDisplayValue('-- Selecciona un Curso Destinatario --');
        fireEvent.change(selectCurso, { target: { value: '20' } });

        fireEvent.click(screen.getByRole('button', { name: /Publicar Aviso/i }));

        await waitFor(() => {
            expect(comunicacionService.crearAviso).toHaveBeenCalledWith({
                titulo: 'Urgente Suspensión',
                contenido: 'No habrá clases por lluvia.',
                cursoId: 20
            });
            expect(screen.getByText('¡Circular publicada exitosamente! Pop-up o alerta.') || screen.getByText('¡Circular publicada exitosamente!')).toBeInTheDocument();
        });
    });
});