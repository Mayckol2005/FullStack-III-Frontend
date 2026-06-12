import React, { useState, useEffect } from 'react';
import { obtenerCursosReal, crearCurso, obtenerAsignaturas, crearAsignatura } from '../../services/academicoService';
import { obtenerUsuarios } from '../../services/usuarioService';

const Cursos = () => {
    // Estados para almacenar la información de la base de datos
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [docentes, setDocentes] = useState([]);

    // Estados para controlar los inputs de los formularios
    const [nuevoCurso, setNuevoCurso] = useState({ grado: '', letra: '', nivel: '' });
    const [nuevaAsignatura, setNuevaAsignatura] = useState({ nombre: '', cursoId: '', docenteId: '' });

    // Estado para las alertas visuales
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

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

    // Manejar el registro de una nueva Asignatura
    const handleCrearAsignatura = async (e) => {
        e.preventDefault();
        if (!nuevaAsignatura.nombre || !nuevaAsignatura.cursoId || !nuevaAsignatura.docenteId) {
            return mostrarAlerta("Por favor, completa todos los campos de la asignatura.", "error");
        }

        const dataParaEnviar = {
            nombre: nuevaAsignatura.nombre,
            cursoId: Number(nuevaAsignatura.cursoId),
            docenteId: Number(nuevaAsignatura.docenteId)
        };

        const exito = await crearAsignatura(dataParaEnviar);
        if (exito) {
            mostrarAlerta(`Asignatura "${nuevaAsignatura.nombre}" creada con éxito`, "exito");
            setNuevaAsignatura({ nombre: '', cursoId: '', docenteId: '' });
            cargarDatos();
        } else {
            mostrarAlerta("Error al guardar la asignatura en el servidor", "error");
        }
    };

    return (
        <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            {/* Encabezado */}
            <div style={{ marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                <h1 style={{ color: '#1e293b', margin: 0, fontSize: '28px' }}>Panel de Gestión Académica</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Administración estructural del año escolar: Cursos, Asignaturas y Cargas Docentes</p>
            </div>

            {/* Alertas */}
            {mensaje.texto && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: mensaje.tipo === 'exito' ? '#10b981' : '#ef4444'
                }}>
                    {mensaje.texto}
                </div>
            )}

            {/* SECCIÓN 1: FORMULARIOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Formulario Curso */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '18px', marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Registrar Nuevo Curso</h2>
                    <form onSubmit={handleCrearCurso} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Grado Académico:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: 1ro, 2do, 4to" 
                                value={nuevoCurso.grado}
                                onChange={(e) => setNuevoCurso({...nuevoCurso, grado: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Letra / Sección:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: A, B, C" 
                                value={nuevoCurso.letra}
                                onChange={(e) => setNuevoCurso({...nuevoCurso, letra: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Nivel Educativo:</label>
                            <select 
                                value={nuevoCurso.nivel}
                                onChange={(e) => setNuevoCurso({...nuevoCurso, nivel: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                            >
                                <option value="">-- Seleccionar Nivel --</option>
                                <option value="Básica">Educación Básica</option>
                                <option value="Media">Educación Media</option>
                            </select>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                            Guardar Curso
                        </button>
                    </form>
                </div>

                {/* Formulario Asignatura */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#0f172a', fontSize: '18px', marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Registrar Nueva Asignatura</h2>
                    <form onSubmit={handleCrearAsignatura} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontWeight: '500' }}>Nombre de la Materia:</label>
                            <input 
                                type="text" 
                                placeholder="Ej: Matemáticas, Historia" 
                                value={nuevaAsignatura.nombre}
                                onChange={(e) => setNuevaAsignatura({...nuevaAsignatura, nombre: e.target.value})}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        
                        {/* INTEGRACIÓN DEL NUEVO SELECT DE CURSOS ORDENADOS */}
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
                        <button type="submit" style={{ backgroundColor: '#0f766e', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                            Vincular Asignatura
                        </button>
                    </form>
                </div>
            </div>

            {/* SECCIÓN 2: TABLAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                
                {/* Tabla Cursos */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#1ie293b', margin: '0 0 12px 0', fontSize: '16px' }}>Cursos Operando</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px', color: '#475569' }}>ID</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Grado</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Letra</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Nivel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursos.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>No hay cursos estructurados en el sistema.</td></tr>
                                ) : (
                                    cursos.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#64748b' }}>{c.id}</td>
                                            <td style={{ padding: '10px', color: '#334155' }}>{c.grado}</td>
                                            <td style={{ padding: '10px', color: '#334155' }}>{c.letra}</td>
                                            <td style={{ padding: '10px' }}><span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{c.nivel}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabla Asignaturas */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '16px' }}>Asignaturas y Cargas de Estudios</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px', color: '#475569' }}>ID</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Nombre Materia</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Curso</th>
                                    <th style={{ padding: '10px', color: '#475569' }}>Docente Responsable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asignaturas.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>No hay asignaturas registradas.</td></tr>
                                ) : (
                                    asignaturas.map((a) => (
                                        <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#64748b' }}>{a.id}</td>
                                            <td style={{ padding: '10px', color: '#334155', fontWeight: '500' }}>{a.nombre}</td>
                                            <td style={{ padding: '10px', color: '#0284c7', fontWeight: '500' }}>
                                                {obtenerDetalleCurso(a.cursoId)}
                                            </td>
                                            <td style={{ padding: '10px', color: '#0f766e', fontWeight: '500' }}>{obtenerNombreDocente(a.docenteId)}</td>
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