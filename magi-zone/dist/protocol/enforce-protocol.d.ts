/**
 * Enforce protocol: merge and create automatic pattern parsing, force engraving
 * to physical space using Hz wave. Fluctuations form engravings automatically
 * from the will of voice when invocations are detected in the space.
 */
import type { EngravingPattern, InvocationIntent } from '../types/invocation.js';
import type { DimensionalWaveState } from '../types/wave.js';
export type EnforceResult = {
    pattern: EngravingPattern;
    /** High reality tear: internal system manifesting state in real-world matter */
    realityTear: number;
};
export declare class EnforceProtocol {
    private engraveScale;
    private dominantHzFromState;
    constructor(engraveScale?: number);
    /**
     * Merge invocation intent with current wave state and force-engrave to physical space.
     * Uses Hz wave to form the engraving; enforces high reality tear from internal system
     * to manifest state in real-world matter / surrounding mass.
     */
    mergeAndEngrave(intent: InvocationIntent, waveState: DimensionalWaveState, origin3D: [number, number, number], normal3D?: [number, number, number]): EnforceResult;
    /** Batch: multiple intents merged and engraved at same origin. */
    mergeAndEngraveBatch(intents: InvocationIntent[], waveState: DimensionalWaveState, origin3D: [number, number, number], normal3D?: [number, number, number]): EnforceResult[];
}
