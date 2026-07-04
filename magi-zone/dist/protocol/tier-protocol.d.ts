/**
 * Tier level selector: permitted under protocol. When user is in danger,
 * high advanced grade can be cast automatically. Tier selector is allowed – automatically.
 */
import type { CastTier } from '../types/magi.js';
import { CAST_TIER_LABELS as LABELS } from '../types/magi.js';
import type { InvocationIntent } from '../types/invocation.js';
/**
 * Resolve tier for this invocation: use explicit tier if set, else if inDanger
 * use high advanced grade automatically, else default tier.
 */
export declare function resolveTier(intent: InvocationIntent, defaultTier?: CastTier): CastTier;
/**
 * Check if invocation is permitted for this user (appropriate to use).
 * When an invocation is cast by the user, permit under protocol using mana/energy.
 */
export declare function isPermittedForUser(intent: InvocationIntent, hasEnoughMana: boolean, calculusPermitted: boolean): boolean;
export { LABELS as CAST_TIER_LABELS };
export type { CastTier };
