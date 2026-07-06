import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';

window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

const renderComponent = () =>
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

describe('Página Pública: LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la identidad institucional y las secciones principales', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', {
        name: "Colegio Bernardo O'Higgins",
        level: 1,
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByText('Hualpén · Región del Biobío')
    ).toHaveLength(2);

    expect(
      screen.getByRole('heading', {
        name: 'Nuestro proyecto educativo',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Nuestros niveles educativos',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Educación Básica',
        level: 3,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Educación Media',
        level: 3,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Admisión Escolar 2027',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Apoyo al estudiante',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Documentos del colegio',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Comunidad educativa',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Ubicación y contacto',
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Estamos en Hualpén',
        level: 3,
      })
    ).toBeInTheDocument();
  });

  it('mantiene una identidad coherente con Hualpén y Educación Básica y Media', () => {
    renderComponent();

    expect(
      screen.getByText('1° A 8° BÁSICO')
    ).toBeInTheDocument();

    expect(
      screen.getByText('1° A 4° MEDIO')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Irlanda 3260, Hualpén')
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Puerto Montt/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/Pre-Kinder/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/Kinder/i)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/Liceo Bernardo O'Higgins/i)
    ).not.toBeInTheDocument();
  });

  it('ejecuta window.scrollTo al hacer clic en Inicio', () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Inicio',
      })
    );

    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('navega mediante scroll hacia las secciones públicas internas', () => {
    renderComponent();

    const botonesNavegacion = [
      'Nuestro Colegio',
      'Niveles',
      'Apoyo',
      'Documentos',
      'Admisión',
    ];

    botonesNavegacion.forEach((nombreBoton) => {
      fireEvent.click(
        screen.getByRole('button', {
          name: nombreBoton,
        })
      );
    });

    expect(
      Element.prototype.scrollIntoView
    ).toHaveBeenCalledTimes(botonesNavegacion.length);

    expect(
      Element.prototype.scrollIntoView
    ).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });

  it('no llama a scrollIntoView cuando la sección solicitada no existe', () => {
    renderComponent();

    const spyGetElement = vi
      .spyOn(document, 'getElementById')
      .mockReturnValueOnce(null);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Nuestro Colegio',
      })
    );

    expect(
      Element.prototype.scrollIntoView
    ).not.toHaveBeenCalled();

    spyGetElement.mockRestore();
  });

  it('mantiene los accesos al portal educativo conectados con login', () => {
    renderComponent();

    const enlacePrincipal = screen.getByRole('link', {
      name: 'Ingresar al Portal →',
    });

    expect(enlacePrincipal).toHaveAttribute(
      'href',
      '/login'
    );

    const enlaceFooter = screen.getByRole('link', {
      name: 'Ingresar al Portal Educativo →',
    });

    expect(enlaceFooter).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('expone los documentos institucionales reales en una nueva pestaña', () => {
    renderComponent();

    const proyectoEducativo = screen.getByRole('link', {
      name: /Proyecto Educativo Institucional/i,
    });

    const convivenciaEscolar = screen.getByRole('link', {
      name: /Manual y Protocolos de Convivencia Escolar/i,
    });

    const reglamentoInterno = screen.getByRole('link', {
      name: /Reglamento Interno Escolar/i,
    });

    expect(
      proyectoEducativo.getAttribute('href')
    ).toContain('proyecto-educativo-cbo.pdf');

    expect(
      convivenciaEscolar.getAttribute('href')
    ).toContain(
      'protocolos-manual-de-convivencia-escolar.pdf'
    );

    expect(
      reglamentoInterno.getAttribute('href')
    ).toContain('reglamento-interno-escolar.pdf');

    [
      proyectoEducativo,
      convivenciaEscolar,
      reglamentoInterno,
    ].forEach((enlace) => {
      expect(enlace).toHaveAttribute(
        'target',
        '_blank'
      );

      expect(enlace).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });
  });

  it('muestra el mapa y los enlaces reales de contacto, ubicación y redes sociales', () => {
    renderComponent();

    const mapa = screen.getByTitle(
      "Mapa del Colegio Bernardo O'Higgins"
    );

    expect(mapa).toBeInTheDocument();

    expect(
      mapa.getAttribute('src')
    ).toContain('google.com/maps');

    expect(
      mapa.getAttribute('src')
    ).toContain('output=embed');

    expect(mapa).toHaveAttribute(
      'loading',
      'lazy'
    );

    const telefono = screen.getByRole('link', {
      name: '+56 9 9507 3517',
    });

    expect(telefono).toHaveAttribute(
      'href',
      'tel:+56995073517'
    );

    const googleMaps = screen.getByRole('link', {
      name: 'Cómo llegar en Google Maps ↗',
    });

    expect(
      googleMaps.getAttribute('href')
    ).toContain('google.com/maps');

    expect(googleMaps).toHaveAttribute(
      'target',
      '_blank'
    );

    expect(googleMaps).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );

    const instagram = screen.getByRole('link', {
      name: 'Instagram ↗',
    });

    expect(instagram).toHaveAttribute(
      'href',
      'https://www.instagram.com/colegio_cbo/'
    );

    expect(instagram).toHaveAttribute(
      'target',
      '_blank'
    );

    const facebook = screen.getByRole('link', {
      name: 'Facebook ↗',
    });

    expect(facebook).toHaveAttribute(
      'href',
      'https://www.facebook.com/cbocomunidad/'
    );

    expect(facebook).toHaveAttribute(
      'target',
      '_blank'
    );
  });

  it('muestra el nombre institucional consistente en el copyright', () => {
    renderComponent();

    expect(
      screen.getByText(
        "© 2026 Colegio Bernardo O'Higgins. Todos los derechos reservados."
      )
    ).toBeInTheDocument();
  });
});