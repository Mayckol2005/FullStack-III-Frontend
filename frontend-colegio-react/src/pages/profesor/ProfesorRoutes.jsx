import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProfesorDashboard from './ProfesorDashboard';
import Asistencia from './Asistencia';
import Evaluaciones from './Evaluaciones';
import Anotaciones from './Anotaciones';
import '../../styles/estilos.css';

function ProfesorRoutes() {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div>
            {/* Menú de navegación común exclusivo para la sección del Docente */}
            <nav style={{ 
                backgroundColor: 'var(--color-primario)', 
                padding: '15px 40px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link to="/profesor" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>🏠 Mi Aula</Link>
                    <Link to="/profesor/evaluaciones" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px' }}>📊 Calificaciones</Link>
                    <Link to="/profesor/asistencia" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px' }}>📅 Libro Asistencia</Link>
                    <Link to="/profesor/anotaciones" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px' }}>📝 Hoja de Vida</Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#ffffff', fontSize: '14px', opacity: 0.9 }}>👨‍🏫 Módulo Profesor</span>
                    <button onClick={handleCerrarSesion} className="btn-primary" style={{ backgroundColor: 'var(--color-secundario)', padding: '8px 16px' }}>
                        Salir Portal
                    </button>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<ProfesorDashboard />} />
                <Route path="/asistencia" element={<Asistencia />} />
                <Route path="/evaluaciones" element={<Evaluaciones />} />
                <Route path="/anotaciones" element={<Anotaciones />} />
            </Routes>
        </div>
    );
}

export default ProfesorRoutes;