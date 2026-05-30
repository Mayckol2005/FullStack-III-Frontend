const API_BASE = 'http://localhost:8080/api/academico';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Conectado con CursoController.java -> GET /api/academico/cursos
export const obtenerCursosReal = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/cursos`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error consultando cursos del backend:", error);
        return [];
    }
};

// Conectado con AsignaturaController.java -> GET /api/academico/asignaturas/curso/{cursoId}
export const obtenerAsignaturasPorCursoReal = async (cursoId) => {
    try {
        const respuesta = await fetch(`${API_BASE}/asignaturas/curso/${cursoId}`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error consultando asignaturas por curso:", error);
        return [];
    }
};