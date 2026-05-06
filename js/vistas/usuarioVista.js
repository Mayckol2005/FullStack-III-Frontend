// js/vistas/usuarioVista.js

let usuariosCargados = []; 
let contenidoOriginalFila = {}; // Diccionario para restaurar filas si se cancela

document.addEventListener('DOMContentLoaded', () => {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-usuarios');
    const formulario = document.getElementById('formulario-crear-usuario');

    window.cargarTabla = async function() {
        cuerpoTabla.innerHTML = '<tr><td colspan="7">Cargando datos...</td></tr>';
        usuariosCargados = await obtenerUsuarios();
        cuerpoTabla.innerHTML = ''; 

        if (usuariosCargados.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="7">No hay usuarios registrados.</td></tr>';
            return;
        }

        usuariosCargados.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.id = `fila-${usuario.id}`; 
            fila.innerHTML = `
                <td class="acciones-cell">
                    <button class="btn-icon btn-edit" onclick="editarUsuarioInline(${usuario.id})" title="Editar">
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
                <td>••••••••</td> 
                <td><strong>${usuario.rol}</strong></td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    // El formulario superior ahora queda exclusivo para crear nuevos registros
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

// --- EDICIÓN EN LÍNEA ---

function editarUsuarioInline(id) {
    const fila = document.getElementById(`fila-${id}`);
    const usuario = usuariosCargados.find(u => u.id === id);
    
    // Guardamos el estado actual por si cancela
    contenidoOriginalFila[id] = fila.innerHTML;

    // Convertimos cada celda en un campo editable directamente en la tabla
    fila.cells[2].innerHTML = `<input type="text" id="edit-rut-${id}" value="${usuario.rut}" style="width:100%">`;
    fila.cells[3].innerHTML = `<input type="text" id="edit-nombre-${id}" value="${usuario.nombre}" style="width:100%">`;
    fila.cells[4].innerHTML = `<input type="email" id="edit-email-${id}" value="${usuario.email}" style="width:100%">`;
    fila.cells[5].innerHTML = `<input type="password" id="edit-pass-${id}" placeholder="Nueva contraseña" style="width:100%">`;
    
    fila.cells[6].innerHTML = `
        <select id="edit-rol-${id}">
            <option value="ADMINISTRADOR" ${usuario.rol === 'ADMINISTRADOR' ? 'selected' : ''}>ADMINISTRADOR</option>
            <option value="PROFESOR" ${usuario.rol === 'PROFESOR' ? 'selected' : ''}>PROFESOR</option>
            <option value="ALUMNO" ${usuario.rol === 'ALUMNO' ? 'selected' : ''}>ALUMNO</option>
        </select>`;

    // Cambiamos los iconos por Check (Guardar) y Cross (Cancelar)
    fila.cells[0].innerHTML = `
        <button class="btn-icon btn-save" onclick="confirmarCambios(${id})" title="Guardar">
            <i class="fas fa-check" style="color: green"></i>
        </button>
        <button class="btn-icon btn-cancel" onclick="cancelarEdicion(${id})" title="Cancelar">
            <i class="fas fa-times" style="color: red"></i>
        </button>
    `;
}

// --- EL RECUADRO DE CONFIRMACIÓN ---

function confirmarCambios(id) {
    // El recuadro que pediste con SI y NO (Aceptar/Cancelar en el navegador)
    const respuesta = confirm("¿Deseas confirmar los cambios realizados?");
    
    if (respuesta) {
        // Si el usuario presiona "SI" (Aceptar)
        guardarCambiosInline(id);
    } else {
        // Si el usuario presiona "NO" (Cancelar), devolvemos la fila a su estado original
        cancelarEdicion(id);
    }
}

async function guardarCambiosInline(id) {
    const usuarioData = {
        rut: document.getElementById(`edit-rut-${id}`).value,
        nombre: document.getElementById(`edit-nombre-${id}`).value,
        email: document.getElementById(`edit-email-${id}`).value,
        password: document.getElementById(`edit-pass-${id}`).value,
        rol: document.getElementById(`edit-rol-${id}`).value
    };

    const resultado = await actualizarUsuarioBD(id, usuarioData);
    
    if (resultado) {
        alert("Usuario actualizado con éxito.");
        cargarTabla(); // Recargamos para ver los datos limpios
    } else {
        alert("Hubo un error al actualizar.");
    }
}

function cancelarEdicion(id) {
    const fila = document.getElementById(`fila-${id}`);
    fila.innerHTML = contenidoOriginalFila[id];
}

async function eliminarUsuario(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        const exito = await eliminarUsuarioBD(id);
        if (exito) {
            alert("Eliminado correctamente.");
            cargarTabla();
        }
    }
}