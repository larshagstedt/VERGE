export type AssetType = 'Personnel' | 'Facilities' | 'Materiel' | 'Operations' | 'Activities' | 'Information' | 'Server' | 'Database' | 'IoT' | 'Workstation' | 'Network';
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
    ipAddress?: string;
}

// --- Risk Assessment Types (Normative per docs/mappings/fair_to_bowtie.md) ---

export interface Distribution {
    min: number;
    mostLikely: number;
    max: number;
}

export interface FAIRFactors {
    // Loss Event Frequency Branch
    attemptCheckFrequency?: number | Distribution; // attempts per year
    threatCapability?: number | Distribution; // 0-100%
    resistanceStrength?: number | Distribution; // 0-100%
    vulnerability?: number; // Derived: P(TCap > RS)

    // Loss Magnitude Branch
    primaryLoss?: number | Distribution; // $$$
    secondaryLoss?: number | Distribution; // $$$

    // Derived
    ale?: number; // Annualized Loss Exposure
}

export type BarrierType = 'Preventive' | 'Detective' | 'Mitigative';

export interface BowtieNode {
    id: string;
    type: 'threat' | 'barrier' | 'topEvent' | 'consequence';
    label: string;
    description?: string;
    mitreAttackId?: string; // e.g., T1566
    mitreTechniqueName?: string; // e.g., Phishing
    mitreUrl?: string; // e.g., https://attack.mitre.org/techniques/T1566/
}

export interface Barrier extends BowtieNode {
    type: 'barrier';
    barrierType: BarrierType;
    parentId: string; // The ID of the Threat (Left) or TopEvent/Consequence (Right) this barrier mitigates
    efficacy: number; // 0.0 - 1.0 (Mitigation Ratio / Risk Reduction)
    cost?: number; // Financial cost + Operational friction
    active: boolean;
    d3fendId?: string; // e.g. D3-AZ
    d3fendName?: string; // e.g. Access Zone
    d3fendUrl?: string;
}

export interface RiskAssessment {
    id: string;
    assetId: string;
    title: string;
    status: 'Draft' | 'Review' | 'Approved';

    // Structure
    threats: BowtieNode[]; // Left side roots
    consequences: BowtieNode[]; // Right side leaves
    barriers: Barrier[]; // Controls along the paths
    topEvent: BowtieNode; // The pivot point (Loss Event)

    // FAIR Calculations
    fairData: FAIRFactors;

    lastUpdated: string;
}
