const API_URL = 'http://localhost:8080/api/usuarios';

const obtenerCabeceras = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token_colegio')}`
});

const leerRespuesta = async (res) => {
    const texto = await res.text();
    if (!texto) return null;

    try {
        return JSON.parse(texto);
    } catch {
        return texto;
    }
};

const formatearError = (data) => {
    if (!data) return 'No se pudo crear el usuario.';
    if (typeof data === 'string') return data;
    if (data.mensaje) return data.mensaje;
    if (data.message) return data.message;
    if (data.error) return data.error;

    return Object.entries(data)
        .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
        .join(' | ');
};

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
        const res = await fetch(`${API_URL}/crear`, {
            method: 'POST',
            headers: obtenerCabeceras(),
            body: JSON.stringify(usuario)
        });
        const data = await leerRespuesta(res);

        if (!res.ok) {
            return {
                exito: false,
                mensaje: formatearError(data)
            };
        }

        return {
            exito: true,
            usuario: data
        };
    } catch (error) {
        console.error("Error creando usuario:", error);
        return {
            exito: false,
            mensaje: 'Error de conexión al crear el usuario.'
        };
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
