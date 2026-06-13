import React, { useState, useEffect } from 'react';
import { obtenerAvisos, crearAviso } from '../../services/comunicacionService';
import * as academicoService from '../../services/academicoService'; 
import '../../styles/globals.css';

const Comunicaciones = () => {
    const [avisos, setAvisos] = useState([]);
    const [cursos, setCursos] = useState([]);
    
    // Estado del Formulario
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [cursoId, setCursoId] = useState('');
    
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            
            // 1. Cargar Avisos
            const listaAvisos = await obtenerAvisos();
            setAvisos(listaAvisos);

            // 2. Intentar detectar dinámicamente cómo llamaste a la función de los cursos
            const buscarFuncionCursos = 
                academicoService.obtenerCursos || 
                academicoService.listarCursos || 
                academicoService.getCursos ||
                academicoService.obtenerCursosReal; 

            if (!buscarFuncionCursos) {
                console.error("No se detectó función de cursos. Revisa los nombres en la consola.");
                setMensaje({ 
                    texto: 'Mural cargado, pero no se pudo mapear la función de cursos en academicoService.', 
                    tipo: 'error' 
                });
                return;
            }

            const listaCursos = await buscarFuncionCursos();
            const cursosOrdenados = [...listaCursos].sort((a, b) => String(a.grado).localeCompare(String(b.grado)));
            setCursos(cursosOrdenados);
            
        } catch (error) {
            setMensaje({ texto: 'Error al sincronizar con los microservicios.', tipo: 'error' });
        } finally {
            setCargando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo.trim() || !contenido.trim() || !cursoId) {
            setMensaje({ texto: 'Todos los campos son obligatorios para emitir la circular.', tipo: 'error' });
            return;
        }

        try {
            const nuevoAviso = {
                titulo: titulo.trim(),
                contenido: contenido.trim(),
                cursoId: parseInt(cursoId)
            };

            await crearAviso(nuevoAviso);
            setMensaje({ texto: '¡Comunicado oficial publicado con éxito!', tipo: 'exito' });
            
            setTitulo('');
            setContenido('');
            setCursoId('');
            
            const listaActualizada = await obtenerAvisos();
            setAvisos(listaActualizada);
        } catch (error) {
            setMensaje({ texto: 'Hubo un problema al procesar el envío.', tipo: 'error' });
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Cabecera del Módulo envuelta en card-panel y sin emoji */}
            <div className="card-panel" style={{ marginBottom: '30px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', color: 'var(--color-primario)', margin: '0 0 8px 0' }}>
                    Panel de Comunicaciones Institucionales
                </h2>
                <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '15px' }}>
                    Publica circulares, avisos de emergencia y novedades directo al mural de los cursos.
                </p>
            </div>

            {/* Alertas de Feedback */}
            {mensaje.texto && (
                <div style={{ 
                    padding: '12px 20px', 
                    borderRadius: '8px',
                    backgroundColor: mensaje.tipo === 'error' ? '#fff5f5' : '#f0fff4',
                    color: mensaje.tipo === 'error' ? '#e53e3e' : '#38a169',
                    border: `1px solid ${mensaje.tipo === 'error' ? '#fed7d7' : '#c6f6d5'}`,
                    marginBottom: '25px', 
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    {mensaje.tipo === 'error' ? '❌ ' : '✨ '} {mensaje.texto}
                </div>
            )}

            {/* Grid de dos columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Columna Izquierda: Formulario */}
                <div className="card-panel" style={{ padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2d3748' }}>Redactar Nuevo Anuncio</h3>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label htmlFor="titulo" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                Título del Comunicado
                            </label>
                            <input
                                id="titulo"
                                type="text"
                                placeholder="Ej: Suspensión de Clases / Reunión"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="contenido" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                Mensaje / Cuerpo de la Circular
                            </label>
                            <textarea
                                id="contenido"
                                placeholder="Escriba de forma clara los detalles del anuncio..."
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', height: '120px', resize: 'none', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="select-curso" style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                                Curso Destinatario
                            </label>
                            <select
                                id="select-curso"
                                value={cursoId}
                                onChange={(e) => setCursoId(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', backgroundColor: 'white', outline: 'none' }}
                            >
                                <option value="">-- Seleccionar Nivel --</option>
                                {cursos.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.grado}° {c.letra} ({c.nivel})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '16px', fontWeight: 'bold', width: '100%', marginTop: '5px' }}>
                            Publicar en el Mural
                        </button>
                    </form>
                </div>

                {/* Columna Derecha: El Mural Activo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: '0', fontSize: '20px', color: '#2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Historial de Circulares Emitidas</span>
                        <span style={{ fontSize: '13px', backgroundColor: '#edf2f7', padding: '4px 10px', borderRadius: '12px', color: '#4a5568' }}>
                            {avisos.length} activos
                        </span>
                    </h3>

                    {cargando ? (
                        <p style={{ color: 'var(--color-texto-secundario)' }}>Cargando el historial de novedades...</p>
                    ) : avisos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '8px', color: 'var(--color-texto-secundario)' }}>
                            📭 No hay comunicados emitidos recientemente en este canal.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                            {avisos.map((aviso) => {
                                const cursoRelacionado = cursos.find(c => c.id === aviso.cursoId);
                                return (
                                    <div key={aviso.id} className="card-panel" style={{ padding: '20px', position: 'relative', borderLeft: '5px solid var(--color-primario)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h4 style={{ margin: 0, fontSize: '18px', color: '#1a202c', fontWeight: 'bold' }}>{aviso.titulo}</h4>
                                            <span style={{ 
                                                fontSize: '12px', 
                                                fontWeight: 'bold',
                                                padding: '3px 10px', 
                                                borderRadius: '15px', 
                                                backgroundColor: '#ebf8ff', 
                                                color: '#2b6cb0' 
                                            }}>
                                                📍 {cursoRelacionado ? `${cursoRelacionado.grado}° ${cursoRelacionado.letra}` : `ID: ${aviso.cursoId}`}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 10px 0', color: '#4a5568', lineHeight: '1.5', fontSize: '15px' }}>{aviso.contenido}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a0aec0' }}>
                                            <span>Emisor: Dirección Académica</span>
                                            <span>Canal Digital • Vigente</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Comunicaciones;