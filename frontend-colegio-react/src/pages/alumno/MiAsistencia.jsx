import React, { useEffect, useState } from 'react';
import { obtenerAsistenciaAlumnoActual } from '../../services/alumnoService';
import '../../styles/globals.css';

function MiAsistencia() {

    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarAsistencia = async () => {
            try {
                const registros = await obtenerAsistenciaAlumnoActual();
                setAsistencias(registros);
                setRegistroSeleccionado(registros[0] || null);
            } catch (err) {
                console.error('Error cargando asistencia del alumno:', err);
                setError('No se pudo cargar la asistencia registrada.');
            } finally {
                setCargando(false);
            }
        };

        cargarAsistencia();
    }, []);

    const presentes =
        asistencias.filter(a => a.estado === 'Presente').length;

    const ausentes =
        asistencias.filter(a => a.estado === 'Ausente').length;

    const porcentaje = asistencias.length === 0
        ? 0
        : Math.round((presentes / asistencias.length) * 100);

    return (
        <div className="dashboard-container">

            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mi Asistencia</h2>
                    <p>Registro histórico de asistencia</p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        Asistencia General
                    </div>

                    <div
                        className="institucion"
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}
                    >
                        {porcentaje}%
                    </div>
                </div>
            </header>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gap: '15px',
                    marginBottom: '20px'
                }}
            >
                <div className="team-card">
                    <h4>Total Clases</h4>
                    <p>{asistencias.length}</p>
                </div>

                <div className="team-card">
                    <h4>Presentes</h4>
                    <p>{presentes}</p>
                </div>

                <div className="team-card">
                    <h4>Ausencias</h4>
                    <p>{ausentes}</p>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '350px 1fr',
                    gap: '20px'
                }}
            >

                <div className="card-panel">

                    <h3>Historial</h3>

                    {cargando && (
                        <p>Cargando asistencia...</p>
                    )}

                    {!cargando && error && (
                        <p style={{ color: 'var(--color-peligro)' }}>{error}</p>
                    )}

                    {!cargando && !error && asistencias.length === 0 && (
                        <p>No hay registros de asistencia para este alumno.</p>
                    )}

                    {!cargando && !error && asistencias.map(registro => (

                        <div
                            key={registro.id}
                            onClick={() =>
                                setRegistroSeleccionado(registro)
                            }
                            className="team-card"
                            style={{
                                cursor: 'pointer',
                                marginBottom: '12px',
                                borderLeft:
                                    registro.estado === 'Presente'
                                        ? '5px solid green'
                                        : '5px solid red'
                            }}
                        >
                            <h4>
                                {registro.estado === 'Presente'
                                    ? '🟢 Presente'
                                    : '🔴 Ausente'}
                            </h4>

                            <small>
                                {registro.fecha}
                            </small>
                        </div>

                    ))}

                </div>

                <div className="card-panel">

                    {!registroSeleccionado ? (

                        <div
                            style={{
                                textAlign: 'center',
                                padding: '50px'
                            }}
                        >
                            Selecciona un registro para ver detalles
                        </div>

                    ) : (

                        <>
                            <h2>
                                {registroSeleccionado.estado === 'Presente'
                                    ? '🟢 Presente'
                                    : '🔴 Ausente'}
                            </h2>

                            <p>
                                <strong>Fecha:</strong>{' '}
                                {registroSeleccionado.fecha}
                            </p>

                            <hr />

                            <h4>Observación</h4>

                            <p
                                style={{
                                    lineHeight: '1.8'
                                }}
                            >
                                {registroSeleccionado.observacion}
                            </p>
                        </>

                    )}

                </div>

            </div>

        </div>
    );
}

export default MiAsistencia;
