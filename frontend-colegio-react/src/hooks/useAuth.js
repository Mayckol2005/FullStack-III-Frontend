import { useState, useEffect } from 'react';
import { getToken, getUserRole, removeToken } from '../utils/storage';
import * as authService from '../services/authService';

export const useAuth = () => {
  const [token, setToken] = useState(getToken());
  const [rol, setRol] = useState(getUserRole());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Sincronizar el estado por si cambia en el storage
    const t = getToken();
    const r = getUserRole();
    setToken(t);
    setRol(r);
    setCargando(false);
  }, []);

  const login = async (username, password) => {
    try {
      const resultado = await authService.login(username, password);
      
      if (resultado.exito) {
        setToken(getToken()); // Actualizar estado con token del storage
        setRol(getUserRole()); // Actualizar estado con rol del storage
      }
      
      return resultado;
    } catch (error) {
      return { exito: false, msg: error.message };
    }
  };

  const loginGlobal = (nuevoToken, nuevoRol) => {
    setToken(nuevoToken);
    setRol(nuevoRol);
  };

  const logoutGlobal = () => {
    removeToken();
    authService.cerrarSesion();
    setToken(null);
    setRol(null);
    window.location.href = '/login';
  };

  return {
    login,
    loginGlobal,
    logoutGlobal,
    autenticado: !!token,
    token,
    rol,
    cargando
  };
};