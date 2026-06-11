import React from 'react';
import '../../styles/globals.css';

function MiAsistencia() {

    const asistencias = [
        { fecha: '01/06/2026', estado: 'Presente' },
        { fecha: '02/06/2026', estado: 'Presente' },
        { fecha: '03/06/2026', estado: 'Ausente' },
        { fecha: '04/06/2026', estado: 'Presente' }
    ];

    return (
        <div className="dashboard-container">

            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mi Asistencia</h2>
                    <p>Registro histórico de asistencia</p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">Asistencia</div>
                    <div
                        className="institucion"
                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                    >
                        92%
                    </div>
                </div>
            </header>

            <div className="card-panel" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="table-custom">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {asistencias.map((a, index) => (
                                <tr key={index}>
                                    <td>{a.fecha}</td>
                                    <td>{a.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default MiAsistencia;