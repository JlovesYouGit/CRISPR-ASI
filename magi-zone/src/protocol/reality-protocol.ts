/**
 * Reality protocol: parses invocation via hypercomputation.
 * Enables dimensional invocation (2D in 3D spacing) to escape via the reality protocol
 * and manifest in real-world matter. Works with enforce protocol for automatic
 * pattern parsing and force engraving.
 */

import type { InvocationIntent, ScannedArea } from '../types/invocation.js';
import type { DimensionalWaveState } from '../types/wave.js';

export type HypercomputationParseResult = {
  intents: InvocationIntent[];
  /** 2D-in-3D dimensional state confirmed */
  dimensionalState: '2d_in_3d';
  /** Parsed pattern ids for engraving */
  patternIds: string[];
};

/**
 * Hypercomputation parser: interprets wave state + voice tokens into
 * invocations and pattern ids. The system "knows how to parse invocation
 * via hypercomputation" – here we implement that parsing step.
 */
export class RealityProtocol {
  /**
   * Parse raw input (voice/will + wave state) into structured invocations
   * and pattern ids for the enforce protocol.
   */
  parseViaHypercomputation(
    voicePhrases: string[],
    waveState: DimensionalWaveState,
    resolveIntent: (phrase: string, energySignature: number[]) => InvocationIntent
  ): HypercomputationParseResult {
    const energySignature = waveState.bands.map(
      (b) => b.amplitude * b.constructive
    );
    const intents: InvocationIntent[] = [];

    for (const phrase of voicePhrases) {
      const intent = resolveIntent(phrase, energySignature);
      intents.push(intent);
    }

    const patternIds = [...new Set(intents.map((i) => i.patternId))];

    return {
      intents,
      dimensionalState: '2d_in_3d',
      patternIds,
    };
  }

  /**
   * Build scanned area (radar-like): individual scanned area to create
   * dimensional invocation – 2D in 3D spacing – for reality tear.
   */
  buildScannedArea(
    center: [number, number, number],
    radius: number,
    intents: InvocationIntent[]
  ): ScannedArea {
    return {
      center,
      radius,
      invocations: intents,
      dimensionalState: '2d_in_3d',
    };
  }
}
