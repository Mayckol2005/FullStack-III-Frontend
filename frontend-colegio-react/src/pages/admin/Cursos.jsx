import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate
import { obtenerCursosReal, crearCurso, obtenerAsignaturas, crearAsignatura, actualizarAsignatura, eliminarAsignatura } from '../../services/academicoService';
import { obtenerUsuarios } from '../../services/usuarioService';
import '../../styles/globals.css';

const Cursos = () => {
    // Estados para almacenar la información de la base de datos
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [docentes, setDocentes] = useState([]);

    // Estados para controlar los inputs de los formularios
    const [nuevoCurso, setNuevoCurso] = useState({ grado: '', letra: '', nivel: '' });
    const [nuevaAsignatura, setNuevaAsignatura] = useState({ nombre: '', cursoId: '', docenteId: '' });

    // Estado para saber si estamos editando una asignatura
    const [asignaturaEditando, setAsignaturaEditando] = useState(null);

    // Estado para las alertas visuales
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // 2. Inicializamos el hook de navegación
    const navigate = useNavigate();

    // Cargar información desde los microservicios
    const cargarDatos = async () => {
        try {
            const listaCursos = await obtenerCursosReal();
            const listaAsignaturas = await obtenerAsignaturas();
            const listaUsuarios = await obtenerUsuarios(); 
            
            const listaDocentes = Array.isArray(listaUsuarios) 
                ? listaUsuarios.filter(u => u.rol === 'PROFESOR' || u.rol === 'DOCENTE' || !u.rol) 
                : listaUsuarios || [];

            setCursos(listaCursos || []);
            setAsignaturas(listaAsignaturas || []);
            setDocentes(listaDocentes || []);
        } catch (error) {
            console.error("Error al cargar datos en Cursos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Desplegar alertas temporales
    const mostrarAlerta = (texto, tipo) => {
        setMensaje({ texto, tipo });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
    };

    // Nombre del docente sin emojis
    const obtenerNombreDocente = (docenteId) => {
        const docente = docentes.find(d => Number(d.id) === Number(docenteId));
        return docente ? `${docente.nombre} ${docente.apellido || ''}`.trim() : `Desconocido (ID: ${docenteId})`;
    };

    // Detalle del curso sin emojis
    const obtenerDetalleCurso = (cursoId) => {
        const curso = cursos.find(c => Number(c.id) === Number(cursoId));
        return curso ? `${curso.grado}° ${curso.letra} (${curso.nivel})` : `Curso #${cursoId}`;
    };

    // INTEGRACIÓN CLAVE: Lógica de ordenamiento antes del renderizado (De menor a mayor)
    const cursosOrdenados = [...cursos].sort((a, b) => {
        const numA = parseInt(a.grado) || 0;
        const numB = parseInt(b.grado) || 0;
        if (numA !== numB) return numA - numB;
        return a.letra.localeCompare(b.letra);
    });

    // Manejar el registro de un nuevo Curso con control de duplicados
    const handleCrearCurso = async (e) => {
        e.preventDefault();
        
        if (!nuevoCurso.grado || !nuevoCurso.letra || !nuevoCurso.nivel) {
            return mostrarAlerta("Por favor, completa todos los campos del curso.", "error");
        }
        
        const cursoDuplicado = cursos.some(c => 
            c.grado.trim().toLowerCase() === nuevoCurso.grado.trim().toLowerCase() &&
            c.letra.trim().toLowerCase() === nuevoCurso.letra.trim().toLowerCase() &&
            c.nivel.trim().toLowerCase() === nuevoCurso.nivel.trim().toLowerCase()
        );

        if (cursoDuplicado) {
            return mostrarAlerta(`¡Atención! El curso "${nuevoCurso.grado}° ${nuevoCurso.letra}" de Educación ${nuevoCurso.nivel} ya está creado y no se puede repetir.`, "error");
        }
        
        const exito = await crearCurso(nuevoCurso);
        if (exito) {
            mostrarAlerta(`Curso ${nuevoCurso.grado}° ${nuevoCurso.letra} registrado con éxito`, "exito");
            setNuevoCurso({ grado: '', letra: '', nivel: '' });
            cargarDatos();
        } else {
            mostrarAlerta("Error al guardar el curso en el servidor", "error");
        }
    };

    // Preparar el formulario para editar Asignatura
    const iniciarEdicionAsignatura = (asignatura) => {
        setAsignaturaEditando(asignatura.id);
        setNuevaAsignatura({
            nombre: asignatura.nombre,
            cursoId: asignatura.cursoId,
            docenteId: asignatura.docenteId
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al formulario
    };

    // Cancelar la edición de Asignatura
    const cancelarEdicion = () => {
        setAsignaturaEditando(null);
        setNuevaAsignatura({ nombre: '', cursoId: '', docenteId: '' });
    };

    // Eliminar asignatura con confirmación
    const handleEliminarAsignatura = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la asignatura "${nombre}"? Esta acción no se puede deshacer.`)) {
            const exito = await eliminarAsignatura(id);
            if (exito) {
                mostrarAlerta(`Asignatura "${nombre}" eliminada correctamente.`, "exito");
                cargarDatos();
            } else {
                mostrarAlerta("Error al eliminar la asignatura.", "error");
            }
        }
    };

    // Manejar el registro o actualización de una Asignatura
    const handleGuardarAsignatura = async (e) => {
        e.preventDefault();
        if (!nuevaAsignatura.nombre || !nuevaAsignatura.cursoId || !nuevaAsignatura.docenteId) {
            return mostrarAlerta("Por favor, completa todos los campos de la asignatura.", "error");
        }

        const dataParaEnviar = {
            nombre: nuevaAsignatura.nombre,
            cursoId: Number(nuevaAsignatura.cursoId),
            docenteId: Number(nuevaAsignatura.docenteId)
        };

        if (asignaturaEditando) {
            // Lógica de ACTUALIZAR
            const exito = await actualizarAsignatura(asignaturaEditando, dataParaEnviar);
            if (exito) {
                mostrarAlerta(`Asignatura actualizada con éxito`, "exito");
                cancelarEdicion();
                cargarDatos();
            } else {
                mostrarAlerta("Error al actualizar la asignatura en el servidor", "error");
            }
        } else {
            // Lógica de CREAR con validación de duplicados
            const asignaturaDuplicada = asignaturas.some(a => 
                a.nombre.trim().toLowerCase() === nuevaAsignatura.nombre.trim().toLowerCase() && 
                Number(a.cursoId) === Number(nuevaAsignatura.cursoId)
            );

            if (asignaturaDuplicada) {
                const detalleCurso = obtenerDetalleCurso(nuevaAsignatura.cursoId);
                return mostrarAlerta(`¡Atención! La asignatura "${nuevaAsignatura.nombre}" ya existe en el curso ${detalleCurso}.`, "error");
            }

            const exito = await crearAsignatura(dataParaEnviar);
            if (exito) {
                mostrarAlerta(`Asignatura "${nuevaAsignatura.nombre}" creada con éxito`, "exito");
                setNuevaAsignatura({ nombre: '', cursoId: '', docenteId: '' });
                cargarDatos();
            } else {
                mostrarAlerta("Error al guardar la asignatura en el servidor", "error");
            }
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Encabezado con Flexbox para incluir el botón de Volver atrás */}
            <div className="card-panel" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '30px', 
                padding: '25px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h1 style={{ color: 'var(--color-primario)', margin: '0 0 8px 0', fontSize: '24px' }}>
                        Panel de Gestión Académica
                    </h1>
                    <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '15px' }}>
                        Administración estructural del año escolar: Cursos, Asignaturas y Cargas Docentes
                    </p>
                </div>
                
                {/* BOTÓN ACTUALIZADO PARA VOLVER AL HOME */}
                <button 
                    onClick={() => navigate('/home')} /* <-- Modificado para ir directamente al Inicio */
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
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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

            {/* --- ALERTA ACTUALIZADA AL NUEVO DISEÑO --- */}
            {mensaje.texto && (
                <div style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: mensaje.tipo === 'exito' ? '#e6f4ea' : '#fde8e8',
                    color: mensaje.tipo === 'exito' ? '#1e4620' : '#9b1c1c',
                    border: mensaje.tipo === 'exito' ? '1px solid #cce8d6' : '1px solid #f8b4b4'
                }}>
                    {mensaje.texto}
                </div>
            )}

            {/* SECCIÓN 1: FORMULARIOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Formulario Curso */}
                <div className="card-panel" style={{ padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '18px', marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Registrar Nuevo Curso</h2>
                    <form onSubmit={handleCrearCurso} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Grado Académico:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: 1ro, 2do, 4to" 
                                value={nuevoCurso.grado}
                                onChange={(e) => setNuevoCurso({...nuevoCurso, grado: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Letra / Sección:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: A, B, C" 
                                value={nuevoCurso.letra}
                                onChange={(e) => setNuevoCurso({...nuevoCurso, letra: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                            <button
                                type="button" 
                                onClick={() => setNuevoCurso({ ...nuevoCurso, nivel: 'Básica' })}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '2px solid var(--color-primario)', 
                                    backgroundColor: nuevoCurso.nivel === 'Básica' ? 'var(--color-primario)' : 'white', 
                                    color: nuevoCurso.nivel === 'Básica' ? 'white' : 'var(--color-primario)', 
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease-in-out' 
                                }}
                            >
                                Educación Básica
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setNuevoCurso({ ...nuevoCurso, nivel: 'Media' })}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '2px solid var(--color-primario)',
                                    backgroundColor: nuevoCurso.nivel === 'Media' ? 'var(--color-primario)' : 'white',
                                    color: nuevoCurso.nivel === 'Media' ? 'white' : 'var(--color-primario)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                Educación Media
                            </button>
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '10px', fontWeight: 'bold', width: '100%', marginTop: '8px' }}>
                            Guardar Curso
                        </button>
                    </form>
                </div>

                {/* Formulario Asignatura */}
                <div className="card-panel" style={{ padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '18px', marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        {asignaturaEditando ? 'Modificar Asignatura' : 'Registrar Nueva Asignatura'}
                    </h2>
                    <form onSubmit={handleGuardarAsignatura} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Nombre de la Materia:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Matemáticas, Historia" 
                                value={nuevaAsignatura.nombre}
                                onChange={(e) => setNuevaAsignatura({...nuevaAsignatura, nombre: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Asociar a Curso:</label>
                            <select 
                                value={nuevaAsignatura.cursoId}
                                onChange={(e) => setNuevaAsignatura({...nuevaAsignatura, cursoId: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                            >
                                <option value="">-- Selecciona un Curso Activo --</option>
                                {cursosOrdenados.map((c) => (
                                    <option key={c.id} value={c.id}>{c.grado}° {c.letra} ({c.nivel})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Docente Responsable:</label>
                            <select 
                                value={nuevaAsignatura.docenteId}
                                onChange={(e) => setNuevaAsignatura({...nuevaAsignatura, docenteId: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                            >
                                <option value="">-- Selecciona un Docente --</option>
                                {docentes.map((d) => (
                                    <option key={d.id} value={d.id}>{d.nombre} {d.apellido || ''}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            <button type="submit" className="btn-primary" style={{ backgroundColor: asignaturaEditando ? '#0284c7' : '#0f766e', padding: '10px', fontWeight: 'bold', flex: 1 }}>
                                {asignaturaEditando ? 'Actualizar Asignatura' : 'Vincular Asignatura'}
                            </button>
                            {asignaturaEditando && (
                                <button type="button" onClick={cancelarEdicion} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* SECCIÓN 2: TABLAS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Tabla Cursos */}
                <div className="card-panel" style={{ padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>Cursos Operando</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Grado</th>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Letra</th>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Nivel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursos.length === 0 ? (
                                    <tr><td colSpan="3" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>No hay cursos estructurados en el sistema.</td></tr>
                                ) : (
                                    cursos.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px 16px', color: '#334155' }}>{c.grado}</td>
                                            <td style={{ padding: '12px 16px', color: '#334155' }}>{c.letra}</td>
                                            <td style={{ padding: '12px 16px' }}><span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' }}>{c.nivel}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabla Asignaturas */}
                <div className="card-panel" style={{ padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>Asignaturas y Cargas de Estudios</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Nombre Materia</th>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Curso</th>
                                    <th style={{ padding: '12px 16px', color: '#475569' }}>Docente Responsable</th>
                                    <th style={{ width: '120px', textAlign: 'center', padding: '12px 16px', color: '#475569' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asignaturas.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>No hay asignaturas registradas.</td></tr>
                                ) : (
                                    asignaturas.map((a) => (
                                        <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px 16px', color: '#334155', fontWeight: '500' }}>{a.nombre}</td>
                                            <td style={{ padding: '12px 16px', color: '#0284c7', fontWeight: '500' }}>
                                                {obtenerDetalleCurso(a.cursoId)}
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#0f766e', fontWeight: '500' }}>{obtenerNombreDocente(a.docenteId)}</td>
                                            <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                                                <button 
                                                    onClick={() => iniciarEdicionAsignatura(a)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '15px' }}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-pencil-alt" style={{ color: 'var(--color-primario)', fontSize: '16px' }}></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleEliminarAsignatura(a.id, a.nombre)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                    title="Eliminar"
                                                >
                                                    <i className="fas fa-trash" style={{ color: '#ef4444', fontSize: '16px' }}></i>
                                                </button>
                                            </td>
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

export default Cursos;