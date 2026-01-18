import React, { useState, useEffect } from 'react';
import type { BowtieNode, Barrier } from '../../types';
import { MitreSelector } from './MitreSelector';
import { D3FendSelector } from './D3FendSelector';

interface NodePropertiesPanelProps {
    node: BowtieNode | Barrier;
    onUpdate: (id: string, updates: Partial<BowtieNode | Barrier>) => void;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({ node, onUpdate, onClose, onDelete }) => {
    const [label, setLabel] = useState(node.label);
    const [description, setDescription] = useState(node.description || '');
    
    // Barrier specific state
    const isBarrier = node.type === 'barrier';
    const [efficacy, setEfficacy] = useState((node as Barrier).efficacy || 0.8);
    
    // ATT&CK State
    const [mitreAttackId, setMitreAttackId] = useState(node.mitreAttackId);
    const [mitreTechniqueName, setMitreTechniqueName] = useState(node.mitreTechniqueName);
    const [mitreUrl, setMitreUrl] = useState(node.mitreUrl);

    // D3FEND State
    const [d3fendId, setD3FendId] = useState((node as Barrier).d3fendId);
    const [d3fendName, setD3FendName] = useState((node as Barrier).d3fendName);
    const [d3fendUrl, setD3FendUrl] = useState((node as Barrier).d3fendUrl);

    useEffect(() => {
        setLabel(node.label);
        setDescription(node.description || '');
        if (isBarrier) {
            setEfficacy((node as Barrier).efficacy || 0.8);
            setD3FendId((node as Barrier).d3fendId);
            setD3FendName((node as Barrier).d3fendName);
            setD3FendUrl((node as Barrier).d3fendUrl);
        }
        setMitreAttackId(node.mitreAttackId);
        setMitreTechniqueName(node.mitreTechniqueName);
        setMitreUrl(node.mitreUrl);
    }, [node, isBarrier]);

    const handleSave = () => {
        const updates: Partial<BowtieNode & Barrier> = { 
            label, 
            description,
            mitreAttackId,
            mitreTechniqueName,
            mitreUrl,
            // Only add efficacy if it's a barrier to avoid pollution, though Partial intersection allows it
            ...(isBarrier ? { 
                efficacy: Number(efficacy),
                d3fendId,
                d3fendName,
                d3fendUrl
            } : {})
        };
        onUpdate(node.id, updates);
        onClose(); // Optional: close on save, or keep open
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (onDelete) onDelete(node.id);
            onClose();
        }
    };

    return (
        <div className="absolute top-4 right-4 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 z-50 flex flex-col gap-4 animate-in slide-in-from-right-10 fade-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Edit {node.type}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    ✕
                </button>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Label</label>
                <input 
                    type="text" 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm h-24 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
            </div>

            {isBarrier && (
                <>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Efficacy (0.0 - 1.0)</label>
                        <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max="1"
                            value={efficacy}
                            onChange={(e) => setEfficacy(parseFloat(e.target.value))}
                            className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                    </div>
                    <D3FendSelector 
                        selectedId={d3fendId}
                        onSelect={(tech) => {
                            setD3FendId(tech.d3fendId);
                            setD3FendName(tech.name);
                            setD3FendUrl(tech.url);
                             // Optional: Auto-update label if it's generic
                            if (label.includes('Barrier') || label.includes('New')) {
                                setLabel(tech.name);
                            }
                        }}
                    />
                </>
            )}

            {node.type === 'threat' && (
                <MitreSelector 
                    selectedId={mitreAttackId} 
                    onSelect={(tech) => {
                        setMitreAttackId(tech.mitreId);
                        setMitreTechniqueName(tech.name);
                        setMitreUrl(tech.url);
                        
                        // Optional: Auto-update label if it's generic
                        if (label === 'Threat Event' || label === 'New Threat') {
                            setLabel(tech.name);
                        }
                    }}
                />
            )}

            <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
                {onDelete && (
                    <button 
                        onClick={handleDelete}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    );
};
