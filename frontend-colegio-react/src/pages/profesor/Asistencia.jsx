import React, { useState, useEffect } from 'react';
import { obtenerAsistencias, crearAsistenciaBD, obtenerCursosReal } from '../../services/profesorService';
import { obtenerEstudiantes } from '../../services/estudianteService'; // Necesario para la nómina
import '../../styles/estilos.css';

function Asistencia() {
    const [cursos, setCursos] = useState([]); 
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const cargarCursos = async () => {
            const data = await obtenerCursosReal();
            setCursos(data || []);
        };
        cargarCursos();
    }, []);

    useEffect(() => {
        if (cursoSeleccionado && fecha) {
            cargarAsistenciaReal();
        } else {
            setListaAlumnos([]);
        }
    }, [cursoSeleccionado, fecha]);

    const cargarAsistenciaReal = async () => {
        setCargando(true);
        try {
            // Obtenemos TODAS las asistencias y filtramos
            const historial = await obtenerAsistencias();
            const asistenciasFiltradas = historial.filter(a => a.fecha === fecha && a.cursoId === parseInt(cursoSeleccionado, 10));

            if (asistenciasFiltradas.length > 0) {
                setListaAlumnos(asistenciasFiltradas);
            } else {
                // Si no hay lista para hoy, traemos a los alumnos y los ponemos presentes por defecto
                const nomina = await obtenerEstudiantes(cursoSeleccionado);
                setListaAlumnos(nomina.map(al => ({
                    id: al.id,
                    rut: al.rut,
                    nombres: al.nombres,
                    apellidos: al.apellidos,
                    presente: true 
                })));
            }
        } catch (error) {
            console.error("Error consultando la asistencia al Gateway:", error);
        } finally {
            setCargando(false);
        }
    };

    const conmutarAsistencia = (id) => {
        setListaAlumnos(prev => prev.map(al => 
            al.id === id ? { ...al, presente: !al.presente } : al
        ));
    };

    const guardarAsistenciaEnBackend = async (e) => {
        e.preventDefault();
        let erroresEncontrados = false;

        for (const alumno of listaAlumnos) {
            const dtoAsistencia = {
                fecha: fecha, 
                estudianteId: parseInt(alumno.id, 10), 
                cursoId: parseInt(cursoSeleccionado, 10), 
                presente: alumno.presente, 
                observacion: alumno.presente ? "Clase Regular" : "Inasistencia sin justificar" 
            };

            const guardadoExitoso = await crearAsistenciaBD(dtoAsistencia);
            if (!guardadoExitoso) erroresEncontrados = true;
        }

        if (!erroresEncontrados) {
            alert(`📅 ¡Sincronización Completa! Asistencia enviada.`);
        } else {
            alert("⚠️ Hubo errores al guardar algunos registros.");
        }
    };

    return (
        <div className="dashboard-container">
            {/* ... Header ... */}
            <header className="header-app">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="logo-box">
                         <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                         <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Control de Asistencia Diario</h1>
                         <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Declaración obligatoria de asistencia al aula</p>
                    </div>
                </div>
            </header>

            <section className="card-panel">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label className="form-label">Curso</label>
                        <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
                            <option value="">Seleccione un curso...</option>
                            {/* Renderizamos los cursos dinámicamente */}
                            {cursos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre || `${c.grado} ${c.letra}`}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label className="form-label">Fecha Académica</label>
                        <input type="date" className="input-custom" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                </div>
            </section>

            {/* ... Resto del componente igual ... */}
             {cargando ? (
                <div className="empty-state">⏳ Sincronizando registros con el servidor central...</div>
            ) : cursoSeleccionado ? (
                <form onSubmit={guardarAsistenciaEnBackend} className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                         <table className="table-custom">
                             <thead>
                                 <tr>
                                     <th>Estudiante</th>
                                     <th>RUT</th>
                                     <th style={{ width: '200px', textAlign: 'center' }}>Estado</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {listaAlumnos.map(alumno => (
                                     <tr key={alumno.id}>
                                         <td style={{ fontWeight: '600' }}>{`${alumno.apellidos || ''}, ${alumno.nombres}`}</td>
                                         <td style={{ color: 'var(--color-texto-secundario)' }}>{alumno.rut || 'Sin Rut'}</td>
                                         <td style={{ textAlign: 'center' }}>
                                             <button 
                                                 type="button"
                                                 onClick={() => conmutarAsistencia(alumno.id)}
                                                 style={{
                                                     backgroundColor: alumno.presente ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                     color: alumno.presente ? 'var(--color-exito)' : 'var(--color-peligro)',
                                                     border: `1px solid ${alumno.presente ? 'var(--color-exito)' : 'var(--color-peligro)'}`,
                                                     padding: '8px 20px',
                                                     borderRadius: '20px',
                                                     fontWeight: 'bold',
                                                     cursor: 'pointer',
                                                     fontSize: '14px',
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
                    <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#fafafa', borderTop: '1px solid var(--color-borde)' }}>
                        <button type="submit" className="btn-success">Finalizar Pasar Lista</button>
                    </div>
                </form>
            ) : (
                 <div className="empty-state">💡 Indique el Curso correspondiente para cargar el libro de asistencia.</div>
            )}
        </div>
    );
}

export default Asistencia;