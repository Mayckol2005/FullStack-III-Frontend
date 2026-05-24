import React, { useState, useEffect } from 'react';
import { obtenerAsistencias, crearAsistenciaBD, obtenerCursosReal } from '../../services/profesorService';
import { obtenerEstudiantes } from '../../services/estudianteService';
import '../../styles/estilos.css';

function Asistencia() {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        obtenerCursosReal().then(data => setCursos(data || []));
    }, []);

    useEffect(() => {
        if (cursoSeleccionado && fecha) cargarAsistencia();
    }, [cursoSeleccionado, fecha]);

    const cargarAsistencia = async () => {
        setCargando(true);
        try {
            const historial = await obtenerAsistencias();
            const filtradas = historial.filter(a => a.fecha === fecha && a.cursoId === parseInt(cursoSeleccionado, 10));
            
            if (filtradas.length > 0) {
                setListaAlumnos(filtradas);
            } else {
                const nomina = await obtenerEstudiantes(cursoSeleccionado);
                setListaAlumnos(nomina.map(al => ({ ...al, presente: true })));
            }
        } catch (error) {
            setListaAlumnos([]);
        } finally {
            setCargando(false);
        }
    };

    const conmutarAsistencia = (id) => {
        setListaAlumnos(prev => prev.map(al => al.id === id ? { ...al, presente: !al.presente } : al));
    };

    // KPI: Porcentaje de asistencia en tiempo real
    const porcentajeAsistencia = listaAlumnos.length > 0 
        ? ((listaAlumnos.filter(a => a.presente).length / listaAlumnos.length) * 100).toFixed(0) 
        : 0;

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Control de Asistencia Diario</h2>
                    <p>Declaración obligatoria de asistencia</p>
                </div>
                <div className="docente-banner-meta">
                    <div className="periodo">Asistencia Hoy</div>
                    <div className="institucion" style={{ fontSize: '24px', fontWeight: 'bold' }}>{porcentajeAsistencia}%</div>
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
                        <label className="form-label">Fecha Académica</label>
                        <input type="date" className="input-custom" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                </div>
            </section>

            {cargando ? <div className="empty-state">⏳ Sincronizando registros con el servidor...</div> : 
             cursoSeleccionado ? (
                <form className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>RUT</th>
                                    <th style={{textAlign:'center'}}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaAlumnos.map(al => (
                                    <tr key={al.id}>
                                        <td style={{fontWeight: '600'}}>{al.apellidos}, {al.nombres}</td>
                                        <td>{al.rut || 'Sin Rut'}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <button 
                                                type="button" 
                                                onClick={() => conmutarAsistencia(al.id)} 
                                                className={`btn-estado ${al.presente ? 'btn-presente' : 'btn-ausente'}`}
                                            >
                                                {al.presente ? '● Presente' : '○ Ausente'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="footer-actions">
                        <button type="submit" className="btn-success">Finalizar Pasar Lista</button>
                    </div>
                </form>
            ) : <div className="empty-state">💡 Seleccione un curso para gestionar el libro de asistencia.</div>}
        </div>
    );
}

export default Asistencia;