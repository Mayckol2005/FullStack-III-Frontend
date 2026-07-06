import React, {
    useEffect,
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import {
    obtenerAsignaturasPorDocente,
    obtenerAvisosInstitucionales
} from '../../services/profesorService';

import '../../styles/globals.css';

function ProfesorDashboard() {
    const navigate = useNavigate();

    const [avisos, setAvisos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensajeError, setMensajeError] = useState('');

    const nombreCompleto =
        localStorage.getItem('usuario_nombre')
        || 'Profesor(a)';

    const docenteId = Number(
        localStorage.getItem('usuario_id')
    );

    const periodo = `Año Escolar ${new Date().getFullYear()}`;

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setCargando(true);
            setMensajeError('');

            try {
                const docenteValido =
                    Number.isInteger(docenteId)
                    && docenteId > 0;

                const [
                    dataAvisos,
                    dataAsignaturas
                ] = await Promise.all([
                    obtenerAvisosInstitucionales(),
                    docenteValido
                        ? obtenerAsignaturasPorDocente(
                            docenteId
                        )
                        : Promise.resolve([])
                ]);

                setAvisos(dataAvisos || []);
                setAsignaturas(dataAsignaturas || []);

                if (!docenteValido) {
                    setMensajeError(
                        'No fue posible identificar el contexto académico del docente.'
                    );
                }
            } catch (error) {
                console.error(
                    'Error al cargar el dashboard:',
                    error
                );

                setAvisos([]);
                setAsignaturas([]);

                setMensajeError(
                    'No fue posible cargar la información del dashboard.'
                );
            } finally {
                setCargando(false);
            }
        };

        cargarDatosIniciales();
    }, [docenteId]);

    const nombresAsignaturas = [
        ...new Set(
            asignaturas
                .map(asignatura =>
                    asignatura.nombre?.trim()
                )
                .filter(Boolean)
        )
    ];

    const resumenAsignaturas =
        nombresAsignaturas.length > 0
            ? nombresAsignaturas.join(' · ')
            : 'Sin asignaturas asociadas';

    return (
        <div className="dashboard-container">
            <div className="docente-banner">
                <div className="docente-banner-info">
                    <h2>
                        ¡Bienvenido(a), {nombreCompleto}!
                    </h2>

                    <p>
                        👨‍🏫{' '}
                        <strong>
                            Asignaturas a Cargo:
                        </strong>{' '}
                        {cargando
                            ? 'Cargando contexto académico...'
                            : resumenAsignaturas}
                    </p>
                </div>

                <div className="docente-banner-meta">
                    <div className="periodo">
                        {periodo}
                    </div>

                    <div className="institucion">
                        Colegio Bernardo O'Higgins
                    </div>
                </div>
            </div>

            {mensajeError && (
                <div className="empty-state">
                    ⚠️ {mensajeError}
                </div>
            )}

            <div className="anotaciones-layout-container">
                <div className="card-panel anotaciones-form-panel">
                    <h3
                        style={{
                            color: 'var(--color-primario)',
                            marginTop: 0
                        }}
                    >
                        📢 Mural de Novedades
                    </h3>

                    {cargando ? (
                        <div className="empty-state">
                            ⏳ Cargando comunicados...
                        </div>
                    ) : avisos.length > 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px'
                            }}
                        >
                            {avisos.map(aviso => (
                                <div
                                    key={aviso.id}
                                    className="team-card"
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent:
                                                'space-between',
                                            marginBottom: '6px'
                                        }}
                                    >
                                        <h4
                                            style={{
                                                margin: 0
                                            }}
                                        >
                                            {aviso.titulo}
                                        </h4>

                                        <span
                                            style={{
                                                fontSize: '12px'
                                            }}
                                        >
                                            📅 {aviso.fecha}
                                        </span>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: '14px'
                                        }}
                                    >
                                        {aviso.detalle
                                            || aviso.descripcion
                                            || aviso.contenido
                                            || 'Sin detalle disponible'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No hay comunicados vigentes en el mural.
                        </div>
                    )}
                </div>

                <div className="card-panel anotaciones-sidebar-container">
                    <h3>
                        ⚡ Acceso Rápido
                    </h3>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--color-texto-secundario)'
                        }}
                    >
                        Gestión diaria de aula:
                    </p>

                    <div className="quick-actions-box">
                        <button
                            type="button"
                            className={
                                'btn-action-quick '
                                + 'btn-action-asistencia'
                            }
                            onClick={() =>
                                navigate(
                                    '/profesor/asistencia'
                                )
                            }
                        >
                            📅 Pasar Lista Diaria
                        </button>

                        <button
                            type="button"
                            className={
                                'btn-action-quick '
                                + 'btn-action-anotacion'
                            }
                            onClick={() =>
                                navigate(
                                    '/profesor/anotaciones'
                                )
                            }
                        >
                            📝 Registrar Observación
                        </button>

                        <button
                            type="button"
                            className={
                                'btn-action-quick '
                                + 'btn-action-evaluacion'
                            }
                            onClick={() =>
                                navigate(
                                    '/profesor/evaluaciones'
                                )
                            }
                        >
                            📊 Ingresar Calificaciones
                        </button>
                    </div>

                    <div
                        className={
                            'card-panel '
                            + 'card-panel-info-coexistencia'
                        }
                        style={{
                            marginTop: '20px'
                        }}
                    >
                        <h3>
                            ¿Necesitas ayuda?
                        </h3>

                        <p>
                            Si tienes problemas con la carga de
                            listas o notas, contacta a soporte
                            técnico en el departamento de
                            informática.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfesorDashboard;