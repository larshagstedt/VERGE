import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="view-container h-full p-8 bg-primary text-text-primary overflow-y-auto transition-colors duration-300">
            <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-text-secondary mt-2">Manage your workspace preferences</p>
            </header>

            <div className="max-w-2xl space-y-8">
                <section className="bg-secondary border border-border rounded-3xl p-8 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Appearance</h2>
                            <p className="text-text-secondary text-sm">Customize how the interface looks on your device</p>
                        </div>
                        <button 
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className={cn(
                                "group relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-inner",
                                theme === 'light' ? "bg-slate-200" : "bg-slate-700"
                            )}
                        >
                            <span className="sr-only">Toggle theme</span>
                            <span 
                                className={cn(
                                    "absolute inset-0 rounded-full transition-opacity duration-300",
                                    theme === 'light' ? "opacity-0" : "opacity-100 bg-slate-800"
                                )}
                            />
                            <span
                                className={cn(
                                    "flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out absolute top-1",
                                    theme === 'light' ? "translate-x-1" : "translate-x-8"
                                )}
                            >
                                {theme === 'light' ? (
                                    <Sun size={14} className="text-amber-500" />
                                ) : (
                                    <Moon size={14} className="text-blue-500" />
                                )}
                            </span>
                        </button>
                    </div>
                </section>

                <section className="bg-secondary border border-border rounded-3xl p-8 shadow-sm opacity-60 transition-colors duration-300">
                    <h2 className="text-xl font-bold mb-4">Workspace Info</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Project Name</span>
                            <span className="font-mono">VERGE Professional</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Version</span>
                            <span className="font-mono">1.2.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Last Sync</span>
                            <span className="font-mono">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
