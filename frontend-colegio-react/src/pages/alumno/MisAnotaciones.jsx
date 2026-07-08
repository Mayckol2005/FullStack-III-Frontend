import React, { useEffect, useState } from 'react';
import { obtenerAnotacionesAlumnoActual } from '../../services/alumnoService';
import '../../styles/globals.css';

function MisAnotaciones() {

    const [anotacionSeleccionada, setAnotacionSeleccionada] = useState(null);
    const [anotaciones, setAnotaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarAnotaciones = async () => {
            try {
                const registros = await obtenerAnotacionesAlumnoActual();
                setAnotaciones(registros);
                setAnotacionSeleccionada(registros[0] || null);
            } catch (err) {
                console.error('Error cargando anotaciones del alumno:', err);
                setError('No se pudieron cargar las anotaciones registradas.');
            } finally {
                setCargando(false);
            }
        };

        cargarAnotaciones();
    }, []);

    const positivas =
        anotaciones.filter(a => a.tipo === 'POSITIVA').length;

    const negativas =
        anotaciones.filter(a => a.tipo === 'NEGATIVA').length;

    return (
        <div className="dashboard-container">

            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mis Anotaciones</h2>
                    <p>Registro de observaciones académicas</p>
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
                    <h4>Total</h4>
                    <p>{anotaciones.length}</p>
                </div>

                <div className="team-card">
                    <h4>Positivas</h4>
                    <p>{positivas}</p>
                </div>

                <div className="team-card">
                    <h4>Negativas</h4>
                    <p>{negativas}</p>
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
                        <p>Cargando anotaciones...</p>
                    )}

                    {!cargando && error && (
                        <p style={{ color: 'var(--color-peligro)' }}>{error}</p>
                    )}

                    {!cargando && !error && anotaciones.length === 0 && (
                        <p>No hay anotaciones registradas para este alumno.</p>
                    )}

                    {!cargando && !error && anotaciones.map(anotacion => (

                        <div
                            key={anotacion.id}
                            onClick={() =>
                                setAnotacionSeleccionada(anotacion)
                            }
                            className="team-card"
                            style={{
                                cursor: 'pointer',
                                marginBottom: '12px',
                                borderLeft:
                                    anotacion.tipo === 'POSITIVA'
                                        ? '5px solid green'
                                        : anotacion.tipo === 'NEGATIVA'
                                        ? '5px solid red'
                                        : '5px solid orange'
                            }}
                        >
                            <h4>{anotacion.tipo}</h4>

                            <small>
                                {anotacion.fecha}
                            </small>
                        </div>

                    ))}

                </div>

                <div className="card-panel">

                    {!anotacionSeleccionada ? (

                        <div
                            style={{
                                textAlign: 'center',
                                padding: '50px'
                            }}
                        >
                            Selecciona una anotación para ver detalles
                        </div>

                    ) : (

                        <>
                            <h2>
                                {anotacionSeleccionada.tipo}
                            </h2>

                            <p>
                                <strong>Fecha:</strong>{' '}
                                {anotacionSeleccionada.fecha}
                            </p>

                            <hr />

                            <p
                                style={{
                                    fontSize: '16px',
                                    lineHeight: '1.8'
                                }}
                            >
                                {anotacionSeleccionada.descripcion}
                            </p>
                        </>

                    )}

                </div>

            </div>

        </div>
    );
}

export default MisAnotaciones;
