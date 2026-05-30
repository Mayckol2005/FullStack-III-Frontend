import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Componente UI: Button', () => {
  it('debe renderizar el botón con el texto proporcionado', () => {
    // Renderizamos el componente en la memoria
    render(<Button>Guardar Cambios</Button>);
    
    // Buscamos el elemento en el "DOM virtual"
    const botonElemento = screen.getByText('Guardar Cambios');
    
    // Verificamos que exista en el documento
    expect(botonElemento).toBeInTheDocument();
  });

  it('debe ejecutar la función onClick al ser clickeado', async () => {
    // vi.fn() crea una función "espía" para saber si fue llamada
    const mockOnClick = vi.fn(); 
    
    render(<Button onClick={mockOnClick}>Enviar</Button>);
    const botonElemento = screen.getByText('Enviar');

    // Simulamos un clic de usuario real de forma asíncrona
    await userEvent.click(botonElemento);

    // Verificamos que nuestro espía detectó exactamente 1 clic
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});