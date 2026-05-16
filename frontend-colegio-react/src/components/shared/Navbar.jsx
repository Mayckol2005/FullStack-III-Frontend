import { useNavigate, Link } from 'react-router-dom';
import '../../styles/estilos.css';

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
            alignItems: 'center',
            padding: '15px 40px', 
            backgroundColor: 'var(--color-superficie)', 
            borderBottom: '1px solid var(--color-borde)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <img src="/logo-colegio.png" alt="Logo" style={{ height: '35px' }} />
                    <span style={{ color: 'var(--color-primario)', fontWeight: 'bold', fontSize: '18px' }}>SISTEMA ESCOLAR</span>
                </Link>
                
                {/* Enlaces Condicionales Limpios */}
                {(rol === 'ADMINISTRADOR' || rol === 'PROFESOR') && (
                    <Link to="/estudiantes" style={{ color: 'var(--color-texto-principal)', textDecoration: 'none', fontWeight: '500' }}>Estudiantes</Link>
                )}
                
                {rol === 'ADMINISTRADOR' && (
                    <Link to="/usuarios" style={{ color: 'var(--color-texto-principal)', textDecoration: 'none', fontWeight: '500' }}>Usuarios</Link>
                )}

                {rol === 'PROFESOR' && (
                    <Link to="/profesor" style={{ color: 'var(--color-texto-principal)', textDecoration: 'none', fontWeight: '500' }}>👨‍🏫 Mi Aula</Link>
                )}
            </div>

            <button onClick={handleCerrarSesion} className="btn-primary" style={{ backgroundColor: 'var(--color-peligro)', padding: '8px 16px' }}>
                Cerrar Sesión
            </button>
        </nav>
    );
}

export default Navbar;