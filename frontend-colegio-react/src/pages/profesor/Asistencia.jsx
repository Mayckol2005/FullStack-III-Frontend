import React, {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    guardarListaAsistenciaBD,
    obtenerAsistenciasPorCursoYFecha,
    obtenerCursosReal
} from '../../services/profesorService';

import { obtenerEstudiantes } from '../../services/estudianteService';
import '../../styles/globals.css';

const obtenerFechaActual = () => {
    const ahora = new Date();
    const compensacionZonaHoraria = ahora.getTimezoneOffset() * 60000;

    return new Date(
        ahora.getTime() - compensacionZonaHoraria
    )
        .toISOString()
        .split('T')[0];
};

function Asistencia() {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [fecha, setFecha] = useState(obtenerFechaActual());
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

    const cargarAsistencia = useCallback(async () => {
        if (!cursoSeleccionado || !fecha) {
            setListaAlumnos([]);
            return;
        }

        setCargando(true);
        setMensajeError('');

        try {
            const [nomina, asistencias] = await Promise.all([
                obtenerEstudiantes(cursoSeleccionado),
                obtenerAsistenciasPorCursoYFecha(
                    cursoSeleccionado,
                    fecha
                )
            ]);

            const asistenciasPorEstudiante = new Map(
                (asistencias || []).map(asistencia => [
                    Number(asistencia.estudianteId),
                    asistencia
                ])
            );

            const listaCombinada = (nomina || []).map(estudiante => {
                const asistenciaGuardada = asistenciasPorEstudiante.get(
                    Number(estudiante.id)
                );

                return {
                    id: estudiante.id,
                    estudianteId: estudiante.id,
                    asistenciaId: asistenciaGuardada?.id || null,
                    nombres: estudiante.nombres,
                    apellidos: estudiante.apellidos,
                    rut: estudiante.rut,
                    presente: asistenciaGuardada?.presente ?? true,
                    observacion: asistenciaGuardada?.observacion || ''
                };
            });

            setListaAlumnos(listaCombinada);
        } catch (error) {
            console.error(
                'Error cargando la lista de asistencia:',
                error
            );

            setListaAlumnos([]);
            setMensajeError(
                'No fue posible cargar la asistencia del curso.'
            );
        } finally {
            setCargando(false);
        }
    }, [cursoSeleccionado, fecha]);

    useEffect(() => {
        cargarAsistencia();
    }, [cargarAsistencia]);

    const conmutarAsistencia = (estudianteId) => {
        setMensajeExito('');

        setListaAlumnos(listaActual =>
            listaActual.map(alumno =>
                Number(alumno.estudianteId) === Number(estudianteId)
                    ? {
                        ...alumno,
                        presente: !alumno.presente
                    }
                    : alumno
            )
        );
    };

    const guardarAsistencia = async (evento) => {
        evento.preventDefault();

        setMensajeExito('');
        setMensajeError('');

        if (!cursoSeleccionado || !fecha) {
            setMensajeError(
                'Debe seleccionar un curso y una fecha.'
            );
            return;
        }

        if (listaAlumnos.length === 0) {
            setMensajeError(
                'No existen estudiantes para registrar asistencia.'
            );
            return;
        }

        setGuardando(true);

        try {
            const asistencias = listaAlumnos.map(alumno => ({
                fecha,
                cursoId: Number(cursoSeleccionado),
                estudianteId: Number(alumno.estudianteId),
                presente: Boolean(alumno.presente),
                observacion: alumno.observacion || ''
            }));

            const resultado = await guardarListaAsistenciaBD(
                asistencias
            );

            if (resultado === null) {
                setMensajeError(
                    'No fue posible guardar la asistencia.'
                );
                return;
            }

            await cargarAsistencia();

            setMensajeExito(
                'Asistencia guardada correctamente.'
            );
        } catch (error) {
            console.error(
                'Error guardando la asistencia:',
                error
            );

            setMensajeError(
                'Ocurrió un error al guardar la asistencia.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const porcentajeAsistencia = listaAlumnos.length > 0
        ? (
            (
                listaAlumnos.filter(alumno => alumno.presente).length
                / listaAlumnos.length
            ) * 100
        ).toFixed(0)
        : 0;

    return (
        <div className="dashboard-container">
            <header className="docente-banner">
                <div className="docente-banner-info">
                    <h2>Control de Asistencia Diario</h2>
                    <p>Declaración obligatoria de asistencia</p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        Asistencia Seleccionada
                    </div>

                    <div
                        className="institucion"
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}
                    >
                        {porcentajeAsistencia}%
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
                                setMensajeExito('');
                                setMensajeError('');
                            }}
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
                            Fecha Académica
                        </label>

                        <input
                            type="date"
                            className="input-custom"
                            value={fecha}
                            onChange={evento => {
                                setFecha(evento.target.value);
                                setMensajeExito('');
                                setMensajeError('');
                            }}
                        />
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
                    ⏳ Sincronizando registros con el servidor...
                </div>
            ) : cursoSeleccionado ? (
                listaAlumnos.length > 0 ? (
                    <form
                        className="card-panel"
                        style={{ padding: 0 }}
                        onSubmit={guardarAsistencia}
                    >
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th>Estudiante</th>
                                        <th>RUT</th>
                                        <th style={{ textAlign: 'center' }}>
                                            Estado
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listaAlumnos.map(alumno => (
                                        <tr key={alumno.estudianteId}>
                                            <td style={{ fontWeight: '600' }}>
                                                {alumno.apellidos},{' '}
                                                {alumno.nombres}
                                            </td>

                                            <td>
                                                {alumno.rut || 'Sin Rut'}
                                            </td>

                                            <td
                                                style={{
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        conmutarAsistencia(
                                                            alumno.estudianteId
                                                        )
                                                    }
                                                    className={
                                                        `btn-estado ${
                                                            alumno.presente
                                                                ? 'btn-presente'
                                                                : 'btn-ausente'
                                                        }`
                                                    }
                                                    disabled={guardando}
                                                >
                                                    {alumno.presente
                                                        ? '● Presente'
                                                        : '○ Ausente'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="footer-actions">
                            <button
                                type="submit"
                                className="btn-success"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Guardando Asistencia...'
                                    : 'Finalizar Pasar Lista'}
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
                    💡 Seleccione un curso para gestionar el libro
                    de asistencia.
                </div>
            )}
        </div>
    );
}

export default Asistencia;