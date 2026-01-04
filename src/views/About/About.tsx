import React from 'react';

export const About: React.FC = () => {
    return (
        <div className="view-container">
            <h1 className="text-2xl mb-4">About VERGE</h1>
            <div className="glass-panel p-6">
                <h2 className="text-xl mb-2 font-semibold">Risk Management Platform</h2>
                <p className="mb-4 text-gray-300">
                    VERGE is a comprehensive risk management solution designed to help organizations visualize,
                    assess, and mitigate operational risks.
                </p>
                <p className="text-sm text-muted">Version 1.0.0</p>
            </div>
        </div>
    );
};
