const API_URL = 'http://localhost:8092/api/usuarios';

const obtenerCabeceras = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token_colegio')}`
});

export const obtenerUsuarios = async () => {
    const res = await fetch(API_URL, { headers: obtenerCabeceras() });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
};

export const crearUsuario = async (usuario) => {
    const res = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: obtenerCabeceras(),
        body: JSON.stringify(usuario)
    });
    return await res.json();
};

export const actualizarUsuarioBD = async (id, usuario) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: obtenerCabeceras(),
        body: JSON.stringify(usuario)
    });
    return await res.json();
};

export const eliminarUsuarioBD = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: obtenerCabeceras()
    });
    return res.ok;
};