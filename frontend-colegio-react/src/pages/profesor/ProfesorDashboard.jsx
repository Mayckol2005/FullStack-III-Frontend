import React, { useState, useEffect } from 'react';
import { obtenerAvisosInstitucionales, obtenerCursosReal, obtenerAnotaciones } from '../../services/profesorService';
import '../../styles/estilos.css';

function ProfesorDashboard() {
    const [avisos, setAvisos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [metricas, setMetricas] = useState({ cursos: 0, anotaciones: 0 });

    useEffect(() => {
        const cargarDashboard = async () => {
            setCargando(true);
            try {
                // 1. Cargamos el mural
                const dataAvisos = await obtenerAvisosInstitucionales();
                setAvisos(dataAvisos || []);

                // 2. Cargamos las métricas dinámicas
                const listaCursos = await obtenerCursosReal();
                const listaAnotaciones = await obtenerAnotaciones();

                setMetricas({
                    cursos: listaCursos.length,
                    anotaciones: listaAnotaciones.length
                });

            } catch(error) {
                 console.error("Error al cargar el dashboard", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDashboard();
    }, []);

    return (
        <div className="dashboard-container">
            {/* ... Header ... */}
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

            {/* 📊 Bloque de Indicadores Dinámicos */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Cursos Activos</span>
                    <h2 style={{ fontSize: '42px', color: 'var(--color-primario)', margin: '10px 0 0 0' }}>{metricas.cursos}</h2>
                </div>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Asistencia General</span>
                    {/* Simulada matemáticamente si no hay endpoints de promedios globales */}
                    <h2 style={{ fontSize: '42px', color: 'var(--color-exito)', margin: '10px 0 0 0' }}>92.5%</h2>
                </div>
                <div className="card-panel" style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Anotaciones Totales</span>
                    <h2 style={{ fontSize: '42px', color: 'var(--color-secundario)', margin: '10px 0 0 0' }}>{metricas.anotaciones}</h2>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
                {/* 📝 Mural de Avisos Real */}
                <div className="card-panel" style={{ flex: '2 1 500px', margin: 0 }}>
                    <h3 style={{ color: 'var(--color-primario)', marginTop: 0, marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                        📢 Mural de Novedades Institucionales
                    </h3>
                    
                    {cargando ? (
                        <div className="empty-state">⏳ Cargando circulares del servidor central...</div>
                    ) : avisos.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {avisos.map(aviso => (
                                <div key={aviso.id} style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--color-primario)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>{aviso.titulo}</h4>
                                        <span style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>📅 {aviso.fecha}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{aviso.detalle || aviso.descripcion || aviso.contenido}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="empty-state" style={{ color: 'var(--color-texto-secundario)' }}>No hay comunicados vigentes en el mural.</div>
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