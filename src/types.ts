export type AssetType = 'Personnel' | 'Facilities' | 'Materiel' | 'Operations' | 'Activities' | 'Information';
export type AssetCriticality = 'Low' | 'Medium' | 'High' | 'Critical';
export type AssetStatus = 'Active' | 'Maintenance' | 'Offline';

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    location: string;
    owner: string;
    criticality: AssetCriticality;
    status: AssetStatus;
    lastUpdated: string;
    parentAsset?: string;
}
