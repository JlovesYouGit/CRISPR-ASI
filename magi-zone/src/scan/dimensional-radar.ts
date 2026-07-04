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

export class DimensionalRadar {
  private center: [number, number, number];
  private radius: number;

  constructor(center: [number, number, number] = [0, 0, 0], radius = 10) {
    this.center = center;
    this.radius = radius;
  }

  setVolume(center: [number, number, number], radius: number): void {
    this.center = center;
    this.radius = radius;
  }

  /**
   * Perform a sweep: scan the area (2D in 3D spacing) and attach
   * invocations to the scanned area for the reality protocol.
   */
  sweep(
    invocations: InvocationIntent[],
    waveState: DimensionalWaveState
  ): RadarSweepResult {
    const area: ScannedArea = {
      center: [...this.center],
      radius: this.radius,
      invocations,
      dimensionalState: '2d_in_3d',
    };

    const engravingReady =
      waveState.fluctuation > 0.1 &&
      waveState.bands.some((b) => b.constructive > 0.5);

    return {
      area,
      waveStateAtSweep: waveState,
      engravingReady,
    };
  }
}
