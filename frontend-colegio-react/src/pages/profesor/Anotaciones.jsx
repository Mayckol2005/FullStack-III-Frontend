import React, { useState, useEffect } from 'react';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { crearAnotacionBD, obtenerCursosReal } from '../../services/profesorService'; 
import '../../styles/estilos.css';

function Anotaciones() {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [tipoAnotacion, setTipoAnotacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);

    useEffect(() => {
        obtenerCursosReal().then(data => setCursos(data || []));
    }, []);

    useEffect(() => {
        if (cursoSeleccionado) {
            cargarAlumnosPorCurso();
        } else {
            setListaAlumnos([]);
            setAlumnoId('');
        }
    }, [cursoSeleccionado]);

    const cargarAlumnosPorCurso = async () => {
        setCargandoAlumnos(true);
        try {
            const data = await obtenerEstudiantes(cursoSeleccionado);
            setListaAlumnos(data || []);
        } finally {
            setCargandoAlumnos(false);
        }
    };

    const registrarAnotacionEnBackend = async (e) => {
        e.preventDefault();
        const profesorId = localStorage.getItem('usuario_id');
        const payload = {
            estudianteId: parseInt(alumnoId, 10),
            docenteId: parseInt(profesorId, 10),
            tipo: tipoAnotacion,
            descripcion: descripcion.trim(),
            fecha: new Date().toISOString().split('T')[0]
        };

        if (await crearAnotacionBD(payload)) {
            alert(`📝 Observación ${tipoAnotacion} registrada exitosamente.`);
            setAlumnoId(''); setTipoAnotacion(''); setDescripcion('');
        } else {
            alert("⚠️ Error al registrar en el servidor.");
        }
    };

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Hoja de Vida & Anotaciones</h2>
                    <p>Registro de comportamiento y observaciones</p>
                </div>
                <div className="docente-banner-meta">
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-label">Positivas (+)</span>
                            <div className="stat-value" style={{ color: '#10b981' }}>0</div>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Negativas (-)</span>
                            <div className="stat-value" style={{ color: '#ef4444' }}>0</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="anotaciones-layout-container">
                <div className="card-panel anotaciones-form-panel">
                    <h2 className="titulo-seccion">Nueva Observación</h2>
                    <form onSubmit={registrarAnotacionEnBackend}>
                        <div className="form-group-spacing">
                            <label className="form-label">Filtrar por Curso</label>
                            <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)} required>
                                <option value="">Seleccione un curso...</option>
                                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre || `${c.grado} ${c.letra}`}</option>)}
                            </select>
                        </div>
                        <div className="form-group-spacing">
                            <label className="form-label">{cargandoAlumnos ? "⏳ Cargando..." : "Estudiante"}</label>
                            <select className="select-custom" value={alumnoId} onChange={e => setAlumnoId(e.target.value)} disabled={!cursoSeleccionado || cargandoAlumnos} required>
                                <option value="">Seleccione al estudiante...</option>
                                {listaAlumnos.map(al => <option key={al.id} value={al.id}>{`${al.apellidos}, ${al.nombres}`}</option>)}
                            </select>
                        </div>
                        <div className="form-group-spacing">
                            <label className="form-label">Tipo de Observación</label>
                            <select className="select-custom" value={tipoAnotacion} onChange={e => setTipoAnotacion(e.target.value)} required>
                                <option value="">Seleccione tipo...</option>
                                <option value="POSITIVA">Positiva</option>
                                <option value="NEGATIVA">Negativa</option>
                            </select>
                        </div>
                        <div className="form-group-spacing">
                            <label className="form-label">Descripción del Suceso</label>
                            <textarea className="input-custom textarea-anotacion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary btn-submit-block">Ingresar al Libro de Vida</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Anotaciones;