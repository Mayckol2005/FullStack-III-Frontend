import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../../hooks/useAuth';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Página de Autenticación: Login', () => {
  const mockLoginFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLoginFn,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('debe renderizar los elementos básicos del formulario de acceso', () => {
    renderComponent();
    
    expect(screen.getByText('Portal Intranet Institucional')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre de Usuario o Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ingresar a la Intranet' })).toBeInTheDocument();
  });

  it('debe permitir escribir en los campos de usuario y contraseña', () => {
    renderComponent();
    
    const inputUsuario = screen.getByPlaceholderText('ej: admin@colegio.com');
    const inputPassword = screen.getByPlaceholderText('••••••••');

    fireEvent.change(inputUsuario, { target: { value: 'profesor@colegio.com' } });
    fireEvent.change(inputPassword, { target: { value: 'password123' } });

    expect(inputUsuario.value).toBe('profesor@colegio.com');
    expect(inputPassword.value).toBe('password123');
  });

  it('debe redirigir al home principal al hacer clic en ← Volver al Sitio', () => {
    renderComponent();
    
    const botonVolver = screen.getByRole('button', { name: '← Volver al Sitio' });
    fireEvent.click(botonVolver);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('debe autenticar y redirigir a /admin si el rol retornado es ADMINISTRADOR', async () => {
    mockLoginFn.mockResolvedValue({ exito: true, rol: 'ADMINISTRADOR' });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith('admin', 'admin123');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('debe autenticar y redirigir a /profesor si el rol retornado es PROFESOR', async () => {
    mockLoginFn.mockResolvedValue({ exito: true, rol: 'PROFESOR' });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'profe' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'profe123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profesor');
    });
  });

  it('debe autenticar y redirigir a /alumno si el rol retornado es ESTUDIANTE', async () => {
    mockLoginFn.mockResolvedValue({ exito: true, rol: 'ESTUDIANTE' });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'alumno' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'alumno123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/alumno');
    });
  });

  it('debe redirigir al sitio base si el rol es desconocido', async () => {
    mockLoginFn.mockResolvedValue({ exito: true, rol: 'VISITA' });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('debe mostrar un mensaje de error si las credenciales son inválidas', async () => {
    mockLoginFn.mockResolvedValue({ exito: false, msg: 'Usuario no registrado' });
    renderComponent();

    // Rellenamos datos para gatillar el submit del formulario
    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'incorrecto' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'clave' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      const alerta = screen.getByRole('alert');
      expect(alerta).toBeInTheDocument();
      expect(alerta.textContent).toBe('Usuario no registrado');
    });
  });

  it('debe mostrar mensaje genérico si el servidor falla o lanza una excepción', async () => {
    mockLoginFn.mockRejectedValue(new Error('Network Crash'));
    renderComponent();

    // Rellenamos datos para gatillar el submit del formulario
    fireEvent.change(screen.getByPlaceholderText('ej: admin@colegio.com'), { target: { value: 'error' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'error' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar a la Intranet' }));

    await waitFor(() => {
      const alerta = screen.getByRole('alert');
      expect(alerta).toBeInTheDocument();
      expect(alerta.textContent).toBe('Error de conexión con el servidor');
    });
  });
});