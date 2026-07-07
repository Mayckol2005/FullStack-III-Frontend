const API_URL = 'http://localhost:8080/api/evaluaciones';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Obtiene todas las notas de un estudiante en particular
export const obtenerNotasPorEstudiante = async (estudianteId) => {
    try {
        const urlFinal = `${API_URL}/estudiante/${estudianteId}`;
        console.log("📡 [EvaluacionService] Buscando notas en:", urlFinal);
        
        const respuesta = await fetch(urlFinal, { headers: getAuthHeaders() });
        if (!respuesta.ok) {
            console.warn(`⚠️ Respuesta no OK del servidor: ${respuesta.status}`);
            return [];
        }
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error obteniendo notas:", error);
        return [];
    }
};