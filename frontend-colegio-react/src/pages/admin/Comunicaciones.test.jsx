import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Comunicaciones from './Comunicaciones';
import * as comunicacionService from '../../services/comunicacionService';

// Solo mockeamos el servicio de comunicaciones, ya no el de académico
vi.mock('../../services/comunicacionService');

describe('Componente de Gestión de Comunicaciones', () => {
    const confirmSpy = vi.spyOn(window, 'confirm');

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        confirmSpy.mockClear();
    });

    const mockAvisos = [
        { id: 1, titulo: 'Vacunación Escolar', contenido: 'Mañana toca vacunación.' }
    ];

    it('debe renderizar el mural y mostrar las circulares previas', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue(mockAvisos);

        await act(async () => {
            render(<Comunicaciones />);
        });

        expect(screen.getByText('Panel de Comunicaciones Institucionales')).toBeInTheDocument();
        expect(screen.getByText('Vacunación Escolar')).toBeInTheDocument();
        expect(screen.getByText('Mañana toca vacunación.')).toBeInTheDocument();
        expect(screen.getByText('📍 General')).toBeInTheDocument();
    });

    it('debe impedir el envío del formulario si hay campos vacíos', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));

        await waitFor(() => {
            expect(screen.getByText(/Por favor, completa el título y el contenido del comunicado/i)).toBeInTheDocument();
            expect(confirmSpy).not.toHaveBeenCalled();
            expect(comunicacionService.crearAviso).not.toHaveBeenCalled();
        });
    });

    it('no debe publicar si el usuario cancela el modal de confirmación', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Suspensión de Clases / Reunión'), { target: { value: 'Urgente Suspensión' } });
        fireEvent.change(screen.getByPlaceholderText('Escriba de forma clara los detalles del anuncio...'), { target: { value: 'No habrá clases por lluvia.' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));

        expect(screen.getByText(/Confirmar Publicación/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

        await waitFor(() => expect(screen.queryByText(/Confirmar Publicación/i)).not.toBeInTheDocument());
        expect(comunicacionService.crearAviso).not.toHaveBeenCalled();
    });

    it('debe enviar los datos correctamente al publicar un aviso válido', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);
        comunicacionService.crearAviso.mockResolvedValue({ id: 2, titulo: 'Urgente Suspensión', contenido: 'No habrá clases por lluvia.' });

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Suspensión de Clases / Reunión'), { target: { value: 'Urgente Suspensión' } });
        fireEvent.change(screen.getByPlaceholderText('Escriba de forma clara los detalles del anuncio...'), { target: { value: 'No habrá clases por lluvia.' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));
        fireEvent.click(screen.getByRole('button', { name: /Sí, Publicar/i }));

        await waitFor(() => {
            expect(comunicacionService.crearAviso).toHaveBeenCalledWith({
                titulo: 'Urgente Suspensión',
                contenido: 'No habrá clases por lluvia.'
            });
            expect(screen.getByText(/Comunicado publicado correctamente/i)).toBeInTheDocument();
        });
    });

    it('debe eliminar un comunicado desde el botón del historial', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue(mockAvisos);
        comunicacionService.eliminarAviso.mockResolvedValue(true);
        confirmSpy.mockReturnValue(true);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.click(screen.getByLabelText(/Eliminar comunicado Vacunación Escolar/i));

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalledWith("¿Está seguro de eliminar este comunicado?");
            expect(comunicacionService.eliminarAviso).toHaveBeenCalledWith(1);
            expect(screen.getByText(/Comunicado eliminado con éxito/i)).toBeInTheDocument();
        });
    });
});
