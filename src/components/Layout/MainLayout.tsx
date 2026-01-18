import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

export const MainLayout: React.FC = () => {
    // Calling useTheme here ensures the theme is applied on every page load
    useTheme();

    return (
        <div className="app-container bg-primary transition-colors duration-300">
            <Sidebar />
            <main className="main-content bg-primary">
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
