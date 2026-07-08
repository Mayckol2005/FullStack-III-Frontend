import apiClient from '../api/apiClient';
import { saveToken, saveUserRole, removeToken } from '../utils/storage';

export const login = async (username, password) => {
    try {
        const respuesta = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: username, password })
        });
        
        if (respuesta && respuesta.token) {
            saveToken(respuesta.token);
            saveUserRole(respuesta.rol || 'ESTUDIANTE');

            localStorage.setItem('usuario_nombre', respuesta.nombre);
            localStorage.setItem('usuario_id', respuesta.id);
            localStorage.setItem('usuario_email', username);

            return {
                exito: true,
                rol: respuesta.rol,
                token: respuesta.token
            };
        }
        
        return { 
            exito: false, 
            msg: respuesta?.msg || 'Credenciales inválidas' 
        };
    } catch (error) {
        const mensajeError = error.message || 'Error de conexión con el servidor';
        return { 
            exito: false, 
            msg: mensajeError 
        };
    }
};

export const cerrarSesion = () => {
    removeToken();
};
