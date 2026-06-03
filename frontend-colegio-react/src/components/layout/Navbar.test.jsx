import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Componente: Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
    // Simulamos la ubicación del navegador
    delete window.location;
    window.location = { href: '' };
  });

  it('debe limpiar localStorage y redirigir a /login al cerrar sesión', () => {
    localStorage.setItem('usuario_rol', 'PROFESOR');
    render(<BrowserRouter><Navbar /></BrowserRouter>);

    fireEvent.click(screen.getByText('Cerrar Sesión'));

    expect(localStorage.getItem('usuario_rol')).toBeNull();
    // El test verifica la redirección mediante window.location
    expect(window.location.href).toBe('/login');
  });
});