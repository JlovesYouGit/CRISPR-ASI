/**
 * Pre-flight validation: account for all variables (command type, target,
 * user location, optimal formation, mana, calculus, intent) before
 * execution. Prevents misfires by only allowing actuation when ready.
 */
import type { InvocationIntent } from '../types/invocation.js';
import type { CastCalculus } from '../types/mana.js';
import type { OptimalFormationResult } from '../types/optimal-point.js';
import type { CommandType, ActuationTarget, ActuationReadiness } from '../types/actuation.js';
declare function getCommandTypeForIntent(intent: InvocationIntent): CommandType;
/**
 * Validate actuation readiness: account for command type, target, and all
 * variables. Returns ready only when everything is valid; otherwise
 * blockReasons list why execution would be a misfire.
 */
export declare function validateActuationReadiness(intent: InvocationIntent, target: ActuationTarget, optimalFormation: OptimalFormationResult, calculus: CastCalculus, manaCurrent: number, options?: {
    minConfidence?: number;
}): ActuationReadiness;
/**
 * Resolve target from intent and formation: if no explicit target, use
 * formation point as position target (direction already applied).
 */
export declare function resolveTarget(intent: InvocationIntent, optimalFormation: OptimalFormationResult, explicitTarget?: ActuationTarget): ActuationTarget;
export { getCommandTypeForIntent };
