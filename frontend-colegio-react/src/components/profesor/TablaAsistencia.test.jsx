import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TablaAsistencia from './TablaAsistencia';

describe('Componente: TablaAsistencia', () => {
  const mockAlumnos = [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez', rut: '12.345.678-9', presente: true },
    { id: 2, nombres: 'María', apellidos: 'Gómez', rut: '98.765.432-1', presente: false }
  ];

  it('debe renderizar la lista de estudiantes con sus RUTs correctamente', () => {
    render(<TablaAsistencia alumnos={mockAlumnos} onToggle={vi.fn()} />);

    expect(screen.getByText('Pérez, Juan')).toBeInTheDocument();
    expect(screen.getByText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByText('Gómez, María')).toBeInTheDocument();
    expect(screen.getByText('98.765.432-1')).toBeInTheDocument();
  });

  it('debe mostrar los estados de presencia correctos en los botones', () => {
    render(<TablaAsistencia alumnos={mockAlumnos} onToggle={vi.fn()} />);

    expect(screen.getByText('● Presente')).toBeInTheDocument();
    expect(screen.getByText('○ Ausente')).toBeInTheDocument();
  });

  it('debe llamar a onToggle con el id correcto cuando se hace clic en el botón', () => {
    const mockOnToggle = vi.fn();
    render(<TablaAsistencia alumnos={mockAlumnos} onToggle={mockOnToggle} />);

    const botonPresente = screen.getByText('● Presente');
    fireEvent.click(botonPresente);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });
});