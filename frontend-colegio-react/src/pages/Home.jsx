import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    // Tu imagen de la base de datos confirma que el rol se guarda como 'ADMINISTRADOR'
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
                    
                    {/* Botón 1: Solo el Admin ve Usuarios */}
                    {rol === 'ADMINISTRADOR' && (
                        <button onClick={() => navigate('/usuarios')} className="btn" style={{ width: '300px' }}>
                            <i className="fas fa-users-cog" style={{marginRight: '8px'}}></i> Gestión de Usuarios
                        </button>
                    )}

                    {/* Botón 2: Admin y Profesor ven Estudiantes (OCULTO TEMPORALMENTE) */}
                    {/* {(rol === 'ADMINISTRADOR' || rol === 'PROFESOR') && (
                        <button onClick={() => navigate('/estudiantes')} className="btn" style={{ width: '300px', backgroundColor: '#28a745' }}>
                            <i className="fas fa-user-graduate" style={{marginRight: '8px'}}></i> Gestión de Estudiantes
                        </button>
                    )}
                    */}

                    {/* Botón 3: Todos ven Mi Perfil */}
                    <button className="btn" style={{ width: '300px', backgroundColor: '#6c757d' }}>
                        <i className="fas fa-user" style={{marginRight: '8px'}}></i> Mi Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;