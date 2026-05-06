// js/servicios/usuarioServicio.js

const URL_BASE = 'http://localhost:8092/api/usuarios';

// Función auxiliar para obtener el token guardado
function obtenerCabeceras() {
    const token = localStorage.getItem('token_colegio');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Aquí mostramos el pase VIP al guardia
    };
}

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch(URL_BASE, {
            method: 'GET',
            headers: obtenerCabeceras() 
        });
        if (!respuesta.ok) throw new Error('Error al obtener usuarios');
        return await respuesta.json();
    } catch (error) {
        console.error("Error en la conexión:", error);
        return [];
    }
}

async function crearUsuario(nuevoUsuario) {
    try {
        const respuesta = await fetch(`${URL_BASE}/crear`, {
            method: 'POST',
            headers: obtenerCabeceras(), // Aquí mostramos el pase VIP al guardia
            body: JSON.stringify(nuevoUsuario)
        });
        
        if (!respuesta.ok) throw new Error('Error al crear usuario');
        return await respuesta.json();
    } catch (error) {
        console.error("Error al guardar:", error);
        return null;
    }
}

// --- NUEVOS CAMBIOS AGREGADOS ---

// Función para eliminar un usuario en el backend (DELETE)
async function eliminarUsuarioBD(id) {
    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            method: 'DELETE',
            headers: obtenerCabeceras() 
        });
        
        // Retorna true si la respuesta fue exitosa (200 OK o 204 No Content)
        return respuesta.ok; 
    } catch (error) {
        console.error("Error al eliminar usuario en el servidor:", error);
        return false;
    }
}

// Función para actualizar un usuario existente (PUT)
async function actualizarUsuarioBD(id, usuarioActualizado) {
    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            method: 'PUT',
            headers: obtenerCabeceras(),
            body: JSON.stringify(usuarioActualizado)
        });
        
        if (!respuesta.ok) throw new Error('Error al actualizar usuario');
        return await respuesta.json(); // Retorna el usuario ya actualizado
    } catch (error) {
        console.error("Error al actualizar usuario en el servidor:", error);
        return null;
    }
}

async function actualizarUsuarioBD(id, usuarioActualizado) {
    try {
        const respuesta = await fetch(`${URL_BASE}/${id}`, {
            method: 'PUT',
            headers: obtenerCabeceras(),
            body: JSON.stringify(usuarioActualizado)
        });
        
        if (!respuesta.ok) throw new Error('Error al actualizar');
        return await respuesta.json(); 
    } catch (error) {
        console.error("Error en PUT:", error);
        return null;
    }
}