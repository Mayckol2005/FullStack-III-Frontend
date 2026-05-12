import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarios, crearUsuario, actualizarUsuarioBD, eliminarUsuarioBD } from '../services/usuarioService';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [tempData, setTempData] = useState({});
    const [nuevoUsuario, setNuevoUsuario] = useState({ rut: '', nombre: '', email: '', password: '', rol: '' });
    const navigate = useNavigate();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        const data = await obtenerUsuarios();
        setUsuarios(data);
    };

    const handleCerrarSesion = () => {
        localStorage.removeItem('token_colegio');
        localStorage.removeItem('usuario_rol');
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
        if (window.confirm("¿Deseas confirmar los cambios realizados?")) {
            const datosAEnviar = { ...tempData };
            delete datosAEnviar.password;

            const exito = await actualizarUsuarioBD(id, datosAEnviar);
            if (exito) {
                alert("Usuario actualizado");
                setEditandoId(null);
                cargarDatos();
            }
        } else {
            cancelarEdicion();
        }
    };

    const borrarUsuario = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminarlo?")) {
            await eliminarUsuarioBD(id);
            cargarDatos();
        }
    };

    return (
        <div className="contenedor" style={{ maxWidth: '1100px', width: '95%', margin: '0 auto' }}>
            {/* Ajuste 1: Forzamos que el recuadro blanco sea más ancho para que quepa todo */}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
                <button 
                    onClick={handleCerrarSesion} 
                    className="btn" 
                    style={{ 
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '8px 15px',
                        cursor: 'pointer',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    <i className="fas fa-sign-out-alt" style={{marginRight: '8px'}}></i>
                    Cerrar Sesión
                </button>
            </div>
            
            <h2>Registrar Nuevo Usuario</h2>
            <form className="formulario-usuario" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }} 
                  onSubmit={async (e) => { e.preventDefault(); await crearUsuario(nuevoUsuario); cargarDatos(); }}>
                <input type="text" placeholder="RUT" onChange={e => setNuevoUsuario({...nuevoUsuario, rut: e.target.value})} required style={{ flex: '1', minWidth: '120px' }} />
                <input type="text" placeholder="Nombre" onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required style={{ flex: '1', minWidth: '150px' }} />
                <input type="email" placeholder="Email" onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required style={{ flex: '1', minWidth: '180px' }} />
                <input type="password" placeholder="Pass" onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} required style={{ flex: '1', minWidth: '120px' }} />
                <select onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} required style={{ flex: '1', minWidth: '130px' }}>
                    <option value="">Rol...</option>
                    <option value="ADMINISTRADOR">Admin</option>
                    <option value="PROFESOR">Profesor</option>
                    <option value="ALUMNO">Alumno</option>
                </select>
                <button type="submit" className="btn">Guardar</button>
            </form>

            <h2>Lista de Usuarios</h2>
            
            {/* Ajuste 2: Contenedor responsivo para la tabla. Si la pantalla es muy chica, se podrá scrollear hacia los lados sin romper la página */}
            <div style={{ overflowX: 'auto', marginTop: '10px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead>
                        {/* Ajuste 3: whiteSpace: 'nowrap' evita que el texto se corte en dos líneas */}
                        <tr style={{ whiteSpace: 'nowrap' }}>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Acciones</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>RUT</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Contraseña</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left' }}>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                {editandoId === u.id ? (
                                    <>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>
                                            <button onClick={() => guardarCambios(u.id)} className="btn-icon" style={{ marginRight: '15px' }}><i className="fas fa-check" style={{color:'green'}}></i></button>
                                            <button onClick={cancelarEdicion} className="btn-icon"><i className="fas fa-times" style={{color:'red'}}></i></button>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>{u.id}</td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <input 
                                                value={tempData.rut} 
                                                disabled 
                                                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#666', padding: '8px', width: '120px', boxSizing: 'border-box' }} 
                                                title="El RUT no se puede modificar"
                                            />
                                        </td>
                                        <td style={{ padding: '12px 15px' }}><input value={tempData.nombre} onChange={e => setTempData({...tempData, nombre: e.target.value})} style={{ padding: '8px', width: '100%', minWidth: '150px', boxSizing: 'border-box' }} /></td>
                                        <td style={{ padding: '12px 15px' }}><input type="email" value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} style={{ padding: '8px', width: '100%', minWidth: '180px', boxSizing: 'border-box' }} /></td>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>
                                            <span style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9em' }}>Protegida</span>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <select value={tempData.rol} onChange={e => setTempData({...tempData, rol: e.target.value})} style={{ padding: '8px' }}>
                                                <option value="ADMINISTRADOR">ADMIN</option>
                                                <option value="PROFESOR">PROFESOR</option>
                                                <option value="ALUMNO">ALUMNO</option>
                                            </select>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="acciones-cell" style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>
                                            <button onClick={() => iniciarEdicion(u)} className="btn-icon btn-edit" style={{ marginRight: '15px' }}><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => borrarUsuario(u.id)} className="btn-icon btn-delete"><i className="fas fa-trash"></i></button>
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>{u.id}</td>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>{u.rut}</td>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>{u.nombre}</td>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}>{u.email}</td>
                                        <td style={{ padding: '12px 15px' }}>••••••••</td>
                                        <td style={{ padding: '12px 15px', whiteSpace: 'nowrap' }}><strong>{u.rol}</strong></td>
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