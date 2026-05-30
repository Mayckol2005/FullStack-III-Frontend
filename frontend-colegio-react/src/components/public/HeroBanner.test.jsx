import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroBanner from './HeroBanner';

describe('Componente Público: HeroBanner.jsx', () => {
  it('debe renderizar correctamente toda la identidad, textos principales y links de acción', () => {
    const mockCallback = vi.fn();
    render(<HeroBanner onIrASeccion={mockCallback} />);

    // Verificamos elementos del DOM
    expect(screen.getByText('Bienvenidos a la Comunidad CBO')).toBeInTheDocument();
    expect(screen.getByText(/Construyendo un espacio educativo inclusivo/i)).toBeInTheDocument();
    
    const linkTrabajo = screen.getByRole('link', { name: /Trabaja con Nosotros/i });
    expect(linkTrabajo).toBeInTheDocument();
    expect(linkTrabajo).toHaveAttribute('href', '#contacto');
  });

  // 🔥 AQUÍ SE BLINDA EL 100% CUBRIENDO LA FUNCIÓN ONCLICK INTERNA
  it('debe invocar la función onIrASeccion con el parámetro admision al hacer clic en el botón', () => {
    const mockCallback = vi.fn();
    render(<HeroBanner onIrASeccion={mockCallback} />);

    const botonPostular = screen.getByRole('button', { name: /Postular Admisión 2026/i });
    expect(botonPostular).toBeInTheDocument();

    // Simulamos la interacción del usuario
    fireEvent.click(botonPostular);

    // Comprobamos que pasó por la línea interna del callback
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('admision');
  });
});