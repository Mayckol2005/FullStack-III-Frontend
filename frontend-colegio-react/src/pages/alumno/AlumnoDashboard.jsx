import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient'; 
import '../../styles/globals.css';

function AlumnoDashboard() {
    const navigate = useNavigate();

    const [nombreAlumno, setNombreAlumno] = useState("Cargando...");
    const [cursoAlumno, setCursoAlumno] = useState("Cargando curso...");
    const [periodoAlumno, setPeriodoAlumno] = useState("Año Escolar 2026");
    
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [asistencia, setAsistencia] = useState([]);
    const [anotaciones, setAnotaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatosDashboard = async () => {
            const usuarioId = localStorage.getItem('usuario_id');
            const usuarioEmail = localStorage.getItem('usuario_email');
            const nombreLocal = localStorage.getItem('usuario_nombre');
            
            if (nombreLocal) setNombreAlumno(nombreLocal);

            if (!usuarioId && !usuarioEmail) {
                console.warn("No se encontró identificación del usuario en el almacenamiento local.");
                setCargando(false);
                return;
            }

            try {
                const endpointEstudiante = usuarioEmail
                    ? `/estudiantes/buscar-por-email?email=${encodeURIComponent(usuarioEmail)}`
                    : `/estudiantes/${usuarioId}`;

                const datosEstudiante = await apiClient(endpointEstudiante);
                const estudianteId = datosEstudiante?.id || usuarioId;

                const [resNotas, resAsistencia, resAnotaciones] = await Promise.allSettled([
                    apiClient(`/evaluaciones/estudiante/${estudianteId}`),
                    apiClient(`/asistencia/estudiante/${estudianteId}`),
                    apiClient(`/anotaciones/estudiante/${estudianteId}`)
                ]);

                console.log("Backend respondió con éxito. Datos recibidos del estudiante:", datosEstudiante);

                if (typeof datosEstudiante.curso === 'string') {
                    setCursoAlumno(datosEstudiante.curso);
                } else if (datosEstudiante.curso?.nombre) {
                    setCursoAlumno(datosEstudiante.curso.nombre);
                } else if (datosEstudiante.nombreCurso) {
                    setCursoAlumno(datosEstudiante.nombreCurso);
                } else if (datosEstudiante.matricula?.curso?.nombre) {
                    setCursoAlumno(datosEstudiante.matricula.curso.nombre);
                } else if (datosEstudiante.cursoId) {
                    setCursoAlumno(`Curso #${datosEstudiante.cursoId}`);
                } else {
                    setCursoAlumno("No asignado");
                }

                // Asignación de Evaluaciones 
                if (resNotas.status === 'fulfilled' && resNotas.value) {
                    setEvaluaciones(resNotas.value || []);
                }

                // Asignación de Asistencia
                if (resAsistencia.status === 'fulfilled' && resAsistencia.value) {
                    setAsistencia(resAsistencia.value || []);
                }

                // Asignación de Anotaciones
                if (resAnotaciones.status === 'fulfilled' && resAnotaciones.value) {
                    setAnotaciones(resAnotaciones.value || []);
                }

            } catch (error) {
                console.error("Error crítico al inicializar los datos del dashboard:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatosDashboard();
    }, []);

    // 3. Lógica matemática adaptable para procesar los datos cuando aparezcan
    const mostrarPromedio = () => {
        if (!evaluaciones || evaluaciones.length === 0) return "Sin calificaciones";
        
        let sumaNotas = 0;
        let totalNotas = 0;

        evaluaciones.forEach(ev => {
            if (ev.nota && ev.nota > 0) {
                sumaNotas += ev.nota;
                totalNotas++;
            } else {
                if (ev.nota1 && ev.nota1 > 0) { sumaNotas += ev.nota1; totalNotas++; }
                if (ev.nota2 && ev.nota2 > 0) { sumaNotas += ev.nota2; totalNotas++; }
                if (ev.nota3 && ev.nota3 > 0) { sumaNotas += ev.nota3; totalNotas++; }
            }
        });

        if (totalNotas === 0) return "Sin calificaciones";
        return (sumaNotas / totalNotas).toFixed(1);
    };

    const mostrarAsistencia = () => {
        if (!asistencia || asistencia.length === 0) return "Sin registros";
        
        const diasPresente = asistencia.filter(a => a.presente || a.estado === 'PRESENTE').length;
        const porcentaje = (diasPresente / asistencia.length) * 100;
        return `${porcentaje.toFixed(0)}%`;
    };

    const mostrarAnotaciones = () => {
        if (!anotaciones || anotaciones.length === 0) return "0 registros";
        return `${anotaciones.length} ${anotaciones.length === 1 ? 'registro' : 'registros'}`;
    };

    return (
        <div className="dashboard-container">

            <div className="docente-banner">
                <div className="docente-banner-info">
                    <h2>¡Bienvenido(a), {nombreAlumno}!</h2>
                    <p>
                        🎓 <strong>Curso:</strong> {cursoAlumno} {/* 👈 Curso dinámico desde la BD */}
                    </p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        {periodoAlumno}
                    </div>

                    <div className="institucion">
                        Colegio Bernardo O'Higgins
                    </div>
                </div>
            </div>

            <div className="anotaciones-layout-container">

                <div className="card-panel anotaciones-form-panel">
                    <h3
                        style={{
                            color: 'var(--color-primario)',
                            marginTop: 0
                        }}
                    >
                        📚 Resumen Académico
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >
                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/notas')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📊 Promedio General</h4>
                            <p>{cargando ? "Cargando..." : mostrarPromedio()}</p>
                        </div>

                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/asistencia')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📅 Asistencia</h4>
                            <p>{cargando ? "Cargando..." : mostrarAsistencia()}</p>
                        </div>

                        <div
                            className="team-card"
                            onClick={() => navigate('/alumno/anotaciones')}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>📝 Anotaciones</h4>
                            <p>{cargando ? "Cargando..." : mostrarAnotaciones()}</p>
                        </div>

                    </div>
                </div>

                <div className="card-panel anotaciones-sidebar-container">
                    <h3>⚡ Acceso Rápido</h3>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--color-texto-secundario)'
                        }}
                    >
                        Consulta tu información académica:
                    </p>

                    <div className="quick-actions-box">

                        <button
                            className="btn-action-quick btn-action-evaluacion"
                            onClick={() => navigate('/alumno/notas')}
                        >
                            📊 Ver Mis Notas
                        </button>

                        <button
                            className="btn-action-quick btn-action-asistencia"
                            onClick={() => navigate('/alumno/asistencia')}
                        >
                            📅 Ver Asistencia
                        </button>

                        <button
                            className="btn-action-quick btn-action-anotacion"
                            onClick={() => navigate('/alumno/anotaciones')}
                        >
                            📝 Ver Anotaciones
                        </button>

                    </div>

                    <div
                        className="card-panel card-panel-info-coexistencia"
                        style={{ marginTop: '20px' }}
                    >
                        <h3>Información</h3>

                        <p>
                            Desde este portal podrás consultar tus notas,
                            asistencia y observaciones registradas por tus
                            profesores.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AlumnoDashboard;
