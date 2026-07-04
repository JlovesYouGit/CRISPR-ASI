/**
 * Optimal formation point: user location (0 point of entry), traveling wave,
 * directional commands, and optimal 3D spacing for cast/invocation so actuation
 * does not affect the user's command origin.
 */

export type Vec3 = [number, number, number];

/** User's 0 point of entry – where command/incantation originates; never displaced */
export type UserLocation = {
  /** Position in 3D (command origin) */
  position: Vec3;
  /** Facing direction (normalized) for "forward" */
  facing: Vec3;
  /** Safety radius: cast formation stays outside this so user is unaffected */
  safetyRadius: number;
};

/** Directional command: named or explicit vector for where to form the cast */
export type DirectionalCommand =
  | { type: 'named'; direction: NamedDirection }
  | { type: 'vector'; direction: Vec3 };

export type NamedDirection =
  | 'forward' | 'back' | 'up' | 'down' | 'left' | 'right'
  | 'forward_up' | 'forward_down' | 'forward_left' | 'forward_right';

/** Traveling wave: used to determine user location (wave origin = user) */
export type TravelingWave = {
  /** Origin of wave = user location (0 point of entry) */
  origin: Vec3;
  /** Propagation direction (normalized) */
  direction: Vec3;
  /** Phase at origin (for timing) */
  phase: number;
  /** Wavelength / scale for optimal spacing derivation */
  wavelength: number;
  timestamp: number;
};

/** Result: optimal 3D point for magic type formation, allowing optimal ranges and actuation without affecting user */
export type OptimalFormationResult = {
  /** Optimal 3D point where cast/invocation is formed (actuation point) */
  formationPoint: Vec3;
  /** User's 0 point of entry (unchanged) */
  userEntryPoint: Vec3;
  /** Direction from user to formation point (normalized) */
  direction: Vec3;
  /** Distance from user to formation point (optimal spacing) */
  distance: number;
  /** Whether formation point keeps user outside zone and at 0 point of entry */
  userUnaffected: boolean;
};
