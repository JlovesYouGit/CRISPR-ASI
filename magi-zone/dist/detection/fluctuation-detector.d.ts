/**
 * Fluctuation detection: measures dimensional space wave states by band wave
 * interpreted constructive. Drives materialising invocation (emotions/energy
 * surrounding matter and states).
 */
import type { DimensionalWaveState } from '../types/wave.js';
export type FluctuationReading = {
    /** Normalized fluctuation 0..1 */
    intensity: number;
    /** Which dimensional axes are most active */
    activeAxes: Record<string, number>;
    /** Constructive coherence – higher = more materialisation potential */
    constructiveCoherence: number;
    /** Derived "emotion/energy" magnitude in the space */
    surroundingEnergy: number;
    timestamp: number;
};
export declare class FluctuationDetector {
    private readonly windowSize;
    private buffer;
    constructor(windowSize?: number);
    /**
     * Feed a dimensional wave state and get fluctuation reading.
     * When fluctuation measures the dimensional space wave states by band wave
     * interpreted constructive, it allows materialising invocation magic via
     * that same wave (emotions and energy surrounding matter and states).
     */
    measure(state: DimensionalWaveState): FluctuationReading;
    getBuffer(): readonly DimensionalWaveState[];
}
