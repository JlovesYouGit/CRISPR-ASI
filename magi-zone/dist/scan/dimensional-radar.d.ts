/**
 * Radar-style scanner: individual scanned area like a radar to create
 * dimensional invocation (2D in 3D spacing). Scans surrounding mass/space
 * and returns invocations detected in that volume.
 */
import type { ScannedArea, InvocationIntent } from '../types/invocation.js';
import type { DimensionalWaveState } from '../types/wave.js';
export type RadarSweepResult = {
    area: ScannedArea;
    waveStateAtSweep: DimensionalWaveState;
    /** Whether the scan detected enough fluctuation for engraving */
    engravingReady: boolean;
};
export declare class DimensionalRadar {
    private center;
    private radius;
    constructor(center?: [number, number, number], radius?: number);
    setVolume(center: [number, number, number], radius: number): void;
    /**
     * Perform a sweep: scan the area (2D in 3D spacing) and attach
     * invocations to the scanned area for the reality protocol.
     */
    sweep(invocations: InvocationIntent[], waveState: DimensionalWaveState): RadarSweepResult;
}
