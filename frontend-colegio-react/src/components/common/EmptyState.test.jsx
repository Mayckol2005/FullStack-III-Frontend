import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('Componente: EmptyState', () => {
  it('debe renderizar el mensaje por defecto e icono correctamente', () => {
    render(<EmptyState />);
    
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByTestId('empty-message')).toHaveTextContent('No se encontraron registros en el sistema.');
  });

  it('debe renderizar un mensaje personalizado si se le pasa por props', () => {
    const miMensaje = 'No hay alumnos inscritos en este curso.';
    render(<EmptyState mensaje={miMensaje} />);
    
    expect(screen.getByTestId('empty-message')).toHaveTextContent(miMensaje);
  });
});