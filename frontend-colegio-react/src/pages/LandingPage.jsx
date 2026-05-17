import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/estilos.css'; 

function LandingPage() {
    
    // Lógica nativa de scroll interactivo suave para la barra SPA
    const irASeccion = (id) => {
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-wrapper">
            
            {/* 📞 TOP BAR DE CONTACTO INSTITUCIONAL */}
            <div className="top-bar-public">
                <div className="top-bar-info">
                    <span>📞 +56 9 9507 3517</span>
                    <span>📞 +56 9 5776 5581</span>
                    <span>✉️ asistente.cbo@gmail.com</span>
                    <span>✉️ direccion.cbo@gmail.com</span>
                </div>
                <div className="top-bar-social">
                    <a href="#fb" rel="noreferrer">Facebook</a>
                    <a href="#ig" rel="noreferrer">Instagram</a>
                </div>
            </div>

            {/* 🏫 ENCABEZADO OFICIAL DE IDENTIDAD */}
            <div className="brand-header-public">
                <h1>Colegio Bernardo O'Higgins</h1>
                <p>Educando hoy para triunfar mañana</p>
            </div>

            {/* 🌐 NAV DE NAVEGACIÓN PÚBLICA INTERACTIVA */}
            <nav className="nav-container-public">
                <div className="nav-grid-links">
                    <ul className="nav-public-list">
                        <li className="nav-public-item"><a onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Inicio</a></li>
                        <li className="nav-public-item"><a onClick={() => irASeccion('colegio')}>El Colegio</a></li>
                        <li className="nav-public-item"><a onClick={() => irASeccion('ciclos')}>Ciclos Educativos</a></li>
                        <li className="nav-public-item"><a onClick={() => irASeccion('equipos')}>Equipos de Trabajo</a></li>
                        <li className="nav-public-item"><a onClick={() => irASeccion('normativas')}>Normativas</a></li>
                        <li className="nav-public-item-alert"><a onClick={() => irASeccion('admision')}>⚡ Admisión 2026</a></li>
                    </ul>

                    <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Portal Intranet →
                    </Link>
                </div>
            </nav>

            {/* 🖼️ HERO BANNER PRINCIPAL */}
            <header className="landing-hero">
                <h1>Bienvenidos a la Comunidad CBO</h1>
                <p>
                    Construyendo un espacio educativo inclusivo de excelencia en el sur de Chile. Conoce nuestros pilares, normativas y forma parte de nuestro proyecto.
                </p>
                <div className="landing-hero-actions">
                    <a onClick={() => irASeccion('admision')} className="btn-primary" style={{ textDecoration: 'none', backgroundColor: 'var(--color-peligro)' }}>Postular Admisión 2026</a>
                    <a href="#contacto" className="btn-primary" style={{ textDecoration: 'none', backgroundColor: '#64748b' }}>Trabaja con Nosotros</a>
                </div>
            </header>

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

            {/* 🏁 EL GRAN FOOTER INSTITUCIONAL REESTRUCTURADO */}
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

                    {/* Enlaces Informativos Internos */}
                    <div className="footer-col-links">
                        <h5>Enlaces de Interés</h5>
                        <ul className="footer-list">
                            <li><a onClick={() => irASeccion('ciclos')}>Programaciones y Eventos</a></li>
                            <li><a onClick={() => irASeccion('colegio')}>Actividades Destacadas</a></li>
                            <li><a onClick={() => irASeccion('equipos')}>Alumnos Destacados</a></li>
                            <li><a onClick={() => irASeccion('normativas')}>Misión, Visión y Sellos</a></li>
                        </ul>
                    </div>

                    {/* Accesos a Portales */}
                    <div className="footer-col-links">
                        <h5>Enlaces Generales</h5>
                        <ul className="footer-list">
                            <li><a onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Inicio Principal</a></li>
                            <li><a onClick={() => irASeccion('colegio')}>Colegio Bernardo O'Higgins</a></li>
                            <li><Link to="/login">Portal Intranet Central</Link></li>
                        </ul>
                    </div>

                    {/* Escudo Redondo del Establecimiento */}
                    <div className="footer-col-logo">
                        <div className="footer-logo-circle">
                            <img src="/logo-colegio.png" alt="Logo CBO" style={{ height: '50px' }} />
                        </div>
                        <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>Colegio CBO</span>
                    </div>

                </div>

                <div className="footer-copyright-bar">
                    © 2026 Liceo Bernardo O'Higgins. Todos los derechos reservados. Infraestructura web transaccional distribuida.
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;