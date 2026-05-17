import React, { useState, useEffect } from 'react';
import { obtenerAvisosInstitucionales } from '../../services/profesorService';
import '../../styles/estilos.css';

function ProfesorDashboard() {
    const [avisos, setAvisos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const cargarMural = async () => {
            setCargando(true);
            const data = await obtenerAvisosInstitucionales();
            if (data && data.length > 0) {
                setAvisos(data);
            } else {
                // FALLBACK: Datos simulados tipo la página real para desarrollo
                setAvisos([
                    { id: 1, titulo: 'Celebración día del estudiante', detalle: 'Estimada comunidad, este viernes se realizarán las actividades recreativas por el día del alumno.', fecha: '17-05-2026' },
                    { id: 2, titulo: 'Bienvenida Estudiantes año 2026', detalle: 'Damos un fraterno saludo a todos los jóvenes que se incorporan a nuestras aulas este nuevo año académico.', fecha: '05-03-2026' },
                ]);
            }
            setCargando(false);
        };
        cargarMural();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header-app">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="logo-box">
                        <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Panel de Control Docente</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Bienvenido al libro de clases digital distribuido</p>
                    </div>
                </div>
            </header>

            {/* 📊 Bloque de Indicadores (Métricas Superiores) */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Cursos Asignados</span>
                    <h2 style={{ fontSize: '42px', color: 'var(--color-primario)', margin: '10px 0 0 0' }}>2</h2>
                </div>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Asistencia Promedio</span>
                    <h2 style={{ fontSize: '42px', color: 'var(--color-exito)', margin: '10px 0 0 0' }}>94.2%</h2>
                </div>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Anotaciones de la Semana</span>
                    <h2 style={{ fontSize: '42px', color: 'var(--color-secundario)', margin: '10px 0 0 0' }}>1</h2>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
                {/* 📝 Mural de Avisos conectado al comunicacion-service */}
                <div className="card-panel" style={{ flex: '2 1 500px', margin: 0 }}>
                    <h3 style={{ color: 'var(--color-primario)', marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                        📢 Mural de Novedades Institucionales
                    </h3>
                    
                    {cargando ? (
                        <div className="empty-state">⏳ Cargando circulares del servidor central...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {avisos.map(aviso => (
                                <div key={aviso.id} style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--color-primario)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>{aviso.titulo}</h4>
                                        <span style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>📅 {aviso.fecha}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{aviso.detalle || aviso.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Rápidas Lateral */}
                <div className="card-panel" style={{ flex: '1 1 280px', margin: 0, backgroundColor: 'rgba(15, 89, 159, 0.02)' }}>
                    <h3 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '18px' }}>⚡ Acceso Rápido</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-texto-secundario)', lineHeight: '1.5' }}>
                        Utilice el menú superior institucional para registrar asistencia, guardar planillas de calificaciones o ingresar observaciones en la hoja de vida de los alumnos.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfesorDashboard;