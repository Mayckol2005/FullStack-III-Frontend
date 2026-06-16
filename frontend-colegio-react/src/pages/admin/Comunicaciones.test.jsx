import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Comunicaciones from './Comunicaciones';
import * as comunicacionService from '../../services/comunicacionService';

// Solo mockeamos el servicio de comunicaciones, ya no el de académico
vi.mock('../../services/comunicacionService');

describe('Componente de Gestión de Comunicaciones', () => {
    // Espiamos window.confirm
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

    it('debe impedir el envío del formulario si hay campos vacíos y NO mostrar alerta', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));

        await waitFor(() => {
            // CORRECCIÓN: Se usa Regex para que no falle por el emoji "❌" o el salto de línea
            expect(screen.getByText(/Todos los campos son obligatorios para emitir la circular/i)).toBeInTheDocument();
            // Verificamos que confirm nunca saltó
            expect(confirmSpy).not.toHaveBeenCalled();
            expect(comunicacionService.crearAviso).not.toHaveBeenCalled();
        });
    });

    it('no debe publicar si el usuario cancela la alerta de confirmación', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);
        // Simulamos que el usuario presiona "Cancelar"
        confirmSpy.mockReturnValue(false);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Suspensión de Clases / Reunión'), { target: { value: 'Urgente Suspensión' } });
        fireEvent.change(screen.getByPlaceholderText('Escriba de forma clara los detalles del anuncio...'), { target: { value: 'No habrá clases por lluvia.' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalledWith("¿Está seguro de publicar este comunicado?");
            expect(comunicacionService.crearAviso).not.toHaveBeenCalled();
        });
    });

    it('debe enviar los datos correctamente al publicar un aviso válido y confirmar', async () => {
        comunicacionService.obtenerAvisos.mockResolvedValue([]);
        comunicacionService.crearAviso.mockResolvedValue({ id: 2, titulo: 'Urgente Suspensión', contenido: 'No habrá clases por lluvia.' });
        // Simulamos que el usuario presiona "Aceptar"
        confirmSpy.mockReturnValue(true);

        await act(async () => {
            render(<Comunicaciones />);
        });

        fireEvent.change(screen.getByPlaceholderText('Ej: Suspensión de Clases / Reunión'), { target: { value: 'Urgente Suspensión' } });
        fireEvent.change(screen.getByPlaceholderText('Escriba de forma clara los detalles del anuncio...'), { target: { value: 'No habrá clases por lluvia.' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Publicar en el Mural/i }));

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalledWith("¿Está seguro de publicar este comunicado?");
            expect(comunicacionService.crearAviso).toHaveBeenCalledWith({
                titulo: 'Urgente Suspensión',
                contenido: 'No habrá clases por lluvia.'
            });
            // CORRECCIÓN: Se usa Regex para que ignore el emoji "✨" y los espacios/saltos de línea
            expect(screen.getByText(/¡Comunicado oficial publicado con éxito!/i)).toBeInTheDocument();
        });
    });
});