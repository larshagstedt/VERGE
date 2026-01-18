import { useState, useEffect, useCallback } from 'react';
import { riskStorage } from '../services/storage';
import type { RiskAssessment } from '../types';

export const useRiskAssessments = (assetId?: string) => {
    const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch from storage
    useEffect(() => {
        if (!assetId) {
            setAssessments([]);
            setLoading(false);
            return;
        }

        const load = () => {
            const stored = riskStorage.getAssessments(assetId);
            if (stored.length > 0) {
                setAssessments(stored);
            } else {
                // Seed initial if empty
                const initial: RiskAssessment = {
                    id: crypto.randomUUID(),
                    assetId: assetId,
                    title: 'Initial Assessment',
                    status: 'Draft',
                    threats: [],
                    consequences: [],
                    barriers: [],
                    topEvent: { id: crypto.randomUUID(), type: 'topEvent', label: 'Threat Event' },
                    fairData: {
                        attemptCheckFrequency: 1,
                        threatCapability: 50,
                        resistanceStrength: 50,
                        primaryLoss: 10000
                    },
                    lastUpdated: new Date().toISOString()
                };
                riskStorage.saveAssessment(initial);
                setAssessments([initial]);
            }
            setLoading(false);
        };

        load();
    }, [assetId]);

    const refresh = useCallback(() => {
        if (assetId) {
            setAssessments(riskStorage.getAssessments(assetId));
        }
    }, [assetId]);

    const saveAssessment = (assessment: RiskAssessment) => {
        const updated = { ...assessment, lastUpdated: new Date().toISOString() };
        riskStorage.saveAssessment(updated);
        refresh(); // Reload to ensure sync
        console.log('Saved Risk Assessment:', updated);
    };

    const addThreat = (assessmentId: string, label: string) => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        const updated: RiskAssessment = {
            ...assessment,
            threats: [...assessment.threats, { id: crypto.randomUUID(), type: 'threat', label }]
        };
        saveAssessment(updated);
    };

    const addConsequence = (assessmentId: string, label: string) => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        const updated: RiskAssessment = {
            ...assessment,
            consequences: [...assessment.consequences, { id: crypto.randomUUID(), type: 'consequence', label }]
        };
        saveAssessment(updated);
    };

    const addBarrier = (assessmentId: string, parentId: string, label: string, type: 'Preventive' | 'Mitigative') => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        const updated: RiskAssessment = {
            ...assessment,
            barriers: [...assessment.barriers, {
                id: crypto.randomUUID(),
                type: 'barrier',
                barrierType: type,
                parentId: parentId,
                label,
                efficacy: 0.8,
                active: true
            }]
        };
        saveAssessment(updated);
    };

    const createAssessment = (assetId: string, title: string) => {
        const newAssessment: RiskAssessment = {
            id: crypto.randomUUID(),
            assetId: assetId,
            title: title,
            status: 'Draft',
            threats: [],
            consequences: [],
            barriers: [],
            topEvent: { id: crypto.randomUUID(), type: 'topEvent', label: 'Threat Event' },
            fairData: {
                attemptCheckFrequency: 1,
                threatCapability: 50,
                resistanceStrength: 50,
                primaryLoss: 10000
            },
            lastUpdated: new Date().toISOString()
        };
        riskStorage.saveAssessment(newAssessment);
        refresh();
    };

    const updateNode = (assessmentId: string, nodeId: string, updates: Partial<RiskAssessment['threats'][0]>) => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        // Try to find and update in all categories
        const threats = assessment.threats.map(n => n.id === nodeId ? { ...n, ...updates } : n);
        const consequences = assessment.consequences.map(n => n.id === nodeId ? { ...n, ...updates } : n);
        const barriers = assessment.barriers.map(n => n.id === nodeId ? { ...n, ...updates } : n);
        let topEvent = assessment.topEvent;
        if (topEvent.id === nodeId) {
            topEvent = { ...topEvent, ...updates };
        }

        const updated = { ...assessment, threats, consequences, barriers, topEvent };
        saveAssessment(updated);
    };

    const removeNode = (assessmentId: string, nodeId: string) => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        // Remove if it's a threat
        const threats = assessment.threats.filter(n => n.id !== nodeId);
        
        // Remove if it's a consequence
        const consequences = assessment.consequences.filter(n => n.id !== nodeId);
        
        // Remove if it's a barrier
        // ALSO remove any barriers that belonged to a deleted parent (threat or consequence)
        const barriers = assessment.barriers.filter(b => b.id !== nodeId && b.parentId !== nodeId);

        const updated = { ...assessment, threats, consequences, barriers };
        saveAssessment(updated);
    };

    const reorderBarriers = (assessmentId: string, parentId: string, barrierIds: string[]) => {
        const assessment = assessments.find(a => a.id === assessmentId);
        if (!assessment) return;

        // 1. Get barriers NOT belonging to this parent (keep them as is)
        const otherBarriers = assessment.barriers.filter(b => b.parentId !== parentId);
        
        // 2. Get barriers belonging to this parent
        const impactedBarriers = assessment.barriers.filter(b => b.parentId === parentId);

        // 3. Reorder impactedBarriers based on the incoming barrierIds order
        const reorderedMap = new Map(impactedBarriers.map(b => [b.id, b]));
        const reorderedGroup = barrierIds
            .map(id => reorderedMap.get(id))
            .filter((b): b is typeof impactedBarriers[0] => !!b);

        // If lengths don't match (somehow), fallback to original to prevent data loss
        if (reorderedGroup.length !== impactedBarriers.length) {
            console.error('Mismatch in reorder counts', reorderedGroup.length, impactedBarriers.length);
            return;
        }

        const updated = { ...assessment, barriers: [...otherBarriers, ...reorderedGroup] };
        saveAssessment(updated);
    };

    return {
        assessments,
        loading,
        saveAssessment,
        addThreat,
        addConsequence,
        addBarrier,
        createAssessment,
        createAssessment,
        updateNode,
        removeNode,
        reorderBarriers
    };
};
