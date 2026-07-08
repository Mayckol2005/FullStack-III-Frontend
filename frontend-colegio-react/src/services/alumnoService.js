import apiClient from '../api/apiClient';

export const formatearFecha = (valor) => {
    if (!valor) return 'Sin fecha';

    const fecha = String(valor).split('T')[0];
    const partes = fecha.split('-');

    if (partes.length === 3) {
        const [anio, mes, dia] = partes;
        return `${dia}/${mes}/${anio}`;
    }

    return String(valor);
};

export const formatearHora = (valor) => {
    if (!valor || !String(valor).includes('T')) return '';

    return String(valor).split('T')[1]?.slice(0, 5) || '';
};

const esComunicadoNuevo = (fechaPublicacion) => {
    if (!fechaPublicacion) return false;

    const fecha = new Date(fechaPublicacion);
    if (Number.isNaN(fecha.getTime())) return false;

    const sieteDias = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - fecha.getTime() <= sieteDias;
};

const ordenarPorFechaDescendente = (a, b) =>
    new Date(b.fechaOriginal || 0) - new Date(a.fechaOriginal || 0);

export const obtenerEstudianteActual = async () => {
    const usuarioEmail = localStorage.getItem('usuario_email');
    const usuarioId = localStorage.getItem('usuario_id');
    const estudianteId = localStorage.getItem('estudiante_id');

    let endpoint = null;

    if (usuarioEmail) {
        endpoint = `/estudiantes/buscar-por-email?email=${encodeURIComponent(usuarioEmail)}`;
    } else if (estudianteId) {
        endpoint = `/estudiantes/${estudianteId}`;
    } else if (usuarioId) {
        endpoint = `/estudiantes/${usuarioId}`;
    }

    if (!endpoint) {
        throw new Error('No se encontró identificación del alumno en la sesión.');
    }

    const estudiante = await apiClient(endpoint);

    if (estudiante?.id) {
        localStorage.setItem('estudiante_id', estudiante.id);
    }

    return estudiante;
};

export const agruparEvaluacionesPorAsignatura = (
    evaluaciones = [],
    asignaturas = []
) => {
    const nombresAsignaturas = new Map(
        asignaturas.map((asignatura) => [
            Number(asignatura.id),
            asignatura.nombre || asignatura.nombreAsignatura || `Asignatura #${asignatura.id}`
        ])
    );

    const grupos = new Map();

    evaluaciones.forEach((evaluacion) => {
        if ('n1' in evaluacion || 'n2' in evaluacion || 'n3' in evaluacion) {
            const claveAgrupada =
                evaluacion.asignaturaId ||
                evaluacion.asignatura ||
                evaluacion.asignaturaNombre ||
                evaluacion.id;

            grupos.set(claveAgrupada, {
                asignaturaId: evaluacion.asignaturaId,
                asignatura:
                    evaluacion.asignatura ||
                    evaluacion.asignaturaNombre ||
                    nombresAsignaturas.get(Number(evaluacion.asignaturaId)) ||
                    `Asignatura #${evaluacion.asignaturaId || 'sin asignar'}`,
                n1: evaluacion.n1,
                n2: evaluacion.n2,
                n3: evaluacion.n3
            });
            return;
        }

        const asignaturaId = evaluacion.asignaturaId;
        const clave = Number(asignaturaId);

        if (!grupos.has(clave)) {
            grupos.set(clave, {
                asignaturaId,
                asignatura:
                    nombresAsignaturas.get(clave) ||
                    evaluacion.asignaturaNombre ||
                    `Asignatura #${asignaturaId || 'sin asignar'}`,
                n1: null,
                n2: null,
                n3: null
            });
        }

        const numeroEvaluacion = Number(evaluacion.numeroEvaluacion);

        if ([1, 2, 3].includes(numeroEvaluacion)) {
            grupos.get(clave)[`n${numeroEvaluacion}`] = evaluacion.nota;
        }
    });

    return Array.from(grupos.values()).sort((a, b) =>
        String(a.asignatura).localeCompare(String(b.asignatura))
    );
};

export const obtenerNotasAlumnoActual = async () => {
    const estudiante = await obtenerEstudianteActual();
    const evaluaciones = await apiClient(`/evaluaciones/estudiante/${estudiante.id}`);

    let asignaturas = [];
    try {
        asignaturas = await apiClient('/academico/asignaturas');
    } catch {
        asignaturas = [];
    }

    return agruparEvaluacionesPorAsignatura(evaluaciones || [], asignaturas || []);
};

export const obtenerAsistenciaAlumnoActual = async () => {
    const estudiante = await obtenerEstudianteActual();
    const registros = await apiClient(`/asistencia/estudiante/${estudiante.id}`);

    return (registros || [])
        .map((registro) => {
            const presente =
                typeof registro.presente === 'boolean'
                    ? registro.presente
                    : String(registro.estado || '').toUpperCase() === 'PRESENTE';

            return {
                id: registro.id,
                fecha: formatearFecha(registro.fecha),
                fechaOriginal: registro.fecha,
                estado: presente ? 'Presente' : 'Ausente',
                observacion: registro.observacion || 'Sin observaciones.'
            };
        })
        .sort(ordenarPorFechaDescendente);
};

export const obtenerAnotacionesAlumnoActual = async () => {
    const estudiante = await obtenerEstudianteActual();
    const anotaciones = await apiClient(`/anotaciones/estudiante/${estudiante.id}`);

    return (anotaciones || [])
        .map((anotacion) => ({
            id: anotacion.id,
            fecha: formatearFecha(anotacion.fecha),
            fechaOriginal: anotacion.fecha,
            tipo: anotacion.tipo || 'OBSERVACION',
            descripcion: anotacion.descripcion || 'Sin descripción registrada.'
        }))
        .sort(ordenarPorFechaDescendente);
};

export const obtenerComunicadosAlumnoActual = async () => {
    const comunicados = await apiClient('/comunicaciones');

    return (comunicados || [])
        .map((comunicado) => ({
            id: comunicado.id,
            titulo: comunicado.titulo,
            fecha: formatearFecha(comunicado.fechaPublicacion),
            fechaOriginal: comunicado.fechaPublicacion,
            hora: formatearHora(comunicado.fechaPublicacion),
            nuevo: esComunicadoNuevo(comunicado.fechaPublicacion),
            detalle: comunicado.contenido,
            remitente: comunicado.remitente || 'Dirección Académica'
        }))
        .sort((a, b) => b.id - a.id);
};
