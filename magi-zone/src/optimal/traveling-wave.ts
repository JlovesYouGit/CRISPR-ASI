/**
 * Determine user location based on traveling wave. Wave origin = user (0 point of entry).
 */

import type { DimensionalWaveState, BandWave } from '../types/wave.js';
import type { TravelingWave, UserLocation, Vec3 } from '../types/optimal-point.js';

/** Default facing when not inferred (e.g. +Y) */
const DEFAULT_FACING: Vec3 = [0, 1, 0];
const DEFAULT_SAFETY_RADIUS = 0.5;

/**
 * Build traveling wave from current dimensional wave state. Origin is taken as
 * user position (0 point of entry); direction from dominant band axes.
 */
export function travelingWaveFromState(
  waveState: DimensionalWaveState,
  userPosition: Vec3 = [0, 0, 0]
): TravelingWave {
  const bands = waveState.bands;
  let dx = 0, dy = 0, dz = 0;
  for (const b of bands) {
    const w = b.amplitude * b.constructive;
    switch (b.dimensionAxis) {
      case 'x': dx += w; break;
      case 'y': dy += w; break;
      case 'z': dz += w; break;
      default: break;
    }
  }
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const direction: Vec3 = [dx / len, dy / len, dz / len];
  const wavelength = 1 + waveState.fluctuation * 2;
  return {
    origin: [...userPosition],
    direction,
    phase: (waveState.timestamp * 0.001) % (2 * Math.PI),
    wavelength,
    timestamp: waveState.timestamp,
  };
}

/**
 * Infer user location from traveling wave: wave origin = user 0 point of entry.
 */
export function userLocationFromTravelingWave(
  wave: TravelingWave,
  safetyRadius: number = DEFAULT_SAFETY_RADIUS
): UserLocation {
  return {
    position: [...wave.origin],
    facing: [...wave.direction],
    safetyRadius,
  };
}

/**
 * Get user location (0 point of entry) from wave state. When no explicit position
 * is given, origin is [0,0,0] as the command origin.
 */
export function resolveUserLocation(
  waveState: DimensionalWaveState,
  explicitPosition?: Vec3,
  safetyRadius: number = DEFAULT_SAFETY_RADIUS
): UserLocation {
  const origin = explicitPosition ?? [0, 0, 0];
  const wave = travelingWaveFromState(waveState, origin);
  return userLocationFromTravelingWave(wave, safetyRadius);
}
