const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerCursosReal = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/academico/cursos`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo cursos reales:", error);
        return [];
    }
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

export const crearAnotacionBD = async (anotacion) => {
    try {
        const respuesta = await fetch(`${API_BASE}/anotaciones`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(anotacion)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error al persistir anotación:", error);
        return false;
    }
};

export const crearAsistenciaBD = async (asistencia) => {
    try {
        const respuesta = await fetch(`${API_BASE}/asistencia`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(asistencia)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error al persistir asistencia:", error);
        return false;
    }
};

export const crearEvaluacionBD = async (evaluacion) => {
    try {
        const respuesta = await fetch(`${API_BASE}/evaluaciones`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(evaluacion)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error al persistir calificación:", error);
        return false;
    }
};

export const obtenerAvisosInstitucionales = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/comunicaciones`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo avisos del mural:", error);
        return [];
    }
};