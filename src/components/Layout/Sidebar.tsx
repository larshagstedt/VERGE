import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Map as MapIcon,
    Network,
    ShieldAlert,
    Settings,
    Info
} from 'lucide-react';


// Actually, I didn't create Sidebar.module.css. I will use a simple BEM-like class approach in index.css or styled object.
// Given the constraints, I'll use standard classes defined here with some inline styles for specificity if needed, 
// or better: I will add sidebar styles to App.css or index.css. 
// Let's assume global styles for simplicity in this phase or add a style block.
// I'll stick to classes and add them to App.css in a moment if needed, or inline for rapid prototyping.
// Wait, I strictly defined "glass-panel" etc.
// I will create a CSS Module for Sidebar to be clean.

import React from 'react';

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Asset Inventory', icon: Database },
    { path: '/map', label: 'Map View', icon: MapIcon },
    { path: '/dependency', label: 'Dependency Map', icon: Network },
    { path: '/risk', label: 'Risk Assessment', icon: ShieldAlert },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">V</div>
                    <span className="logo-text">VERGE</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <Info size={20} />
                    <span className="nav-label">About</span>
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <Settings size={20} />
                    <span className="nav-label">Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};
