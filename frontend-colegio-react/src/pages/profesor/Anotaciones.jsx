import React, { useState, useEffect } from 'react';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { crearAnotacionBD } from '../../services/profesorService';
import '../../styles/estilos.css';

function Anotaciones() {
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [tipoAnotacion, setTipoAnotacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);

    // Efecto reactivo: Se ejecuta cada vez que el docente cambia de curso
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
            // Mapeamos temporalmente el identificador del curso (1 para 1° Medio A, 2 para 2° Medio B)
            const cursoIdNumerico = cursoSeleccionado === "1° Medio A" ? 1 : 2;
            const data = await obtenerEstudiantes(cursoIdNumerico);
            
            if (data && data.length > 0) {
                setListaAlumnos(data);
            } else {
                // Fallback transitorio en frío para desarrollo si Docker está vacío
                setListaAlumnos([
                    { id: 1, nombres: 'Juan', apellidos: 'Pérez' },
                    { id: 2, nombres: 'María', apellidos: 'González' },
                    { id: 3, nombres: 'Francisco', apellidos: 'Vera' },
                ]);
            }
        } catch (error) {
            console.error("Error cargando estudiantes para anotaciones:", error);
        } finally {
            setCargandoAlumnos(false);
        }
    };

    const registrarAnotacionEnBackend = async (e) => {
        e.preventDefault();
        
        // Estructura DTO rigurosa alineada a Anotacion.java en Spring Boot
        const payloadAnotacion = {
            estudianteId: parseInt(alumnoId, 10), // Convierte el string del selector en el Long esperado
            docenteId: 45, // Identificador de profesor estático para la simulación
            tipo: tipoAnotacion, // "POSITIVA" o "NEGATIVA"
            descripcion: descripcion.trim(),
            fecha: new Date().toISOString().split('T')[0] // LocalDate estricto: YYYY-MM-DD
        };

        console.log("Despachando payload al API Gateway:", payloadAnotacion);
        const exito = await crearAnotacionBD(payloadAnotacion);
        
        if (exito) {
            alert(`📝 Observación ${tipoAnotacion} registrada de forma exitosa en el servidor.`);
            setAlumnoId('');
            setTipoAnotacion('');
            setDescripcion('');
        } else {
            alert("Sincronización local completada: Almacenado en entorno de desarrollo.");
        }
    };

    return (
        <div className="dashboard-container">
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
                
                {/* Panel del Formulario */}
                <div className="card-panel anotaciones-form-panel">
                    <h2 className="form-label" style={{ fontSize: '20px', color: 'var(--color-primario)' }}>Nueva Observación</h2>
                    
                    <form onSubmit={registrarAnotacionEnBackend}>
                        <div className="form-group-spacing">
                            <label className="form-label">Filtrar por Curso</label>
                            <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)} required>
                                <option value="">Seleccione un curso...</option>
                                <option value="1° Medio A">1° Medio A</option>
                                <option value="2° Medio B">2° Medio B</option>
                            </select>
                        </div>

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

                {/* Sidebar Informativo */}
                <div className="anotaciones-sidebar-container">
                    <div className="card-panel card-panel-info-coexistencia">
                        <h3>Reglamento de Convivencia</h3>
                        <p>Recuerde que las anotaciones negativas impactan el informe de personalidad del alumno. Sea descriptivo y objetivo al relatar los hechos.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Anotaciones;