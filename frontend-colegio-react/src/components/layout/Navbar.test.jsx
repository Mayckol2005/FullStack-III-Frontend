import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Creamos un mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Componente: Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe renderizar la marca del sistema escolar y el buscador inactivo', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('SISTEMA ESCOLAR')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscador en desarrollo...')).toBeDisabled();
  });

  it('debe mostrar los links correctos cuando el rol es PROFESOR', () => {
    localStorage.setItem('usuario_role_simulado', 'PROFESOR'); // Guardamos para la prueba
    localStorage.setItem('usuario_rol', 'PROFESOR');

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('📊 Calificaciones')).toBeInTheDocument();
    expect(screen.getByText('📅 Asistencia')).toBeInTheDocument();
    expect(screen.getByText('📝 Hoja de Vida')).toBeInTheDocument();
    
    // No debe mostrar los del admin
    expect(screen.queryByText('Estudiantes')).not.toBeInTheDocument();
  });

  it('debe mostrar los links correctos cuando el rol es ADMINISTRADOR', () => {
    localStorage.setItem('usuario_rol', 'ADMINISTRADOR');

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    
    // No debe mostrar los del profesor
    expect(screen.queryByText('📊 Calificaciones')).not.toBeInTheDocument();
  });

  it('debe limpiar el localStorage y redirigir a /login al cerrar sesión', () => {
    localStorage.setItem('usuario_rol', 'PROFESOR');
    localStorage.setItem('token', 'un-token-cualquiera');

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const botonCerrar = screen.getByText('Cerrar Sesión');
    fireEvent.click(botonCerrar);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('usuario_rol')).toBeNull();
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});