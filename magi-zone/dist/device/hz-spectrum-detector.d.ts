/**
 * Device detector: Hz / spectrum wave.
 * Samples band waves and interprets constructive dimensional states.
 */
import type { DimensionalWaveState, SpectrumSnapshot } from '../types/wave.js';
export declare class HzSpectrumDetector {
    private rangeHz;
    private bandCount;
    private history;
    private readonly maxHistory;
    constructor(options?: {
        rangeHz?: [number, number];
        bandCount?: number;
    });
    /**
     * Sample current spectrum and produce dimensional wave state.
     * In a real device this would read from hardware; here we simulate from seed.
     */
    sample(seed?: number): DimensionalWaveState;
    private computeFluctuation;
    getSnapshot(): SpectrumSnapshot;
    getHistory(): readonly DimensionalWaveState[];
}
