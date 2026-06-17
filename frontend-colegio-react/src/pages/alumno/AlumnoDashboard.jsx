import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/globals.css';

function AlumnoDashboard() {
    const navigate = useNavigate();

    const alumnoInfo = {
        nombreCompleto: localStorage.getItem('usuario_nombre') || "Alumno",
        curso: "4° Medio A",
        periodo: "Año Escolar 2026"
    };

    return (
        <div className="dashboard-container">

            <div className="docente-banner">
                <div className="docente-banner-info">
                    <h2>¡Bienvenido(a), {alumnoInfo.nombreCompleto}!</h2>
                    <p>
                        🎓 <strong>Curso:</strong> {alumnoInfo.curso}
                    </p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        {alumnoInfo.periodo}
                    </div>

                    <div className="institucion">
                        Colegio Bernardo O'Higgins
                    </div>
                </div>
            </div>

            <div className="anotaciones-layout-container">

                <div className="card-panel anotaciones-form-panel">
                    <h3
                        style={{
                            color: 'var(--color-primario)',
                            marginTop: 0
                        }}
                    >
                        📚 Resumen Académico
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >

                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/notas')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📊 Promedio General</h4>
                            <p>6.2</p>
                        </div>

                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/asistencia')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📅 Asistencia</h4>
                            <p>92%</p>
                        </div>

                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/anotaciones')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📝 Anotaciones</h4>
                            <p>2 registros</p>
                        </div>

                    </div>
                </div>

                <div className="card-panel anotaciones-sidebar-container">
                    <h3>⚡ Acceso Rápido</h3>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--color-texto-secundario)'
                        }}
                    >
                        Consulta tu información académica:
                    </p>

                    <div className="quick-actions-box">

                        <button
                            className="btn-action-quick btn-action-evaluacion"
                            onClick={() => navigate('/alumno/notas')}
                        >
                            📊 Ver Mis Notas
                        </button>

                        <button
                            className="btn-action-quick btn-action-asistencia"
                            onClick={() => navigate('/alumno/asistencia')}
                        >
                            📅 Ver Asistencia
                        </button>

                        <button
                            className="btn-action-quick btn-action-anotacion"
                            onClick={() => navigate('/alumno/anotaciones')}
                        >
                            📝 Ver Anotaciones
                        </button>

                    </div>

                    <div
                        className="card-panel card-panel-info-coexistencia"
                        style={{ marginTop: '20px' }}
                    >
                        <h3>Información</h3>

                        <p>
                            Desde este portal podrás consultar tus notas,
                            asistencia y observaciones registradas por tus
                            profesores.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AlumnoDashboard;