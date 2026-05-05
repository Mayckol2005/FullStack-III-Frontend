// js/vistas/usuarioVista.js

document.addEventListener('DOMContentLoaded', () => {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-usuarios');
    const formulario = document.getElementById('formulario-crear-usuario');

    async function cargarTabla() {
        // ACTUALIZADO: Aumentamos el colspan a 7 por la nueva columna Contraseña
        cuerpoTabla.innerHTML = '<tr><td colspan="7">Cargando datos...</td></tr>';
        
        const listaUsuarios = await obtenerUsuarios();
        cuerpoTabla.innerHTML = ''; 

        if (listaUsuarios.length === 0) {
            // ACTUALIZADO: Aumentamos el colspan a 7 aquí también
            cuerpoTabla.innerHTML = '<tr><td colspan="7">No hay usuarios registrados.</td></tr>';
            return;
        }

        listaUsuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class="acciones-cell">
                    <button class="btn-icon btn-edit" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="fas fa-pencil-alt"></i>
                    </button> 
                    <button class="btn-icon btn-delete" onclick="eliminarUsuario(${usuario.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
                <td>${usuario.id}</td>
                <td>${usuario.rut}</td> 
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>••••••••</td> <td><strong>${usuario.rol}</strong></td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 

        const usuarioData = {
            rut: document.getElementById('input-rut').value,           
            nombre: document.getElementById('input-nombre').value,
            email: document.getElementById('input-email').value,
            password: document.getElementById('input-password').value, 
            rol: document.getElementById('select-rol').value
        };

        const resultado = await crearUsuario(usuarioData);

        if (resultado) {
            alert("¡Usuario creado exitosamente!");
            formulario.reset(); 
            cargarTabla(); 
        }
    });

    cargarTabla();
});

// --- FUNCIONES DE ACCIÓN ---

function editarUsuario(id) {
    console.log("Editando usuario con ID:", id);
    alert("Función para editar el usuario con ID " + id + " llamada.");
}

async function eliminarUsuario(id) {
    console.log("Eliminando usuario con ID:", id);
    const confirmar = confirm("¿Estás seguro de que deseas eliminar permanentemente este usuario con ID " + id + "?");
    if (confirmar) {
        alert("Usuario con ID " + id + " eliminado con éxito.");
    }
}