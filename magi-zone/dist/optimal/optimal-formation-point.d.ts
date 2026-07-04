/**
 * Compute optimal 3D point for cast/invocation formation from user location,
 * magic type (ranges), and directional command. Actuation at this point
 * allows optimal ranges and directional commands without affecting user
 * 0 point of entry.
 */
import type { UserLocation, DirectionalCommand, OptimalFormationResult } from '../types/optimal-point.js';
/**
 * Compute optimal 3D formation point for this magic type and directional command.
 * User stays at 0 point of entry; cast is actuated at formationPoint for optimal
 * ranges and easy directional actuation without affecting user.
 */
export declare function computeOptimalFormationPoint(user: UserLocation, patternId: string, directionalCommand?: DirectionalCommand): OptimalFormationResult;
/**
 * Get default directional command (forward) for when none is specified.
 */
export declare function defaultDirectionalCommand(): DirectionalCommand;
