import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfesorDashboard from './ProfesorDashboard';
import Asistencia from './Asistencia';
import Evaluaciones from './Evaluaciones';
import Anotaciones from './Anotaciones';
import '../../styles/estilos.css';

function ProfesorRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProfesorDashboard />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
            <Route path="/anotaciones" element={<Anotaciones />} />
        </Routes>
    );
}

export default ProfesorRoutes;