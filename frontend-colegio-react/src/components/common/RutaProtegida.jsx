import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout'; 

function RutaProtegida({ children, rolRequerido }) {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');

    // Si no hay token, directo al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si se exige un rol y el tuyo no coincide (normalizado a mayúsculas)
    if (rolRequerido && rol?.toUpperCase() !== rolRequerido.toUpperCase()) {
        return <Navigate to="/login" replace />; 
    }

    // Acceso concedido: Envolvemos las vistas (children) dentro del Layout maestro
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}

export default RutaProtegida;