import React from 'react';
import '../../styles/globals.css';

function MisNotas() {

    const notas = [
        { asignatura: 'Matemáticas', n1: 6.0, n2: 6.5, n3: 5.8 },
        { asignatura: 'Lenguaje', n1: 5.5, n2: 6.2, n3: 6.0 },
        { asignatura: 'Historia', n1: 6.1, n2: 5.9, n3: 6.4 }
    ];

    return (
        <div className="dashboard-container">

            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mis Calificaciones</h2>
                    <p>Consulta de rendimiento académico</p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">Promedio General</div>
                    <div
                        className="institucion"
                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                    >
                        6.0
                    </div>
                </div>
            </header>

            <div className="card-panel" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>N1</th>
                                <th>N2</th>
                                <th>N3</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notas.map((n, index) => (
                                <tr key={index}>
                                    <td>{n.asignatura}</td>
                                    <td>{n.n1}</td>
                                    <td>{n.n2}</td>
                                    <td>{n.n3}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default MisNotas;