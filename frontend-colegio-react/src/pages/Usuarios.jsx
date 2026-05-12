import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarios, crearUsuario, actualizarUsuarioBD, eliminarUsuarioBD } from '../services/usuarioService';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});
    const [nuevoUsuario, setNuevoUsuario] = useState({ rut: '', nombre: '', email: '', password: '', rol: '' });
    const navigate = useNavigate();

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        const data = await obtenerUsuarios();
        setUsuarios(data);
    };

    const handleCerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

    const iniciarEdicion = (u) => {
        setEditandoId(u.id);
        setTempData({ ...u, password: '' });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setTempData({});
    };

    const guardarCambios = async (id) => {
        if (window.confirm("¿Confirmar cambios?")) {
            const datosAEnviar = { ...tempData };
            delete datosAEnviar.password;
            if (await actualizarUsuarioBD(id, datosAEnviar)) {
                setEditandoId(null);
                cargarDatos();
            }
        }
    };

    return (
        <div className="contenedor" style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Gestión de Usuarios</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/home')} className="btn" style={{ backgroundColor: '#6c757d' }}>Volver</button>
                    <button onClick={handleCerrarSesion} className="btn" style={{ backgroundColor: '#dc3545' }}>Salir</button>
                </div>
            </div>

            <form onSubmit={async (e) => { e.preventDefault(); await crearUsuario(nuevoUsuario); cargarDatos(); }} 
                  style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="RUT" onChange={e => setNuevoUsuario({...nuevoUsuario, rut: e.target.value})} required className="input-form" style={{flex: 1}}/>
                <input type="text" placeholder="Nombre" onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required className="input-form" style={{flex: 1}}/>
                <input type="email" placeholder="Email" onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required className="input-form" style={{flex: 1}}/>
                
                {/* CAMBIO 1: "Pass" cambiado por "Contraseña" */}
                <input type="password" placeholder="Contraseña" onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} required className="input-form" style={{flex: 1}}/>
                
                {/* CAMBIO 2: Agregada la opción "Rol..." por defecto y en blanco */}
                <select onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} required className="input-form">
                    <option value="">Rol...</option>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                    <option value="PROFESOR">PROFESOR</option>
                    <option value="ALUMNO">ALUMNO</option>
                </select>
                
                <button type="submit" className="btn">Guardar</button>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Acciones</th>
                            <th style={{ padding: '12px' }}>RUT</th>
                            <th style={{ padding: '12px' }}>Nombre</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                {editandoId === u.id ? (
                                    <>
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={() => guardarCambios(u.id)} className="btn-icon" style={{marginRight: '15px'}}><i className="fas fa-check" style={{color: 'green'}}></i></button>
                                            <button onClick={cancelarEdicion} className="btn-icon"><i className="fas fa-times" style={{color: 'red'}}></i></button>
                                        </td>
                                        <td style={{ padding: '12px' }}>{u.rut}</td>
                                        <td style={{ padding: '12px' }}><input value={tempData.nombre} onChange={e => setTempData({...tempData, nombre: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}><input value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} className="input-form" /></td>
                                        <td style={{ padding: '12px' }}>
                                            <select value={tempData.rol} onChange={e => setTempData({...tempData, rol: e.target.value})} className="input-form">
                                                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                                <option value="PROFESOR">PROFESOR</option>
                                                <option value="ALUMNO">ALUMNO</option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={() => iniciarEdicion(u)} className="btn-icon" style={{marginRight: '15px'}}><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={async () => { if(window.confirm("¿Eliminar?")) { await eliminarUsuarioBD(u.id); cargarDatos(); } }} className="btn-icon"><i className="fas fa-trash"></i></button>
                                        </td>
                                        <td style={{ padding: '12px' }}>{u.rut}</td>
                                        <td style={{ padding: '12px' }}>{u.nombre}</td>
                                        <td style={{ padding: '12px' }}>{u.email}</td>
                                        <td style={{ padding: '12px' }}><strong>{u.rol}</strong></td>
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

export default Usuarios;