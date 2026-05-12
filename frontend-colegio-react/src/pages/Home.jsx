import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const rol = localStorage.getItem('usuario_rol'); 

    const handleCerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="contenedor">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Inicio</h1>
                <button onClick={handleCerrarSesion} className="btn" style={{ backgroundColor: '#dc3545' }}>
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <h2>Bienvenido</h2>
                <p>Tu rol actual es: <strong>{rol}</strong></p>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    
                    {/* SOLO EL ADMIN VE ESTO */}
                    {rol === 'ADMINISTRADOR' && (
                        <button onClick={() => navigate('/usuarios')} className="btn" style={{ width: '300px' }}>
                            <i className="fas fa-users-cog"></i> Gestión de Usuarios
                        </button>
                    )}

                    <button className="btn" style={{ width: '300px', backgroundColor: '#6c757d' }}>
                        <i className="fas fa-user"></i> Mi Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;