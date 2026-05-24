import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 
import Login from './pages/Login';
import Home from './pages/Home';
import Usuarios from './pages/admin/Usuarios';       
import Estudiantes from './pages/admin/Estudiantes'; 
import ProfesorRoutes from './pages/profesor/ProfesorRoutes';
import RutaProtegida from './components/shared/RutaProtegida';
import Navbar from './components/shared/Navbar';

function Layout({ children }) {
    const location = useLocation();
    const isPublic = location.pathname === '/' || location.pathname === '/login';

    return (
        <>
            {!isPublic && <Navbar />}
            <div className={!isPublic ? "main-content" : ""}>
                {children}
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* 🌐 VISTA GENERAL PÚBLICA */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* 🔒 Intranet Común */}
                    <Route path="/home" element={ 
                        <RutaProtegida><Home /></RutaProtegida> 
                    } />

                    {/* 🎛️ VISTA ADMIN */}
                    <Route path="/usuarios" element={ 
                        <RutaProtegida rolRequerido="ADMINISTRADOR"><Usuarios /></RutaProtegida> 
                    } />
                    <Route path="/estudiantes" element={ 
                        <RutaProtegida rolRequerido="ADMINISTRADOR"><Estudiantes /></RutaProtegida> 
                    } />
                    
                    {/* 👨‍🏫 VISTA PROFESOR */}
                    <Route path="/profesor/*" element={ 
                        <RutaProtegida rolRequerido="PROFESOR"><ProfesorRoutes /></RutaProtegida> 
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;