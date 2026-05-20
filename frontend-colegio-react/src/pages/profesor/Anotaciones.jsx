import React, { useState, useEffect } from 'react';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { crearAnotacionBD, obtenerCursosReal } from '../../services/profesorService'; 
import '../../styles/estilos.css';

function Anotaciones() {
    const [cursos, setCursos] = useState([]); // Estado para cursos de la BD
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [tipoAnotacion, setTipoAnotacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);

    // Cargar los cursos al montar el componente
    useEffect(() => {
        const cargarCursos = async () => {
            const data = await obtenerCursosReal();
            setCursos(data || []);
        };
        cargarCursos();
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
            if (data && data.length > 0) {
                setListaAlumnos(data);
            } else {
                setListaAlumnos([]); 
            }
        } catch (error) {
            console.error("Error cargando estudiantes para anotaciones:", error);
        } finally {
            setCargandoAlumnos(false);
        }
    };

    const registrarAnotacionEnBackend = async (e) => {
        e.preventDefault();
        
        const profesorIdLocal = localStorage.getItem('usuario_id');
        if (!profesorIdLocal) {
             alert("Error: No se encontró el ID del profesor en sesión.");
             return;
        }

        const payloadAnotacion = {
            estudianteId: parseInt(alumnoId, 10),
            docenteId: parseInt(profesorIdLocal, 10), // ¡Dinámico!
            tipo: tipoAnotacion,
            descripcion: descripcion.trim(),
            fecha: new Date().toISOString().split('T')[0]
        };

        const exito = await crearAnotacionBD(payloadAnotacion);
        
        if (exito) {
            alert(`📝 Observación ${tipoAnotacion} registrada de forma exitosa en el servidor.`);
            setAlumnoId('');
            setTipoAnotacion('');
            setDescripcion('');
        } else {
            alert("⚠️ Error al registrar en el servidor central.");
        }
    };

    return (
        <div className="dashboard-container">
            {/* ... Header ... */}
            <header className="header-app">
                <div className="landing-nav-brand">
                    <div className="logo-box">
                        <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Hoja de Vida & Anotaciones</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Registro de comportamiento y observaciones del estudiante</p>
                    </div>
                </div>
            </header>

            <div className="anotaciones-layout-container">
                <div className="card-panel anotaciones-form-panel">
                    <h2 className="form-label" style={{ fontSize: '20px', color: 'var(--color-primario)' }}>Nueva Observación</h2>
                    
                    <form onSubmit={registrarAnotacionEnBackend}>
                        <div className="form-group-spacing">
                            <label className="form-label">Filtrar por Curso</label>
                            <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)} required>
                                <option value="">Seleccione un curso...</option>
                                {/* Renderizamos los cursos dinámicamente */}
                                {cursos.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre || `${c.grado} ${c.letra}`}</option>
                                ))}
                            </select>
                        </div>

                        {/* ... Resto del formulario (Estudiante, Tipo, Textarea) queda igual ... */}
                         <div className="form-group-spacing">
                            <label className="form-label">
                                {cargandoAlumnos ? "⏳ Cargando estudiantes..." : "Estudiante"}
                            </label>
                            <select className="select-custom" value={alumnoId} onChange={e => setAlumnoId(e.target.value)} disabled={!cursoSeleccionado || cargandoAlumnos} required>
                                <option value="">Seleccione al estudiante...</option>
                                {listaAlumnos.map(al => (
                                    <option key={al.id} value={al.id}>{`${al.apellidos || ''}, ${al.nombres}`}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group-spacing">
                            <label className="form-label">Tipo de Observación</label>
                            <select className="select-custom" value={tipoAnotacion} onChange={e => setTipoAnotacion(e.target.value)} required>
                                <option value="">Seleccione tipo...</option>
                                <option value="POSITIVA">Positiva (Destaca en clases / Colaboración)</option>
                                <option value="NEGATIVA">Negativa (Incumplimiento / Falta de respeto)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '22px' }}>
                            <label className="form-label">Descripción del Suceso</label>
                            <textarea className="input-custom textarea-anotacion" placeholder="Escriba detalladamente el comportamiento u observación..." value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary btn-submit-block">Ingresar al Libro de Vida</button>
                    </form>
                </div>
                {/* ... Sidebar Informativo ... */}
            </div>
        </div>
    );
}

export default Anotaciones;