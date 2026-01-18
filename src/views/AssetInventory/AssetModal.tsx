import React, { useState, useEffect } from 'react';
import type { Asset, AssetType, AssetCriticality, AssetStatus } from '../../types';

import { X } from 'lucide-react';

interface AssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Omit<Asset, 'id' | 'lastUpdated'>) => void;
    initialData?: Asset;
    title: string;
}

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
    const [formData, setFormData] = useState<Partial<Asset>>({
        name: '',
        type: 'Information',
        ipAddress: '',
        location: '',
        owner: '',
        criticality: 'Low',
        status: 'Active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                type: 'Information',
                ipAddress: '',
                location: '',
                owner: '',
                criticality: 'Low',
                status: 'Active'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Asset, 'id' | 'lastUpdated'>);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Asset Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                            placeholder="e.g. Web-Server-01"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as AssetType })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                            >
                                <option value="Server">Server</option>
                                <option value="Database">Database</option>
                                <option value="IoT">IoT Device</option>
                                <option value="Workstation">Workstation</option>
                                <option value="Network">Network Gear</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">IP Address</label>
                            <input
                                required
                                type="text"
                                value={formData.ipAddress}
                                onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                                placeholder="0.0.0.0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                                placeholder="e.g. Data Center A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Owner</label>
                            <input
                                type="text"
                                value={formData.owner}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                                placeholder="Team or Individual"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Criticality</label>
                            <select
                                value={formData.criticality}
                                onChange={e => setFormData({ ...formData, criticality: e.target.value as AssetCriticality })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                                className="w-full bg-[#0a0c10] border border-[var(--border-color)] rounded-md px-3 py-2 text-white focus:border-[var(--accent-primary)] focus:outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md text-gray-300 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Save Asset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
