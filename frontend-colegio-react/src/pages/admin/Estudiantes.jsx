import { useState, useEffect } from 'react';
import { obtenerEstudiantes, crearEstudiante, actualizarEstudianteBD, eliminarEstudianteBD } from '../../services/estudianteService';
import Navbar from '../../components/layout/Navbar';
import '../../styles/globals.css';

function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});
    const [nuevoEstudiante, setNuevoEstudiante] = useState({ 
        rut: '', nombres: '', apellidos: '', email: '', fechaNacimiento: '', cursoId: '', estado: 'MATRICULADO' 
    });

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        const data = await obtenerEstudiantes();
        setEstudiantes(data);
    };

    const manejarGuardado = async (e) => {
        e.preventDefault();
        const estudianteAEnviar = { ...nuevoEstudiante, cursoId: parseInt(nuevoEstudiante.cursoId) };
        if (await crearEstudiante(estudianteAEnviar)) {
            cargarDatos();
            setNuevoEstudiante({ rut: '', nombres: '', apellidos: '', email: '', fechaNacimiento: '', cursoId: '', estado: 'MATRICULADO' });
        }
    };

    const iniciarEdicion = (est) => {
        setEditandoId(est.id);
        setTempData({ ...est });
    };

    const guardarCambios = async (id) => {
        if (window.confirm("¿Confirmar cambios del estudiante?")) {
            const datosAEnviar = { ...tempData, cursoId: parseInt(tempData.cursoId) };
            if (await actualizarEstudianteBD(id, datosAEnviar)) {
                setEditandoId(null);
                cargarDatos();
            }
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

                <div className="card-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Matricular Alumno</h3>
                    <form onSubmit={manejarGuardado} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="RUT" value={nuevoEstudiante.rut} onChange={e => setNuevoEstudiante({...nuevoEstudiante, rut: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <input type="text" placeholder="Nombres" value={nuevoEstudiante.nombres} onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombres: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <input type="text" placeholder="Apellidos" value={nuevoEstudiante.apellidos} onChange={e => setNuevoEstudiante({...nuevoEstudiante, apellidos: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <input type="email" placeholder="Email Alumno" value={nuevoEstudiante.email} onChange={e => setNuevoEstudiante({...nuevoEstudiante, email: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <input type="date" value={nuevoEstudiante.fechaNacimiento} onChange={e => setNuevoEstudiante({...nuevoEstudiante, fechaNacimiento: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <input type="number" placeholder="ID Curso" value={nuevoEstudiante.cursoId} onChange={e => setNuevoEstudiante({...nuevoEstudiante, cursoId: e.target.value})} required className="input-custom" style={{ flex: 1 }} />
                        <button type="submit" className="btn-success">Matricular</button>
                    </form>
                </div>

                <div className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
                                    <th>RUT</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Email</th>
                                    <th>Curso</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map(est => (
                                    <tr key={est.id}>
                                        {editandoId === est.id ? (
                                            <>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button onClick={() => guardarCambios(est.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}><i className="fas fa-check" style={{ color: 'var(--color-exito)' }}></i></button>
                                                    <button onClick={() => setEditandoId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fas fa-times" style={{ color: 'var(--color-peligro)' }}></i></button>
                                                </td>
                                                <td>{est.rut}</td>
                                                <td><input value={tempData.nombres} onChange={e => setTempData({...tempData, nombres: e.target.value})} className="input-custom" style={{ padding: '6px' }} /></td>
                                                <td><input value={tempData.apellidos} onChange={e => setTempData({...tempData, apellidos: e.target.value})} className="input-custom" style={{ padding: '6px' }} /></td>
                                                <td><input value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} className="input-custom" style={{ padding: '6px' }} /></td>
                                                <td><input type="number" value={tempData.cursoId} onChange={e => setTempData({...tempData, cursoId: e.target.value})} className="input-custom" style={{ padding: '6px', width: '70px' }} /></td>
                                                <td>
                                                    <select value={tempData.estado} onChange={e => setTempData({...tempData, estado: e.target.value})} className="select-custom" style={{ padding: '6px' }}>
                                                        <option value="MATRICULADO">MATRICULADO</option>
                                                        <option value="RETIRADO">RETIRADO</option>
                                                        <option value="SUSPENDIDO">SUSPENDIDO</option>
                                                    </select>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button onClick={() => iniciarEdicion(est)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}><i className="fas fa-pencil-alt" style={{ color: 'var(--color-primario)' }}></i></button>
                                                    <button onClick={async () => { if(window.confirm("¿Eliminar permanentemente?")) { await eliminarEstudianteBD(est.id); cargarDatos(); } }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fas fa-trash" style={{ color: 'var(--color-peligro)' }}></i></button>
                                                </td>
                                                <td style={{ color: 'var(--color-texto-secundario)' }}>{est.rut}</td>
                                                <td style={{ fontWeight: '600' }}>{est.nombres}</td>
                                                <td style={{ fontWeight: '600' }}>{est.apellidos}</td>
                                                <td>{est.email}</td>
                                                <td><strong>Curso {est.cursoId}</strong></td>
                                                <td><span style={{ color: est.estado === 'MATRICULADO' ? 'var(--color-exito)' : 'var(--color-peligro)', fontWeight: 'bold' }}>{est.estado}</span></td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Estudiantes;