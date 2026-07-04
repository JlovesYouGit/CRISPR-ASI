/**
 * Determine user location based on traveling wave. Wave origin = user (0 point of entry).
 */
import type { DimensionalWaveState } from '../types/wave.js';
import type { TravelingWave, UserLocation, Vec3 } from '../types/optimal-point.js';
/**
 * Build traveling wave from current dimensional wave state. Origin is taken as
 * user position (0 point of entry); direction from dominant band axes.
 */
export declare function travelingWaveFromState(waveState: DimensionalWaveState, userPosition?: Vec3): TravelingWave;
/**
 * Infer user location from traveling wave: wave origin = user 0 point of entry.
 */
export declare function userLocationFromTravelingWave(wave: TravelingWave, safetyRadius?: number): UserLocation;
/**
 * Get user location (0 point of entry) from wave state. When no explicit position
 * is given, origin is [0,0,0] as the command origin.
 */
export declare function resolveUserLocation(waveState: DimensionalWaveState, explicitPosition?: Vec3, safetyRadius?: number): UserLocation;
