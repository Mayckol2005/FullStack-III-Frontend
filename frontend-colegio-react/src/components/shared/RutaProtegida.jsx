import { Navigate } from 'react-router-dom';

function RutaProtegida({ children, rolRequerido }) {
    const token = localStorage.getItem('token_colegio');
    const rol = localStorage.getItem('usuario_rol');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (rolRequerido && rol !== rolRequerido) {
        alert("Acceso denegado. No cuentas con los privilegios requeridos.");
        return <Navigate to="/home" replace />; 
    }

    return children;
}

export default RutaProtegida;