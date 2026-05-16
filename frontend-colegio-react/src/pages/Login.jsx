import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService';
import '../styles/estilos.css';

function Login() {
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await iniciarSesion(credenciales.email, credenciales.password);
            
            if (data && data.token) {
                localStorage.setItem('token_colegio', data.token);
                localStorage.setItem('usuario_rol', data.rol); 
                
                // Redirección Inteligente según el Rol del JWT
                if (data.rol === 'PROFESOR') {
                    navigate('/profesor');
                } else {
                    navigate('/home');
                }
            } else {
                setError("Credenciales incorrectas");
            }
        } catch (err) {
            setError("Error al conectar con el servidor o credenciales inválidas");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-fondo)' }}>
            <div className="card-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src="/logo-colegio.png" alt="Logo Colegio" style={{ height: '70px', marginBottom: '15px' }} />
                    <h1 style={{ fontSize: '24px', color: 'var(--color-primario)', margin: 0 }}>Portal Escolar</h1>
                    <p style={{ color: 'var(--color-texto-secundario)', margin: '5px 0 0 0' }}>Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="form-label">Correo Electrónico</label>
                        <input type="email" name="email" placeholder="ejemplo@colegio.cl" onChange={handleChange} required className="input-custom" />
                    </div>
                    <div>
                        <label className="form-label">Contraseña</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="input-custom" />
                    </div>

                    {error && <p style={{ color: 'var(--color-peligro)', margin: 0, fontSize: '14px', fontWeight: '600' }}>⚠️ {error}</p>}
                    
                    <button type="submit" className="btn-primary" style={{ padding: '14px', width: '100%', marginTop: '10px' }}>
                        Ingresar al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;