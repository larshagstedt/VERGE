import { useState, useEffect } from 'react';
import type { Asset } from '../types';

const STORAGE_KEY = 'verge_assets_v2'; // Changed key to force fresh start

const INITIAL_ASSETS: Asset[] = [
    {
        id: '1',
        name: 'Forward Command Post Alpha',
        type: 'Facilities',
        location: 'Sector 7',
        owner: 'HQ Command',
        criticality: 'Critical',
        status: 'Active',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Bravo Squadron',
        type: 'Personnel',
        location: 'Base Camp',
        owner: 'HR / Ops',
        criticality: 'High',
        status: 'Active',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Mission Data Link',
        type: 'Information',
        location: 'Cloud / SatCom',
        owner: 'Comms Unit',
        criticality: 'Critical',
        status: 'Active',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Logistics Convoy',
        type: 'Activities',
        location: 'Route 66',
        owner: 'Logistics',
        criticality: 'Medium',
        status: 'Active',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Main Generator',
        type: 'Materiel',
        location: 'Power Plant',
        owner: 'Engineering',
        criticality: 'High',
        status: 'Maintenance',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Surveillance Op',
        type: 'Operations',
        location: 'Northern Border',
        owner: 'Intel',
        criticality: 'Medium',
        status: 'Active',
        lastUpdated: new Date().toISOString()
    }
];

export const useAssets = () => {
    const [assets, setAssets] = useState<Asset[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_ASSETS;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    }, [assets]);

    const addAsset = (asset: Omit<Asset, 'id' | 'lastUpdated'>) => {
        const newAsset: Asset = {
            ...asset,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString()
        };
        setAssets(prev => [...prev, newAsset]);
    };

    const updateAsset = (id: string, updates: Partial<Asset>) => {
        setAssets(prev => prev.map(asset =>
            asset.id === id
                ? { ...asset, ...updates, lastUpdated: new Date().toISOString() }
                : asset
        ));
    };

    const deleteAsset = (id: string) => {
        setAssets(prev => prev.filter(asset => asset.id !== id));
    };

    const getAsset = (id: string) => assets.find(a => a.id === id);

    return { assets, addAsset, updateAsset, deleteAsset, getAsset };
};
