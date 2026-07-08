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
    
    // Nuevo estado para controlar la alerta de éxito
    const [mensajeExito, setMensajeExito] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        const data = await obtenerUsuarios();
        setUsuarios(data);
    };

    // 🇨🇱 Función para formatear el RUT dinámicamente en tiempo real (xx.xxx.xxx-x)
    const formatearRut = (valor) => {
        if (!valor) return '';
        
        let limpio = valor.replace(/[^0-9kK]/g, '');
        if (limpio.length === 0) return '';

        let cuerpo = limpio.slice(0, -1);
        let dv = limpio.slice(-1).toUpperCase();

        if (limpio.length === 1) {
            return limpio;
        }

        let cuerpoFormateado = '';
        while (cuerpo.length > 3) {
            cuerpoFormateado = '.' + cuerpo.slice(-3) + cuerpoFormateado;
            cuerpo = cuerpo.slice(0, -3);
        }
        cuerpoFormateado = cuerpo + cuerpoFormateado;

        return `${cuerpoFormateado}-${dv}`;
    };

    const handleRutChange = (e) => {
        const valorInput = e.target.value;
        const rutFormateado = formatearRut(valorInput);
        setNuevoUsuario({ ...nuevoUsuario, rut: rutFormateado });
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
                
                {/* --- ENCABEZADO --- */}
                <div className="header-app" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--color-primario)', fontSize: '24px' }}>Control de Usuarios</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Cuentas de acceso institucionales</p>
                    </div>

                    {/* BOTÓN VOLVER AL HOME */}
                    <div>
                        <button 
                            onClick={() => navigate('/home')}
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
                </div>

                {/* --- ALERTA DE ÉXITO --- */}
                {mensajeExito && (
                    <div style={{
                        backgroundColor: '#e6f4ea',
                        color: '#1e4620',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #cce8d6',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Usuario creado correctamente
                    </div>
                )}

                <div className="card-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Registrar Nuevo Personal</h3>
                    <form onSubmit={async (e) => { 
                        e.preventDefault(); 
                        setMensajeError('');
                        const resultado = await crearUsuario(nuevoUsuario);

                        if(resultado.exito){ 
                            cargarDatos(); 
                            setNuevoUsuario({ rut: '', nombre: '', email: '', password: '', rol: '' }); 
                            // Mostrar alerta y ocultar después de 3 segundos
                            setMensajeExito(true);
                            setTimeout(() => {
                                setMensajeExito(false);
                            }, 3000);
                        } else {
                            setMensajeError(resultado.mensaje || 'No se pudo crear el usuario.');
                        }
                    }} 
                    style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        {mensajeError && (
                            <div style={{
                                flexBasis: '100%',
                                backgroundColor: '#fff5f5',
                                color: '#c53030',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #fed7d7',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {mensajeError}
                            </div>
                        )}
                        
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input 
                                type="text" 
                                placeholder="RUT (ej: 12.345.678-9)" 
                                value={nuevoUsuario.rut} 
                                onChange={handleRutChange} 
                                maxLength={12} 
                                required 
                                className="input-custom" 
                            />
                        </div>

                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="text" placeholder="Nombre Completo" value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '18px' }}>
                            <input type="email" placeholder="Email Corporativo" value={nuevoUsuario.email} onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})} required className="input-custom" />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <input type="password" placeholder="Contraseña Acceso" value={nuevoUsuario.password} onChange={e => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} minLength={6} required className="input-custom" />
                        </div>
                        <div style={{ minWidth: '150px' }}>
                            <select value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})} required className="select-custom">
                                <option value="">Asignar Rol...</option>
                                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                <option value="PROFESOR">PROFESOR</option>
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
                                                    <span className="btn-primary" style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px', opacity: 0.75 }}>
                                                        {tempData.rol}
                                                    </span>
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
