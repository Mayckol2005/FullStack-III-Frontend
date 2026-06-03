import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import "../../styles/globals.css";
import logoColegio from '../../assets/logos/logo-colegio.png';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [cargando, setCargando] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const procesarLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setCargando(true);

        try {
            const resultado = await login(usuario, password);
            setCargando(false);

            if (resultado && resultado.exito) {
                const rolUsuario = resultado.rol; 

                if (rolUsuario === 'ADMINISTRADOR') {
                    navigate('/home');
                } else if (rolUsuario === 'PROFESOR') {
                    navigate('/profesor');
                } else if (rolUsuario === 'ALUMNO' || rolUsuario === 'ESTUDIANTE') {
                    navigate('/alumno');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMsg(resultado?.msg || 'Credenciales inválidas');
            }
        } catch (err) {
            setCargando(false);
            setErrorMsg('Error de conexión con el servidor');
        }
    };

    return (
        <div className="landing-wrapper">
            <nav className="landing-nav">
                <div className="landing-nav-brand">
                    <img src={logoColegio} alt="Logo CBO" className="nav-logo-brand" style={{ height: '40px' }} />
                    <span>Colegio Bernardo O'Higgins</span>
                </div>
                <button className="btn-primary" onClick={() => navigate('/')}>← Volver al Sitio</button>
            </nav>

            <main className="landing-main main-form-wrapper" style={{ maxWidth: '800px', marginTop: '50px' }}>
                <div className="card-panel" style={{ padding: '45px 50px' }}>
                    <h2 className="form-label brand-title-center" style={{ fontSize: '22px', textAlign: 'center', color: 'var(--color-primario)' }}>
                        Portal Intranet Institucional
                    </h2>
                    {errorMsg && <div role="alert" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{errorMsg}</div>}
                    <form onSubmit={procesarLogin}>
    <div className="form-group-spacing">
        <label htmlFor="usuario" className="form-label">Nombre de Usuario o Correo</label>
        <input 
            id="usuario" 
            type="text" 
            className="input-custom" 
            value={usuario} 
            onChange={e => setUsuario(e.target.value)} 
            required 
        />
    </div>
    <div className="form-group-spacing">
        <label htmlFor="password" className="form-label">Contraseña</label>
        <input 
            id="password" 
            type="password" 
            className="input-custom" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
        />
    </div>
    <button type="submit" className="btn-primary btn-submit-block" disabled={cargando}>
        {cargando ? "⏳ Autenticando..." : "Ingresar a la Intranet"}
    </button>
</form>
                </div>
            </main>
        </div>
    );
}
export default Login;