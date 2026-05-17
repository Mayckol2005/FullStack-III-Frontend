import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesionBD } from '../services/authService';
import '../styles/estilos.css';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const procesarLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setCargando(true);

        const resultado = await iniciarSesionBD(usuario, password);
        setCargando(false);

        if (resultado.exito) {
            // ENRUTAMIENTO DINÁMICO: Redirección según el Rol real que retornó la Base de Datos
            const rolUsuario = resultado.rol; 

            if (rolUsuario === 'ADMINISTRADOR') {
                console.log("👑 Modo Administrador Detectado. Derivando...");
                navigate('/admin');
            } else if (rolUsuario === 'PROFESOR') {
                console.log("📝 Modo Docente Detectado. Derivando...");
                navigate('/profesor');
            } else if (rolUsuario === 'ALUMNO' || rolUsuario === 'ESTUDIANTE') {
                console.log("🎒 Modo Estudiante Detectado. Derivando...");
                navigate('/alumno');
            } else {
                console.warn("⚠️ Rol desconocido detectado:", rolUsuario);
                navigate('/');
            }
        } else {
            setErrorMsg(resultado.msg || 'Credenciales inválidas');
        }
    };

    return (
        <div className="landing-wrapper">
            {/* Nav básica superior de retorno */}
            <nav className="landing-nav">
                <div className="landing-nav-brand">
                    <img src="/logo-colegio.png" alt="Logo CBO" className="nav-logo-brand" style={{ height: '40px' }} />
                    <span>Colegio Bernardo O'Higgins</span>
                </div>
                <button className="btn-primary" onClick={() => navigate('/')}>← Volver al Sitio</button>
            </nav>

            <main className="landing-main main-form-wrapper" style={{ maxWidth: '450px', marginTop: '50px' }}>
                <div className="card-panel">
                    <h2 className="form-label brand-title-center" style={{ fontSize: '22px', textAlign: 'center', color: 'var(--color-primario)' }}>
                        Portal Intranet Institucional
                    </h2>
                    <p className="subtitle-form-center" style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-texto-secundario)', marginBottom: '25px' }}>
                        Ingrese sus credenciales de acceso asignadas
                    </p>

                    {errorMsg && (
                        <div className="card-panel error-alert-panel" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'var(--color-peligro)', padding: '12px', color: 'var(--color-peligro)', fontSize: '14px', textAlign: 'center', fontWeight: '500', marginBottom: '15px' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={procesarLogin}>
                        <div className="form-group-spacing">
                            <label className="form-label">Nombre de Usuario o Correo</label>
                            <input 
                                type="text" 
                                className="input-custom" 
                                placeholder="ej: admin@colegio.com" 
                                value={usuario} 
                                onChange={e => setUsuario(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="form-group-spacing">
                            <label className="form-label">Contraseña</label>
                            <input 
                                type="password" 
                                className="input-custom" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-submit-block" disabled={cargando}>
                            {cargando ? "⏳ Autenticando en la Red..." : "Ingresar a la Intranet"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Login;