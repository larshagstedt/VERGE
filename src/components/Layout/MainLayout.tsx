import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
