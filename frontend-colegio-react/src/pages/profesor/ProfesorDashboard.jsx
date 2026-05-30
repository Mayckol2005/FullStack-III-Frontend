import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAvisosInstitucionales } from '../../services/profesorService';
import '../../styles/globals.css'

function ProfesorDashboard() {
    const navigate = useNavigate();
    const [avisos, setAvisos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const docenteInfo = {
        nombreCompleto: localStorage.getItem('usuario_nombre') || "Profesor(a)",
        asignatura: "Matemáticas y Ciencias",
        periodo: "Año Escolar 2026"
    };

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setCargando(true);
            try {
                const dataAvisos = await obtenerAvisosInstitucionales();
                setAvisos(dataAvisos || []);
            } catch(error) {
                 console.error("Error al cargar el dashboard", error);
            } finally {
                setCargando(false);
            }
        };
        cargarDatosIniciales();
    }, []);

    return (
        <div className="dashboard-container">
            
            {/* Banner de Bienvenida: Identidad clara */}
            <div className="docente-banner">
                <div className="docente-banner-info">
                    <h2>¡Bienvenido(a), {docenteInfo.nombreCompleto}!</h2>
                    <p>👨‍🏫 <strong>Asignatura a Cargo:</strong> {docenteInfo.asignatura}</p>
                </div>
                <div className="docente-banner-meta">
                    <div className="periodo">{docenteInfo.periodo}</div>
                    <div className="institucion">Colegio Bernardo O'Higgins</div>
                </div>
            </div>

            {/* Layout principal: Foco en Mural y Acciones */}
            <div className="anotaciones-layout-container">
                
                {/* Mural de Novedades: Lo primero que debe ver */}
                <div className="card-panel anotaciones-form-panel">
                    <h3 style={{ color: 'var(--color-primario)', marginTop: 0 }}>📢 Mural de Novedades</h3>
                    
                    {cargando ? (
                        <div className="empty-state">⏳ Cargando comunicados...</div>
                    ) : avisos.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {avisos.map(aviso => (
                                <div key={aviso.id} className="team-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <h4 style={{ margin: 0 }}>{aviso.titulo}</h4>
                                        <span style={{ fontSize: '12px' }}>📅 {aviso.fecha}</span>
                                    </div>
                                    <p style={{ fontSize: '14px' }}>{aviso.detalle || aviso.descripcion || aviso.contenido}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="empty-state">No hay comunicados vigentes en el mural.</div>
                    )}
                </div>

                {/* Acceso Rápido */}
                <div className="card-panel anotaciones-sidebar-container">
                    <h3>⚡ Acceso Rápido</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-texto-secundario)' }}>
                        Gestión diaria de aula:
                    </p>
                    
                    <div className="quick-actions-box">
                        <button className="btn-action-quick btn-action-asistencia" onClick={() => navigate('/profesor/asistencia')}>
                            📅 Pasar Lista Diaria
                        </button>
                        
                        <button className="btn-action-quick btn-action-anotacion" onClick={() => navigate('/profesor/anotaciones')}>
                            📝 Registrar Observación
                        </button>
                        
                        <button className="btn-action-quick btn-action-evaluacion" onClick={() => navigate('/profesor/evaluaciones')}>
                            📊 Ingresar Calificaciones
                        </button>
                    </div>

                    <div className="card-panel card-panel-info-coexistencia" style={{ marginTop: '20px' }}>
                        <h3>¿Necesitas ayuda?</h3>
                        <p>Si tienes problemas con la carga de listas o notas, contacta a soporte técnico en el departamento de informática.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfesorDashboard;