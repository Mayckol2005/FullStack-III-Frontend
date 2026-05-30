export const formatRut = (rut) => {
  if (!rut) return '';
  // Limpiar puntos y guiones previos
  const actual = rut.toString().replace(/^0+|[^0-9kK]/g, '');
  if (actual.length < 2) return actual;
  
  const dv = actual.slice(-1);
  const rutSolo = actual.slice(0, -1);
  
  return rutSolo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv.toUpperCase();
};

export const formatNota = (nota) => {
  const num = parseFloat(nota);
  if (isNaN(num)) return '0.0';
  return num.toFixed(1);
};