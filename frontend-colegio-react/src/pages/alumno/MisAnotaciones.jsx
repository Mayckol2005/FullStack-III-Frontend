import React from 'react';
import '../../styles/globals.css';

function MisAnotaciones() {

    const anotaciones = [
        {
            fecha: '05/06/2026',
            tipo: 'POSITIVA',
            descripcion: 'Participación destacada en clases.'
        },
        {
            fecha: '10/06/2026',
            tipo: 'POSITIVA',
            descripcion: 'Entrega puntual de trabajos.'
        }
    ];

    return (
        <div className="dashboard-container">

            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mis Anotaciones</h2>
                    <p>Registro de observaciones académicas</p>
                </div>
            </header>

            <div className="card-panel">

                {anotaciones.map((a, index) => (
                    <div
                        key={index}
                        className="team-card"
                        style={{ marginBottom: '15px' }}
                    >
                        <h4>
                            {a.tipo} - {a.fecha}
                        </h4>

                        <p>
                            {a.descripcion}
                        </p>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default MisAnotaciones;