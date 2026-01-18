import React, { useState, useEffect } from 'react';
import { fetchMitreTechniques } from '../../utils/mitre';
import type { MitreTechnique } from '../../utils/mitre';

interface MitreSelectorProps {
    selectedId?: string;
    onSelect: (technique: MitreTechnique) => void;
}

export const MitreSelector: React.FC<MitreSelectorProps> = ({ selectedId, onSelect }) => {
    const [techniques, setTechniques] = useState<MitreTechnique[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Fetch is idempotent and cached
        fetchMitreTechniques().then(data => {
            setTechniques(data);
            setLoading(false);
        });
    }, []);

    const filtered = techniques.filter(t => 
        t.mitreId.toLowerCase().includes(search.toLowerCase()) || 
        t.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 10);

    const selectedTechnique = techniques.find(t => t.mitreId === selectedId);

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">MITRE ATT&CK Technique</label>
            
            {selectedTechnique ? (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded text-sm">
                    <div className="flex-1">
                        <div className="font-bold text-blue-700 dark:text-blue-300">{selectedTechnique.mitreId}</div>
                        <div className="text-slate-700 dark:text-slate-300 text-xs">{selectedTechnique.name}</div>
                    </div>
                    <button 
                        onClick={() => onSelect({ ...selectedTechnique, mitreId: '', name: '', url: '' })}
                        className="text-slate-400 hover:text-slate-600"
                        title="Remove Mapping"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={loading ? "Loading STIX data..." : "Search ID or Name (e.g. T1566)..."}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    
                    {isOpen && search.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg max-h-60 overflow-y-auto z-50">
                            {filtered.map(tech => (
                                <button
                                    key={tech.id}
                                    onClick={() => {
                                        onSelect(tech);
                                        setSearch('');
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                >
                                    <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">{tech.mitreId}</span>
                                    {tech.name}
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="px-3 py-2 text-sm text-slate-500 italic">No matches found</div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {selectedTechnique && (
                 <a 
                    href={selectedTechnique.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-1"
                >
                    View on MITRE ATT&CK ↗
                </a>
            )}
        </div>
    );
};
