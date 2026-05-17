import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 
import Login from './pages/Login';
import Home from './pages/Home';
import Usuarios from './pages/admin/Usuarios';       
import Estudiantes from './pages/admin/Estudiantes'; 
import ProfesorRoutes from './pages/profesor/ProfesorRoutes';
import RutaProtegida from './components/shared/RutaProtegida';

function App() {
    return (
        <Router>
            <Routes>
                {/* 🌐 VISTA GENERAL PÚBLICA */}
                <Route path="/" element={<LandingPage />} />
                
                {/* 🔑 Formulario de Acceso a la Intranet */}
                <Route path="/login" element={<Login />} />
                
                {/* 🔒 Intranet Común (Dashboard Base) */}
                <Route path="/home" element={ 
                    <RutaProtegida><Home /></RutaProtegida> 
                } />

                {/* 🎛️ INTRANET VISTA ADMIN (Mayckol) */}
                <Route path="/admin" element={ 
                    <RutaProtegida rolRequerido="ADMINISTRADOR"><Home /></RutaProtegida> 
                } />
                <Route path="/usuarios" element={ 
                    <RutaProtegida rolRequerido="ADMINISTRADOR"><Usuarios /></RutaProtegida> 
                } />
                <Route path="/estudiantes" element={ 
                    <RutaProtegida rolRequerido="ADMINISTRADOR"><Estudiantes /></RutaProtegida> 
                } />
                
                {/* 👨‍🏫 INTRANET VISTA PROFESOR (Francisco) */}
                <Route path="/profesor/*" element={ 
                    <RutaProtegida rolRequerido="PROFESOR"><ProfesorRoutes /></RutaProtegida> 
                } />

                {/* Fallback de redirección */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;