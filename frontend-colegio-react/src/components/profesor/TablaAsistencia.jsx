import React from 'react';
import '../../styles/estilos.css';

function TablaAsistencia({ alumnos, onToggle }) {
    return (
        <div className="table-responsive">
            <table className="table-custom">
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>RUT</th>
                        <th style={{ width: '200px', textAlign: 'center' }}>Estado Presencia</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map(alumno => (
                        <tr key={alumno.id}>
                            <td style={{ fontWeight: '600' }}>{`${alumno.apellidos}, ${alumno.nombres}`}</td>
                            <td style={{ color: 'var(--color-texto-secundario)' }}>{alumno.rut}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button 
                                    type="button"
                                    onClick={() => onToggle(alumno.id)}
                                    style={{
                                        backgroundColor: alumno.presente ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                        color: alumno.presente ? 'var(--color-exito)' : 'var(--color-peligro)',
                                        border: `1px solid ${alumno.presente ? 'var(--color-exito)' : 'var(--color-peligro)'}`,
                                        padding: '8px 22px',
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {alumno.presente ? '● Presente' : '○ Ausente'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaAsistencia;