import React from 'react';
import fotoColegio from '../../assets/images/colegio-hero.jpg';

function HeroBanner({ onIrASeccion }) {
  return (
    <header
      className="landing-hero"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(7, 38, 68, 0.96) 0%,
            rgba(11, 55, 98, 0.90) 42%,
            rgba(15, 89, 159, 0.64) 72%,
            rgba(15, 89, 159, 0.40) 100%
          ),
          url(${fotoColegio})
        `
      }}
    >
      <div className="landing-hero-content">
        <span className="landing-hero-kicker">
          EDUCACIÓN BÁSICA Y MEDIA
        </span>

        <h2>Educación que acompaña cada etapa del aprendizaje</h2>

        <p>
          Una comunidad educativa comprometida con el aprendizaje,
          la convivencia y el desarrollo integral de nuestros
          estudiantes en Hualpén.
        </p>

        <div className="landing-hero-actions">
          <button
            onClick={() => onIrASeccion('colegio')}
            className="btn-primary landing-hero-primary-action"
          >
            Conoce nuestro colegio
          </button>

          <button
            onClick={() => onIrASeccion('admision')}
            className="btn-primary landing-hero-secondary-action"
            type="button"
          >
            Admisión Escolar 2027
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeroBanner;