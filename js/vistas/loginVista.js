// js/vistas/loginVista.js

document.getElementById('formulario-login').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const email = document.getElementById('input-email-login').value;
    const password = document.getElementById('input-password-login').value;

    try {
        const respuesta = await fetch('http://localhost:8090/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            
            // Guardamos el "Pase VIP" en el navegador
            localStorage.setItem('token_colegio', datos.token); 
            
            // Redirigimos a la pantalla de usuarios
            window.location.href = 'paginas/usuarios.html';
        } else {
            document.getElementById('mensaje-error').style.display = 'block';
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("El servidor de autenticación no responde.");
    }
});