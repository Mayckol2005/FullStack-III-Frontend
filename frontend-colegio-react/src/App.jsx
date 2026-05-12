import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/estilos.css';

import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import RutaProtegida from './components/RutaProtegida'; // <-- 1. Importamos el guardia

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* 2. Envolvemos la ruta de usuarios con el guardia y le decimos que exija ser ADMIN */}
        <Route 
          path="/usuarios" 
          element={
            <RutaProtegida rolRequerido="ADMINISTRADOR">
              <Usuarios />
            </RutaProtegida>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;