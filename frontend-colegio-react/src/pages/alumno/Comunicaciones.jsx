import React, { useState } from 'react';
import '../../styles/globals.css';

function Comunicaciones() {

    const [avisoSeleccionado, setAvisoSeleccionado] = useState(null);

    const comunicados = [
        {
            id: 1,
            titulo: 'Reunión de Apoderados',
            fecha: '17/06/2026',
            hora: '18:30',
            nuevo: true,
            detalle:
                'Se informa a toda la comunidad educativa que la reunión de apoderados se realizará el próximo lunes a las 19:00 horas en dependencias del establecimiento.'
        },
        {
            id: 2,
            titulo: 'Suspensión de Clases',
            fecha: '15/06/2026',
            hora: '08:00',
            nuevo: true,
            detalle:
                'Debido a condiciones climáticas adversas, las clases serán suspendidas durante la jornada de mañana.'
        },
        {
            id: 3,
            titulo: 'Proceso de Becas 2026',
            fecha: '10/06/2026',
            hora: '12:15',
            nuevo: false,
            detalle:
                'Ya se encuentra disponible el proceso de postulación a becas internas para el año académico 2026.'
        }
    ];

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

                    {comunicados.map((comunicado) => (

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
                                {comunicado.fecha} · {comunicado.hora} hrs
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
                                {' - '}
                                {avisoSeleccionado.hora} hrs
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
                                    Dirección Colegio Bernardo O'Higgins
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