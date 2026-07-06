import React, {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    guardarListaEvaluacionesBD,
    obtenerCursosReal,
    obtenerEvaluacionesPorAsignatura
} from '../../services/profesorService';

import { obtenerEstudiantes } from '../../services/estudianteService';

import {
    obtenerAsignaturasPorCursoReal
} from '../../services/academicoService';

import '../../styles/globals.css';

const CAMPOS_EVALUACION = [
    {
        campo: 'n1',
        numeroEvaluacion: 1
    },
    {
        campo: 'n2',
        numeroEvaluacion: 2
    },
    {
        campo: 'n3',
        numeroEvaluacion: 3
    }
];

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

const calcularPromedio = (notas) => {
    const notasRegistradas = [
        notas.n1,
        notas.n2,
        notas.n3
    ]
        .filter(nota => nota !== '')
        .map(Number)
        .filter(Number.isFinite);

    if (notasRegistradas.length === 0) {
        return '-';
    }

    const suma = notasRegistradas.reduce(
        (acumulador, nota) => acumulador + nota,
        0
    );

    return (
        suma / notasRegistradas.length
    ).toFixed(1);
};

function Evaluaciones() {
    const [cursos, setCursos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [
        asignaturaSeleccionada,
        setAsignaturaSeleccionada
    ] = useState('');
    const [listaAlumnos, setListaAlumnos] = useState([]);
    const [cargando, setCargando] = useState(false);
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
        const cargarAsignaturas = async () => {
            if (!cursoSeleccionado) {
                setAsignaturas([]);
                return;
            }

            setCargando(true);
            setMensajeError('');

            try {
                const datos =
                    await obtenerAsignaturasPorCursoReal(
                        cursoSeleccionado
                    );

                setAsignaturas(datos || []);
            } catch (error) {
                console.error(
                    'Error cargando asignaturas del curso:',
                    error
                );

                setAsignaturas([]);
                setMensajeError(
                    'No fue posible cargar las asignaturas del curso.'
                );
            } finally {
                setCargando(false);
            }
        };

        cargarAsignaturas();
    }, [cursoSeleccionado]);

    const cargarEvaluaciones = useCallback(async () => {
        if (
            !cursoSeleccionado
            || !asignaturaSeleccionada
        ) {
            setListaAlumnos([]);
            return;
        }

        setCargando(true);
        setMensajeError('');

        try {
            const [nomina, evaluaciones] = await Promise.all([
                obtenerEstudiantes(cursoSeleccionado),
                obtenerEvaluacionesPorAsignatura(
                    asignaturaSeleccionada
                )
            ]);

            const notasPorEstudiante = new Map();

            (evaluaciones || []).forEach(evaluacion => {
                const estudianteId = Number(
                    evaluacion.estudianteId
                );

                const numeroEvaluacion = Number(
                    evaluacion.numeroEvaluacion
                );

                if (
                    numeroEvaluacion < 1
                    || numeroEvaluacion > 3
                ) {
                    return;
                }

                if (!notasPorEstudiante.has(estudianteId)) {
                    notasPorEstudiante.set(
                        estudianteId,
                        {
                            n1: '',
                            n2: '',
                            n3: ''
                        }
                    );
                }

                const notas = notasPorEstudiante.get(
                    estudianteId
                );

                notas[`n${numeroEvaluacion}`] =
                    evaluacion.nota !== null
                    && evaluacion.nota !== undefined
                        ? String(evaluacion.nota)
                        : '';
            });

            const listaCombinada = (nomina || []).map(
                estudiante => ({
                    id: estudiante.id,
                    estudianteId: estudiante.id,
                    nombres: estudiante.nombres,
                    apellidos: estudiante.apellidos,
                    rut: estudiante.rut,
                    notas: notasPorEstudiante.get(
                        Number(estudiante.id)
                    ) || {
                        n1: '',
                        n2: '',
                        n3: ''
                    }
                })
            );

            setListaAlumnos(listaCombinada);
        } catch (error) {
            console.error(
                'Error cargando las evaluaciones:',
                error
            );

            setListaAlumnos([]);
            setMensajeError(
                'No fue posible cargar las calificaciones.'
            );
        } finally {
            setCargando(false);
        }
    }, [
        cursoSeleccionado,
        asignaturaSeleccionada
    ]);

    useEffect(() => {
        cargarEvaluaciones();
    }, [cargarEvaluaciones]);

    const manejarCambioNota = (
        estudianteId,
        campo,
        valor
    ) => {
        setMensajeExito('');
        setMensajeError('');

        setListaAlumnos(listaActual =>
            listaActual.map(alumno =>
                Number(alumno.estudianteId)
                === Number(estudianteId)
                    ? {
                        ...alumno,
                        notas: {
                            ...alumno.notas,
                            [campo]: valor
                        }
                    }
                    : alumno
            )
        );
    };

    const guardarEvaluaciones = async (evento) => {
        evento.preventDefault();

        setMensajeExito('');
        setMensajeError('');

        if (
            !cursoSeleccionado
            || !asignaturaSeleccionada
        ) {
            setMensajeError(
                'Debe seleccionar un curso y una asignatura.'
            );
            return;
        }

        if (listaAlumnos.length === 0) {
            setMensajeError(
                'No existen estudiantes para registrar calificaciones.'
            );
            return;
        }

        const evaluaciones = [];

        for (const alumno of listaAlumnos) {
            for (const evaluacion of CAMPOS_EVALUACION) {
                const valorNota =
                    alumno.notas[evaluacion.campo];

                if (valorNota === '') {
                    continue;
                }

                const nota = Number(valorNota);

                if (
                    !Number.isFinite(nota)
                    || nota < 1
                    || nota > 7
                ) {
                    setMensajeError(
                        'Las calificaciones deben estar entre 1.0 y 7.0.'
                    );
                    return;
                }

                evaluaciones.push({
                    estudianteId: Number(
                        alumno.estudianteId
                    ),
                    asignaturaId: Number(
                        asignaturaSeleccionada
                    ),
                    numeroEvaluacion:
                        evaluacion.numeroEvaluacion,
                    nota,
                    fecha: obtenerFechaActual()
                });
            }
        }

        if (evaluaciones.length === 0) {
            setMensajeError(
                'Ingrese al menos una calificación antes de sincronizar.'
            );
            return;
        }

        setGuardando(true);

        try {
            const resultado =
                await guardarListaEvaluacionesBD(
                    evaluaciones
                );

            if (resultado === null) {
                setMensajeError(
                    'No fue posible sincronizar las calificaciones.'
                );
                return;
            }

            await cargarEvaluaciones();

            setMensajeExito(
                'Calificaciones sincronizadas correctamente.'
            );
        } catch (error) {
            console.error(
                'Error sincronizando las evaluaciones:',
                error
            );

            setMensajeError(
                'Ocurrió un error al sincronizar las calificaciones.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const promediosRegistrados = listaAlumnos
        .map(alumno => calcularPromedio(alumno.notas))
        .filter(promedio => promedio !== '-')
        .map(Number);

    const promedioGeneral = promediosRegistrados.length > 0
        ? (
            promediosRegistrados.reduce(
                (acumulador, promedio) =>
                    acumulador + promedio,
                0
            ) / promediosRegistrados.length
        ).toFixed(1)
        : '-';

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Registro de Calificaciones</h2>
                    <p>Libro de clases digital</p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        Promedio del Curso
                    </div>

                    <div
                        className="institucion"
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}
                    >
                        {promedioGeneral}
                    </div>
                </div>
            </header>

            <section className="card-panel">
                <div className="evaluaciones-filter-grid">
                    <div>
                        <label className="form-label">
                            Curso
                        </label>

                        <select
                            className="select-custom"
                            value={cursoSeleccionado}
                            onChange={evento => {
                                setCursoSeleccionado(
                                    evento.target.value
                                );
                                setAsignaturaSeleccionada('');
                                setAsignaturas([]);
                                setListaAlumnos([]);
                                setMensajeExito('');
                                setMensajeError('');
                            }}
                            disabled={guardando}
                        >
                            <option value="">
                                Seleccione curso...
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

                    <div>
                        <label className="form-label">
                            Asignatura
                        </label>

                        <select
                            className="select-custom"
                            value={asignaturaSeleccionada}
                            onChange={evento => {
                                setAsignaturaSeleccionada(
                                    evento.target.value
                                );
                                setListaAlumnos([]);
                                setMensajeExito('');
                                setMensajeError('');
                            }}
                            disabled={
                                !cursoSeleccionado
                                || guardando
                            }
                        >
                            <option value="">
                                Seleccione asignatura...
                            </option>

                            {asignaturas.map(asignatura => (
                                <option
                                    key={asignatura.id}
                                    value={asignatura.id}
                                >
                                    {asignatura.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

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

            {cargando ? (
                <div className="empty-state">
                    ⏳ Cargando calificaciones...
                </div>
            ) : cursoSeleccionado
                && asignaturaSeleccionada ? (
                listaAlumnos.length > 0 ? (
                    <form
                        className="card-panel"
                        style={{ padding: 0 }}
                        onSubmit={guardarEvaluaciones}
                        noValidate
                    >
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th>Estudiante</th>
                                        <th>RUT</th>
                                        <th>N1</th>
                                        <th>N2</th>
                                        <th>N3</th>
                                        <th>Promedio</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listaAlumnos.map(alumno => {
                                        const promedio =
                                            calcularPromedio(
                                                alumno.notas
                                            );

                                        const clasePromedio =
                                            promedio === '-'
                                                ? ''
                                                : Number(promedio) >= 4
                                                    ? 'nota-aprobada'
                                                    : 'nota-reprobada';

                                        return (
                                            <tr
                                                key={
                                                    alumno.estudianteId
                                                }
                                            >
                                                <td>
                                                    {alumno.apellidos},{' '}
                                                    {alumno.nombres}
                                                </td>

                                                <td>
                                                    {alumno.rut
                                                        || 'Sin Rut'}
                                                </td>

                                                {CAMPOS_EVALUACION.map(
                                                    evaluacion => (
                                                        <td
                                                            key={
                                                                evaluacion.campo
                                                            }
                                                        >
                                                            <input
                                                                type="number"
                                                                className="input-nota"
                                                                min="1"
                                                                max="7"
                                                                step="0.1"
                                                                aria-label={
                                                                    `N${evaluacion.numeroEvaluacion} `
                                                                    + `${alumno.nombres} `
                                                                    + `${alumno.apellidos}`
                                                                }
                                                                value={
                                                                    alumno.notas[
                                                                        evaluacion.campo
                                                                    ]
                                                                }
                                                                onChange={
                                                                    evento =>
                                                                        manejarCambioNota(
                                                                            alumno.estudianteId,
                                                                            evaluacion.campo,
                                                                            evento.target.value
                                                                        )
                                                                }
                                                                disabled={
                                                                    guardando
                                                                }
                                                            />
                                                        </td>
                                                    )
                                                )}

                                                <td
                                                    className={
                                                        clasePromedio
                                                    }
                                                >
                                                    {promedio}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="footer-actions">
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Sincronizando Calificaciones...'
                                    : 'Sincronizar Calificaciones'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="empty-state">
                        No existen estudiantes asociados al curso
                        seleccionado.
                    </div>
                )
            ) : (
                <div className="empty-state">
                    👋 Seleccione curso y asignatura para visualizar
                    el listado.
                </div>
            )}
        </div>
    );
}

export default Evaluaciones;