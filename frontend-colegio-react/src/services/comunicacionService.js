import apiClient from '../api/apiClient';

export const obtenerAvisos = async () => {
    const response = await apiClient.get('/comunicaciones');
    return response.data;
};

export const crearAviso = async (avisoData) => {
    const response = await apiClient.post('/comunicaciones', avisoData);
    return response.data;
};