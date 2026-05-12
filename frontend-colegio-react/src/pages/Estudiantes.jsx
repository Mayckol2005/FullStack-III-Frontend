import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerEstudiantes, crearEstudiante, actualizarEstudianteBD, eliminarEstudianteBD } from '../services/estudianteService';

function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});
    
    const [nuevoEstudiante, setNuevoEstudiante] = useState({ 
        rut: '', nombres: '', apellidos: '', email: '', fechaNacimiento: '', cursoId: '', estado: 'MATRICULADO' 
    });
    
    const navigate = useNavigate();

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        const data = await obtenerEstudiantes();
        setEstudiantes(data);
    };

    const handleCerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

    const manejarGuardado = async (e) => {
        e.preventDefault();
        const estudianteAEnviar = { ...nuevoEstudiante, cursoId: parseInt(nuevoEstudiante.cursoId) };
        if (await crearEstudiante(estudianteAEnviar)) {
            cargarDatos();
            setNuevoEstudiante({ rut: '', nombres: '', apellidos: '', email: '', fechaNacimiento: '', cursoId: '', estado: 'MATRICULADO' });
        } else {
            alert("Error al matricular");
        }
    };

    // --- LÓGICA DE EDICIÓN Y ELIMINACIÓN ---
    const iniciarEdicion = (est) => {
        setEditandoId(est.id);
        setTempData({ ...est });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setTempData({});
    };

    const guardarCambios = async (id) => {
        if (window.confirm("¿Confirmar cambios del estudiante?")) {
            const datosAEnviar = { ...tempData, cursoId: parseInt(tempData.cursoId) };
            if (await actualizarEstudianteBD(id, datosAEnviar)) {
                setEditandoId(null);
                cargarDatos();
            } else {
                alert("Error al actualizar");
            }
        }
    };

    const eliminarEstudiante = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este alumno permanentemente?")) {
            if (await eliminarEstudianteBD(id)) {
                cargarDatos();
            } else {
                alert("Error al eliminar");
            }
        }
    };

    return (
        <div className="contenedor" style={{ maxWidth: '1300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Gestión de Estudiantes</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/home')} className="btn" style={{ backgroundColor: '#6c757d' }}>Volver</button>
                    <button onClick={handleCerrarSesion} className="btn" style={{ backgroundColor: '#dc3545' }}>Salir</button>
                </div>
            </div>

            <h2>Matricular Nuevo Alumno</h2>
            <form onSubmit={manejarGuardado} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="RUT" value={nuevoEstudiante.rut} onChange={e => setNuevoEstudiante({...nuevoEstudiante, rut: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '130px'}}/>
                <input type="text" placeholder="Nombres" value={nuevoEstudiante.nombres} onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombres: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '150px'}}/>
                <input type="text" placeholder="Apellidos" value={nuevoEstudiante.apellidos} onChange={e => setNuevoEstudiante({...nuevoEstudiante, apellidos: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '150px'}}/>
                <input type="email" placeholder="Email" value={nuevoEstudiante.email} onChange={e => setNuevoEstudiante({...nuevoEstudiante, email: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '200px'}}/>
                <input type="date" value={nuevoEstudiante.fechaNacimiento} onChange={e => setNuevoEstudiante({...nuevoEstudiante, fechaNacimiento: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '150px'}}/>
                <input type="number" placeholder="ID Curso" value={nuevoEstudiante.cursoId} onChange={e => setNuevoEstudiante({...nuevoEstudiante, cursoId: e.target.value})} required className="input-form" style={{flex: 1, minWidth: '100px'}}/>
                <button type="submit" className="btn">Matricular</button>
            </form>

            <h2>Alumnos Matriculados</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Acciones</th>
                            <th style={{ padding: '12px' }}>RUT</th>
                            <th style={{ padding: '12px' }}>Nombres</th>
                            <th style={{ padding: '12px' }}>Apellidos</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>F. Nacimiento</th>
                            <th style={{ padding: '12px' }}>Curso</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map(est => (
                            <tr key={est.id} style={{ borderBottom: '1px solid #eee' }}>
                                {editandoId === est.id ? (
                                    <>
                                        <td style={{ padding: '12px', minWidth: '100px' }}>
                                            <button onClick={() => guardarCambios(est.id)} className="btn-icon" style={{marginRight: '15px'}}><i className="fas fa-check" style={{color: 'green'}}></i></button>
                                            <button onClick={cancelarEdicion} className="btn-icon"><i className="fas fa-times" style={{color: 'red'}}></i></button>
                                        </td>
                                        <td style={{ padding: '12px' }}>{est.rut}</td>
                                        <td style={{ padding: '12px' }}><input value={tempData.nombres} onChange={e => setTempData({...tempData, nombres: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}><input value={tempData.apellidos} onChange={e => setTempData({...tempData, apellidos: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}><input value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}><input type="date" value={tempData.fechaNacimiento} onChange={e => setTempData({...tempData, fechaNacimiento: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}><input type="number" value={tempData.cursoId} onChange={e => setTempData({...tempData, cursoId: e.target.value})} className="input-form" style={{width: '70px'}}/></td>
                                        <td style={{ padding: '12px' }}>
                                            <select value={tempData.estado} onChange={e => setTempData({...tempData, estado: e.target.value})} className="input-form">
                                                <option value="MATRICULADO">MATRICULADO</option>
                                                <option value="RETIRADO">RETIRADO</option>
                                                <option value="SUSPENDIDO">SUSPENDIDO</option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ padding: '12px', minWidth: '100px' }}>
                                            <button onClick={() => iniciarEdicion(est)} className="btn-icon" style={{marginRight: '15px'}}><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => eliminarEstudiante(est.id)} className="btn-icon"><i className="fas fa-trash" style={{color: 'red'}}></i></button>
                                        </td>
                                        <td style={{ padding: '12px' }}>{est.rut}</td>
                                        <td style={{ padding: '12px' }}>{est.nombres}</td>
                                        <td style={{ padding: '12px' }}>{est.apellidos}</td>
                                        <td style={{ padding: '12px' }}>{est.email}</td>
                                        <td style={{ padding: '12px' }}>{est.fechaNacimiento}</td>
                                        <td style={{ padding: '12px' }}><strong>{est.cursoId}</strong></td>
                                        <td style={{ padding: '12px' }}>{est.estado}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Estudiantes;