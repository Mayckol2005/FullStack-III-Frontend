import { getToken, removeToken } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }

    const responseText = await response.text();
    let data = null;
    
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn('El backend no devolvió un JSON válido');
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Error del servidor: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

export default apiClient;