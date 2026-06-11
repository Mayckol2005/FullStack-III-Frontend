import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AlumnoDashboard from './AlumnoDashboard';
import MisNotas from './MisNotas';
import MiAsistencia from './MiAsistencia';
import MisAnotaciones from './MisAnotaciones';

import '../../styles/globals.css';

function AlumnoRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AlumnoDashboard />} />
            <Route path="/notas" element={<MisNotas />} />
            <Route path="/asistencia" element={<MiAsistencia />} />
            <Route path="/anotaciones" element={<MisAnotaciones />} />
        </Routes>
    );
}

export default AlumnoRoutes;