import type { RiskAssessment } from '../types';

export interface StorageService {
    getAssessments(assetId: string): RiskAssessment[];
    saveAssessment(assessment: RiskAssessment): void;
    deleteAssessment(id: string): void;
}

const STORAGE_KEY_PREFIX = 'verge_assessment_';

export class LocalStorageService implements StorageService {
    private getStorageKey(id: string): string {
        return `${STORAGE_KEY_PREFIX}${id}`;
    }

    private getAllKeys(): string[] {
        return Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEY_PREFIX));
    }

    getAssessments(assetId: string): RiskAssessment[] {
        const assessments: RiskAssessment[] = [];
        const keys = this.getAllKeys();

        for (const key of keys) {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    const assessment = JSON.parse(item) as RiskAssessment;
                    if (assessment.assetId === assetId) {
                        assessments.push(assessment);
                    }
                }
            } catch (e) {
                console.error(`Failed to parse assessment for key ${key}`, e);
            }
        }
        return assessments;
    }

    saveAssessment(assessment: RiskAssessment): void {
        try {
            localStorage.setItem(this.getStorageKey(assessment.id), JSON.stringify(assessment));
        } catch (e) {
            console.error('Failed to save assessment', e);
            throw e; 
        }
    }

    deleteAssessment(id: string): void {
        localStorage.removeItem(this.getStorageKey(id));
    }
}

export const riskStorage = new LocalStorageService();
