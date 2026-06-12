import React, { useState, useEffect } from 'react';
import { obtenerEstudiantes, crearEstudiante, actualizarEstudianteBD, eliminarEstudianteBD } from '../../services/estudianteService';
import { obtenerCursosReal } from '../../services/academicoService';
import '../../styles/globals.css';

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    
    // Estados para la Edición Inline (Igual que en Usuarios)
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});

    const [nuevoEstudiante, setNuevoEstudiante] = useState({
        rut: '',
        nombres: '',
        apellidos: '',
        email: '',
        fechaNacimiento: '',
        cursoId: ''
    });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const cargarDatos = async () => {
        try {
            const dataEstudiantes = await obtenerEstudiantes();
            const dataCursos = await obtenerCursosReal();
            setEstudiantes(dataEstudiantes || []);
            setCursos(dataCursos || []);
        } catch (error) {
            console.error("Error al cargar datos de estudiantes/cursos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // 🇨🇱 Función para formatear el RUT dinámicamente en tiempo real (xx.xxx.xxx-x)
    const formatearRut = (valor) => {
        if (!valor) return '';
        let limpio = valor.replace(/[^0-9kK]/g, '');
        if (limpio.length === 0) return '';

        let cuerpo = limpio.slice(0, -1);
        let dv = limpio.slice(-1).toUpperCase();

        if (limpio.length === 1) {
            return limpio;
        }

        let cuerpoFormateado = '';
        while (cuerpo.length > 3) {
            cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
            cuerpo = cuerpo.slice(0, -3);
        }
        cuerpoFormateado = cuerpo + cuerpoFormateado;

        return `${cuerpoFormateado}-${dv}`;
    };

    const handleRutChange = (e) => {
        const valorInput = e.target.value;
        const rutFormateado = formatearRut(valorInput);
        setNuevoEstudiante({ ...nuevoEstudiante, rut: rutFormateado });
    };

    const mostrarAlerta = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
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

    // --- Funciones de Control de Edición Inline ---
    const iniciarEdicion = (estudiante) => {
        setEditandoId(estudiante.id);
        setTempData({ 
            ...estudiante,
            // Nos aseguramos que mantenga el estado por defecto o inicial en mayúsculas
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
                cursoId: Number(tempData.cursoId) // Forzar que viaje como número
            };
            
            // Llama a tu servicio pasándole el ID y la data modificada
            const exito = await actualizarEstudianteBD(id, datosAEnviar);
            if (exito) {
                mostrarAlerta("Datos del estudiante actualizados con éxito", "exito");
                setEditandoId(null);
                cargarDatos();
            } else {
                mostrarAlerta("Error al actualizar los datos del estudiante", "error");
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

    const handleMatricular = async (e) => {
        e.preventDefault();
        if (!nuevoEstudiante.rut || !nuevoEstudiante.nombres || !nuevoEstudiante.apellidos || !nuevoEstudiante.cursoId) {
            mostrarAlerta("Por favor, completa los campos obligatorios (RUT, Nombres, Apellidos y Curso)", "error");
            return;
        }

        const payload = {
            ...nuevoEstudiante,
            cursoId: Number(nuevoEstudiante.cursoId),
            estado: 'MATRICULADO' // Por defecto al crearse nuevo
        };

        const exito = await crearEstudiante(payload);
        if (exito) {
            mostrarAlerta("Estudiante matriculado correctamente", "exito");
            setNuevoEstudiante({ rut: '', nombres: '', apellidos: '', email: '', fechaNacimiento: '', cursoId: '' });
            cargarDatos();
        } else {
            mostrarAlerta("Error al procesar la matrícula", "error");
        }
    };

    // Función auxiliar para renderizar los colores de los Badges dinámicamente según el estado
    const obtenerEstiloEstado = (estado) => {
        switch(estado?.toUpperCase()) {
            case 'MATRICULA SUSPENDIDA':
                return { backgroundColor: 'var(--color-peligro)', color: '#fff' };
            case 'MATRICULA PENDIENTE':
                return { backgroundColor: '#f59e0b', color: '#fff' }; // Ámbar / Naranja
            default:
                return { backgroundColor: 'var(--color-primario)', color: '#fff' }; // Azul institucional
        }
    };

    return (
        <div>
            <div className="dashboard-container" style={{ paddingTop: '10px' }}>
                
                <div className="header-app">
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--color-primario)', fontSize: '24px' }}>Matrícula Escolar</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Gestión integrada de estudiantes matriculados</p>
                    </div>
                </div>

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

                {/* Formulario de registro */}
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

                {/* Tabla con Sistema Inline Dinámico */}
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
                                                /* ================= VISTA MODO EDICIÓN ================= */
                                                <>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button onClick={() => guardarCambios(e.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}>
                                                            <i className="fas fa-check" style={{ color: 'var(--color-exito)', fontSize: '16px' }}></i>
                                                        </button>
                                                        <button onClick={cancelarEdicion} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                            <i className="fas fa-times" style={{ color: 'var(--color-peligro)', fontSize: '16px' }}></i>
                                                        </button>
                                                    </td>
                                                    {/* RUT Deshabilitado/Bloqueado tal cual como solicitaste */}
                                                    <td style={{ color: '#94a3b8' }}>{e.rut}</td>
                                                    <td>
                                                        <input value={tempData.nombres} onChange={el => setTempData({...tempData, nombres: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        <input value={tempData.apellidos} onChange={el => setTempData({...tempData, apellidos: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        <input value={tempData.email || ''} onChange={el => setTempData({...tempData, email: el.target.value})} className="input-custom" style={{ padding: '6px' }} />
                                                    </td>
                                                    <td>
                                                        {/* Combobox Dinámico Ordenado para cambiar de curso */}
                                                        <select value={tempData.cursoId} onChange={el => setTempData({...tempData, cursoId: el.target.value})} className="select-custom" style={{ padding: '6px', height: '34px' }}>
                                                            {cursosOrdenados.map((c) => (
                                                                <option key={c.id} value={c.id}>{c.grado}° {c.letra} ({c.nivel})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        {/* Selector de los 3 estados solicitados */}
                                                        <select value={tempData.estado} onChange={el => setTempData({...tempData, estado: el.target.value})} className="select-custom" style={{ padding: '6px', height: '34px' }}>
                                                            <option value="MATRICULADO">MATRICULADO</option>
                                                            <option value="MATRICULA SUSPENDIDA">MATRICULA SUSPENDIDA</option>
                                                            <option value="MATRICULA PENDIENTE">MATRICULA PENDIENTE</option>
                                                        </select>
                                                    </td>
                                                </>
                                            ) : (
                                                /* ================= VISTA MODO LECTURA ================= */
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