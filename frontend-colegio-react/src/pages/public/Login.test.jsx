import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../../hooks/useAuth';

const mockNavigate = vi.fn();
const mockLoginFn = vi.fn();

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

describe('Página Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLoginFn,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it('debe renderizar correctamente', () => {
    renderComponent();

    expect(
      screen.getByText(/Portal Intranet Institucional/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Nombre de Usuario o Correo/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Contraseña/i)
    ).toBeInTheDocument();
  });

  it('debe volver al sitio al hacer click en volver', () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole('button', {
        name: /Volver al Sitio/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('debe redirigir a /home si el rol es ADMINISTRADOR', async () => {
    mockLoginFn.mockResolvedValue({
      exito: true,
      rol: 'ADMINISTRADOR',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'admin' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('debe redirigir a /profesor si el rol es PROFESOR', async () => {
    mockLoginFn.mockResolvedValue({
      exito: true,
      rol: 'PROFESOR',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'profe' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profesor');
    });
  });

  it('debe redirigir a /alumno si el rol es ALUMNO', async () => {
    mockLoginFn.mockResolvedValue({
      exito: true,
      rol: 'ALUMNO',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'alumno' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/alumno');
    });
  });

  it('debe redirigir a /alumno si el rol es ESTUDIANTE', async () => {
    mockLoginFn.mockResolvedValue({
      exito: true,
      rol: 'ESTUDIANTE',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'estudiante' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/alumno');
    });
  });

  it('debe redirigir a "/" para roles desconocidos', async () => {
    mockLoginFn.mockResolvedValue({
      exito: true,
      rol: 'INVITADO',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'user' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('debe mostrar mensaje cuando las credenciales son inválidas', async () => {
    mockLoginFn.mockResolvedValue({
      exito: false,
      msg: 'Usuario o contraseña incorrectos',
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'wrong' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: 'wrong' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Usuario o contraseña incorrectos'
    );
  });

  it('debe mostrar mensaje genérico cuando no viene msg', async () => {
    mockLoginFn.mockResolvedValue({
      exito: false,
    });

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'usuario' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Credenciales inválidas'
    );
  });

  it('debe mostrar error de conexión cuando login lanza excepción', async () => {
    mockLoginFn.mockRejectedValue(
      new Error('Network Error')
    );

    renderComponent();

    fireEvent.change(
      screen.getByLabelText(/Nombre de Usuario o Correo/i),
      { target: { value: 'usuario' } }
    );

    fireEvent.change(
      screen.getByLabelText(/Contraseña/i),
      { target: { value: '1234' } }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Ingresar a la Intranet/i,
      })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'Error de conexión con el servidor'
    );
  });
});