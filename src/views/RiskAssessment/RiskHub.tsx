import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../../hooks/useAssets';
import { useState } from 'react';

export const RiskHub: React.FC = () => {
    const navigate = useNavigate();
    const { assets } = useAssets();
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');

    const handleStart = () => {
        if (selectedAssetId) {
            navigate(`/risk/${selectedAssetId}`);
        }
    };

    return (
        <div className="view-container h-full flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full text-center">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-xl">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Risk Assessment Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Select an asset to view or create its risk assessment.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                        <select
                            value={selectedAssetId}
                            onChange={(e) => setSelectedAssetId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="" disabled>Select an Asset...</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleStart}
                            disabled={!selectedAssetId}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start Risk Assessment
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">Or</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/inventory')}
                            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold text-sm transition-colors"
                        >
                            Browse Asset Inventory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
