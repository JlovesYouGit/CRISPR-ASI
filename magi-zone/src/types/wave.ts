/**
 * Dimensional space wave states – band wave interpreted constructive.
 * Used by device detectors (Hz / spectrum) to represent matter-surrounding energy.
 */

export type BandWave = {
  /** Hz center frequency of the band */
  hz: number;
  /** Band width in Hz */
  bandwidth: number;
  /** Constructive phase 0..1 (coherent vs diffuse) */
  constructive: number;
  /** Amplitude (energy magnitude) */
  amplitude: number;
  /** Dimensional axis this band projects onto (x,y,z, t, or higher) */
  dimensionAxis: 'x' | 'y' | 'z' | 't' | 'psi';
};

export type DimensionalWaveState = {
  bands: BandWave[];
  /** Fluctuation measure – variance in wave states over time */
  fluctuation: number;
  /** Timestamp of measurement */
  timestamp: number;
};

export type SpectrumSnapshot = {
  /** Hz range [min, max] */
  rangeHz: [number, number];
  /** Resolved bands in that range */
  bands: BandWave[];
  /** Overall fluctuation in this snapshot */
  fluctuation: number;
  timestamp: number;
};
