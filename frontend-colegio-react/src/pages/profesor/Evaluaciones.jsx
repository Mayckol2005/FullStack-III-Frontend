import React, { useState } from 'react';
import '../../styles/estilos.css'; // Importación de estilos globales de la app

function Evaluaciones() {
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');

    // Datos simulados (Mock Data) para desarrollo independiente del Backend
    const alumnosSimulados = [
        { id: 1, rut: '12.345.678-9', nombres: 'Juan', apellidos: 'Pérez', notas: { n1: '5.5', n2: '6.0', n3: '' } },
        { id: 2, rut: '23.456.789-0', nombres: 'María', apellidos: 'González', notas: { n1: '4.0', n2: '3.2', n3: '5.5' } },
        { id: 3, rut: '18.987.654-3', nombres: 'Francisco', apellidos: 'Vera', notas: { n1: '7.0', n2: '6.8', n3: '7.0' } },
    ];

    const [listaAlumnos, setListaAlumnos] = useState(alumnosSimulados);

    const manejarCambioNota = (alumnoId, nCampos, valor) => {
        if (valor !== '' && (parseFloat(valor) < 1.0 || parseFloat(valor) > 7.0)) return;

        setListaAlumnos(prev => prev.map(alumno => {
            if (alumno.id === alumnoId) {
                return {
                    ...alumno,
                    notas: { ...alumno.notas, [nCampos]: valor }
                };
            }
            return alumno;
        }));
    };

    const guardarNotas = (e) => {
        e.preventDefault();
        alert(`Planilla de ${asignaturaSeleccionada} para el curso ${cursoSeleccionado} guardada con éxito. 🚀`);
    };

    return (
        <div className="dashboard-container">
            
            {/* Header Institucional */}
            <header className="header-app">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="logo-box">
                        <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Registro de Calificaciones</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Libro de clases digital - Módulo Docente</p>
                    </div>
                </div>
            </header>

            {/* Filtros de Selección */}
            <section className="card-panel">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label className="form-label">Curso</label>
                        <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                            <option value="">Seleccione un curso...</option>
                            <option value="1° Medio A">1° Medio A</option>
                            <option value="2° Medio B">2° Medio B</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label className="form-label">Asignatura</label>
                        <select className="select-custom" value={asignaturaSeleccionada} onChange={e => setAsignaturaSeleccionada(e.target.value)}>
                            <option value="">Seleccione una asignatura...</option>
                            <option value="Matemáticas">Matemáticas</option>
                            <option value="Historia">Historia</option>
                            <option value="Tecnología">Tecnología</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Renderizado de Planilla Condicional */}
            {cursoSeleccionado && asignaturaSeleccionada ? (
                <form onSubmit={guardarNotas} className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>RUT</th>
                                    <th style={{ width: '110px', textAlign: 'center' }}>Nota 1</th>
                                    <th style={{ width: '110px', textAlign: 'center' }}>Nota 2</th>
                                    <th style={{ width: '110px', textAlign: 'center' }}>Nota 3</th>
                                    <th style={{ width: '130px', textAlign: 'center' }}>Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaAlumnos.map(alumno => {
                                    const notasValidas = [alumno.notas.n1, alumno.notas.n2, alumno.notas.n3].map(Number).filter(n => n > 0);
                                    const promedio = notasValidas.length > 0 
                                        ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1) 
                                        : '-.-';

                                    // Determinar color del promedio según la legislación escolar chilena (azul/rojo)
                                    const colorPromedio = promedio === '-.-' 
                                        ? 'var(--color-texto-secundario)' 
                                        : parseFloat(promedio) >= 4.0 ? 'var(--color-primario)' : 'var(--color-peligro)';

                                    return (
                                        <tr key={alumno.id}>
                                            <td style={{ fontWeight: '600' }}>{`${alumno.apellidos}, ${alumno.nombres}`}</td>
                                            <td style={{ color: 'var(--color-texto-secundario)' }}>{alumno.rut}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n1} onChange={e => manejarCambioNota(alumno.id, 'n1', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n2} onChange={e => manejarCambioNota(alumno.id, 'n2', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n3} onChange={e => manejarCambioNota(alumno.id, 'n3', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: colorPromedio }}>
                                                {promedio}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Botón de Envío del Formulario */}
                    <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fafafa', borderTop: '1px solid var(--color-borde)' }}>
                        <button type="submit" className="btn-success">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            ) : (
                <div className="empty-state">
                    👋 Por favor, seleccione un Curso y Asignatura para desplegar el listado de alumnos.
                </div>
            )}
        </div>
    );
}

export default Evaluaciones;