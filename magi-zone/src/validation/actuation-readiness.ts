/**
 * Pre-flight validation: account for all variables (command type, target,
 * user location, optimal formation, mana, calculus, intent) before
 * execution. Prevents misfires by only allowing actuation when ready.
 */

import type { InvocationIntent } from '../types/invocation.js';
import type { CastCalculus } from '../types/mana.js';
import type { OptimalFormationResult } from '../types/optimal-point.js';
import type { CommandType, ActuationTarget, ActuationReadiness } from '../types/actuation.js';
import { getMagicType } from '../types/magic-type.js';

const PATTERN_TO_COMMAND_TYPE: Record<string, CommandType> = {
  pattern_default: 'cast',
  pattern_manifest: 'manifest',
  pattern_bind: 'bind',
  pattern_shield: 'shield',
  pattern_reveal: 'reveal',
  pattern_seal: 'seal',
  pattern_open: 'open',
  pattern_ward: 'ward',
  pattern_flow: 'flow',
};

const VALID_PATTERN_IDS = new Set(Object.keys(PATTERN_TO_COMMAND_TYPE));

function getCommandTypeForIntent(intent: InvocationIntent): CommandType {
  return PATTERN_TO_COMMAND_TYPE[intent.patternId] ?? 'cast';
}

/** Max distance from user that target position can be (avoid misfire from invalid target) */
const MAX_TARGET_DISTANCE = 50;

function distance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

/**
 * Validate actuation readiness: account for command type, target, and all
 * variables. Returns ready only when everything is valid; otherwise
 * blockReasons list why execution would be a misfire.
 */
export function validateActuationReadiness(
  intent: InvocationIntent,
  target: ActuationTarget,
  optimalFormation: OptimalFormationResult,
  calculus: CastCalculus,
  manaCurrent: number,
  options?: { minConfidence?: number }
): ActuationReadiness {
  const minConfidence = options?.minConfidence ?? 0.15;
  const commandType = getCommandTypeForIntent(intent);
  const blockReasons: string[] = [];

  const userEntryPointValid =
    optimalFormation.userEntryPoint.length === 3 &&
    optimalFormation.formationPoint.length === 3;
  if (!userEntryPointValid) blockReasons.push('user_entry_point_invalid');

  const optimalFormationValid =
    optimalFormation.distance >= 0 && Number.isFinite(optimalFormation.distance);
  if (!optimalFormationValid) blockReasons.push('optimal_formation_invalid');

  const userUnaffected = optimalFormation.userUnaffected;
  if (!userUnaffected) blockReasons.push('user_would_be_affected');

  const manaSufficient = manaCurrent >= calculus.manaCost;
  if (!manaSufficient) blockReasons.push('insufficient_mana');

  const calculusPermitted = calculus.permitted;
  if (!calculusPermitted) blockReasons.push('calculus_not_permitted');

  const intentConfidenceOk = intent.confidence >= minConfidence;
  if (!intentConfidenceOk) blockReasons.push('intent_confidence_too_low');

  let targetInRange = true;
  if (target.type === 'position' && target.value) {
    const d = distance(target.value, optimalFormation.userEntryPoint);
    if (d > MAX_TARGET_DISTANCE) {
      targetInRange = false;
      blockReasons.push('target_out_of_range');
    }
  }

  const patternIdValid = VALID_PATTERN_IDS.has(intent.patternId);
  if (!patternIdValid) blockReasons.push('invalid_pattern_id');

  const ready =
    userEntryPointValid &&
    optimalFormationValid &&
    userUnaffected &&
    manaSufficient &&
    calculusPermitted &&
    intentConfidenceOk &&
    targetInRange &&
    patternIdValid;

  return {
    ready,
    variablesAccounted: {
      commandType,
      target,
      userEntryPointValid,
      optimalFormationValid,
      userUnaffected,
      manaSufficient,
      calculusPermitted,
      intentConfidenceOk,
      targetInRange,
      patternIdValid,
    },
    blockReasons,
  };
}

/**
 * Resolve target from intent and formation: if no explicit target, use
 * formation point as position target (direction already applied).
 */
export function resolveTarget(
  intent: InvocationIntent,
  optimalFormation: OptimalFormationResult,
  explicitTarget?: ActuationTarget
): ActuationTarget {
  if (explicitTarget) return explicitTarget;
  return {
    type: 'position',
    value: [...optimalFormation.formationPoint],
  };
}

export { getCommandTypeForIntent };
