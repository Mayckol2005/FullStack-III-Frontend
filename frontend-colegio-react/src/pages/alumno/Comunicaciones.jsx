import React, { useEffect, useState } from 'react';
import { obtenerComunicadosAlumnoActual } from '../../services/alumnoService';
import '../../styles/globals.css';

function Comunicaciones() {

    const [avisoSeleccionado, setAvisoSeleccionado] = useState(null);
    const [comunicados, setComunicados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarComunicados = async () => {
            try {
                const avisos = await obtenerComunicadosAlumnoActual();
                setComunicados(avisos);
                setAvisoSeleccionado(avisos[0] || null);
            } catch (err) {
                console.error('Error cargando comunicaciones del alumno:', err);
                setError('No se pudieron cargar las comunicaciones institucionales.');
            } finally {
                setCargando(false);
            }
        };

        cargarComunicados();
    }, []);

    return (
        <div className="dashboard-container">

            <div className="docente-banner">
                <div className="docente-banner-info">
                    <h2>📢 Comunicaciones Institucionales</h2>

                    <p>
                        Mantente informado de los anuncios y novedades del establecimiento.
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '350px 1fr',
                    gap: '20px',
                    marginTop: '20px'
                }}
            >

                {/* LISTADO */}

                <div className="card-panel">

                    <h3 style={{ marginTop: 0 }}>
                        Bandeja de Comunicados
                    </h3>

                    {cargando && (
                        <p>Cargando comunicados...</p>
                    )}

                    {!cargando && error && (
                        <p style={{ color: 'var(--color-peligro)' }}>{error}</p>
                    )}

                    {!cargando && !error && comunicados.length === 0 && (
                        <p>No hay comunicados publicados por el colegio.</p>
                    )}

                    {!cargando && !error && comunicados.map((comunicado) => (

                        <div
                            key={comunicado.id}
                            onClick={() =>
                                setAvisoSeleccionado(comunicado)
                            }
                            className="team-card"
                            style={{
                                marginBottom: '12px',
                                cursor: 'pointer',
                                border:
                                    avisoSeleccionado?.id === comunicado.id
                                        ? '2px solid var(--color-primario)'
                                        : '1px solid #ddd'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        fontSize: '15px'
                                    }}
                                >
                                    {comunicado.titulo}
                                </h4>

                                {comunicado.nuevo && (
                                    <span
                                        style={{
                                            background: '#22c55e',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '10px',
                                            fontSize: '11px'
                                        }}
                                    >
                                        NUEVO
                                    </span>
                                )}
                            </div>

                            <p
                                style={{
                                    marginTop: '8px',
                                    fontSize: '12px',
                                    color: '#666'
                                }}
                            >
                                {comunicado.hora
                                    ? `${comunicado.fecha} · ${comunicado.hora} hrs`
                                    : comunicado.fecha}
                            </p>
                        </div>
                    ))}
                </div>

                {/* DETALLE */}

                <div className="card-panel">

                    {avisoSeleccionado ? (
                        <>
                            <h2
                                style={{
                                    color: 'var(--color-primario)'
                                }}
                            >
                                {avisoSeleccionado.titulo}
                            </h2>

                            <p
                                style={{
                                    color: '#666',
                                    marginBottom: '25px'
                                }}
                            >
                                Publicado el{' '}
                                {avisoSeleccionado.fecha}
                                {avisoSeleccionado.hora
                                    ? ` - ${avisoSeleccionado.hora} hrs`
                                    : ''}
                            </p>

                            <div
                                style={{
                                    lineHeight: '1.8'
                                }}
                            >
                                {avisoSeleccionado.detalle}
                            </div>

                            <div
                                style={{
                                    marginTop: '40px',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #eee'
                                }}
                            >
                                <strong>
                                    {avisoSeleccionado.remitente}
                                </strong>
                            </div>
                        </>
                    ) : (
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#666'
                            }}
                        >
                            📩 Selecciona un comunicado para visualizarlo.
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Comunicaciones;
