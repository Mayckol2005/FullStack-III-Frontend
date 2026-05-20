const API_AUTH = 'http://localhost:8080/api/auth';

export const iniciarSesionBD = async (username, password) => {
    try {
        console.log("🚀 Despachando credenciales al Gateway...");
        
        const respuesta = await fetch(`${API_AUTH}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: username, 
                password: password 
            })
        });

        if (!respuesta.ok) {
            return { exito: false, msg: 'Credenciales inválidas en el servidor' };
        }

        const data = await respuesta.json(); // Recibe TokenDto { token: "...", rol: "..." }

        if (data && data.token) {
            console.log("🔒 JWT capturado con éxito. Guardando credenciales transaccionales.");
            
            localStorage.setItem('token_colegio', data.token);
            localStorage.setItem('usuario_rol', data.rol); 
            localStorage.setItem('usuario_id', data.id); // Guardamos el ID para futuras referencias
            
            return { exito: true, rol: data.rol };
        }
        
        return { 
            exito: false, 
            msg: 'El servidor respondió exitosamente pero el cuerpo del token no es válido.' 
        };

    } catch (error) {
        console.error("❌ Error conectando con el auth-service:", error);
        return { exito: false, msg: 'El servidor central de autenticación no responde' };
    }
};

export const cerrarSesion = () => {
    localStorage.removeItem('token_colegio');
    localStorage.removeItem('usuario_rol');
    localStorage.removeItem('usuario_id');
    window.location.href = '/';
};