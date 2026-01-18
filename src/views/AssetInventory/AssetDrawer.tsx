import React, { useEffect, useState } from 'react';
import type { Asset, AssetType, AssetCriticality, AssetStatus } from '../../types';
import { X, Save, Trash2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    asset?: Asset;
    onSave: (id: string, updates: Partial<Asset>) => void;
    onDelete: (id: string) => void;
}

export const AssetDrawer: React.FC<AssetDrawerProps> = ({ isOpen, onClose, asset, onSave, onDelete }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Asset>>({});

    useEffect(() => {
        if (asset) {
            setFormData(asset);
        }
    }, [asset]);

    if (!isOpen || !asset) return null;

    const handleSave = () => {
        onSave(asset.id, formData);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this asset?')) {
            onDelete(asset.id);
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0d1117] border-l border-[var(--glass-border)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[#161b22]">
                    <h2 className="text-xl font-bold font-['Outfit']">Edit Asset</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                navigate(`/risk?assetId=${asset.id}`);
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-400 border border-red-500/20 py-3 rounded-lg hover:bg-red-600/20 transition-all font-bold uppercase tracking-wider text-xs"
                        >
                            <Activity size={18} />
                            View Risk Assessment
                        </button>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-2 text-white focus:border-[var(--accent-primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as AssetType })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-2 text-white outline-none"
                            >
                                <option value="Personnel">Personnel</option>
                                <option value="Facilities">Facilities</option>
                                <option value="Materiel">Materiel</option>
                                <option value="Operations">Operations</option>
                                <option value="Activities">Activities</option>
                                <option value="Information">Information</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-2 text-white outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Owner</label>
                            <input
                                type="text"
                                value={formData.owner || ''}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-2 text-white outline-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-[var(--border-color)]">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Assessment</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Criticality</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['Low', 'Medium', 'High', 'Critical'] as AssetCriticality[]).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({ ...formData, criticality: level })}
                                            className={`px-2 py-1 text-xs rounded border transition-all ${formData.criticality === level
                                                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-bold'
                                                : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Operational Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                                    className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded p-2 text-white outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] bg-[#161b22] flex justify-between">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 px-4 py-2 rounded hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary flex items-center gap-2 px-6"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
};
