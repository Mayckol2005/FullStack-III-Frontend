const API_URL = 'http://localhost:8080/api/usuarios';

const obtenerCabeceras = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token_colegio')}`
});

export const obtenerUsuarios = async () => {
    try {
        const res = await fetch(API_URL, { headers: obtenerCabeceras() });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        return [];
    }
};

export const crearUsuario = async (usuario) => {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: obtenerCabeceras(),
            body: JSON.stringify(usuario)
        });
        return res.ok;
    } catch (error) {
        console.error("Error creando usuario:", error);
        return false;
    }
};

export const actualizarUsuarioBD = async (id, usuario) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: obtenerCabeceras(),
            body: JSON.stringify(usuario)
        });
        return res.ok;
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return false;
    }
};

export const eliminarUsuarioBD = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: obtenerCabeceras()
        });
        return res.ok;
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        return false;
    }
};