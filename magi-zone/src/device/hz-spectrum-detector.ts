/**
 * Device detector: Hz / spectrum wave.
 * Samples band waves and interprets constructive dimensional states.
 */

import type { BandWave, DimensionalWaveState, SpectrumSnapshot } from '../types/wave.js';

const DEFAULT_RANGE_HZ: [number, number] = [0.1, 20000];

export class HzSpectrumDetector {
  private rangeHz: [number, number];
  private bandCount: number;
  private history: DimensionalWaveState[] = [];
  private readonly maxHistory = 128;

  constructor(options?: { rangeHz?: [number, number]; bandCount?: number }) {
    this.rangeHz = options?.rangeHz ?? DEFAULT_RANGE_HZ;
    this.bandCount = options?.bandCount ?? 32;
  }

  /**
   * Sample current spectrum and produce dimensional wave state.
   * In a real device this would read from hardware; here we simulate from seed.
   */
  sample(seed?: number): DimensionalWaveState {
    const t = Date.now();
    const rng = seed ?? (t * 0.001 + Math.random());
    const bands: BandWave[] = [];
    const [minHz, maxHz] = this.rangeHz;
    const step = (maxHz - minHz) / this.bandCount;
    const axes: BandWave['dimensionAxis'][] = ['x', 'y', 'z', 't', 'psi'];

    for (let i = 0; i < this.bandCount; i++) {
      const hz = minHz + step * (i + 0.5);
      bands.push({
        hz,
        bandwidth: step * 0.8,
        constructive: 0.3 + 0.7 * (Math.sin(rng + i * 0.7) * 0.5 + 0.5),
        amplitude: 0.2 + 0.8 * (Math.cos(rng * 1.3 + i * 0.4) * 0.5 + 0.5),
        dimensionAxis: axes[i % axes.length],
      });
    }

    const fluctuation = this.computeFluctuation(bands);
    const state: DimensionalWaveState = { bands, fluctuation, timestamp: t };
    this.history.push(state);
    if (this.history.length > this.maxHistory) this.history.shift();
    return state;
  }

  private computeFluctuation(bands: BandWave[]): number {
    if (this.history.length < 2) return 0;
    const prev = this.history[this.history.length - 1];
    let sum = 0;
    const n = Math.min(bands.length, prev.bands.length);
    for (let i = 0; i < n; i++) {
      const a = bands[i];
      const b = prev.bands[i];
      sum += Math.abs(a.amplitude - b.amplitude) + Math.abs(a.constructive - b.constructive);
    }
    return sum / (n || 1);
  }

  getSnapshot(): SpectrumSnapshot {
    const state = this.sample();
    return {
      rangeHz: this.rangeHz,
      bands: state.bands,
      fluctuation: state.fluctuation,
      timestamp: state.timestamp,
    };
  }

  getHistory(): readonly DimensionalWaveState[] {
    return this.history;
  }
}
