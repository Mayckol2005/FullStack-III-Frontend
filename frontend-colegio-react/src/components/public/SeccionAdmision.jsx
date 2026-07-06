import React from 'react';

const SAE_URL = 'https://www.sistemadeadmisionescolar.cl/';

function SeccionAdmision() {
  return (
    <section
      id="admision"
      className="card-panel card-panel-alert public-admission-section"
    >
      <div className="public-admission-content">
        <span className="public-admission-kicker">
          SISTEMA DE ADMISIÓN ESCOLAR
        </span>

        <h2>Admisión Escolar 2027</h2>

        <p className="public-admission-description">
          Las postulaciones para Educación Básica y Educación Media se realizan
          mediante el Sistema de Admisión Escolar del Ministerio de Educación.
        </p>

        <p className="public-admission-note">
          Revisa las fechas, etapas y orientaciones vigentes directamente en el
          portal oficial antes de realizar tu postulación.
        </p>

        <a
          href={SAE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary public-admission-action"
        >
          Ir al Sistema de Admisión Escolar ↗
        </a>
      </div>

      <aside className="public-admission-info">
        <span className="public-admission-info-label">
          ANTES DE POSTULAR
        </span>

        <h3>Infórmate y revisa tus preferencias</h3>

        <p>
          Conoce los establecimientos, revisa sus proyectos educativos y ordena
          tus preferencias antes de enviar la postulación.
        </p>
      </aside>
    </section>
  );
}

export default SeccionAdmision;