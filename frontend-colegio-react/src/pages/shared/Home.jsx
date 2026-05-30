import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/globals.css';
import logoColegio from '../../assets/logos/logo-colegio.png';

function Home() {
    const navigate = useNavigate();
    const rol = localStorage.getItem('usuario_rol'); 

    useEffect(() => {
        if (rol === 'PROFESOR') {
            navigate('/profesor');
        }
    }, [rol, navigate]);

    return (
        <div>
            <div className="dashboard-container" style={{ paddingTop: '20px' }}>
                <div className="card-panel" style={{ textAlign: 'center', padding: '50px' }}>
                    <img src={logoColegio} alt="Logo Colegio" style={{ height: '100px', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '32px', color: 'var(--color-primario)', margin: 0 }}>Bienvenido de Vuelta</h2>
                    <p style={{ color: 'var(--color-texto-secundario)', fontSize: '18px', marginTop: '8px' }}>
                        Nivel de acceso actual: <span className="btn-primary" style={{ padding: '4px 12px', borderRadius: '15px', fontSize: '14px' }}>{rol}</span>
                    </p>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {rol === 'ADMINISTRADOR' && (
                            <>
                                <button onClick={() => navigate('/admin/usuarios')} className="btn-primary" style={{ padding: '15px 30px', minWidth: '250px' }}>
                                    🎛️ Gestión de Usuarios
                                </button>
                                <button onClick={() => navigate('/admin/estudiantes')} className="btn-primary" style={{ backgroundColor: 'var(--color-exito)', padding: '15px 30px', minWidth: '250px' }}>
                                    🎓 Gestión de Estudiantes
                                </button>
                            </>
                        )}
                        <button className="btn-primary" style={{ backgroundColor: '#6c757d', padding: '15px 30px', minWidth: '250px' }}>
                            👤 Mi Perfil Académico
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;