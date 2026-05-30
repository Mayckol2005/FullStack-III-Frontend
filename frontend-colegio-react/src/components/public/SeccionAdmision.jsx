import React from 'react';

function SeccionAdmision() {
  return (
    <section id="admision" className="card-panel card-panel-alert">
      <h2>Proceso de Admisión Escolar 2026</h2>
      <p style={{ margin: '10px 0', fontSize: '15px' }}>
        Informamos a toda la comunidad de Puerto Montt que las postulaciones para <strong>Pre-Kinder, Kinder, Educación Básica y Educación Media</strong> para el año académico 2026 inician de forma impostergable el <strong>5 de agosto</strong> y finalizan el <strong>28 de agosto</strong>.
      </p>
      <p style={{ fontSize: '14px', color: 'var(--color-texto-secundario)', margin: '0 0 15px 0' }}>
        🚨 Todo el proceso se centraliza de manera online mediante la plataforma del Sistema de Admisión Escolar (SAE).
      </p>
      <a href="https://www.sistemadeadmisionescolar.cl" target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: 'var(--color-peligro)' }}>
        Ir al Portal Oficial SAE ↗
      </a>
    </section>
  );
}

export default SeccionAdmision;