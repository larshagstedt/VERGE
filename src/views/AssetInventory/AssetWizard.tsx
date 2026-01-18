import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../../hooks/useAssets';
import type { Asset, AssetType, AssetCriticality } from '../../types';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ShieldAlert,
    Users,
    Building2,
    Box,
    Activity,
    FileText,
    Zap
} from 'lucide-react';

export const AssetWizard: React.FC = () => {
    const navigate = useNavigate();
    const { addAsset } = useAssets();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Asset>>({
        name: '',
        type: undefined,
        location: '',
        owner: '',
        criticality: 'Low',
        status: 'Active', // Default status, hidden from wizard
        parentAsset: ''
    });

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleFinish = () => {
        if (formData.name && formData.type && formData.location && formData.owner) {
            addAsset(formData as Omit<Asset, 'id' | 'lastUpdated'>);
            navigate('/inventory');
        }
    };

    const isStep1Valid = !!formData.type;
    const isStep2Valid = !!formData.name && !!formData.owner && !!formData.location;

    const TypeCard = ({ type, icon: Icon, label }: { type: AssetType, icon: any, label: string }) => (
        <button
            onClick={() => setFormData({ ...formData, type })}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${formData.type === type
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
        >
            <div className={`mb-3 w-10 h-10 rounded-full flex items-center justify-center ${formData.type === type ? 'bg-[var(--accent-primary)] text-black' : 'bg-white/10 text-gray-400'
                }`}>
                <Icon size={20} />
            </div>
            <h3 className={`font-semibold ${formData.type === type ? 'text-white' : 'text-gray-300'}`}>{label}</h3>
        </button>
    );

    return (
        <div className="view-container flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full mb-12">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-400">
                    <span className={step >= 1 ? 'text-[var(--accent-primary)]' : ''}>Classification</span>
                    <span className={step >= 2 ? 'text-[var(--accent-primary)]' : ''}>Details</span>
                    <span className={step >= 3 ? 'text-[var(--accent-primary)]' : ''}>Assessment</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--accent-primary)] transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="glass-panel p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Step 1: Classification */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">What are we securing?</h1>
                            <p className="text-gray-400">Select the AJP 3.14 category that best describes this asset.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <TypeCard type="Personnel" icon={Users} label="Personnel" />
                            <TypeCard type="Facilities" icon={Building2} label="Facilities" />
                            <TypeCard type="Materiel" icon={Box} label="Materiel" />
                            <TypeCard type="Operations" icon={Zap} label="Operations" />
                            <TypeCard type="Activities" icon={Activity} label="Activities" />
                            <TypeCard type="Information" icon={FileText} label="Information" />
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Asset Details</h1>
                            <p className="text-gray-400">Provide the core identity information.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Asset Name</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-3 text-white focus:border-[var(--accent-primary)] outline-none"
                                    placeholder="e.g. Forward Command Post Alpha"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Items Owner / Unit</label>
                                    <input
                                        type="text"
                                        value={formData.owner}
                                        onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                        className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-3 text-white outline-none"
                                        placeholder="e.g. HQ Command"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-3 text-white outline-none"
                                        placeholder="e.g. Sector 7"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Parent Asset (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.parentAsset}
                                    onChange={e => setFormData({ ...formData, parentAsset: e.target.value })}
                                    className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-3 text-white outline-none"
                                    placeholder="Is this part of a larger system?"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Criticality */}
                {step === 3 && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Initial Assessment</h1>
                            <p className="text-gray-400">Determine the preliminary criticality level.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {(['Low', 'Medium', 'High', 'Critical'] as AssetCriticality[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setFormData({ ...formData, criticality: level })}
                                    className={`p-4 rounded-lg border flex items-center justify-between transition-all ${formData.criticality === level
                                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                                        : 'border-white/10 hover:border-white/20 bg-transparent'
                                        }`}
                                >
                                    <div className="text-left">
                                        <span className={`block font-bold ${formData.criticality === level ? 'text-white' : 'text-gray-300'}`}>
                                            {level} Priority
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {level === 'Critical' ? 'Mission failure likely if compromised.' :
                                                level === 'High' ? 'Significant impact on mission capabilities.' :
                                                    level === 'Medium' ? 'Degraded performance but mission continues.' :
                                                        'Minimal impact on operations.'}
                                        </span>
                                    </div>
                                    {formData.criticality === level && <ShieldAlert className="text-[var(--accent-primary)]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-12 pt-6 border-t border-[var(--border-color)]">
                    {step > 1 ? (
                        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2">
                            <ArrowLeft size={18} /> Back
                        </button>
                    ) : (
                        <button onClick={() => navigate('/inventory')} className="text-gray-500 hover:text-white px-4 py-2">
                            Cancel
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                            className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button onClick={handleFinish} className="btn-primary flex items-center gap-2 px-8 bg-green-500 hover:bg-green-400 border-none text-black">
                            create Asset <Check size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
