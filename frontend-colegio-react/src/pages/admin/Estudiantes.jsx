import React, { useState, useEffect } from 'react';
import { 
    obtenerEstudiantes, 
    crearEstudiante, 
    actualizarEstudianteBD, 
    eliminarEstudianteBD 
} from '../../services/estudianteService';
import { obtenerCursosReal } from '../../services/academicoService';
import '../../styles/globals.css';

const Estudiantes = () => {
    // --- Estados Principales ---
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // --- Estados para Edición Inline ---
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});

    // --- Estado para Nuevo Estudiante ---
    const estadoInicialNuevo = {
        rut: '',
        nombres: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        cursoId: ''
    };
    const [nuevoEstudiante, setNuevoEstudiante] = useState(estadoInicialNuevo);

    // --- Carga de Datos ---
    const cargarDatos = async () => {
        try {
            const [dataEstudiantes, dataCursos] = await Promise.all([
                obtenerEstudiantes(),
                obtenerCursosReal()
            ]);
            setEstudiantes(dataEstudiantes || []);
            setCursos(dataCursos || []);
        } catch (error) {
            console.error("Error al cargar datos de estudiantes/cursos:", error);
            mostrarAlerta("Error al cargar los datos", "error");
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // --- Utilidades ---
    const mostrarAlerta = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    };

    const formatearRut = (valor) => {
        if (!valor) return '';
        let limpio = valor.replace(/[^0-9kK]/g, '');
        if (limpio.length === 0) return '';

        let cuerpo = limpio.slice(0, -1);
        let dv = limpio.slice(-1).toUpperCase();

        if (limpio.length === 1) return limpio;

        let cuerpoFormateado = '';
        while (cuerpo.length > 3) {
            cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
            cuerpo = cuerpo.slice(0, -3);
        }
        cuerpoFormateado = cuerpo + cuerpoFormateado;

        return `${cuerpoFormateado}-${dv}`;
    };

    const obtenerDetalleCurso = (cursoId) => {
        const curso = cursos.find(c => Number(c.id) === Number(cursoId));
        return curso ? `${curso.grado}° ${curso.letra} (${curso.nivel})` : `Curso #${cursoId}`;
    };

    const cursosOrdenados = [...cursos].sort((a, b) => {
        const numA = parseInt(a.grado) || 0;
        const numB = parseInt(b.grado) || 0;
        if (numA !== numB) return numA - numB;
        return a.letra.localeCompare(b.letra);
    });

    const obtenerEstiloEstado = (estado) => {
        switch(estado?.toUpperCase()) {
            case 'MATRICULA SUSPENDIDA': return { backgroundColor: 'var(--color-peligro)', color: '#fff' };
            case 'MATRICULA PENDIENTE': return { backgroundColor: '#f59e0b', color: '#fff' };
            default: return { backgroundColor: 'var(--color-primario)', color: '#fff' };
        }
    };

    // --- Manejadores de Eventos (Handlers) ---
    const handleRutChange = (e) => {
        const rutFormateado = formatearRut(e.target.value);
        setNuevoEstudiante({ ...nuevoEstudiante, rut: rutFormateado });
    };

    const handleMatricular = async (e) => {
        e.preventDefault();
        const { rut, nombres, apellidos, cursoId } = nuevoEstudiante;
        
        if (!rut || !nombres || !apellidos || !cursoId) {
            mostrarAlerta("Por favor, completa los campos obligatorios (RUT, Nombres, Apellidos y Curso)", "error");
            return;
        }

        const payload = {
            ...nuevoEstudiante,
            cursoId: Number(cursoId),
            estado: 'MATRICULADO' 
        };

        const exito = await crearEstudiante(payload);
        if (exito) {
            mostrarAlerta("Estudiante matriculado correctamente", "exito");
            setNuevoEstudiante(estadoInicialNuevo);
            cargarDatos();
        } else {
            mostrarAlerta("Error al procesar la matrícula", "error");
        }
    };

    // --- Control de Edición Inline ---
    const iniciarEdicion = (estudiante) => {
        setEditandoId(estudiante.id);
        setTempData({ 
            ...estudiante,
            estado: estudiante.estado || 'MATRICULADO' 
        });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setTempData({});
    };

    const guardarCambios = async (id) => {
        if (window.confirm("¿Confirmar modificaciones del estudiante?")) {
            const datosAEnviar = { 
                ...tempData,
                cursoId: Number(tempData.cursoId) 
            };
            
            const exito = await actualizarEstudianteBD(id, datosAEnviar);
            if (exito) {
                mostrarAlerta("Datos actualizados con éxito", "exito");
                setEditandoId(null);
                cargarDatos();
            } else {
                mostrarAlerta("Error al actualizar los datos", "error");
            }
        }
    };

    const eliminarEstudiante = async (id) => {
        if (window.confirm("¿Está seguro que desea eliminar este estudiante?")) {
            const exito = await eliminarEstudianteBD(id);
            if (exito) {
                mostrarAlerta("Estudiante eliminado correctamente", "exito");
                cargarDatos();
            } else {
                mostrarAlerta("Error al intentar eliminar el estudiante", "error");
            }
        }
    };

    return (
        <div>
            <div className="dashboard-container" style={{ paddingTop: '10px' }}>
                
                {/* --- Encabezado --- */}
                <div className="header-app" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--color-primario)', fontSize: '24px' }}>Matrícula Escolar</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Gestión integrada de estudiantes matriculados</p>
                    </div>
                    
                    {/* --- Botón de Navegación Corregido --- */}
                    <button 
                        onClick={() => window.location.href = '/home'}
                        style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            height: 'fit-content'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#94a3b8';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                    >
                        <i className="fas fa-home" style={{ color: 'var(--color-primario)' }}></i> 
                        Menú principal
                    </button>
                </div>

                {/* --- Alertas --- */}
                {mensaje.texto && (
                    <div className="card-panel" style={{ 
                        backgroundColor: mensaje.tipo === 'exito' ? '#e6f4ea' : '#fce8e6', 
                        color: mensaje.tipo === 'exito' ? '#137333' : '#c5221f',
                        padding: '12px 20px', 
                        marginBottom: '15px', 
                        fontWeight: '600' 
                    }}>
                        {mensaje.texto}
                    </div>
                )}

                {/* --- Formulario de Registro --- */}
                <div className="card-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Matricular Alumno</h3>
                    <form onSubmit={handleMatricular} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <input type="text" placeholder="RUT (ej: 12.345.678-9)" value={nuevoEstudiante.rut} onChange={handleRutChange} maxLength={12} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="text" placeholder="Nombres" value={nuevoEstudiante.nombres} onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombres: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="text" placeholder="Apellidos" value={nuevoEstudiante.apellidos} onChange={e => setNuevoEstudiante({...nuevoEstudiante, apellidos: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '160px' }}>
                            <input type="email" placeholder="Email Alumno" value={nuevoEstudiante.email} onChange={e => setNuevoEstudiante({...nuevoEstudiante, email: e.target.value})} className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <input type="date" value={nuevoEstudiante.fechaNacimiento} onChange={e => setNuevoEstudiante({...nuevoEstudiante, fechaNacimiento: e.target.value})} className="input-custom" style={{ height: '42px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ minWidth: '180px', flex: 1 }}>
                            <select value={nuevoEstudiante.cursoId} onChange={e => setNuevoEstudiante({...nuevoEstudiante, cursoId: e.target.value})} required className="select-custom">
                                <option value="">Asignar Curso...</option>
                                {cursosOrdenados.map((c) => (
                                    <option key={c.id} value={c.id}>{c.grado}° {c.letra} ({c.nivel})</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-success" style={{ padding: '12px 24px' }}>Matricular</button>
                    </form>
                </div>

                {/* --- Tabla Dinámica --- */}
                <div className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th style={{ width: '130px', textAlign: 'center' }}>Acciones</th>
                                    <th>RUT</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Email</th>
                                    <th>Curso</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-texto-secundario)' }}>
                                            No hay estudiantes matriculados.
                                        </td>
                                    </tr>
                                ) : (
                                    estudiantes.map((e) => (
                                        <tr key={e.id}>
                                            {editandoId === e.id ? (
                                                /* --- MODO EDICIÓN --- */
                                                <>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button onClick={() => guardarCambios(e.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>
                                                            <i className="fas fa-check" style={{ color: 'var(--color-exito)', fontSize: '16px' }}></i>
                                                        </button>
                                                        <button onClick={cancelarEdicion} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                            <i className="fas fa-times" style={{ color: 'var(--color-peligro)', fontSize: '16px' }}></i>
                                                        </button>
                                                    </td>
                                                    <td style={{ color: '#94a3b8' }}>{e.rut}</td>
                                                    <td>
                                                        <input value={tempData.nombres || ''} onChange={el => setTempData({...tempData, nombres: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        <input value={tempData.apellidos || ''} onChange={el => setTempData({...tempData, apellidos: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        <input value={tempData.email || ''} onChange={el => setTempData({...tempData, email: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        <select value={tempData.cursoId || ''} onChange={el => setTempData({...tempData, cursoId: el.target.value})} className="select-custom" style={{ padding: '6px', height: '34px' }}>
                                                            {cursosOrdenados.map((c) => (
                                                                <option key={c.id} value={c.id}>{c.grado}° {c.letra} ({c.nivel})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select value={tempData.estado || ''} onChange={el => setTempData({...tempData, estado: el.target.value})} className="select-custom" style={{ padding: '6px', height: '34px' }}>
                                                            <option value="MATRICULADO">MATRICULADO</option>
                                                            <option value="MATRICULA SUSPENDIDA">MATRICULA SUSPENDIDA</option>
                                                            <option value="MATRICULA PENDIENTE">MATRICULA PENDIENTE</option>
                                                        </select>
                                                    </td>
                                                </>
                                            ) : (
                                                /* --- MODO LECTURA --- */
                                                <>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button onClick={() => iniciarEdicion(e)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>
                                                            <i className="fas fa-pencil-alt" style={{ color: 'var(--color-primario)' }}></i>
                                                        </button>
                                                        <button onClick={() => eliminarEstudiante(e.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                            <i className="fas fa-trash" style={{ color: 'var(--color-peligro)' }}></i>
                                                        </button>
                                                    </td>
                                                    <td style={{ color: 'var(--color-texto-secundario)' }}>{e.rut}</td>
                                                    <td style={{ fontWeight: '600' }}>{e.nombres}</td>
                                                    <td>{e.apellidos}</td>
                                                    <td>{e.email || 'N/A'}</td>
                                                    <td style={{ color: 'var(--color-primario)', fontWeight: 'bold' }}>
                                                        {obtenerDetalleCurso(e.cursoId)}
                                                    </td>
                                                    <td>
                                                        <span className="btn-primary" style={{ 
                                                            padding: '3px 10px', 
                                                            borderRadius: '10px', 
                                                            fontSize: '11px', 
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 'bold',
                                                            ...obtenerEstiloEstado(e.estado)
                                                        }}>
                                                            {e.estado || 'MATRICULADO'}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Estudiantes;