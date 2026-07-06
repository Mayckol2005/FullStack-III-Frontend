import React from 'react';
import { Link } from 'react-router-dom';
import logoColegio from '../../assets/logos/logo-colegio.png';
import proyectoEducativo from '../../assets/documents/proyecto-educativo-cbo.pdf';
import manualConvivencia from '../../assets/documents/protocolos-manual-de-convivencia-escolar.pdf';
import reglamentoInterno from '../../assets/documents/reglamento-interno-escolar.pdf';
import HeroBanner from '../../components/public/HeroBanner.jsx';
import SeccionAdmision from '../../components/public/SeccionAdmision.jsx';

const INSTAGRAM_URL = 'https://www.instagram.com/colegio_cbo/';
const FACEBOOK_URL = 'https://www.facebook.com/cbocomunidad/';

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Colegio+Bernardo+O%27Higgins%2C+Irlanda+3260%2C+Hualpen%2C+Bio+Bio%2C+Chile";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Colegio+Bernardo+O%27Higgins%2C+Irlanda+3260%2C+Hualp%C3%A9n%2C+Biob%C3%ADo%2C+Chile&output=embed";

function LandingPage() {
  const irASeccion = (id) => {
    const seccion = document.getElementById(id);

    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-wrapper">
      <header className="brand-header-public">
        <div className="public-brand-identity">
          <img
            src={logoColegio}
            alt="Escudo del Colegio Bernardo O'Higgins"
            className="public-brand-logo"
          />

          <div>
            <h1>Colegio Bernardo O'Higgins</h1>
            <p>Hualpén · Región del Biobío</p>
          </div>
        </div>
      </header>

      <nav
        className="nav-container-public"
        aria-label="Navegación principal"
      >
        <div className="nav-grid-links">
          <ul className="nav-public-list">
            <li className="nav-public-item">
              <button
                type="button"
                className="nav-public-button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              >
                Inicio
              </button>
            </li>

            <li className="nav-public-item">
              <button
                type="button"
                className="nav-public-button"
                onClick={() => irASeccion('colegio')}
              >
                Nuestro Colegio
              </button>
            </li>

            <li className="nav-public-item">
              <button
                type="button"
                className="nav-public-button"
                onClick={() => irASeccion('niveles')}
              >
                Niveles
              </button>
            </li>

            <li className="nav-public-item">
              <button
                type="button"
                className="nav-public-button"
                onClick={() => irASeccion('apoyo')}
              >
                Apoyo
              </button>
            </li>

            <li className="nav-public-item">
              <button
                type="button"
                className="nav-public-button"
                onClick={() => irASeccion('documentos')}
              >
                Documentos
              </button>
            </li>

            <li className="nav-public-item-alert">
              <button
                type="button"
                className="nav-public-button nav-public-button-alert"
                onClick={() => irASeccion('admision')}
              >
                Admisión
              </button>
            </li>
          </ul>

          <Link
            to="/login"
            className="btn-primary public-portal-link"
          >
            Ingresar al Portal →
          </Link>
        </div>
      </nav>

      <HeroBanner onIrASeccion={irASeccion} />

      <main className="landing-main">
        <section
          id="colegio"
          className="card-panel public-section"
        >
          <div className="public-section-heading">
            <span className="public-section-kicker">
              NUESTRO COLEGIO
            </span>

            <h2>Nuestro proyecto educativo</h2>
          </div>

          <p className="public-section-description">
            En el Colegio Bernardo O&apos;Higgins acompañamos a
            nuestros estudiantes durante su Educación Básica y Media,
            promoviendo el aprendizaje, el respeto y la participación
            en una comunidad educativa cercana y comprometida.
          </p>

          <div className="public-values-grid">
            <article className="public-value-card">
              <span
                className="public-card-icon"
                aria-hidden="true"
              >
                🎯
              </span>

              <div>
                <h3>Formación integral</h3>

                <p>
                  Buscamos fortalecer los aprendizajes y el desarrollo
                  personal de cada estudiante durante su trayectoria
                  escolar.
                </p>
              </div>
            </article>

            <article className="public-value-card">
              <span
                className="public-card-icon"
                aria-hidden="true"
              >
                🤝
              </span>

              <div>
                <h3>Comunidad educativa</h3>

                <p>
                  Promovemos el respeto, la buena convivencia y la
                  participación de estudiantes, familias y equipos
                  educativos.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section
          id="niveles"
          className="public-section"
        >
          <div className="public-section-heading">
            <span className="public-section-kicker">
              TRAYECTORIA ESCOLAR
            </span>

            <h2>Nuestros niveles educativos</h2>

            <p>
              Acompañamos a nuestros estudiantes desde 1° básico hasta
              4° medio.
            </p>
          </div>

          <div className="public-levels-grid">
            <article className="card-panel public-level-card">
              <div
                className="public-level-icon"
                aria-hidden="true"
              >
                ✏️
              </div>

              <span className="public-level-range">
                1° A 8° BÁSICO
              </span>

              <h3>Educación Básica</h3>

              <p>
                Fortalecemos los aprendizajes fundamentales, la
                autonomía y el desarrollo de habilidades necesarias
                para avanzar con seguridad durante la vida escolar.
              </p>
            </article>

            <article className="card-panel public-level-card">
              <div
                className="public-level-icon"
                aria-hidden="true"
              >
                📚
              </div>

              <span className="public-level-range">
                1° A 4° MEDIO
              </span>

              <h3>Educación Media</h3>

              <p>
                Acompañamos la consolidación de los aprendizajes y la
                preparación de cada estudiante para sus proyectos de
                continuidad de estudios y desarrollo personal.
              </p>
            </article>
          </div>
        </section>

        <SeccionAdmision />

        <section
          id="apoyo"
          className="card-panel public-section"
        >
          <div className="public-section-heading">
            <span className="public-section-kicker">
              ACOMPAÑAMIENTO ESCOLAR
            </span>

            <h2>Apoyo al estudiante</h2>

            <p>
              El aprendizaje también requiere acompañamiento,
              convivencia y trabajo colaborativo.
            </p>
          </div>

          <div className="grid-teams public-support-grid">
            <article className="team-card">
              <span
                className="public-card-icon"
                aria-hidden="true"
              >
                ✨
              </span>

              <h3>Programa de Integración Escolar</h3>

              <p>
                Profesionales que acompañan a estudiantes que requieren
                apoyos específicos, colaborando con docentes y familias
                para favorecer su participación y aprendizaje.
              </p>
            </article>

            <article className="team-card">
              <span
                className="public-card-icon"
                aria-hidden="true"
              >
                🧠
              </span>

              <h3>Convivencia Escolar</h3>

              <p>
                Promueve espacios seguros y respetuosos mediante
                acciones de prevención, acompañamiento y resolución
                colaborativa de conflictos.
              </p>
            </article>

            <article className="team-card">
              <span
                className="public-card-icon"
                aria-hidden="true"
              >
                📋
              </span>

              <h3>Acompañamiento formativo</h3>

              <p>
                Profesores jefes y docentes acompañan el progreso
                académico y la participación de cada curso durante el
                año escolar.
              </p>
            </article>
          </div>
        </section>

        <div className="public-information-grid">
          <section
            id="documentos"
            className="card-panel public-information-card"
          >
            <div className="public-section-heading public-section-heading-small">
              <span className="public-section-kicker">
                INFORMACIÓN INSTITUCIONAL
              </span>

              <h2>Documentos del colegio</h2>
            </div>

            <p className="public-information-description">
              Consulta documentación institucional del Colegio Bernardo
              O&apos;Higgins.
            </p>

            <div className="public-documents-list">
              <a
                href={proyectoEducativo}
                target="_blank"
                rel="noopener noreferrer"
                className="public-document-link"
              >
                <span
                  className="public-document-icon"
                  aria-hidden="true"
                >
                  📄
                </span>

                <span className="public-document-content">
                  <strong>
                    Proyecto Educativo Institucional
                  </strong>

                  <small>
                    Conoce los lineamientos del proyecto educativo del
                    colegio.
                  </small>
                </span>

                <span className="public-document-action">
                  Ver ↗
                </span>
              </a>

              <a
                href={manualConvivencia}
                target="_blank"
                rel="noopener noreferrer"
                className="public-document-link"
              >
                <span
                  className="public-document-icon"
                  aria-hidden="true"
                >
                  📄
                </span>

                <span className="public-document-content">
                  <strong>
                    Manual y Protocolos de Convivencia Escolar
                  </strong>

                  <small>
                    Consulta orientaciones y protocolos para la
                    convivencia escolar.
                  </small>
                </span>

                <span className="public-document-action">
                  Ver ↗
                </span>
              </a>

              <a
                href={reglamentoInterno}
                target="_blank"
                rel="noopener noreferrer"
                className="public-document-link"
              >
                <span
                  className="public-document-icon"
                  aria-hidden="true"
                >
                  📄
                </span>

                <span className="public-document-content">
                  <strong>Reglamento Interno Escolar</strong>

                  <small>
                    Revisa las normas de funcionamiento y convivencia
                    del establecimiento.
                  </small>
                </span>

                <span className="public-document-action">
                  Ver ↗
                </span>
              </a>
            </div>
          </section>

          <section
            id="comunidad"
            className="card-panel public-information-card"
          >
            <div className="public-section-heading public-section-heading-small">
              <span className="public-section-kicker">
                PARTICIPACIÓN
              </span>

              <h2>Comunidad educativa</h2>
            </div>

            <p className="public-information-description">
              La participación de las familias y estudiantes forma
              parte de nuestra vida escolar.
            </p>

            <div className="public-community-list">
              <article className="estamento-item">
                <span
                  className="public-card-icon"
                  aria-hidden="true"
                >
                  👨‍👩‍👧
                </span>

                <div>
                  <h3>
                    Centro General de Padres y Apoderados
                  </h3>

                  <p>
                    Espacio de participación y colaboración de las
                    familias con la comunidad educativa.
                  </p>
                </div>
              </article>

              <article className="estamento-item">
                <span
                  className="public-card-icon"
                  aria-hidden="true"
                >
                  📢
                </span>

                <div>
                  <h3>Centro de Estudiantes</h3>

                  <p>
                    Organización estudiantil que promueve la
                    participación, la representación y las actividades
                    de la comunidad escolar.
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

<section
  id="contacto"
  className="public-location-section"
>
  <div className="public-location-heading">
    <span className="public-section-kicker">
      VISÍTANOS
    </span>

    <h2>Ubicación y contacto</h2>

    <p>
      Encuéntranos en Hualpén y mantente en contacto con nuestra
      comunidad educativa.
    </p>
  </div>

  <div className="public-location-grid">
    <div className="public-map-container">
      <iframe
        title="Mapa del Colegio Bernardo O'Higgins"
        src={GOOGLE_MAPS_EMBED_URL}
        className="public-map-iframe"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>

    <aside className="public-contact-card">
      <div className="public-contact-identity">
        <div className="public-contact-logo">
          <img
            src={logoColegio}
            alt="Escudo del Colegio Bernardo O'Higgins"
          />
        </div>

        <div>
          <span>COLEGIO BERNARDO O&apos;HIGGINS</span>
          <h3>Estamos en Hualpén</h3>
        </div>
      </div>

      <div className="public-contact-details">
        <div className="public-contact-item">
          <span
            className="public-contact-icon"
            aria-hidden="true"
          >
            📍
          </span>

          <div>
            <strong>Dirección</strong>
            <p>Irlanda 3260, Hualpén</p>
            <p>Región del Biobío</p>
          </div>
        </div>

        <div className="public-contact-item">
          <span
            className="public-contact-icon"
            aria-hidden="true"
          >
            📞
          </span>

          <div>
            <strong>Teléfono</strong>

            <a href="tel:+56995073517">
              +56 9 9507 3517
            </a>
          </div>
        </div>
      </div>

      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary public-location-action"
      >
        Cómo llegar en Google Maps ↗
      </a>

      <div className="public-contact-social">
        <span>Síguenos en nuestras redes</span>

        <div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook ↗
          </a>
        </div>
      </div>
    </aside>
  </div>
</section>

<footer className="footer-container-public">
  <div className="public-footer-content">
    <div className="public-footer-brand">
      <img
        src={logoColegio}
        alt=""
        aria-hidden="true"
      />

      <div>
        <strong>Colegio Bernardo O&apos;Higgins</strong>
        <span>Hualpén · Región del Biobío</span>
      </div>
    </div>

    <Link
      to="/login"
      className="footer-portal-link"
    >
      Ingresar al Portal Educativo →
    </Link>
  </div>

  <div className="footer-copyright-bar">
    © 2026 Colegio Bernardo O&apos;Higgins. Todos los derechos
    reservados.
  </div>
</footer>
    </div>
  );
}

export default LandingPage;