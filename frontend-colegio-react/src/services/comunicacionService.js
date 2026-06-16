// ATENCIÓN: Cambia el 8080 por el puerto donde corra tu microservicio de Comunicaciones (Ej: 8081, 8082, etc.)
// Si corre en el mismo proyecto monolítico, déjalo en 8080.
const API_BASE = 'http://localhost:8080/api'; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerAvisos = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/comunicaciones`, { 
            headers: getAuthHeaders() 
        });
        
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener las comunicaciones del servidor:", error);
        return [];
    }
};

export const crearAviso = async (avisoData) => {
    try {
        // 💡 AQUÍ ESTÁ LA MAGIA: 
        // Tomamos el título y contenido que vienen del formulario (...avisoData)
        // y le inyectamos automáticamente el remitente que exige el servidor.
        const datosConRemitente = {
            ...avisoData,
            remitente: "Dirección Académica" // <-- Valor estático por defecto
        };

        const respuesta = await fetch(`${API_BASE}/comunicaciones`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(datosConRemitente) // Enviamos el objeto modificado
        });
        
        // Retorna true si se guardó con éxito (código 200 o 201)
        return respuesta.status === 201 || respuesta.ok;
    } catch (error) {
        console.error("Error al crear la comunicación en el servidor:", error);
        return false;
    }
};

// 🗑️ NUEVA FUNCIÓN: Conexión para eliminar comunicados del mural
export const eliminarAviso = async (id) => {
    try {
        const respuesta = await fetch(`${API_BASE}/comunicaciones/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        // Retorna true si el backend procesó el borrado correctamente (status 200-299)
        return respuesta.ok;
    } catch (error) {
        console.error("Error al eliminar la comunicación en el servidor:", error);
        return false;
    }
};