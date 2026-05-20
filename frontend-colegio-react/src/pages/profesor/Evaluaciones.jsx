import React, { useState, useEffect } from 'react';
import { crearEvaluacionBD, obtenerCursosReal } from '../../services/profesorService';
import { obtenerEstudiantes } from '../../services/estudianteService';
import { obtenerAsignaturasPorCursoReal } from '../../services/academicoService';
import '../../styles/estilos.css';

function Evaluaciones() {
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. Cargar cursos
    useEffect(() => {
        const cargarCursosIniciales = async () => {
            const dataCursos = await obtenerCursosReal();
            setCursos(dataCursos || []);
        };
        cargarCursosIniciales();
    }, []);

    // 2. Cargar asignaturas y alumnos cuando cambia el curso
    useEffect(() => {
        if (cursoSeleccionado) {
            const cargarDatosDelCurso = async () => {
                const dataAsig = await obtenerAsignaturasPorCursoReal(cursoSeleccionado);
                setAsignaturas(dataAsig || []);

                setCargando(true);
                try {
                    const dataEstudiantes = await obtenerEstudiantes(cursoSeleccionado);
                    if (dataEstudiantes && dataEstudiantes.length > 0) {
                        const estudiantesConNotas = dataEstudiantes.map(est => ({
                            id: est.id,
                            rut: est.rut || 'Sin RUT',
                            nombres: est.nombres,
                            apellidos: est.apellidos,
                            notas: { n1: '', n2: '', n3: '' } 
                        }));
                        setListaAlumnos(estudiantesConNotas);
                    } else {
                        setListaAlumnos([]); 
                    }
                } catch (error) {
                    console.error("Error conectando con estudiante-service:", error);
                    setListaAlumnos([]);
                } finally {
                    setCargando(false);
                }
            };
            cargarDatosDelCurso();
        } else {
            setAsignaturas([]);
            setListaAlumnos([]);
            setAsignaturaSeleccionada('');
        }
    }, [cursoSeleccionado]);

    const manejarCambioNota = (alumnoId, nCampos, valor) => {
        if (valor !== '' && (parseFloat(valor) < 1.0 || parseFloat(valor) > 7.0)) return;
        setListaAlumnos(prev => prev.map(alumno => {
            if (alumno.id === alumnoId) {
                return { ...alumno, notas: { ...alumno.notas, [nCampos]: valor } };
            }
            return alumno;
        }));
    };

    const guardarNotasEnBackend = async (e) => {
        e.preventDefault();
        if (!asignaturaSeleccionada) {
            alert("Por favor seleccione una asignatura.");
            return;
        }

        let erroresEncontrados = false;

        for (const alumno of listaAlumnos) {
            const arrayNotas = [alumno.notas.n1, alumno.notas.n2, alumno.notas.n3];

            for (const notaTexto of arrayNotas) {
                if (notaTexto !== '' && notaTexto !== undefined) {
                    const dtoEvaluacion = {
                        estudianteId: parseInt(alumno.id, 10),
                        asignatura: asignaturaSeleccionada, 
                        nota: parseFloat(notaTexto)
                    };
                    const exito = await crearEvaluacionBD(dtoEvaluacion);
                    if (!exito) erroresEncontrados = true;
                }
            }
        }

        if (!erroresEncontrados) {
            alert(`🚀 ¡Sincronización Transaccional Exitosa! Calificaciones procesadas mediante el API Gateway.`);
        } else {
            alert("⚠️ Ocurrieron errores al intentar guardar algunas calificaciones.");
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
                        <h1 className="form-label" style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Registro de Calificaciones</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Libro de clases digital - Módulo Docente</p>
                    </div>
                </div>
            </header>

            <section className="card-panel">
                <div className="evaluaciones-filter-grid">
                    <div className="evaluaciones-filter-item">
                        <label className="form-label">Curso</label>
                        <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                            <option value="">Seleccione un curso...</option>
                            {cursos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre || `${c.grado} ${c.letra}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="evaluaciones-filter-item">
                        <label className="form-label">Asignatura</label>
                        <select className="select-custom" value={asignaturaSeleccionada} onChange={e => setAsignaturaSeleccionada(e.target.value)} disabled={!cursoSeleccionado || asignaturas.length === 0}>
                            <option value="">{asignaturas.length === 0 ? "No hay asignaturas..." : "Seleccione una asignatura..."}</option>
                            {asignaturas.map(a => (
                                <option key={a.id} value={a.nombre}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {cargando ? (
                <div className="empty-state">⏳ Sincronizando datos transaccionales con el API Gateway...</div>
            ) : cursoSeleccionado && asignaturaSeleccionada && listaAlumnos.length > 0 ? (
                /* CORRECCIÓN DE UX: Se eliminó el padding: 0 para que no choque y se le dio estructura limpia */
                <form onSubmit={guardarNotasEnBackend} className="card-panel" style={{ padding: '0px', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>RUT</th>
                                    <th style={{ textAlign: 'center' }}>Nota 1</th>
                                    <th style={{ textAlign: 'center' }}>Nota 2</th>
                                    <th style={{ textAlign: 'center' }}>Nota 3</th>
                                    <th style={{ textAlign: 'center' }}>Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaAlumnos.map(alumno => {
                                    const notasValidas = [alumno.notas.n1, alumno.notas.n2, alumno.notas.n3].map(Number).filter(n => n > 0);
                                    const promedio = notasValidas.length > 0 ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1) : '-.-';
                                    
                                    const claseColorPromedio = promedio === '-.-' 
                                        ? 'nota-vacia' 
                                        : parseFloat(promedio) >= 4.0 
                                            ? 'nota-aprobada' 
                                            : 'nota-reprobada';

                                    return (
                                        <tr key={alumno.id}>
                                            <td style={{ fontWeight: '600' }}>{`${alumno.apellidos || ''}, ${alumno.nombres}`}</td>
                                            <td style={{ color: 'var(--color-texto-secundario)' }}>{alumno.rut || 'Sin RUT'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n1} onChange={e => manejarCambioNota(alumno.id, 'n1', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n2} onChange={e => manejarCambioNota(alumno.id, 'n2', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type="number" step="0.1" min="1.0" max="7.0" className="input-nota" value={alumno.notas.n3} onChange={e => manejarCambioNota(alumno.id, 'n3', e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: 'center' }} className={claseColorPromedio}>{promedio}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* CORRECCIÓN: Contenedor tipo footer, idéntico al de Asistencia, empujando el botón azul a la derecha */}
                    <div style={{ 
                        padding: '20px 30px', 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        backgroundColor: '#fafafa', 
                        borderTop: '1px solid var(--color-borde)' 
                    }}>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            style={{ 
                                width: 'auto', 
                                padding: '10px 24px',
                                backgroundColor: 'var(--color-primario)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-custom)',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Sincronizar Calificaciones
                        </button>
                    </div>
                </form>
            ) : cursoSeleccionado && asignaturaSeleccionada && listaAlumnos.length === 0 ? (
                <div className="empty-state">⚠️ El curso seleccionado no registra estudiantes matriculados.</div>
            ) : (
                <div className="empty-state">👋 Por favor, seleccione un Curso y Asignatura para desplegar el listado de alumnos.</div>
            )}
        </div>
    );
}

export default Evaluaciones;