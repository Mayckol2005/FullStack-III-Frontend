import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input'; 

describe('Componente UI: Input', () => {
  it('debe renderizar el input correctamente con su label y propiedades', () => {
    render(
      <Input 
        label="Nombre completo" 
        id="nombre-input" 
        placeholder="Ingrese su nombre" 
        data-testid="input-test" 
      />
    );
    
    const inputEl = screen.getByTestId('input-test');
    expect(inputEl).toBeInTheDocument();
    expect(inputEl.getAttribute('placeholder')).toBe('Ingrese su nombre');
    expect(screen.getByText('Nombre completo')).toBeInTheDocument();
  });

  it('debe mostrar el mensaje de error en pantalla si se proporciona', () => {
    render(<Input error="Este campo es obligatorio" />);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('debe permitir escribir texto y lanzar el evento onChange', async () => {
    const mockOnChange = vi.fn();
    render(<Input data-testid="input-test" onChange={mockOnChange} />);
    
    const inputEl = screen.getByTestId('input-test');
    await userEvent.type(inputEl, 'Admin');
    
    expect(inputEl.value).toBe('Admin');
    expect(mockOnChange).toHaveBeenCalled();
  });
});