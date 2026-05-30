import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';

// Mocks globales de simulación de comportamiento del navegador
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
};

describe('Página Pública: LandingPage (Blindaje Completo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente toda la identidad institucional, secciones y footer', () => {
    renderComponent();

    // Títulos Principales
    expect(screen.getByRole('heading', { name: "Colegio Bernardo O'Higgins", level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Bienvenidos a la Comunidad CBO')).toBeInTheDocument();
    
    // Paneles informativos intermedios
    expect(screen.getByText('🏫 Nuestro Proyecto Educativo')).toBeInTheDocument();
    expect(screen.getByText('🎯 Misión Institucional')).toBeInTheDocument();
    expect(screen.getByText('👁️ Visión del Futuro')).toBeInTheDocument();
    expect(screen.getByText('Proceso de Admisión Escolar 2026')).toBeInTheDocument();
    expect(screen.getByText('🎓 Ciclos Formativos')).toBeInTheDocument();
    expect(screen.getByText('👥 Nuestros Equipos del Establecimiento')).toBeInTheDocument();
    
    // Estamentos del footer y descargas
    expect(screen.getByText('📄 Normativas & Descargas')).toBeInTheDocument();
    expect(screen.getByText('🤝 Estamentos Escolares')).toBeInTheDocument();
    expect(screen.getByText('Contacto Oficial')).toBeInTheDocument();
    expect(screen.getByText('✉️ asistente.cbo@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('📞 +56 9 5776 5581 (Dirección)')).toBeInTheDocument();
    expect(screen.getByText('Ubicación Física')).toBeInTheDocument();
  });

  it('debe accionar window.scrollTo al hacer clic en el botón Inicio del menú', () => {
    renderComponent();
    
    const botonInicio = screen.getByRole('button', { name: 'Inicio' });
    fireEvent.click(botonInicio);
    
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('debe accionar window.scrollTo al hacer clic en el botón Inicio Principal del footer', () => {
    renderComponent();
    
    const botonInicioFooter = screen.getByRole('button', { name: 'Inicio Principal' });
    fireEvent.click(botonInicioFooter);
    
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('debe disparar scrollIntoView de forma exitosa en todos los botones de navegación SPA internos', () => {
    renderComponent();

    // Simulamos que las secciones con id existen en el DOM de pruebas para que document.getElementById no retorne null
    const ids = ['colegio', 'ciclos', 'equipos', 'normativas', 'admision'];
    const elementosCreados = ids.map(id => {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      return el;
    });

    // 1. Probar botones reales de la barra de navegación superior SPA
    fireEvent.click(screen.getByRole('button', { name: 'El Colegio' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ciclos Educativos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Equipos de Trabajo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Normativas' }));
    fireEvent.click(screen.getByRole('button', { name: '⚡ Admisión 2026' }));

    // 2. Probar botón dinámico remanente en los enlaces del footer
    fireEvent.click(screen.getByRole('button', { name: "Colegio Bernardo O'Higgins" }));

    // Validamos que se haya llamado a la función nativa de scroll por cada interacción exitosa
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    // Limpiamos el DOM de pruebas
    elementosCreados.forEach(el => document.body.removeChild(el));
  });

  it('debe verificar la presencia del link transaccional al portal Intranet', () => {
    renderComponent();
    
    const enlaceLogin = screen.getByRole('link', { name: 'Portal Intranet →' });
    expect(enlaceLogin).toBeInTheDocument();
    expect(enlaceLogin.getAttribute('href')).toBe('/login');
    
    const enlaceLoginFooter = screen.getByRole('link', { name: 'Portal Intranet Central' });
    expect(enlaceLoginFooter).toBeInTheDocument();
    expect(enlaceLoginFooter.getAttribute('href')).toBe('/login');
  });

  it('no debe romper la ejecución ni llamar a scrollIntoView si el id de sección no existe en el DOM', () => {
    renderComponent();
    
    // Forzamos el click en un botón pasándole un contexto vacío o simulando id que retorne null
    const botonColegio = screen.getByRole('button', { name: 'El Colegio' });
    
    const spyGetElement = vi.spyOn(document, 'getElementById').mockReturnValueOnce(null);
    
    fireEvent.click(botonColegio);
    
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    spyGetElement.mockRestore();
  });
});