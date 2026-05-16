import React from 'react';
import TarjetaNota from '../../components/profesor/TarjetaNota';
import '../../styles/estilos.css';

function ProfesorDashboard() {
    return (
        <div className="dashboard-container">
            <header className="header-app">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="logo-box">
                        <img src="/logo-colegio.png" alt="Logo Colegio" />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--color-primario)' }}>Panel de Control Docente</h1>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-texto-secundario)' }}>Bienvenido al libro de clases distribuido</p>
                    </div>
                </div>
            </header>

            {/* Inyección modular de Tarjetas de Resumen Estadístico */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <TarjetaNota titulo="Cursos Asignados" valor="2" color="var(--color-primario)" />
                <TarjetaNota titulo="Asistencia Promedio" valor="94.2%" color="var(--color-exito)" />
                <TarjetaNota titulo="Anotaciones de la Semana" valor="1" color="var(--color-secundario)" />
            </div>

            <div className="card-panel">
                <h3 style={{ marginTop: 0, color: 'var(--color-primario)' }}>Acciones Rápidas</h3>
                <p style={{ color: 'var(--color-texto-secundario)' }}>Utiliza el menú superior institucional para registrar asistencia, guardar planillas de calificaciones o ingresar observaciones en la hoja de vida de los alumnos.</p>
            </div>
        </div>
    );
}

export default ProfesorDashboard;