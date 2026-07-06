import React, {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    crearAnotacionBD,
    obtenerAnotacionesPorEstudiante,
    obtenerCursosReal
} from '../../services/profesorService';

import {
    obtenerEstudiantes
} from '../../services/estudianteService';

import '../../styles/globals.css';

const obtenerFechaActual = () => {
    const ahora = new Date();
    const compensacionZonaHoraria =
        ahora.getTimezoneOffset() * 60000;

    return new Date(
        ahora.getTime() - compensacionZonaHoraria
    )
        .toISOString()
        .split('T')[0];
};

function Anotaciones() {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [alumnoId, setAlumnoId] = useState('');
    const [tipoAnotacion, setTipoAnotacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [anotaciones, setAnotaciones] = useState([]);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
    const [
        cargandoAnotaciones,
        setCargandoAnotaciones
    ] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        const cargarCursos = async () => {
            const datos = await obtenerCursosReal();
            setCursos(datos || []);
        };

        cargarCursos();
    }, []);

    useEffect(() => {
        const cargarAlumnosPorCurso = async () => {
            if (!cursoSeleccionado) {
                setListaAlumnos([]);
                setAlumnoId('');
                setAnotaciones([]);
                return;
            }

            setCargandoAlumnos(true);
            setMensajeError('');

            try {
                const datos = await obtenerEstudiantes(
                    cursoSeleccionado
                );

                setListaAlumnos(datos || []);
            } catch (error) {
                console.error(
                    'Error cargando estudiantes del curso:',
                    error
                );

                setListaAlumnos([]);
                setMensajeError(
                    'No fue posible cargar los estudiantes del curso.'
                );
            } finally {
                setCargandoAlumnos(false);
            }
        };

        cargarAlumnosPorCurso();
    }, [cursoSeleccionado]);

    const cargarAnotaciones = useCallback(async () => {
        if (!alumnoId) {
            setAnotaciones([]);
            return;
        }

        setCargandoAnotaciones(true);
        setMensajeError('');

        try {
            const datos =
                await obtenerAnotacionesPorEstudiante(
                    alumnoId
                );

            const anotacionesOrdenadas = [
                ...(datos || [])
            ].sort((anotacionA, anotacionB) => {
                const fechaA = anotacionA.fecha || '';
                const fechaB = anotacionB.fecha || '';

                const comparacionFecha =
                    fechaB.localeCompare(fechaA);

                if (comparacionFecha !== 0) {
                    return comparacionFecha;
                }

                return Number(anotacionB.id || 0)
                    - Number(anotacionA.id || 0);
            });

            setAnotaciones(anotacionesOrdenadas);
        } catch (error) {
            console.error(
                'Error cargando la hoja de vida:',
                error
            );

            setAnotaciones([]);
            setMensajeError(
                'No fue posible cargar la hoja de vida del estudiante.'
            );
        } finally {
            setCargandoAnotaciones(false);
        }
    }, [alumnoId]);

    useEffect(() => {
        cargarAnotaciones();
    }, [cargarAnotaciones]);

    const registrarAnotacionEnBackend = async (evento) => {
        evento.preventDefault();

        setMensajeExito('');
        setMensajeError('');

        const profesorId = localStorage.getItem('usuario_id');
        const estudianteId = Number(alumnoId);
        const docenteId = Number(profesorId);
        const descripcionLimpia = descripcion.trim();

        if (
            !cursoSeleccionado
            || !Number.isInteger(estudianteId)
            || estudianteId <= 0
            || !tipoAnotacion
            || !descripcionLimpia
        ) {
            setMensajeError(
                'Complete todos los campos antes de registrar la observación.'
            );
            return;
        }

        if (
            !Number.isInteger(docenteId)
            || docenteId <= 0
        ) {
            setMensajeError(
                'No fue posible identificar al docente autenticado.'
            );
            return;
        }

        const payload = {
            estudianteId,
            docenteId,
            tipo: tipoAnotacion,
            descripcion: descripcionLimpia,
            fecha: obtenerFechaActual()
        };

        setGuardando(true);

        try {
            const resultado = await crearAnotacionBD(payload);

            if (!resultado) {
                setMensajeError(
                    'No fue posible registrar la observación.'
                );
                return;
            }

            setTipoAnotacion('');
            setDescripcion('');

            await cargarAnotaciones();

            setMensajeExito(
                `Observación ${tipoAnotacion.toLowerCase()} registrada correctamente.`
            );
        } catch (error) {
            console.error(
                'Error registrando la anotación:',
                error
            );

            setMensajeError(
                'Ocurrió un error al registrar la observación.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const cantidadPositivas = anotaciones.filter(
        anotacion =>
            String(anotacion.tipo)
                .toUpperCase() === 'POSITIVA'
    ).length;

    const cantidadNegativas = anotaciones.filter(
        anotacion =>
            String(anotacion.tipo)
                .toUpperCase() === 'NEGATIVA'
    ).length;

    const estudianteSeleccionado = listaAlumnos.find(
        alumno =>
            Number(alumno.id) === Number(alumnoId)
    );

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Hoja de Vida & Anotaciones</h2>
                    <p>
                        Registro de comportamiento y observaciones
                    </p>
                </div>

                <div className="docente-banner-meta">
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-label">
                                Positivas (+)
                            </span>

                            <div
                                className="stat-value"
                                style={{ color: '#10b981' }}
                            >
                                {cantidadPositivas}
                            </div>
                        </div>

                        <div className="stat-item">
                            <span className="stat-label">
                                Negativas (-)
                            </span>

                            <div
                                className="stat-value"
                                style={{ color: '#ef4444' }}
                            >
                                {cantidadNegativas}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {mensajeExito && (
                <div className="empty-state">
                    ✅ {mensajeExito}
                </div>
            )}

            {mensajeError && (
                <div className="empty-state">
                    ⚠️ {mensajeError}
                </div>
            )}

            <div className="anotaciones-layout-container">
                <div className="card-panel anotaciones-form-panel">
                    <h2 className="titulo-seccion">
                        Nueva Observación
                    </h2>

                    <form
                        onSubmit={registrarAnotacionEnBackend}
                        noValidate
                    >
                        <div className="form-group-spacing">
                            <label className="form-label">
                                Filtrar por Curso
                            </label>

                            <select
                                className="select-custom"
                                value={cursoSeleccionado}
                                onChange={evento => {
                                    setCursoSeleccionado(
                                        evento.target.value
                                    );
                                    setAlumnoId('');
                                    setListaAlumnos([]);
                                    setAnotaciones([]);
                                    setMensajeExito('');
                                    setMensajeError('');
                                }}
                                disabled={guardando}
                            >
                                <option value="">
                                    Seleccione un curso...
                                </option>

                                {cursos.map(curso => (
                                    <option
                                        key={curso.id}
                                        value={curso.id}
                                    >
                                        {curso.nombre
                                            || `${curso.grado} ${curso.letra}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-spacing">
                            <label className="form-label">
                                {cargandoAlumnos
                                    ? '⏳ Cargando...'
                                    : 'Estudiante'}
                            </label>

                            <select
                                className="select-custom"
                                value={alumnoId}
                                onChange={evento => {
                                    setAlumnoId(
                                        evento.target.value
                                    );
                                    setTipoAnotacion('');
                                    setDescripcion('');
                                    setMensajeExito('');
                                    setMensajeError('');
                                }}
                                disabled={
                                    !cursoSeleccionado
                                    || cargandoAlumnos
                                    || guardando
                                }
                            >
                                <option value="">
                                    Seleccione al estudiante...
                                </option>

                                {listaAlumnos.map(alumno => (
                                    <option
                                        key={alumno.id}
                                        value={alumno.id}
                                    >
                                        {`${alumno.apellidos}, ${alumno.nombres}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-spacing">
                            <label className="form-label">
                                Tipo de Observación
                            </label>

                            <select
                                className="select-custom"
                                value={tipoAnotacion}
                                onChange={evento =>
                                    setTipoAnotacion(
                                        evento.target.value
                                    )
                                }
                                disabled={!alumnoId || guardando}
                            >
                                <option value="">
                                    Seleccione tipo...
                                </option>

                                <option value="POSITIVA">
                                    Positiva
                                </option>

                                <option value="NEGATIVA">
                                    Negativa
                                </option>
                            </select>
                        </div>

                        <div className="form-group-spacing">
                            <label className="form-label">
                                Descripción del Suceso
                            </label>

                            <textarea
                                className={
                                    'input-custom textarea-anotacion'
                                }
                                value={descripcion}
                                onChange={evento =>
                                    setDescripcion(
                                        evento.target.value
                                    )
                                }
                                disabled={!alumnoId || guardando}
                                maxLength={500}
                                aria-label="Descripción del Suceso"
                            />
                        </div>

                        <button
                            type="submit"
                            className={
                                'btn-primary btn-submit-block'
                            }
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Registrando Observación...'
                                : 'Ingresar al Libro de Vida'}
                        </button>
                    </form>
                </div>

                <div className="card-panel">
                    <h2 className="titulo-seccion">
                        Historial de Hoja de Vida
                    </h2>

                    {!alumnoId ? (
                        <div className="empty-state">
                            Seleccione un estudiante para consultar
                            su historial.
                        </div>
                    ) : cargandoAnotaciones ? (
                        <div className="empty-state">
                            ⏳ Cargando hoja de vida...
                        </div>
                    ) : anotaciones.length > 0 ? (
                        <>
                            <p>
                                Estudiante:{' '}
                                <strong>
                                    {estudianteSeleccionado
                                        ? `${estudianteSeleccionado.apellidos}, ${estudianteSeleccionado.nombres}`
                                        : 'Seleccionado'}
                                </strong>
                            </p>

                            <div className="table-responsive">
                                <table className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {anotaciones.map(anotacion => {
                                            const tipo = String(
                                                anotacion.tipo || ''
                                            ).toUpperCase();

                                            return (
                                                <tr key={anotacion.id}>
                                                    <td>
                                                        {anotacion.fecha
                                                            || 'Sin fecha'}
                                                    </td>

                                                    <td
                                                        className={
                                                            tipo === 'POSITIVA'
                                                                ? 'nota-aprobada'
                                                                : tipo === 'NEGATIVA'
                                                                    ? 'nota-reprobada'
                                                                    : ''
                                                        }
                                                    >
                                                        {tipo || 'OBSERVACIÓN'}
                                                    </td>

                                                    <td>
                                                        {anotacion.descripcion}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            El estudiante no posee anotaciones
                            registradas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Anotaciones;