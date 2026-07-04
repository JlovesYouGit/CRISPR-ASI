/**
 * Compute optimal 3D point for cast/invocation formation from user location,
 * magic type (ranges), and directional command. Actuation at this point
 * allows optimal ranges and directional commands without affecting user
 * 0 point of entry.
 */

import type { MagicType } from '../types/magic-type.js';
import { getMagicType } from '../types/magic-type.js';
import type {
  UserLocation,
  DirectionalCommand,
  NamedDirection,
  OptimalFormationResult,
  Vec3,
} from '../types/optimal-point.js';

const NAMED_TO_VEC: Record<NamedDirection, Vec3> = {
  forward: [0, 1, 0],
  back: [0, -1, 0],
  up: [0, 0, 1],
  down: [0, 0, -1],
  left: [-1, 0, 0],
  right: [1, 0, 0],
  forward_up: [0, 0.707, 0.707],
  forward_down: [0, 0.707, -0.707],
  forward_left: [-0.707, 0.707, 0],
  forward_right: [0.707, 0.707, 0],
};

function normalize(v: Vec3): Vec3 {
  const [x, y, z] = v;
  const len = Math.sqrt(x * x + y * y + z * z) || 1;
  return [x / len, y / len, z / len];
}

function resolveDirection(cmd: DirectionalCommand, user: UserLocation): Vec3 {
  if (cmd.type === 'vector') return normalize(cmd.direction);
  const base = NAMED_TO_VEC[cmd.direction];
  if (!base) return user.facing;
  return normalize(base);
}

/**
 * Optimal distance from user: outside safety radius, and far enough that the
 * magic type's zone does not include the user (formation at user + direction * d,
 * zone radius R => need d >= safetyRadius and ideally d such that user at 0 is
 * outside the zone centered at formation point: |formation - user| = d, zone
 * radius R, so user unaffected if d - R >= safetyRadius or d >= R + safetyRadius.
 * We use d = safetyRadius + 0.4 * zoningRange so the zone can extend toward user
 * but not overlap the safety sphere.
 */
function optimalDistance(magicType: MagicType, user: UserLocation): number {
  const d = user.safetyRadius + Math.max(0.3 * magicType.zoningRange, 0.5);
  return Math.min(d, magicType.zoningRange * 1.2);
}

/**
 * Compute optimal 3D formation point for this magic type and directional command.
 * User stays at 0 point of entry; cast is actuated at formationPoint for optimal
 * ranges and easy directional actuation without affecting user.
 */
export function computeOptimalFormationPoint(
  user: UserLocation,
  patternId: string,
  directionalCommand: DirectionalCommand = { type: 'named', direction: 'forward' }
): OptimalFormationResult {
  const magicType = getMagicType(patternId);
  const dir = resolveDirection(directionalCommand, user);
  const dist = optimalDistance(magicType, user);
  const formationPoint: Vec3 = [
    user.position[0] + dir[0] * dist,
    user.position[1] + dir[1] * dist,
    user.position[2] + dir[2] * dist,
  ];
  const distFromUser = dist;
  const userUnaffected = distFromUser >= user.safetyRadius && distFromUser >= 0.2 * magicType.zoningRange;

  return {
    formationPoint,
    userEntryPoint: [...user.position],
    direction: dir,
    distance: distFromUser,
    userUnaffected,
  };
}

/**
 * Get default directional command (forward) for when none is specified.
 */
export function defaultDirectionalCommand(): DirectionalCommand {
  return { type: 'named', direction: 'forward' };
}
