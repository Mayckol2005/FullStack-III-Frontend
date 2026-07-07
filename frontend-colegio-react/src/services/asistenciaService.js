const API_URL = 'http://localhost:8080/api/asistencias';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Obtiene el registro de asistencia de un estudiante
export const obtenerAsistenciaPorEstudiante = async (estudianteId) => {
    try {
        const urlFinal = `${API_URL}/estudiante/${estudianteId}`;
        console.log("📡 [AsistenciaService] Buscando asistencia en:", urlFinal);
        
        const respuesta = await fetch(urlFinal, { headers: getAuthHeaders() });
        if (!respuesta.ok) {
            console.warn(`⚠️ Respuesta no OK del servidor: ${respuesta.status}`);
            return [];
        }
        return await respuesta.json();
    } catch (error) {
        console.error("❌ Error obteniendo asistencia:", error);
        return [];
    }
};