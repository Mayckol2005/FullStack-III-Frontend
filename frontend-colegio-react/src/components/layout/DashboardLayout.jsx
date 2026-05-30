import React from 'react';
import Navbar from './Navbar';

function DashboardLayout({ children }) {
    return (
        <div className="layout-app-wrapper">
            <Navbar />
            <main className="layout-main-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;