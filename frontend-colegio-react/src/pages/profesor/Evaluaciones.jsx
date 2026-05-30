import React, { useState, useEffect } from 'react';
import { crearEvaluacionBD, obtenerCursosReal } from '../../services/profesorService';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { obtenerAsignaturasPorCursoReal } from '../../services/academicoService';
import '../../styles/globals.css'

function Evaluaciones() {
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        obtenerCursosReal().then(data => setCursos(data || []));
    }, []);

    useEffect(() => {
        if (!cursoSeleccionado) return;
        const cargarDatos = async () => {
            setCargando(true);
            const asig = await obtenerAsignaturasPorCursoReal(cursoSeleccionado);
            const ests = await obtenerEstudiantes(cursoSeleccionado);
            setAsignaturas(asig || []);
            setListaAlumnos(ests?.map(e => ({ ...e, notas: { n1: '', n2: '', n3: '' } })) || []);
            setCargando(false);
        };
        cargarDatos();
    }, [cursoSeleccionado]);

    const manejarCambioNota = (id, campo, val) => {
        setListaAlumnos(prev => prev.map(a => a.id === id ? { ...a, notas: { ...a.notas, [campo]: val } } : a));
    };

    const promedioGeneral = listaAlumnos.length > 0 
        ? (listaAlumnos.reduce((acc, a) => {
            const notes = [a.notas.n1, a.notas.n2, a.notas.n3].filter(n => n).map(Number);
            return acc + (notes.length ? notes.reduce((s, n) => s + n, 0) / notes.length : 0);
        }, 0) / listaAlumnos.length).toFixed(1)
        : '-';

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Registro de Calificaciones</h2>
                    <p>Libro de clases digital</p>
                </div>
                <div className="docente-banner-meta">
                    <div className="periodo">Promedio del Curso</div>
                    <div className="institucion" style={{ fontSize: '24px', fontWeight: 'bold' }}>{promedioGeneral}</div>
                </div>
            </header>

            <section className="card-panel">
                <div className="evaluaciones-filter-grid">
                    <div>
                        <label className="form-label">Curso</label>
                        <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                            <option value="">Seleccione curso...</option>
                            {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre || `${c.grado} ${c.letra}`}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Asignatura</label>
                        <select className="select-custom" value={asignaturaSeleccionada} onChange={e => setAsignaturaSeleccionada(e.target.value)}>
                            <option value="">Seleccione asignatura...</option>
                            {asignaturas.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {cargando ? <div className="empty-state">⏳ Cargando...</div> : 
             cursoSeleccionado && listaAlumnos.length > 0 ? (
                <form className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr><th>Estudiante</th><th>RUT</th><th>N1</th><th>N2</th><th>N3</th><th>Promedio</th></tr>
                            </thead>
                            <tbody>
                                {listaAlumnos.map(a => {
                                    const notes = [a.notas.n1, a.notas.n2, a.notas.n3].filter(n => n).map(Number);
                                    const prom = notes.length ? (notes.reduce((s, n) => s + n, 0) / notes.length).toFixed(1) : '-';
                                    return (
                                        <tr key={a.id}>
                                            <td>{a.apellidos}, {a.nombres}</td>
                                            <td>{a.rut}</td>
                                            {['n1','n2','n3'].map(n => (
                                                <td key={n}><input type="number" className="input-nota" value={a.notas[n]} onChange={e => manejarCambioNota(a.id, n, e.target.value)} /></td>
                                            ))}
                                            <td className={prom >= 4 ? 'nota-aprobada' : 'nota-reprobada'}>{prom}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="footer-actions">
                        <button type="button" className="btn-submit">Sincronizar Calificaciones</button>
                    </div>
                </form>
            ) : <div className="empty-state">👋 Seleccione curso y asignatura para visualizar el listado.</div>}
        </div>
    );
}

export default Evaluaciones;