/**
 * Tier level selector: permitted under protocol. When user is in danger,
 * high advanced grade can be cast automatically. Tier selector is allowed – automatically.
 */

import type { CastTier } from '../types/magi.js';
import { CAST_TIER_LABELS as LABELS } from '../types/magi.js';
import type { InvocationIntent } from '../types/invocation.js';

const DANGER_OVERRIDE_TIER: CastTier = 4; // high advanced

/**
 * Resolve tier for this invocation: use explicit tier if set, else if inDanger
 * use high advanced grade automatically, else default tier.
 */
export function resolveTier(intent: InvocationIntent, defaultTier: CastTier = 2): CastTier {
  if (intent.tier != null && intent.tier >= 1 && intent.tier <= 5) {
    return intent.tier as CastTier;
  }
  if (intent.inDanger) {
    return DANGER_OVERRIDE_TIER;
  }
  return defaultTier;
}

/**
 * Check if invocation is permitted for this user (appropriate to use).
 * When an invocation is cast by the user, permit under protocol using mana/energy.
 */
export function isPermittedForUser(
  intent: InvocationIntent,
  hasEnoughMana: boolean,
  calculusPermitted: boolean
): boolean {
  if (!hasEnoughMana || !calculusPermitted) return false;
  if (intent.confidence < 0.15) return false;
  return true;
}

export { LABELS as CAST_TIER_LABELS };
export type { CastTier };
