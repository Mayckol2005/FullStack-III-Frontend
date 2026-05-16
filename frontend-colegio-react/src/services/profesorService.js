const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerEvaluaciones = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/evaluaciones`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo evaluaciones:", error);
        return [];
    }
};

export const obtenerAnotaciones = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/anotaciones`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo anotaciones:", error);
        return [];
    }
};

export const obtenerAsistencias = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/asistencia`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        return [];
    }
};