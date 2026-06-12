import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage.jsx';
import Login from '../pages/public/Login.jsx';
import Home from '../pages/shared/Home.jsx';
import RutaProtegida from '../components/common/RutaProtegida.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import ProfesorRoutes from '../pages/profesor/ProfesorRoutes.jsx';
import Estudiantes from '../pages/admin/Estudiantes.jsx';
import Usuarios from '../pages/admin/Usuarios.jsx';
import Cursos from '../pages/admin/Cursos.jsx';

const AppRoutes = () => {
  const { autenticado, cargando } = useAuth();
  if (cargando) return <Loader />;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!autenticado ? <Login /> : <Navigate to="/home" replace />} />
      <Route path="/home" element={<RutaProtegida><Home /></RutaProtegida>} />
      <Route path="/profesor/*" element={<RutaProtegida rolRequerido="PROFESOR"><ProfesorRoutes /></RutaProtegida>} />
      <Route path="/admin/estudiantes" element={<RutaProtegida rolRequerido="ADMINISTRADOR"><Estudiantes /></RutaProtegida>} />
      <Route path="/admin/usuarios" element={<RutaProtegida rolRequerido="ADMINISTRADOR"><Usuarios /></RutaProtegida>} />
      <Route path="/admin/cursos" element={<RutaProtegida rolRequerido="ADMINISTRADOR"><Cursos /></RutaProtegida>} />
      <Route path="/admin/cursos" element={<RutaProtegida rolRequerido="ADMINISTRADOR"><Cursos /></RutaProtegida>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;