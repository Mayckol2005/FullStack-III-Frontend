const API_URL = 'http://localhost:8090/api/estudiantes'; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerEstudiantes = async () => {
    try {
        const respuesta = await fetch(API_URL, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
        return [];
    }
};

export const crearEstudiante = async (estudiante) => {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(estudiante)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error creando estudiante:", error);
        return false;
    }
};

// --- RESTAURADO: ACTUALIZAR ---
export const actualizarEstudianteBD = async (id, estudiante) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(estudiante)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error actualizando estudiante:", error);
        return false;
    }
};

// --- RESTAURADO: ELIMINAR ---
export const eliminarEstudianteBD = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error eliminando estudiante:", error);
        return false;
    }
};