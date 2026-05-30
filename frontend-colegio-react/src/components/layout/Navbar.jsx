import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoColegio from '../../assets/logos/logo-colegio.png';

function Navbar() {
    const [busqueda, setBusqueda] = useState('');
    const rol = localStorage.getItem('usuario_rol');

    const handleCerrarSesion = () => {
        localStorage.clear(); // Borra el token
        window.location.href = '/login'; 
    };

    return (
        <nav className="navbar-container">
            <div className="nav-links">
                <Link to="/home" className="nav-brand">
                    <img src={logoColegio} alt="Logo" style={{ height: '35px' }} />
                    <span>SISTEMA ESCOLAR</span>
                </Link>
                
                {/* Links del Profesor */}
                {rol === 'PROFESOR' && (
                    <>
                        <Link to="/profesor/evaluaciones" className="nav-link">📊 Calificaciones</Link>
                        <Link to="/profesor/asistencia" className="nav-link">📅 Asistencia</Link>
                        <Link to="/profesor/anotaciones" className="nav-link">📝 Hoja de Vida</Link>
                    </>
                )}

                {/* Links de Admin */}
                {rol === 'ADMINISTRADOR' && (
                    <>
                        <Link to="/estudiantes" className="nav-link">Estudiantes</Link>
                        <Link to="/usuarios" className="nav-link">Usuarios</Link>
                    </>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <form className="search-bar-container" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    <span>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscador en desarrollo..." 
                        className="search-input" 
                        disabled 
                    />
                </form>

                <button onClick={handleCerrarSesion} className="btn-primary" style={{ backgroundColor: 'var(--color-peligro)', padding: '8px 16px' }}>
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;