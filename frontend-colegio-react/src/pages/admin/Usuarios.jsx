import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarios, crearUsuario, actualizarUsuarioBD, eliminarUsuarioBD } from '../../services/usuarioService';
import Navbar from '../../components/layout/Navbar';
import '../../styles/globals.css'

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

    const iniciarEdicion = (u) => {
        setEditandoId(u.id);
        setTempData({ ...u, password: '' });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setTempData({});
    };

    const guardarCambios = async (id) => {
        if (window.confirm("¿Confirmar modificaciones del usuario?")) {
            const datosAEnviar = { ...tempData };
            delete datosAEnviar.password;
            if (await actualizarUsuarioBD(id, datosAEnviar)) {
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
                        <h1 style={{ margin: 0, color: 'var(--color-primario)', fontSize: '24px' }}>Control de Usuarios</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Cuentas de acceso institucionales</p>
                    </div>
                </div>

                <div className="card-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Registrar Nuevo Personal</h3>
                    <form onSubmit={async (e) => { e.preventDefault(); if(await crearUsuario(nuevoUsuario)){ cargarDatos(); setNuevoUsuario({ rut: '', nombre: '', email: '', password: '', rol: '' }); } }} 
                          style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="text" placeholder="RUT (ej: 12345678-9)" value={nuevoUsuario.rut} onChange={e => setNuevoUsuario({...nuevoUsuario, rut: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="text" placeholder="Nombre Completo" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '18px' }}>
                            <input type="email" placeholder="Email Corporativo" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="password" placeholder="Contraseña Acceso" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ minWidth: '150px' }}>
                            <select value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} required className="select-custom">
                                <option value="">Asignar Rol...</option>
                                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                <option value="PROFESOR">PROFESOR</option>
                                <option value="ALUMNO">ALUMNO</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-success" style={{ padding: '12px 24px' }}>Guardar</button>
                    </form>
                </div>

                <div className="card-panel" style={{ padding: 0 }}>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th style={{ width: '130px', textAlign: 'center' }}>Acciones</th>
                                    <th>RUT</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        {editandoId === u.id ? (
                                            <>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button onClick={() => guardarCambios(u.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}><i className="fas fa-check" style={{ color: 'var(--color-exito)', fontSize: '16px' }}></i></button>
                                                    <button onClick={cancelarEdicion} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fas fa-times" style={{ color: 'var(--color-peligro)', fontSize: '16px' }}></i></button>
                                                </td>
                                                <td>{u.rut}</td>
                                                <td><input value={tempData.nombre} onChange={e => setTempData({...tempData, nombre: e.target.value})} className="input-custom" style={{ padding: '6px' }} /></td>
                                                <td><input value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} className="input-custom" style={{ padding: '6px' }} /></td>
                                                <td>
                                                    <select value={tempData.rol} onChange={e => setTempData({...tempData, rol: e.target.value})} className="select-custom" style={{ padding: '6px' }}>
                                                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                                        <option value="PROFESOR">PROFESOR</option>
                                                        <option value="ALUMNO">ALUMNO</option>
                                                    </select>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button onClick={() => iniciarEdicion(u)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px' }}><i className="fas fa-pencil-alt" style={{ color: 'var(--color-primario)' }}></i></button>
                                                    <button onClick={async () => { if(window.confirm("¿Eliminar usuario?")) { await eliminarUsuarioBD(u.id); cargarDatos(); } }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><i className="fas fa-trash" style={{ color: 'var(--color-peligro)' }}></i></button>
                                                </td>
                                                <td style={{ color: 'var(--color-texto-secundario)' }}>{u.rut}</td>
                                                <td style={{ fontWeight: '600' }}>{u.nombre}</td>
                                                <td>{u.email}</td>
                                                <td><span className="btn-primary" style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px' }}>{u.rol}</span></td>
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

export default Usuarios;