const API_BASE = 'http://localhost:8080/api/academico';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// 🏫 Conectado con CursoController.java -> GET /api/academico/cursos
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

// 🏫 Conectado con CursoController.java -> POST /api/academico/cursos
export const crearCurso = async (cursoData) => {
    try {
        const respuesta = await fetch(`${API_BASE}/cursos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(cursoData)
        });
        // Tus controladores responden con HttpStatus.CREATED (201)
        return respuesta.status === 201 || respuesta.ok;
    } catch (error) {
        console.error("Error creando nuevo curso en el backend:", error);
        return false;
    }
};

// 📚 Conectado con AsignaturaController.java -> GET /api/academico/asignaturas (¡Optimizado!)
export const obtenerAsignaturas = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/asignaturas`, { headers: getAuthHeaders() });
        if (!respuesta.ok) return [];
        return await respuesta.json();
    } catch (error) {
        console.error("Error consultando catálogo global de asignaturas:", error);
        return [];
    }
};

// 📚 Conectado con AsignaturaController.java -> POST /api/academico/asignaturas
export const crearAsignatura = async (asignaturaData) => {
    try {
        const respuesta = await fetch(`${API_BASE}/asignaturas`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(asignaturaData)
        });
        // Tu controlador responde con HttpStatus.CREATED (201)
        return respuesta.status === 201 || respuesta.ok;
    } catch (error) {
        console.error("Error creando nueva asignatura en el backend:", error);
        return false;
    }
};

// ✏️ NUEVO: Conectado con AsignaturaController.java -> PUT /api/academico/asignaturas/{id}
export const actualizarAsignatura = async (id, asignaturaData) => {
    try {
        const respuesta = await fetch(`${API_BASE}/asignaturas/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(asignaturaData)
        });
        // Retornamos true si la respuesta es exitosa (200 OK)
        return respuesta.ok;
    } catch (error) {
        console.error("Error actualizando la asignatura en el backend:", error);
        return false;
    }
};

// 🗑️ NUEVO: Conectado con AsignaturaController.java -> DELETE /api/academico/asignaturas/{id}
export const eliminarAsignatura = async (id) => {
    try {
        const respuesta = await fetch(`${API_BASE}/asignaturas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        // Retornamos true si responde HttpStatus.NO_CONTENT (204) o 200 OK
        return respuesta.status === 204 || respuesta.ok;
    } catch (error) {
        console.error("Error eliminando la asignatura en el backend:", error);
        return false;
    }
};

// Conservamos tu método original por si lo requieres en otra sección
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