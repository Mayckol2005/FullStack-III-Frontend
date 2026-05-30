import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Componente: Loader', () => {
  it('debe renderizar el spinner y el texto de carga correctamente', () => {
    render(<Loader />);
    
    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
    expect(screen.getByTestId('loader-spinner')).toBeInTheDocument();
    expect(screen.getByText('Cargando información...')).toBeInTheDocument();
  });
});