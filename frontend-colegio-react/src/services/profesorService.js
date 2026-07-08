import apiClient from '../api/apiClient';

export const obtenerCursosReal = async () => {
    try {
        return await apiClient('/academico/cursos') || [];
    } catch (error) {
        console.error("Error obteniendo cursos reales:", error);
        return [];
    }
};

export const obtenerAsignaturasPorDocente = async (
    docenteId
) => {
    try {
        return await apiClient(
            `/asignaturas/docente/${docenteId}`
        ) || [];
    } catch (error) {
        console.error(
            "Error obteniendo asignaturas del docente:",
            error
        );

        return [];
    }
};

export const obtenerEvaluaciones = async () => {
    try {
        return await apiClient('/evaluaciones') || [];
    } catch (error) {
        console.error("Error obteniendo evaluaciones:", error);
        return [];
    }
};

export const obtenerEvaluacionesPorAsignatura = async (
    asignaturaId
) => {
    try {
        return await apiClient(
            `/evaluaciones/asignatura/${asignaturaId}`
        ) || [];
    } catch (error) {
        console.error(
            "Error obteniendo evaluaciones por asignatura:",
            error
        );

        return [];
    }
};

export const obtenerEvaluacionesPorEstudianteYAsignatura = async (
    estudianteId,
    asignaturaId
) => {
    try {
        return await apiClient(
            `/evaluaciones/estudiante/${estudianteId}/asignatura/${asignaturaId}`
        ) || [];
    } catch (error) {
        console.error(
            "Error obteniendo evaluaciones del estudiante por asignatura:",
            error
        );

        return [];
    }
};

export const obtenerPromedioEvaluacion = async (
    estudianteId,
    asignaturaId
) => {
    try {
        return await apiClient(
            `/evaluaciones/estudiante/${estudianteId}/promedio?asignaturaId=${asignaturaId}`
        );
    } catch (error) {
        console.error(
            "Error obteniendo promedio de evaluación:",
            error
        );

        return null;
    }
};

export const obtenerAnotaciones = async () => {
    try {
        return await apiClient('/anotaciones') || [];
    } catch (error) {
        console.error("Error obteniendo anotaciones:", error);
        return [];
    }
};

export const obtenerAnotacionesPorEstudiante = async (
    estudianteId
) => {
    try {
        return await apiClient(
            `/anotaciones/estudiante/${estudianteId}`
        ) || [];
    } catch (error) {
        console.error(
            "Error obteniendo anotaciones del estudiante:",
            error
        );

        return [];
    }
};

export const obtenerAsistencias = async () => {
    try {
        return await apiClient('/asistencia') || [];
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        return [];
    }
};

export const obtenerAsistenciasPorCursoYFecha = async (
    cursoId,
    fecha
) => {
    try {
        return await apiClient(
            `/asistencia/curso/${cursoId}?fecha=${fecha}`
        ) || [];
    } catch (error) {
        console.error(
            "Error obteniendo asistencia por curso y fecha:",
            error
        );

        return [];
    }
};

export const crearAnotacionBD = async (anotacion) => {
    try {
        await apiClient('/anotaciones', {
            method: 'POST',
            body: JSON.stringify(anotacion)
        });

        return true;
    } catch (error) {
        console.error("Error al persistir anotación:", error);
        return false;
    }
};

export const crearAsistenciaBD = async (asistencia) => {
    try {
        await apiClient('/asistencia', {
            method: 'POST',
            body: JSON.stringify(asistencia)
        });

        return true;
    } catch (error) {
        console.error("Error al persistir asistencia:", error);
        return false;
    }
};

export const guardarListaAsistenciaBD = async (asistencias) => {
    try {
        return await apiClient('/asistencia/lista', {
            method: 'PUT',
            body: JSON.stringify(asistencias)
        }) || [];
    } catch (error) {
        console.error(
            "Error al sincronizar la lista de asistencia:",
            error
        );

        return null;
    }
};

export const crearEvaluacionBD = async (evaluacion) => {
    try {
        await apiClient('/evaluaciones', {
            method: 'POST',
            body: JSON.stringify(evaluacion)
        });

        return true;
    } catch (error) {
        console.error("Error al persistir calificación:", error);
        return false;
    }
};

export const guardarListaEvaluacionesBD = async (
    evaluaciones
) => {
    try {
        return await apiClient('/evaluaciones/lista', {
            method: 'PUT',
            body: JSON.stringify(evaluaciones)
        }) || [];
    } catch (error) {
        console.error(
            "Error al sincronizar las evaluaciones:",
            error
        );

        return null;
    }
};

export const obtenerAvisosInstitucionales = async () => {
    try {
        return await apiClient('/comunicaciones') || [];
    } catch (error) {
        console.error("Error obteniendo avisos del mural:", error);
        return [];
    }
};