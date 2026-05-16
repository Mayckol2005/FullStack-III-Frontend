import React, { useState } from 'react';
import '../../styles/estilos.css';

function Anotaciones() {
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [tipoAnotacion, setTipoAnotacion] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const alumnosSimulados = [
        { id: 1, nombreCompleto: 'Pérez, Juan' },
        { id: 2, nombreCompleto: 'González, María' },
        { id: 3, nombreCompleto: 'Vera, Francisco' },
    ];

    const registrarAnotacion = (e) => {
        e.preventDefault();
        alert(`Anotación ${tipoAnotacion} registrada para el alumno seleccionado.`);
        setAlumnoId('');
        setTipoAnotacion('');
        setDescripcion('');
    };

    return (
        <div className="dashboard-container">
            <header className="header-app">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="logo-box">
                        <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Hoja de Vida & Anotaciones</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Registro de comportamiento y observaciones del estudiante</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
                
                {/* Formulario de Registro */}
                <div className="card-panel" style={{ flex: '1 1 500px', margin: 0 }}>
                    <h2 style={{ color: 'var(--color-primario)', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>Nueva Observación</h2>
                    
                    <form onSubmit={registrarAnotacion}>
                        <div style={{ marginBottom: '18px' }}>
                            <label className="form-label">Filtrar por Curso</label>
                            <select className="select-custom" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)} required>
                                <option value="">Seleccione un curso...</option>
                                <option value="1° Medio A">1° Medio A</option>
                                <option value="2° Medio B">2° Medio B</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="form-label">Estudiante</label>
                            <select className="select-custom" value={alumnoId} onChange={e => setAlumnoId(e.target.value)} disabled={!cursoSeleccionado} required>
                                <option value="">Seleccione al estudiante...</option>
                                {alumnosSimulados.map(al => (
                                    <option key={al.id} value={al.id}>{al.nombreCompleto}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="form-label">Tipo de Observación</label>
                            <select className="select-custom" value={tipoAnotacion} onChange={e => setTipoAnotacion(e.target.value)} required>
                                <option value="">Seleccione tipo...</option>
                                <option value="POSITIVA">Positiva (Destaca en clases / Colaboración)</option>
                                <option value="NEGATIVA">Negativa (Incumplimiento / Falta de respeto)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '22px' }}>
                            <label className="form-label">Descripción del Suceso</label>
                            <textarea 
                                className="input-custom" 
                                style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                                placeholder="Escriba detalladamente el comportamiento u observación..."
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                            Ingresar al Libro de Vida
                        </button>
                    </form>
                </div>

                {/* Panel Informativo Lateral */}
                <div style={{ flex: '1 1 300px' }}>
                    <div className="card-panel" style={{ backgroundColor: 'rgba(15, 89, 159, 0.03)', borderColor: 'rgba(15, 89, 159, 0.12)' }}>
                        <h3 style={{ color: 'var(--color-primario)', marginTop: 0, fontSize: '16px' }}>Reglamento de Convivencia</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-texto-secundario)', lineHeight: '1.5', margin: 0 }}>
                            Recuerde que las anotaciones negativas impactan el informe de personalidad del alumno. Sea descriptivo y objetivo al relatar los hechos.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Anotaciones;