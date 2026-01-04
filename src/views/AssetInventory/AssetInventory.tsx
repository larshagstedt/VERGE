import React, { useState, useMemo } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { AssetDrawer } from './AssetDrawer';
import { useNavigate } from 'react-router-dom';
import type { Asset } from '../../types';
import {
    Search,
    Filter,
    Plus,
    Users,
    Building2,
    Box,
    Activity,
    FileText,
    Zap,
    MoreHorizontal
} from 'lucide-react';

const AssetIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Personnel': return <Users size={16} className="text-orange-400" />;
        case 'Facilities': return <Building2 size={16} className="text-blue-400" />;
        case 'Materiel': return <Box size={16} className="text-yellow-400" />;
        case 'Operations': return <Zap size={16} className="text-red-400" />;
        case 'Activities': return <Activity size={16} className="text-green-400" />;
        case 'Information': return <FileText size={16} className="text-purple-400" />;
        default: return <Box size={16} />;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
        Active: 'bg-green-500/10 text-green-500 border-green-500/20',
        Maintenance: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Offline: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${colors[status as keyof typeof colors]}`}>
            {status}
        </span>
    );
};

const CriticalityDot = ({ level }: { level: string }) => {
    const colors = {
        Low: 'bg-gray-500',
        Medium: 'bg-blue-500',
        High: 'bg-orange-500',
        Critical: 'bg-red-500 animate-pulse'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[level as keyof typeof colors]}`} title={level} />;
};

export const AssetInventory: React.FC = () => {
    const navigate = useNavigate();
    const { assets, updateAsset, deleteAsset } = useAssets();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [assets, searchQuery, statusFilter]);

    const handleRowClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsDrawerOpen(true);
    };

    const handleSave = (id: string, updates: Partial<Asset>) => {
        updateAsset(id, updates);
        setIsDrawerOpen(false);
    };

    return (
        <div className="view-container flex flex-col items-stretch h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Asset Inventory</h1>
                    <p className="text-gray-400 text-sm">Organizational assets (AJP 3.14)</p>
                </div>
                <button onClick={() => navigate('/inventory/new')} className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    <span>Add New</span>
                </button>
            </div>

            <div className="glass-panel p-3 mb-4 flex gap-4 items-center shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0c10] border-none rounded py-1.5 pl-9 pr-4 text-sm text-white focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none"
                    />
                </div>

                <div className="h-6 w-px bg-[var(--border-color)]"></div>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent text-gray-300 text-sm focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Offline">Offline</option>
                    </select>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border border-[var(--border-color)] flex-1 relative">
                <div className="absolute inset-0 overflow-auto">
                    <table className="data-grid-table">
                        <thead>
                            <tr>
                                <th className="w-[30%]">Asset Name</th>
                                <th className="w-[15%]">Type</th>
                                <th className="w-[20%]">Location</th>
                                <th className="w-[15%]">Owner</th>
                                <th className="w-[10%] text-center">Criticality</th>
                                <th className="w-[10%]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} onClick={() => handleRowClick(asset)}>
                                    <td className="font-medium text-white">
                                        {asset.name}
                                        {asset.parentAsset && (
                                            <div className="text-[10px] text-gray-500 mt-0.5">↳ {asset.parentAsset}</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <AssetIcon type={asset.type} />
                                            <span className="text-sm">{asset.type}</span>
                                        </div>
                                    </td>
                                    <td className="text-gray-400 text-sm">{asset.location}</td>
                                    <td className="text-gray-400 text-sm">{asset.owner}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center">
                                            <CriticalityDot level={asset.criticality} />
                                        </div>
                                    </td>
                                    <td>
                                        <StatusBadge status={asset.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AssetDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                asset={selectedAsset}
                onSave={handleSave}
                onDelete={deleteAsset}
            />
        </div>
    );
};

