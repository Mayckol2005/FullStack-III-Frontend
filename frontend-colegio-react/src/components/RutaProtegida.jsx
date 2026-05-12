import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, rolRequerido }) {
    // Leemos lo que guardamos en el Login
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');

    // 1er Filtro: ¿Está logueado?
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2do Filtro: ¿Tiene el rol correcto? (Si es que exigimos un rol)
    if (rolRequerido && rol !== rolRequerido) {
        alert("Acceso denegado. Solo administradores pueden ver esta sección.");
        // Si tuvieras un dashboard de alumno/profe, lo mandarías ahí. 
        // Por ahora lo devolvemos al login.
        return <Navigate to="/login" replace />; 
    }

    // Si pasa los filtros, le mostramos la página que pidió
    return children;
}

export default RutaProtegida;