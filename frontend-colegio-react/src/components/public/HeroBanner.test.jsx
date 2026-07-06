import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroBanner from './HeroBanner';

describe('Componente Público: HeroBanner', () => {
  let mockIrASeccion;

  beforeEach(() => {
    mockIrASeccion = vi.fn();
  });

  it('renderiza la propuesta educativa principal del colegio', () => {
    render(
      <HeroBanner onIrASeccion={mockIrASeccion} />
    );

    expect(
      screen.getByText('EDUCACIÓN BÁSICA Y MEDIA')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Educación que acompaña cada etapa del aprendizaje',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Una comunidad educativa comprometida con el aprendizaje/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/en Hualpén/i)
    ).toBeInTheDocument();
  });

  it('navega hacia la sección del colegio al hacer clic en la acción principal', () => {
    render(
      <HeroBanner onIrASeccion={mockIrASeccion} />
    );

    const botonColegio = screen.getByRole('button', {
      name: 'Conoce nuestro colegio',
    });

    fireEvent.click(botonColegio);

    expect(mockIrASeccion).toHaveBeenCalledTimes(1);

    expect(mockIrASeccion).toHaveBeenCalledWith(
      'colegio'
    );
  });

  it('navega hacia la sección de admisión al hacer clic en Admisión Escolar 2027', () => {
    render(
      <HeroBanner onIrASeccion={mockIrASeccion} />
    );

    const botonAdmision = screen.getByRole('button', {
      name: 'Admisión Escolar 2027',
    });

    fireEvent.click(botonAdmision);

    expect(mockIrASeccion).toHaveBeenCalledTimes(1);

    expect(mockIrASeccion).toHaveBeenCalledWith(
      'admision'
    );
  });

  it('muestra ambas acciones principales como botones interactivos', () => {
    render(
      <HeroBanner onIrASeccion={mockIrASeccion} />
    );

    expect(
      screen.getByRole('button', {
        name: 'Conoce nuestro colegio',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Admisión Escolar 2027',
      })
    ).toBeInTheDocument();
  });
});