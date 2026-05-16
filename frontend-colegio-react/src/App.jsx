import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Usuarios from './pages/admin/Usuarios';       
import Estudiantes from './pages/admin/Estudiantes'; 

// 📁 Importación de tus rutas de profesor
import ProfesorRoutes from './pages/profesor/ProfesorRoutes';

// Seguridad estricta solo para ADMIN
const RutaAdmin = ({ children }) => {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');
    if (!token) return <Navigate to="/login" />;
    if (rol !== 'ADMINISTRADOR') return <Navigate to="/home" />; 
    return children;
};

// Seguridad para ADMIN y PROFESOR (Ambos pueden ver alumnos)
const RutaAdminOProfesor = ({ children }) => {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');
    if (!token) return <Navigate to="/login" />;
    if (rol !== 'ADMINISTRADOR' && rol !== 'PROFESOR') return <Navigate to="/home" />; 
    return children;
};

// Seguridad estricta solo para PROFESOR
const RutaProfesor = ({ children }) => {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');
    if (!token) return <Navigate to="/login" />;
    if (rol !== 'PROFESOR') return <Navigate to="/home" />; 
    return children;
};

// Seguridad básica: debe estar logueado
const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token_colegio');
    if (!token) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* 🌐 Rutas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* 🔒 Rutas Privadas Comunes */}
                <Route path="/home" element={ <RutaPrivada><Home /></RutaPrivada> } />

                {/* 🎛️ Rutas de Administrador */}
                <Route path="/usuarios" element={ <RutaAdmin><Usuarios /></RutaAdmin> } />
                <Route path="/estudiantes" element={ <RutaAdminOProfesor><Estudiantes /></RutaAdminOProfesor> } />
                
                {/* 👨‍🏫 Rutas de Profesor */}
                <Route path="/profesor/*" element={ <RutaProfesor><ProfesorRoutes /></RutaProfesor> } />
            </Routes>
        </Router>
    );
}

export default App;