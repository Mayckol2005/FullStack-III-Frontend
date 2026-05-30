import React from 'react';
import { Link } from 'react-router-dom';
import logoColegio from '../../assets/logos/logo-colegio.png';
import HeroBanner from '../../components/public/HeroBanner.jsx';
import SeccionAdmision from '../../components/public/SeccionAdmision.jsx';

function LandingPage() {
  
  const irASeccion = (id) => {
    const seccion = document.getElementById(id);
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-wrapper">

      {/* 🏫 ENCABEZADO OFICIAL DE IDENTIDAD (Ahora inicia limpio desde arriba) */}
      <div className="brand-header-public">
        <h1>Colegio Bernardo O'Higgins</h1>
        <p>Educando hoy para triunfar mañana</p>
      </div>

      {/* 🌐 NAV DE NAVEGACIÓN PÚBLICA INTERACTIVA */}
      <nav className="nav-container-public">
        <div className="nav-grid-links">
          <ul className="nav-public-list">
            <li className="nav-public-item"><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Inicio</button></li>
            <li className="nav-public-item"><button onClick={() => irASeccion('colegio')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>El Colegio</button></li>
            <li className="nav-public-item"><button onClick={() => irASeccion('ciclos')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Ciclos Educativos</button></li>
            <li className="nav-public-item"><button onClick={() => irASeccion('equipos')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Equipos de Trabajo</button></li>
            <li className="nav-public-item"><button onClick={() => irASeccion('normativas')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Normativas</button></li>
            <li className="nav-public-item-alert"><button onClick={() => irASeccion('admision')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}>⚡ Admisión 2026</button></li>
          </ul>

          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Portal Intranet →
          </Link>
        </div>
      </nav>

      {/* 🖼️ HERO BANNER PRINCIPAL */}
      <HeroBanner onIrASeccion={irASeccion} />

      {/* 📋 CUADRÍCULA DE CONTENIDO GENERAL */}
      <main className="landing-main">
        
        {/* El Colegio: Misión, Visión y Valores */}
        <section id="colegio" className="card-panel">
          <h2 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '22px' }}>🏫 Nuestro Proyecto Educativo</h2>
          <p style={{ lineHeight: '1.6', color: '#475569', margin: '0 0 20px 0' }}>
            ¿Qué implica ser parte de la comunidad CBO? Significa integrarse a un ecosistema enfocado en el desarrollo holístico del estudiante, donde la convivencia armónica, el respeto mutuo y la superación académica se conjugan bajo sellos valóricos bien definidos.
          </p>
          <div className="flex-row-gap">
            <div className="flex-equal-item" style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-primario)' }}>🎯 Misión Institucional</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Garantizar educación de calidad a través de metodologías activas que promuevan la autonomía y la inserción social de cada egresado.</p>
            </div>
            <div className="flex-equal-item" style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-primario)' }}>👁️ Visión del Futuro</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Ser un referente regional de inclusión, innovación curricular y formación ciudadana responsable con su entorno.</p>
            </div>
          </div>
        </section>

        {/* Proceso Obligatorio de Admisión SAE */}
        <SeccionAdmision />

        {/* Ciclos de Educación */}
        <section id="ciclos">
          <h2 style={{ color: 'var(--color-primario)', fontSize: '22px', marginBottom: '20px' }}>🎓 Ciclos Formativos</h2>
          <div className="flex-row-gap">
            <div className="card-panel flex-equal-item" style={{ margin: 0 }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>👶 Pre-Escolar</h4>
              <p style={{ fontSize: '14px', margin: 0, color: '#475569' }}>Estimulación temprana, desarrollo psicomotor y socialización inicial para los niveles de Pre-Kinder y Kinder.</p>
            </div>
            <div className="card-panel flex-equal-item" style={{ margin: 0 }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>✏️ Educación Básica</h4>
              <p style={{ fontSize: '14px', margin: 0, color: '#475569' }}>De 1° a 8° año básico enfocado en la consolidación de la lectoescritura, pensamiento lógico-matemático y ciencias.</p>
            </div>
            <div className="card-panel flex-equal-item" style={{ margin: 0 }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>📖 Educación Media</h4>
              <p style={{ fontSize: '14px', margin: 0, color: '#475569' }}>Formación general científico-humanista con preparación focalizada para la transición a la educación superior.</p>
            </div>
          </div>
        </section>

        {/* Planta y Equipos Técnicos */}
        <section id="equipos" className="card-panel" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '22px' }}>👥 Nuestros Equipos del Establecimiento</h2>
          <div className="grid-teams">
            <div className="team-card">
              <h4>✨ Equipo PIE (Programa de Inclusión)</h4>
              <p>Psicopedagogas, psicólogos y fonoaudiólogos trabajando en aula regular para brindar apoyos especializados a necesidades educativas.</p>
            </div>
            <div className="team-card">
              <h4>🧠 Convivencia Escolar</h4>
              <p>Encargados de promover un clima de aula seguro, gestionar mediaciones de conflictos y talleres de prevención comunitaria.</p>
            </div>
            <div className="team-card">
              <h4>📋 Equipo de Educación Básica & Media</h4>
              <p>Docentes de asignatura y profesores jefes enfocados en el despliegue de las programaciones y actividades del plan de estudio.</p>
            </div>
          </div>
        </section>

        {/* Normativas y Descargas del Centro de Padres */}
        <div className="flex-row-gap-big">
          <section id="normativas" className="card-panel flex-equal-item-big" style={{ margin: 0 }}>
            <h3 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '18px' }}>📄 Normativas & Descargas</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-texto-secundario)' }}>Descarga la documentación oficial vigente aprobada por el MINEDUC:</p>
            <ul className="list-download">
              <li><a href="#RIE">🗂️ Reglamento Interno Escolar (RIE) 2026.pdf</a></li>
              <li><a href="#Protocolos">🗂️ Protocolos de Acción Convivencia Escolar.pdf</a></li>
              <li><a href="#PISE">🗂️ Plan Integral de Seguridad Escolar (PISE).pdf</a></li>
            </ul>
          </section>

          <section id="comunidad" className="card-panel flex-equal-item-big" style={{ margin: 0 }}>
            <h3 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '18px' }}>🤝 Estamentos Escolares</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="estamento-item">
                <strong>👨‍👩‍👦 Centro General de Padres & Apoderados</strong>
                <p>Contacto de la mesa directiva: centrogeneraldepadre.cbo@gmail.com</p>
              </div>
              <div className="estamento-item">
                <strong>📢 CEAL (Centro de Alumnos)</strong>
                <p>Organización estudiantil democrática para programaciones culturales y actividades destacadas de los alumnos.</p>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* 🏁 EL GRAN FOOTER INSTITUCIONAL REESTRUCTURADO (Con bloque central de contacto) */}
      <footer id="contacto" className="footer-container-public">
        <div className="footer-grid">
          
          {/* Bloque Mapa de Google Maps Simulado */}
          <div className="footer-col-map">
            <h5>Ubicación Física</h5>
            <div className="footer-map-box">
              <span>🗺️ [Mapa Interactivo: Irlanda 320, Hualpén]</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px' }}>📍 Dirección: Irlanda N° 320, Hualpén, Región del Bío-Bío.</p>
          </div>

          {/* 📞 NUEVO APARTADO DE CONTACTO CENTRALIZADO */}
          <div className="footer-col-links">
            <h5>Contacto Oficial</h5>
            <ul className="footer-list" style={{ color: '#cbd5e1', fontSize: '14px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>📞 +56 9 9507 3517 (Asistente)</li>
              <li style={{ marginBottom: '8px' }}>📞 +56 9 5776 5581 (Dirección)</li>
              <li style={{ marginBottom: '8px' }}>✉️ asistente.cbo@gmail.com</li>
              <li style={{ marginBottom: '12px' }}>✉️ direccion.cbo@gmail.com</li>
              <li>
                <span style={{ fontWeight: 'bold', color: '#fff', display: 'block', marginBottom: '5px' }}>Redes Sociales:</span>
                <a href="#fb" style={{ marginRight: '10px', color: '#38bdf8' }}>Facebook</a>
                <a href="#ig" style={{ color: '#38bdf8' }}>Instagram</a>
              </li>
            </ul>
          </div>

          {/* Enlaces Generales */}
          <div className="footer-col-links">
            <h5>Enlaces Generales</h5>
            <ul className="footer-list">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, textAlign: 'left' }}>Inicio Principal</button></li>
              <li><button onClick={() => irASeccion('colegio')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, textAlign: 'left' }}>Colegio Bernardo O'Higgins</button></li>
              <li><Link to="/login">Portal Intranet Central</Link></li>
            </ul>
          </div>

          {/* Escudo Redondo del Establecimiento */}
          <div className="footer-col-logo">
            <div className="footer-logo-circle">
              <img src={logoColegio} alt="Logo CBO" style={{ height: '50px' }} />
            </div>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>Colegio CBO</span>
          </div>
        </div>

        <div className="footer-copyright-bar">
          © 2026 Liceo Bernardo O'Higgins. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;