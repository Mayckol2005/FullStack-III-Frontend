import React from 'react';
import '../../styles/globals.css';

function TarjetaNota({ titulo, valor, color }) {
    return (
        <div className="card-panel" style={{ flex: '1', minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <span style={{ color: 'var(--color-texto-secundario)', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{titulo}</span>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: color || 'var(--color-primario)', marginTop: '10px' }}>{valor}</span>
        </div>
    );
}

export default TarjetaNota;