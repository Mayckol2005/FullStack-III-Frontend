import React, { useState, useEffect } from 'react';
import { obtenerNotasAlumnoActual } from '../../services/alumnoService';
import '../../styles/globals.css';

function MisNotas() {
    const [notas, setNotas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarNotas = async () => {
            try {
                const data = await obtenerNotasAlumnoActual();
                setNotas(data);
            } catch (err) {
                console.error('Error cargando notas del alumno:', err);
                setError('No se pudieron cargar las calificaciones registradas.');
            } finally {
                setCargando(false);
            }
        };

        cargarNotas();
    }, []);

    // Cálculo básico de promedio general 
    const calcularPromedioGeneral = () => {
        if (notas.length === 0) return "0.0";
        let suma = 0;
        let cantidad = 0;
        notas.forEach(n => {
            if(n.n1) { suma += n.n1; cantidad++; }
            if(n.n2) { suma += n.n2; cantidad++; }
            if(n.n3) { suma += n.n3; cantidad++; }
        });
        return cantidad === 0 ? "0.0" : (suma / cantidad).toFixed(1);
    };

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Mis Calificaciones</h2>
                    <p>Consulta de rendimiento académico</p>
                </div>
                <div className="docente-banner-meta">
                    <div className="periodo">Promedio General</div>
                    <div className="institucion" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {calcularPromedioGeneral()}
                    </div>
                </div>
            </header>

            <div className="card-panel" style={{ padding: 0 }}>
                {cargando ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Cargando notas... ⏳</div>
                ) : error ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-peligro)' }}>
                        {error}
                    </div>
                ) : (
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
                                {notas.length > 0 ? (
                                    notas.map((n, index) => (
                                        <tr key={index}>
                                            <td>{n.asignatura || 'Sin Asignatura'}</td>
                                            <td>{n.n1 || '-'}</td>
                                            <td>{n.n2 || '-'}</td>
                                            <td>{n.n3 || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>No hay calificaciones registradas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MisNotas;
