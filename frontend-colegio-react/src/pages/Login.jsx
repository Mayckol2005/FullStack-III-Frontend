import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService';

function Login() {
    // Estados para los inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
    e.preventDefault();
    setError(false);

    try {
        const datos = await iniciarSesion(email, password);
        
        // GUARDAMOS AMBOS DATOS:
        localStorage.setItem('token_colegio', datos.token);
        localStorage.setItem('usuario_rol', datos.rol); 

        navigate('/usuarios');
    } catch (err) {
        setError(true);
    }
};

    return (
        <div className="contenedor" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <h1 style={{ textAlign: 'center' }}>Acceso al Sistema</h1>
            
            <form onSubmit={manejarEnvio}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px' }} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px' }} 
                        required 
                    />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Ingresar</button>
            </form>

            {error && (
                <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                    Credenciales incorrectas.
                </p>
            )}
        </div>
    );
}

export default Login;