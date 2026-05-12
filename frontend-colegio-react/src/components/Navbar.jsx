import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const rol = localStorage.getItem('usuario_rol');

    const handleCerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '1rem 2rem', 
            backgroundColor: '#343a40', 
            color: 'white',
            marginBottom: '20px' 
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>SISTEMA ESCOLAR</Link>
                
                {/* Links condicionales */}
                {(rol === 'ADMINISTRADOR' || rol === 'PROFESOR') && (
                    <Link to="/estudiantes" style={{ color: 'white', textDecoration: 'none' }}>Estudiantes</Link>
                )}
                
                {rol === 'ADMINISTRADOR' && (
                    <Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>Usuarios</Link>
                )}
            </div>

            <button onClick={handleCerrarSesion} style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px',
                cursor: 'pointer' 
            }}>
                Salir
            </button>
        </nav>
    );
}

export default Navbar;