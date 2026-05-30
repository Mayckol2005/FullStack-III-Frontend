import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card'; 

describe('Componente UI: Card', () => {
  it('debe renderizar el contenedor de la tarjeta con sus hijos', () => {
    render(
      <Card>
        <div data-testid="contenido-tarjeta">Hola Mundo</div>
      </Card>
    );
    
    expect(screen.getByTestId('contenido-tarjeta')).toBeInTheDocument();
  });
});