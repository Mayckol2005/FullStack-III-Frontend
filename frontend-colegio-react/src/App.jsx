import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Home from './pages/Home';

// Componente para proteger rutas de administrador
const RutaAdmin = ({ children }) => {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');

    if (!token) return <Navigate to="/login" />;
    if (rol !== 'ADMINISTRADOR') return <Navigate to="/home" />; // Si no es admin, lo manda a la home
    return children;
};

// Componente para proteger la Home (cualquier usuario logueado)
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
                
                {/* Página principal para TODOS los que inicien sesión */}
                <Route path="/home" element={
                    <RutaPrivada>
                        <Home />
                    </RutaPrivada>
                } />

                {/* Solo accesible por el ADMINISTRADOR */}
                <Route path="/usuarios" element={
                    <RutaAdmin>
                        <Usuarios />
                    </RutaAdmin>
                } />
                
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;