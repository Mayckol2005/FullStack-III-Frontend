export const getRolEtiqueta = (rol) => {
  const roles = {
    ADMIN: 'Administrador',
    PROFESOR: 'Profesor de Aula',
    ESTUDIANTE: 'Estudiante'
  };
  return roles[rol] || 'Usuario General';
};

export const tienePermiso = (rolUsuario, rolRequerido) => {
  if (!rolRequerido) return true;
  if (!rolUsuario) return false;
  return rolUsuario.toUpperCase() === rolRequerido.toUpperCase();
};