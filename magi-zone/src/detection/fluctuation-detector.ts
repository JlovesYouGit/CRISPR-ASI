/**
 * Fluctuation detection: measures dimensional space wave states by band wave
 * interpreted constructive. Drives materialising invocation (emotions/energy
 * surrounding matter and states).
 */

import type { DimensionalWaveState, BandWave } from '../types/wave.js';

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

export class FluctuationDetector {
  private readonly windowSize: number;
  private buffer: DimensionalWaveState[] = [];

  constructor(windowSize = 16) {
    this.windowSize = windowSize;
  }

  /**
   * Feed a dimensional wave state and get fluctuation reading.
   * When fluctuation measures the dimensional space wave states by band wave
   * interpreted constructive, it allows materialising invocation magic via
   * that same wave (emotions and energy surrounding matter and states).
   */
  measure(state: DimensionalWaveState): FluctuationReading {
    this.buffer.push(state);
    if (this.buffer.length > this.windowSize) this.buffer.shift();

    const intensity = Math.min(1, state.fluctuation * 2);
    const activeAxes: Record<string, number> = {};
    let constructiveSum = 0;
    let energySum = 0;

    for (const band of state.bands) {
      const axis = band.dimensionAxis;
      activeAxes[axis] = (activeAxes[axis] ?? 0) + band.amplitude * band.constructive;
      constructiveSum += band.constructive;
      energySum += band.amplitude * band.constructive;
    }

    const n = state.bands.length || 1;
    const constructiveCoherence = constructiveSum / n;
    const surroundingEnergy = energySum / n;

    return {
      intensity,
      activeAxes,
      constructiveCoherence,
      surroundingEnergy,
      timestamp: state.timestamp,
    };
  }

  getBuffer(): readonly DimensionalWaveState[] {
    return this.buffer;
  }
}
