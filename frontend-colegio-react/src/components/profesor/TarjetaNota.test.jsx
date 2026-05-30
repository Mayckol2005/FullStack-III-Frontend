import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TarjetaNota from './TarjetaNota';

describe('Componente: TarjetaNota', () => {
  it('debe renderizar el título y el valor correctamente', () => {
    render(<TarjetaNota titulo="Promedio General" valor="5.8" />);

    expect(screen.getByText('Promedio General')).toBeInTheDocument();
    expect(screen.getByText('5.8')).toBeInTheDocument();
  });

  it('debe aplicar el color personalizado si se pasa por prop', () => {
    render(<TarjetaNota titulo="Nota Mínima" valor="3.5" color="red" />);
    
    const valorSpan = screen.getByText('3.5');
    expect(valorSpan).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});