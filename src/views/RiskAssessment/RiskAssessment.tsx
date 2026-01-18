import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRiskAssessments } from '../../hooks/useRiskAssessments';
import { useAssets } from '../../hooks/useAssets';
import { BowtieEditor } from './BowtieEditor';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { fairEngine } from '../../utils/fairEngine';
import type { BowtieNode, Barrier } from '../../types';


export const RiskAssessment: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    
    // We need to handle the case where assetId is undefined, although the route guarantees it
    if (!assetId) return <div className="p-4 text-red-500">Error: Asset ID is required</div>;

    const { assets } = useAssets();
    const asset = assets.find(a => a.id === assetId);

    const { assessments, loading, addThreat, addConsequence, addBarrier, createAssessment, updateNode, removeNode, reorderBarriers } = useRiskAssessments(assetId);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<BowtieNode | Barrier | null>(null);

    // Default to the first one if available
    const activeAssessment = selectedAssessmentId
        ? assessments.find(a => a.id === selectedAssessmentId)
        : assessments[0];




    const handleCreateNew = () => {
        const title = prompt('Enter a title for the new assessment:', 'New Risk Assessment');
        if (title) {
            createAssessment(assetId, title);
        }
    };

    const [simulationResult, setSimulationResult] = useState<any>(null);

    React.useEffect(() => {
        if (activeAssessment) {
            const result = fairEngine.calculateALE(activeAssessment.fairData);
            setSimulationResult(result);
        }
    }, [activeAssessment]);
    
    
    const handleNodeClick = (id: string, type: string) => {
        if (!activeAssessment) return;
        
        let node: BowtieNode | Barrier | undefined;
        
        // Search all collections
        if (activeAssessment.topEvent.id === id) {
            node = activeAssessment.topEvent;
        } else {
            node = activeAssessment.threats.find(t => t.id === id) || 
                   activeAssessment.consequences.find(c => c.id === id) || 
                   activeAssessment.barriers.find(b => b.id === id);
        }

        if (node) {
            setSelectedNode(node);
        }
    };
    
    // Auto-update local state is handled by hook but we need to close panel if assessment changes
    React.useEffect(() => {
        setSelectedNode(null);
    }, [activeAssessment?.id]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="view-container h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <header className="mb-6 flex justify-between items-center px-8 pt-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Risk Assessment</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Asset: Sample Asset ({assetId})</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        + Create New Assessment
                    </button>
                    <select
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        onChange={(e) => setSelectedAssessmentId(e.target.value)}
                        value={activeAssessment?.id || ''}
                    >
                        {assessments.map(a => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Risk Dashboard / Metrics */}
            {simulationResult && activeAssessment && (
                 <div className="px-8 pb-6 grid grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Annual Loss Exposure (Mean)</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(simulationResult.mean)}</div>
                        <div className="text-xs text-slate-400 mt-1">Based on {simulationResult.iterations} simulations</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Worst Case (Max)</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(simulationResult.max)}</div>
                    </div>
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Risk Level</div>
                        <div className={`text-2xl font-bold ${simulationResult.mean > 100000 ? 'text-red-500' : 'text-green-500'}`}>
                            {simulationResult.mean > 100000 ? 'HIGH' : 'LOW'}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col justify-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Confidence Interval (10-90%)</div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                             <div className="absolute top-0 bottom-0 left-[10%] right-[10%] bg-blue-500/50"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>{formatCurrency(simulationResult.p10)}</span>
                            <span>{formatCurrency(simulationResult.p90)}</span>
                        </div>
                    </div>
                 </div>
            )}

            {activeAssessment ? (
                <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden">
                    {/* Left Sidebar: Controls */}
                    <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-8 overflow-y-auto shadow-sm">

                        {/* Threats Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Threats</h3>
                                <button
                                    onClick={() => addThreat(activeAssessment.id, 'New Threat')}
                                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-3 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {activeAssessment.threats.length === 0 && (
                                    <p className="text-xs text-slate-400 dark:text-slate-600 italic">No threats added yet.</p>
                                )}
                                {activeAssessment.threats.map(t => (
                                    <div key={t.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-800 group">
                                        <div className="font-bold text-slate-700 dark:text-slate-300 mb-3 truncate" title={t.label}>{t.label}</div>
                                        <button
                                            onClick={() => addBarrier(activeAssessment.id, t.id, 'New Preventive Barrier', 'Preventive')}
                                            className="text-[10px] w-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all uppercase font-bold shadow-sm"
                                        >
                                            + Add Preventive Barrier
                                        </button>
                                        <div className="mt-3 flex flex-col gap-1.5">
                                            {activeAssessment.barriers.filter(b => b.parentId === t.id).map(b => (
                                                <div key={b.id} className="text-[10px] bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800/50 truncate font-semibold">
                                                    Shield: {b.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consequences Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Consequences</h3>
                                <button
                                    onClick={() => addConsequence(activeAssessment.id, 'New Loss Event')}
                                    className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 px-3 py-1 rounded-md text-[10px] font-bold uppercase hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {activeAssessment.consequences.length === 0 && (
                                    <p className="text-xs text-slate-400 dark:text-slate-600 italic">No consequences added yet.</p>
                                )}
                                {activeAssessment.consequences.map(c => (
                                    <div key={c.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-800 group">
                                        <div className="font-bold text-slate-700 dark:text-slate-300 mb-3 truncate" title={c.label}>{c.label}</div>
                                        <button
                                            onClick={() => addBarrier(activeAssessment.id, c.id, 'New Mitigative Barrier', 'Mitigative')}
                                            className="text-[10px] w-full bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 hover:border-green-300 dark:hover:border-green-600 transition-all uppercase font-bold shadow-sm"
                                        >
                                            + Add Mitigative Barrier
                                        </button>
                                        <div className="mt-3 flex flex-col gap-1.5">
                                            {activeAssessment.barriers.filter(b => b.parentId === c.id).map(b => (
                                                <div key={b.id} className="text-[10px] bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-md border border-green-200 dark:border-green-800/50 truncate font-semibold">
                                                    Shield: {b.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Main Area: Bowtie Diagram */}
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
                        <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 shadow-sm pointer-events-none">
                            Bowtie Editor
                        </div>
                        <BowtieEditor 
                            assessment={activeAssessment} 
                            allAssessments={assessments}
                            asset={asset}
                            onNodeClick={handleNodeClick}
                            onBarrierReorder={(parentId, barrierIds) => reorderBarriers(activeAssessment.id, parentId, barrierIds)}
                            onSwitchAssessment={(id) => setSelectedAssessmentId(id)}
                        />
                        
                        {selectedNode && activeAssessment && (
                            <NodePropertiesPanel 
                                node={selectedNode} 
                                onUpdate={(id, updates) => updateNode(activeAssessment.id, id, updates)}
                                onClose={() => setSelectedNode(null)} 
                                onDelete={(id) => removeNode(activeAssessment.id, id)}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="text-slate-400 dark:text-slate-500 mb-6 text-sm font-medium">No assessments found for this asset.</div>
                        <button
                            onClick={handleCreateNew}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Create First Assessment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
