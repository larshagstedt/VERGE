import type { FAIRFactors, Distribution } from '../types';

/**
 * Generates a random number from a Triangular distribution.
 * A simple robust proxy for PERT in risk modeling.
 */
function sampleTriangular(min: number, mode: number, max: number): number {
    const u = Math.random();
    const F = (mode - min) / (max - min);
    if (u <= F) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
}

function sampleValue(value: number | Distribution | undefined, defaultValue: number = 0): number {
    if (value === undefined) return defaultValue;
    if (typeof value === 'number') return value;
    return sampleTriangular(value.min, value.mostLikely, value.max);
}

interface SimulationResult {
    mean: number;
    min: number;
    max: number;
    p10: number; // 10th percentile (optimistic)
    p90: number; // 90th percentile (pessimistic)
    iterations: number;
}

export class FAIREngine {
    private iterations: number;

    constructor(iterations: number = 1000) {
        this.iterations = iterations;
    }

    public calculateALE(factors: FAIRFactors): SimulationResult {
        const annualLosses: number[] = [];

        for (let i = 0; i < this.iterations; i++) {
            let totalLoss = 0;

            // 1. Determine Frequency of Attempts (Threat Event Frequency - TEF)
            // We treat this as a rate or a distinct number of events per year.
            // For simplicity in this Monte Carlo, we'll round to the nearest integer
            // if we interpret it as "Number of Attempts".
            // If it's a probability < 1, we treat it as a Bernoulli trial?
            // Standard FAIR: TEF is a frequency.
            const tef = sampleValue(factors.attemptCheckFrequency, 0);
            
            // If TEF is essentially 0, no risk.
            if (tef <= 0) {
                annualLosses.push(0);
                continue;
            }

            // 2. For each attempt, check Vulnerability
            // Vulnerability = Probability that TCap > RS
            // We can simulate each attempt, or simulate an aggregate.
            // For performance, if TEF is high, we shouldn't loop TEF times.
            // But usually risk events are rare (TEF < 100).
            // If TEF > 1000, we'd approximate.
            
            const numAttempts = Math.round(tef); // Simple integer approximation
            let lossEvents = 0;

            for (let j = 0; j < numAttempts; j++) {
                const tCap = sampleValue(factors.threatCapability, 50);
                const rs = sampleValue(factors.resistanceStrength, 50);
                
                if (tCap > rs) {
                    lossEvents++;
                }
            }

            // 3. For each Loss Event, calculate Magnitude
            for (let k = 0; k < lossEvents; k++) {
                const primary = sampleValue(factors.primaryLoss, 0);
                const secondary = sampleValue(factors.secondaryLoss, 0);
                totalLoss += (primary + secondary);
            }

            annualLosses.push(totalLoss);
        }

        // Calculate Statistics
        annualLosses.sort((a, b) => a - b);
        const sum = annualLosses.reduce((a, b) => a + b, 0);
        const mean = sum / this.iterations;
        const min = annualLosses[0];
        const max = annualLosses[this.iterations - 1];
        const p10 = annualLosses[Math.floor(this.iterations * 0.1)];
        const p90 = annualLosses[Math.floor(this.iterations * 0.9)];

        return { mean, min, max, p10, p90, iterations: this.iterations };
    }
}

export const fairEngine = new FAIREngine();
