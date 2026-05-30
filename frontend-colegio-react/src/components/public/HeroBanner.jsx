import React from 'react';

function HeroBanner({ onIrASeccion }) {
  return (
    <header className="landing-hero">
      <h1>Bienvenidos a la Comunidad CBO</h1>
      <p>
        Construyendo un espacio educativo inclusivo de excelencia en el sur de Chile. 
        Conoce nuestros pilares, normativas y forma parte de nuestro proyecto.
      </p>
      <div className="landing-hero-actions">
        <button 
          onClick={() => onIrASeccion('admision')} 
          className="btn-primary" 
          style={{ border: 'none', cursor: 'pointer', backgroundColor: 'var(--color-peligro)' }}
        >
          Postular Admisión 2026
        </button>
        <a href="#contacto" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: '#64748b' }}>
          Trabaja con Nosotros
        </a>
      </div>
    </header>
  );
}

export default HeroBanner;