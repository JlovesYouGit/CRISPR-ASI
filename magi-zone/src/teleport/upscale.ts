/**
 * Upscale: teleport matter to the physical realm via voice. Hz data wave is decoded
 * by the system and enforced into outside reality via particle teleportation of
 * movement – we are not violating two different places even at sub-dimension scale.
 */

import type { DimensionalWaveState } from '../types/wave.js';
import type { MagiCode } from '../types/magi.js';

export type HzDataWave = {
  /** Encoded payload (from pocket dimension magi) */
  magiId: string;
  /** Carrier Hz for decode */
  hzCarrier: number;
  /** Band energies at encode time */
  bandSignature: number[];
  /** Single movement vector: particle teleportation of movement (one path, no two places) */
  movementVector: [number, number, number];
  timestamp: number;
};

export type UpscaleResult = {
  /** Decoded magi and movement */
  decoded: HzDataWave;
  /** Enforced into physical realm (outside reality) */
  enforcedToReality: true;
  /** Final 3D position after particle teleportation */
  physicalPosition: [number, number, number];
  /** No two-places violation: single movement applied */
  singleMovement: true;
};

/**
 * Encode magi + movement as Hz data wave for teleport. Decoded by the system
 * and enforced into outside reality via particle teleportation of movement.
 */
export function encodeHzDataWave(
  magi: MagiCode,
  movementVector: [number, number, number],
  waveState: DimensionalWaveState
): HzDataWave {
  const bandSignature = waveState.bands.map((b) => b.amplitude * b.constructive);
  return {
    magiId: magi.id,
    hzCarrier: magi.hzCarrier,
    bandSignature,
    movementVector,
    timestamp: waveState.timestamp,
  };
}

/**
 * Decode Hz data wave and enforce to physical realm. Particle teleportation of
 * movement: apply single movement vector so we are not violating two different
 * places (no simultaneous dual location even at sub-dimension scale).
 */
export function decodeAndEnforce(
  hzWave: HzDataWave,
  originPhysical: [number, number, number]
): UpscaleResult {
  const [dx, dy, dz] = hzWave.movementVector;
  const physicalPosition: [number, number, number] = [
    originPhysical[0] + dx,
    originPhysical[1] + dy,
    originPhysical[2] + dz,
  ];
  return {
    decoded: hzWave,
    enforcedToReality: true,
    physicalPosition,
    singleMovement: true,
  };
}
