export const saveToken = (token) => {
    localStorage.setItem('token_colegio', token);
};

export const getToken = () => {
    return localStorage.getItem('token_colegio');
};

export const removeToken = () => {
    localStorage.removeItem('token_colegio');
};

export const saveUserRole = (rol) => {
    localStorage.setItem('usuario_rol', rol);
};

export const getUserRole = () => {
    return localStorage.getItem('usuario_rol');
};

export const clearAuth = () => {
    localStorage.removeItem('token_colegio');
    localStorage.removeItem('usuario_rol');
};