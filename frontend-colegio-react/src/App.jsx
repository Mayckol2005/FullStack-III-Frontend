import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Home from './pages/Home';
import Estudiantes from './pages/Estudiantes'; // <-- ¡IMPORTANTE! Importamos la vista

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
                <Route path="/login" element={<Login />} />
                
                <Route path="/home" element={ <RutaPrivada><Home /></RutaPrivada> } />

                <Route path="/usuarios" element={ <RutaAdmin><Usuarios /></RutaAdmin> } />
                
                {/* LA RUTA QUE FALTABA */}
                <Route path="/estudiantes" element={ <RutaAdminOProfesor><Estudiantes /></RutaAdminOProfesor> } />
                
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;