import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, rolRequerido }) {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');

    console.log("🛡️ [RutaProtegida] - Validando Acceso:");
    console.log("🔑 Token existente:", !!token);
    console.log("👤 Rol en sesión (BD):", rol);
    console.log("🎯 Rol Requerido por la vista:", rolRequerido);

    // 1. Si no hay token, directo al login
    if (!token) {
        console.warn("❌ Acceso denegado: No existe un token activo.");
        return <Navigate to="/login" replace />;
    }

    // 2. Si se exige un rol y el tuyo no coincide (normalizado a mayúsculas)
    if (rolRequerido && rol?.toUpperCase() !== rolRequerido.toUpperCase()) {
        console.error(`❌ Permiso Insuficiente. El rol '${rol}' no coincide con '${rolRequerido}'.`);
        alert("Acceso denegado. No cuentas con los privilegios requeridos.");
        
        // Redireccionamos a una ruta base real para evitar que te mande a un limbo invisible
        return <Navigate to="/login" replace />; 
    }

    // Acceso concedido
    console.log("🚀 Permisos validados con éxito. Renderizando panel...");
    return children;
}

export default RutaProtegida;