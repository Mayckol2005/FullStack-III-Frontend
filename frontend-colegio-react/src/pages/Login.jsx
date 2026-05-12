import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Corregimos la importación para usar el nombre exacto de tu función
import { iniciarSesion } from '../services/authService';

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
            // Pasamos el email y la contraseña separados, tal como lo pide tu authService.js
            const data = await iniciarSesion(credenciales.email, credenciales.password);
            
            if (data && data.token) {
                localStorage.setItem('token_colegio', data.token);
                // Asegúrate de que tu backend esté enviando el 'rol' junto con el token
                localStorage.setItem('usuario_rol', data.rol); 
                
                // Redirección forzada a la página principal
                navigate('/home'); 
            } else {
                setError("Credenciales incorrectas");
            }
        } catch (err) {
            setError("Error al conectar con el servidor o credenciales inválidas");
        }
    };

    return (
        <div className="contenedor">
            <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center', padding: '40px 0' }}>
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Correo" 
                        onChange={handleChange} 
                        required 
                        className="input-form" 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Clave" 
                        onChange={handleChange} 
                        required 
                        className="input-form" 
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" className="btn">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;