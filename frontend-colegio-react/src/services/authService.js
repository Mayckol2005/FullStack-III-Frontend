// Centralizado al API Gateway
const API_URL = 'http://localhost:8080/api/auth';

export const iniciarSesion = async (email, password) => {
    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!respuesta.ok) throw new Error('Credenciales incorrectas');

        const datos = await respuesta.json();
        return datos; // Retorna { token, rol }
    } catch (error) {
        console.error("Error en authService:", error);
        throw error;
    }
};