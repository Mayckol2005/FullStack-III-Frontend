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