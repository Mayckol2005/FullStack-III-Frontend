import React, { useState, useEffect } from 'react';
// 1. Agregamos eliminarAviso a las importaciones
import { obtenerAvisos, crearAviso, eliminarAviso } from '../../services/comunicacionService';
import '../../styles/globals.css';

const Comunicaciones = () => {
    // --- Estados ---
    const [avisos, setAvisos] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(true);

    // --- Efectos ---
    useEffect(() => {
        cargarDatos();
    }, []);

    // --- Utilidades ---
    const mostrarAlerta = (texto, tipo) => {
        setMensaje({ texto, tipo });
        // Auto-ocultar la alerta después de 4 segundos
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    };

    // --- Carga de Datos ---
    const cargarDatos = async () => {
        try {
            setCargando(true);
            const listaAvisos = await obtenerAvisos();
            setAvisos(listaAvisos);
        } catch (error) {
            console.error("Error cargando avisos:", error);
            mostrarAlerta('Error al sincronizar con los microservicios.', 'error');
        } finally {
            setCargando(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo.trim() || !contenido.trim()) {
            mostrarAlerta('Todos los campos son obligatorios para emitir la circular.', 'error');
            return;
        }

        // Alerta de confirmación
        if (!window.confirm("¿Está seguro de publicar este comunicado?")) {
            return; 
        }

        try {
            const nuevoAviso = {
                titulo: titulo.trim(),
                contenido: contenido.trim()
            };

            const exito = await crearAviso(nuevoAviso);
            
            if (exito === false) {
                mostrarAlerta('El servidor rechazó el envío (revisa la consola).', 'error');
                return;
            }

            mostrarAlerta('¡Comunicado oficial publicado con éxito!', 'exito');
            
            setTitulo('');
            setContenido('');
            cargarDatos();
        } catch (error) {
            console.error("🔥 ERROR OCULTO DE REACT ANTES DE ENVIAR:", error);
            mostrarAlerta(`Error de código: ${error.message}`, 'error');
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* --- Cabecera del Módulo con Botón Home --- */}
            <div className="card-panel header-app" style={{ 
                marginBottom: '30px', 
                padding: '25px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h2 style={{ fontSize: '24px', color: 'var(--color-primario)', margin: '0 0 8px 0' }}>
                        Panel de Comunicaciones Institucionales
                    </h2>
                    <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '15px' }}>
                        Publica circulares, avisos de emergencia y novedades directo al mural general.
                    </p>
                </div>
                
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
            
            {/* --- Alertas de Feedback --- */}
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

            {/* --- Grid Principal --- */}
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
                            {avisos.map((aviso) => (
                                <div key={aviso.id} className="card-panel" style={{ padding: '20px', position: 'relative', borderLeft: '5px solid var(--color-primario)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, fontSize: '18px', color: '#1a202c', fontWeight: 'bold' }}>{aviso.titulo}</h4>
                                        
                                        {/* Contenedor de acciones unificadas a la derecha */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ 
                                                fontSize: '12px', 
                                                fontWeight: 'bold',
                                                padding: '3px 10px', 
                                                borderRadius: '15px', 
                                                backgroundColor: '#ebf8ff', 
                                                color: '#2b6cb0' 
                                            }}>
                                                📍 General
                                            </span>
                                        </div>
                                    </div>
                                    <p style={{ margin: '0 0 10px 0', color: '#4a5568', lineHeight: '1.5', fontSize: '15px' }}>{aviso.contenido}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#a0aec0' }}>
                                        <span>Emisor: Dirección Académica</span>
                                        <span>Canal Digital • Vigente</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Comunicaciones;